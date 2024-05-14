import './App.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DashboardState,
  IDataRange,
  DATA_SOURCE_SORT_TYPE,
  GroupMode,
  ORDER,
  SourceType,
  bitable,
  dashboard,
  ICategory,
  IData,
  FieldType,
  ISeries,
  Rollup,
  IDataCondition,
  ICurrencyField,
} from '@lark-base-open/js-sdk';
import { RadarChart } from './components/chart/radar_chart';
import { ConfigPanel, IFormValues, ITableSource } from './components/config-panel/config_panel';

export default function App() {
  const [tableSource, setTableSource] = useState<ITableSource[]>([]);
  const [dataRange, setDataRange] = useState<IDataRange[]>([{ type: SourceType.ALL }]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [initFormValue, setInitFormValue] = useState<IFormValues>();
  const [renderData, setRenderData] = useState<IData>([]);
  const [formState, setFormState] = useState({});

  const getTableList = useCallback(async () => {
    const tables = await bitable.base.getTableList();
    return await Promise.all(
      tables.map(async (table) => {
        const name = await table.getName();
        return {
          tableId: table.id,
          tableName: name,
        };
      }),
    );
  }, []);

  const getTableRange = useCallback((tableId: string) => {
    return dashboard.getTableDataRange(tableId);
  }, []);

  const getCategories = useCallback((tableId: string) => {
    return dashboard.getCategories(tableId);
  }, []);

  // 展示态
  useEffect(() => {
    async function fetchData() {
      if (dashboard.state === DashboardState.View) {
        const res = await dashboard.getData();
        setRenderData(res);

        dashboard.onDataChange(async (res) => {
          setRenderData(res.data);
        });

        // dashboard.onConfigChange(async (res) => {
        //   console.log('🚀  re22222222s:', res);
        //   setFormState(res.data.customConfig);
        //   // setRenderData(res.data);
        // });
      }
    }

    fetchData();
  }, []);

  // 获取人员字段
  function filterCategories(data: ICategory[], type: 'user' | 'number') {
    let _list = type === 'user' ? [11, 1003, 1004] : [2, 99003];
    const _data = [...data];

    return _data.filter((item) => _list.includes(item.fieldType));
  }

  // 配置态
  useEffect(() => {
    if (dashboard.state === DashboardState.Config || dashboard.state === DashboardState.Create) {
      async function init() {
        const tableList = await getTableList();
        setTableSource(tableList);

        let formInitValue: IFormValues = {} as IFormValues;
        let previewConfig: IDataCondition = {} as IDataCondition;

        // FIXME 创建阶段
        if (dashboard.state === DashboardState.Create) {
          // 创建阶段没有任何配置，设置默认配置
          const tableId = tableList[0]?.tableId;

          let [tableRanges, categories] = await Promise.all([getTableRange(tableId), getCategories(tableId)]);

          setDataRange(tableRanges);
          setCategories(categories);

          formInitValue = {
            table: tableId,
            dataRange: JSON.stringify(tableRanges[0]),
            category: filterCategories(categories, 'user')[0]?.fieldId,
            selectFiled: filterCategories(categories, 'number')[0]?.fieldId,
            style: 1,
            statistics: 'COUNTA',
          };

          previewConfig = {
            tableId,
            dataRange: tableRanges[0],
            series: 'COUNTA',
            groups: [
              {
                fieldId: filterCategories(categories, 'user')[0]?.fieldId,
                mode: GroupMode.INTEGRATED,
                sort: {
                  order: ORDER.ASCENDING,
                  sortType: DATA_SOURCE_SORT_TYPE.VIEW,
                },
              },
            ],
          };
        }

        // FIXME 配置阶段
        if (dashboard.state === DashboardState.Config) {
          // 调用后端接口 getConfig 获取刚刚配置的数据，来进行返显操作
          const { dataConditions, customConfig } = await dashboard.getConfig();

          let { tableId, dataRange, groups, series } = dataConditions[0];
          let { style } = customConfig;

          const [tableRanges, categories] = await Promise.all([getTableRange(tableId), getCategories(tableId)]);
          setDataRange(tableRanges);

          setCategories(categories);

          const statistics = series === 'COUNTA' ? 'COUNTA' : 'VALUE';

          formInitValue = {
            table: tableId,
            dataRange: JSON.stringify(dataRange),
            category: groups?.[0]?.fieldId ?? '',
            selectFiled: groups?.[1]?.fieldId ?? '',
            style,
            // indicators: statistics === 'VALUE' ? (series as ISeries[]).map((seri) => seri.fieldId) : undefined,
            statistics,
          };

          previewConfig = {
            tableId,
            groups,
            dataRange,
            series,
          };
          if (customConfig) {
            setFormState(customConfig?.allValues);
          }
        }

        setInitFormValue(formInitValue);

        const data = await dashboard.getPreviewData(previewConfig);

        setRenderData(data);
      }
      init();
    }
  }, [getTableList, getTableRange, getCategories]);

  const [currencyCode, setCurrencyCode] = useState();

  function getCurrency(currencyCode) {
    const currencySymbols = {
      CNY: '¥',
      USD: '$',
      EUR: '€',
      GBP: '£',
      AED: 'dh',
      AUD: '$',
      BRL: 'R$',
      CAD: '$',
      CHF: 'CHF',
      HKD: '$',
      INR: '₹',
      IDR: 'Rp',
      JPY: '¥',
      KRW: '₩',
      MOP: 'MOP$',
      MXN: '$',
      MYR: 'RM',
      PHP: '₱',
      PLN: 'zł',
      RUB: '₽',
      SGD: '$',
      THB: '฿',
      TRY: '₺',
      TWD: 'NT$',
      VND: '₫',
    };

    return currencySymbols[currencyCode] || '';
  }

  const handleConfigChange = async (changedVal, allValues: IFormValues, form) => {
    let { category, dataRange, table, statistics, indicators, selectFiled } = allValues;

    // 监听表单变化

    // table 修改，后续数据需调整，相当于初始化
    if (changedVal.table) {
      const tableRanges = await getTableRange(changedVal.table);
      setDataRange(tableRanges);

      const categories = await getCategories(changedVal.table);
      setCategories(categories);

      form.setValue('category', filterCategories(categories, 'user')[0]?.fieldId);
      category = filterCategories(categories, 'user')[0]?.fieldId;

      form.setValue('selectFiled', filterCategories(categories, 'number')[0]?.fieldId);
      selectFiled = filterCategories(categories, 'number')[0]?.fieldId;

      let _all = JSON.stringify({
        type: SourceType.ALL,
      });

      form.setValue('dataRange', _all);

      dataRange = _all;

      form.setValue('style', 1);
      form.setValue('statistics', 'COUNTA');
    }

    // 切换至『统计字段数值』默认选中第一个数字或货币字段
    if (changedVal.statistics) {
      let _data = filterCategories(categories, 'number')[0];

      form.setValue('selectFiled', _data?.fieldId);
      selectFiled = _data?.fieldId;

      if (_data?.fieldType === 99003) {
        const _table = await bitable.base.getTable(table);
        const currencyField = await _table.getField(_data.fieldId);
        const res = await currencyField.getCurrencyCode();
        const currencyCode = getCurrency(res);

        form.setValue('unit', currencyCode);

        // setCurrencyCode(currencyCode);
      } else {
        form.setValue('unit', '');
      }
    }

    if (changedVal.selectFiled) {
      let isCurrency =
        filterCategories(categories, 'number').find((item) => item.fieldId === selectFiled)?.fieldType === 99003;

      if (isCurrency) {
        const _table = await bitable.base.getTable(table);
        const currencyField = await _table.getField(selectFiled);
        const res = await currencyField.getCurrencyCode();
        const currencyCode = getCurrency(res);

        form.setValue('unit', currencyCode);
        // setCurrencyCode(currencyCode);
      } else {
        form.setValue('unit', '');
      }
    }

    const dataRangeObj = JSON.parse(dataRange);

    const groups = [
      {
        fieldId: category,
        mode: GroupMode.INTEGRATED,
        sort: {
          order: ORDER.ASCENDING,
          sortType: DATA_SOURCE_SORT_TYPE.VIEW,
        },
      },
    ];

    let series: 'COUNTA' | ISeries[];

    if (statistics === 'COUNTA') {
      // 统计记录总数
      series = 'COUNTA';
    } else {
      series = [
        {
          fieldId: selectFiled,
          rollup: Rollup.MAX,
        },
      ];
    }

    const data = await dashboard.getPreviewData({
      tableId: table,
      dataRange: dataRangeObj,
      groups,
      series,
    });

    // FIXME 这里根据表单的数据去修改左侧的图表

    setFormState(allValues);
    setRenderData(data);
  };

  // FIXME 保存配置至展示状态

  // const updateConfig = (res: any) => {
  //   const { customConfig } = res;
  //   if (customConfig) {
  //     // setConfig(customConfig as any);
  //     setTimeout(() => {
  //       // 预留3s给浏览器进行渲染，3s后告知服务端可以进行截图了
  //       dashboard.setRendered();
  //     }, 3000);
  //   }
  // };

  // useEffect(() => {
  //   // isCreate
  //   if (dashboard.state === DashboardState.Create) {
  //     return;
  //   }
  //   // 初始化获取配置
  //   dashboard.getConfig().then(updateConfig);
  // }, []);

  // useEffect(() => {
  //   const offConfigChange = dashboard.onConfigChange((r) => {
  //     // 监听配置变化，协同修改配置
  //     updateConfig(r.data);
  //   });
  //   return () => {
  //     offConfigChange();
  //   };
  // }, []);

  const saveConfig = (allValues) => {
    const { category, dataRange, table, style, selectFiled } = allValues;

    const dataRangeObj = dataRange && JSON.parse(dataRange);

    const groups = [
      {
        fieldId: category,
        mode: GroupMode.INTEGRATED,
        sort: {
          order: ORDER.ASCENDING,
          sortType: DATA_SOURCE_SORT_TYPE.VIEW,
        },
      },
    ];

    const dataCondition = {
      tableId: table,
      dataRange: dataRangeObj,
      groups,
    };

    setFormState(allValues);

    // 保存配置，通常在插件处于配置状态且用户修改并保存配置后调用，调用该接口会关闭配置弹窗进入展示状态。

    // customConfig 自定义配置，来控制返显操作
    // 这里调用 saveConfig 其实就是相当于调用后端接口保存数据
    dashboard.saveConfig({
      dataConditions: dataCondition,
      customConfig: {
        style,
        allValues,
      },
    });
  };

  {
    /* 创建和配置菜显示 配置界面 */
  }
  const isCreateOrConfig = dashboard.state === DashboardState.Create || dashboard.state === DashboardState.Config;

  return (
    <div className='chart-app'>
      {/* 所有状态都显示图表界面 */}
      <RadarChart
        dataSet={renderData.map((data) => data.map((item) => item.value ?? ''))}
        formState={formState}
      />

      {isCreateOrConfig ? (
        <ConfigPanel
          handleConfigChange={handleConfigChange}
          tableSource={tableSource}
          dataRange={dataRange}
          categories={categories}
          onSaveConfig={saveConfig}
          initFormValue={initFormValue}
          dataSet={renderData.map((data) => data.map((item) => item.value ?? ''))}
          currencyCode={currencyCode}
        />
      ) : null}
    </div>
  );
}
