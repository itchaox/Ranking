import './App.css';
import { useCallback, useEffect, useState } from 'react';
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

import { lightTheme, darkTheme } from './utils/theme';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t } = useTranslation();

  const [tableSource, setTableSource] = useState<ITableSource[]>([]);
  const [dataRange, setDataRange] = useState<IDataRange[]>([{ type: SourceType.ALL }]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [initFormValue, setInitFormValue] = useState<IFormValues>();
  const [renderData, setRenderData] = useState<IData>([]);
  const [formState, setFormState] = useState({});
  const [operation, setOperation] = useState('qiu-he');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 控制主题色

  async function fn() {
    const theme = await bitable.bridge.getTheme();

    if (theme === 'DARK') {
      setIsDarkMode(true);

      if (formState?.customColor === false) {
        setBackgroundColor('#2c3837');
        setTextColor('#fff');
      }
    }

    bitable.bridge.onThemeChange((event) => {
      if (event.data.theme === 'DARK') {
        setIsDarkMode(true);

        if (formState?.customColor === false) {
          setBackgroundColor('#2c3837');
          setTextColor('#fff');
        }
      } else {
        setIsDarkMode(false);

        if (formState?.customColor === false) {
          setBackgroundColor('#fff');
          setTextColor('#000');
        }
      }
    });
  }

  fn();

  useEffect(() => {
    async function fn() {
      const body = document.body;
      const theme = await bitable.bridge.getTheme();

      if (theme === 'DARK') {
        if (body.hasAttribute('theme-mode')) {
          body.removeAttribute('theme-mode');
        } else {
          body.setAttribute('theme-mode', 'dark');
        }
      }

      bitable.bridge.onThemeChange((event) => {
        if (event.data.theme === 'DARK') {
          if (body.hasAttribute('theme-mode')) {
            body.removeAttribute('theme-mode');
          } else {
            body.setAttribute('theme-mode', 'dark');
          }
        }
      });
    }

    fn();
  }, []);

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
      if (dashboard.state === DashboardState.View || dashboard.state === DashboardState.FullScreen) {
        // FIXME 加载插件

        // 获取配置
        const res2 = await dashboard.getConfig();
        setFormState(res2.customConfig);
        setIsPercent(res2?.customConfig?.isPercent);
        setBackgroundColor(res2?.customConfig?.backgroundColor);
        setTextColor(res2?.customConfig?.textColor);

        // 获取数据
        const res = await dashboard.getData();
        setRenderData(res);

        dashboard.onDataChange(async (res) => {
          setRenderData(res.data);
        });

        dashboard.onConfigChange(async (res) => {
          setFormState(res?.data?.customConfig);
          setOperation(res?.data?.customConfig?.operation);
          setIsPercent(res?.data?.customConfig?.isPercent);
          setBackgroundColor(res?.data?.customConfig?.backgroundColor);
          setTextColor(res?.data?.customConfig?.textColor);
        });
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

  const [temPreviewConfig, setTemPreviewConfig] = useState<IDataCondition>();

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
            statistics: 'COUNTA',
            unit: '',
            unitPosition: 'LEFT',
            amountSwitch: true,
            amountNumber: 10,
            decimalNumber: 0,
            displayFormat: 1,
            sort: 1,
            isParallel: true,
            prefix: '',
            suffix: '',
            customColor: false,
            // style: 1,
          };

          previewConfig = {
            tableId,
            dataRange: tableRanges[0],
            series: 'COUNTA',
            groups: [
              {
                fieldId: filterCategories(categories, 'user')[0]?.fieldId,
                mode: GroupMode.ENUMERATED,
                sort: {
                  order: ORDER.DESCENDING,
                  sortType: DATA_SOURCE_SORT_TYPE.VALUE,
                },
              },
            ],
          };
        }

        // FIXME 配置阶段
        if (dashboard.state === DashboardState.Config) {
          // 调用后端接口 getConfig 获取刚刚配置的数据，来进行返显操作
          const { dataConditions, customConfig } = await dashboard.getConfig();

          let { tableId, dataRange, groups } = dataConditions[0];

          // FIXME 筛选暂时注释
          setFilterInfo(dataRange?.filterInfo);

          let _dataRange = { ...dataRange };

          delete _dataRange.filterInfo;

          let {
            unit,
            unitPosition,
            amountSwitch,
            amountNumber,
            statistics,
            selectFiled,
            operation: _operation,
            isPercent: _isPercent,
            decimalNumber,
            displayFormat,
            sort,
            isParallel,
            prefix,
            suffix,
            customColor,
            backgroundColor: _backgroundColor,
            textColor: _textColor,
          } = customConfig;

          const [tableRanges, categories] = await Promise.all([getTableRange(tableId), getCategories(tableId)]);
          setDataRange(tableRanges);
          setCategories(categories);
          setOperation(_operation);
          setIsPercent(_isPercent);
          setBackgroundColor(_backgroundColor);
          setTextColor(_textColor);

          // FIXME 这里会导致下拉框无法正确返显
          // const statistics = series === 'COUNTA' ? 'COUNTA' : 'VALUE';

          let series: 'COUNTA' | ISeries[];

          if (statistics === 'COUNTA') {
            // 统计记录总数
            series = 'COUNTA';
          } else {
            series = [
              {
                fieldId: selectFiled,
                rollup: operationMap[_operation],
              },
            ];
          }

          formInitValue = {
            table: tableId,
            // dataRange: JSON.stringify(dataRange),

            dataRange: JSON.stringify(_dataRange),

            category: groups?.[0]?.fieldId ?? '',
            selectFiled,
            unit,
            unitPosition,
            amountSwitch,
            amountNumber,
            statistics,
            decimalNumber,
            displayFormat,
            sort,
            isParallel,
            prefix,
            suffix,
            customColor,
          };

          previewConfig = {
            tableId,
            groups,
            dataRange,
            series,
          };

          if (customConfig) {
            setFormState(customConfig);
          }
        }

        setInitFormValue(formInitValue);

        setTemPreviewConfig(previewConfig);

        const data = await dashboard.getPreviewData(previewConfig);

        setRenderData(data);
      }
      init();
    }
  }, [getTableList, getTableRange, getCategories]);

  // const [currencyCode, setCurrencyCode] = useState();

  const [filterInfo, setFilterInfo] = useState();

  const getNewData = async (filterInfo) => {
    let updatedPreviewConfig = {
      ...temPreviewConfig,
      dataRange: {
        ...temPreviewConfig.dataRange,
        filterInfo,
      },
    };

    const data = await dashboard.getPreviewData(updatedPreviewConfig);

    setRenderData(data);
    setFilterInfo(filterInfo);
  };

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

  // let operationMap = {
  //   最大值: Rollup.MAX,
  //   最小值: Rollup.MIN,
  //   求和: Rollup.SUM,
  //   平均值: Rollup.AVERAGE,
  // };

  let operationMap = {
    'qiu-he': Rollup.SUM,
    'zui-da-zhi': Rollup.MAX,
    'zui-xiao-zhi': Rollup.MIN,
    'ping-jun-zhi': Rollup.AVERAGE,
  };

  const dropChange = async (value, allValues) => {
    setOperation(value);

    let { category, dataRange, table, statistics, indicators, selectFiled, amountSwitch } = allValues;

    // 监听表单变化

    const dataRangeObj = JSON.parse(dataRange);

    const groups = [
      {
        fieldId: category,
        mode: GroupMode.ENUMERATED,
        sort: {
          order: ORDER.DESCENDING,
          sortType: DATA_SOURCE_SORT_TYPE.VALUE,
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
          rollup: operationMap[value],
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

  const [isPercent, setIsPercent] = useState(false);

  const handleConfigChange = async (changedVal, allValues: IFormValues, form) => {
    let { category, dataRange, table, statistics, indicators, selectFiled, amountSwitch } = allValues;

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

    if (changedVal.statistics === 'VALUE') {
      setIsPercent(false);

      let _data = filterCategories(categories, 'number')[0];

      form.setValue('selectFiled', _data?.fieldId);
      selectFiled = _data?.fieldId;

      if (_data?.fieldType === 99003) {
        const _table = await bitable.base.getTable(table);
        const currencyField = await _table.getField(_data.fieldId);
        const res = await currencyField.getCurrencyCode();
        const currencyCode = getCurrency(res);

        form.setValue('unit', currencyCode);
      } else if (_data?.fieldType === 2) {
        const _table = await bitable.base.getTable(table);
        const numberField = await _table.getField(_data.fieldId);
        const NumberFormatter = await numberField.getFormatter();

        // 百分比
        if (NumberFormatter === '0%' || NumberFormatter === '0.00%') {
          setIsPercent(true);
        } else {
          // 其他单位
          form.setValue('unit', '');
        }
      } else {
        form.setValue('unit', '');
      }
    }

    if (changedVal.statistics === 'COUNTA') {
      setIsPercent(false);
    }

    let _isPercent = false;
    if (changedVal.selectFiled) {
      let _data = filterCategories(categories, 'number').find((item) => item.fieldId === selectFiled);
      let isCurrency = _data?.fieldType === 99003;

      if (isCurrency) {
        const _table = await bitable.base.getTable(table);
        const currencyField = await _table.getField(selectFiled);
        const res = await currencyField.getCurrencyCode();
        const currencyCode = getCurrency(res);
        form.setValue('unit', currencyCode);
      } else if (_data?.fieldType === 2) {
        const _table = await bitable.base.getTable(table);
        const numberField = await _table.getField(_data.fieldId);
        const NumberFormatter = await numberField.getFormatter();

        // 百分比
        if (NumberFormatter === '0%' || NumberFormatter === '0.00%') {
          _isPercent = true;
        } else {
          // 其他单位
          form.setValue('unit', '');
        }
      } else {
        form.setValue('unit', '');
      }
    }

    if (changedVal.amountSwitch) {
      form.setValue('amountNumber', 10);
    }

    const dataRangeObj = JSON.parse(dataRange);

    const groups = [
      {
        fieldId: category,
        mode: GroupMode.ENUMERATED,
        sort: {
          order: ORDER.DESCENDING,
          sortType: DATA_SOURCE_SORT_TYPE.VALUE,
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
          rollup: operationMap[operation],
        },
      ];
    }

    const data = await dashboard.getPreviewData({
      tableId: table,
      // FIXME 筛选
      // dataRange: dataRangeObj,

      dataRange: { ...dataRangeObj, filterInfo },

      groups,
      series,
    });

    // FIXME 这里根据表单的数据去修改左侧的图表

    setFormState(allValues);
    setRenderData(data);

    setTemPreviewConfig({
      tableId: table,
      dataRange: { ...dataRangeObj, filterInfo },
      groups,
      series,
    });

    if (changedVal.selectFiled) {
      setIsPercent(false);

      if (_isPercent) {
        setIsPercent(true);
      }
    }
  };

  const saveConfig = (allValues) => {
    const { category, dataRange, table, style, selectFiled, statistics } = allValues;

    let series;

    if (statistics === 'COUNTA') {
      // 统计记录总数
      series = 'COUNTA';
    } else {
      series = [
        {
          fieldId: selectFiled,
          rollup: operationMap[operation],
        },
      ];
    }

    const dataRangeObj = dataRange && JSON.parse(dataRange);

    const groups = [
      {
        fieldId: category,
        mode: GroupMode.ENUMERATED,
        sort: {
          order: ORDER.DESCENDING,
          sortType: DATA_SOURCE_SORT_TYPE.VALUE,
        },
      },
    ];

    const dataCondition = {
      tableId: table,
      dataRange: { ...dataRangeObj, filterInfo },
      // dataRange: dataRangeObj,
      groups,
      series,
    };

    setFormState(allValues);

    // 保存配置，通常在插件处于配置状态且用户修改并保存配置后调用，调用该接口会关闭配置弹窗进入展示状态。

    // customConfig 自定义配置，来控制返显操作
    // 这里调用 saveConfig 其实就是相当于调用后端接口保存数据
    dashboard.saveConfig({
      dataConditions: dataCondition,
      customConfig: {
        ...allValues,
        operation,
        isPercent,
        backgroundColor,
        textColor,
      },
    });
  };

  useEffect(() => {
    async function fn() {
      if (formState?.customColor === false) {
        const theme = await bitable.bridge.getTheme();
        if (theme === 'DARK') {
          setBackgroundColor('#2c3837');
          setTextColor('#fff');
        } else {
          setBackgroundColor('#fff');
          setTextColor('#000');
        }
      }
    }

    fn();
  }, [formState?.customColor]);

  {
    /* 创建和配置菜显示 配置界面 */
  }
  const isCreateOrConfig = dashboard.state === DashboardState.Create || dashboard.state === DashboardState.Config;

  // 默认明亮主题

  const [backgroundColor, setBackgroundColor] = useState('#fff');
  const [textColor, setTextColor] = useState('#000');

  return (
    <div
      className='chart-app'
      style={isDarkMode ? { borderTop: '.5px solid #cfcfcf15' } : { borderTop: '.5px solid #1f232915' }}
    >
      {/* 所有状态都显示图表界面 */}
      <RadarChart
        dataSet={renderData.map((data) => data.map((item) => item.value ?? ''))}
        formState={formState}
        isPercent={isPercent}
        backgroundColor={backgroundColor}
        textColor={textColor}
      />

      {isCreateOrConfig ? (
        <ConfigPanel
          handleConfigChange={handleConfigChange}
          dropChange={dropChange}
          tableSource={tableSource}
          dataRange={dataRange}
          categories={categories}
          onSaveConfig={saveConfig}
          initFormValue={initFormValue}
          operation={operation}
          dataSet={renderData.map((data) => data.map((item) => item.value ?? ''))}
          isPercent={isPercent}
          getNewData={getNewData}
          filterInfo={filterInfo}
          setBackgroundColor={setBackgroundColor}
          setTextColor={setTextColor}
          backgroundColor={backgroundColor}
          textColor={textColor}
        />
      ) : null}
    </div>
  );
}
