/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-10 19:41
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-31 00:00
 * @desc       :
 */
import { FC, useEffect, useRef, useState } from 'react';
// import { Form, Select, FormInstance, Radio } from 'antd';
import { IDataRange, SourceType, ICategory, bitable } from '@lark-base-open/js-sdk';
import { AppWrapper } from './style';
import { Button, Form, Divider, Input, Dropdown } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';

import { People, ViewList } from '@icon-park/react';

import { useFilterView } from '../FilterView';

import TableIcon from '../../assets/icons/Table.svg';
import FilterIcon from '../../assets/icons/filter.svg';

import IconComponent from '../FiledIcon';

import { lightTheme, darkTheme } from '../../utils/theme';

export const ConfigPanel: FC<any> = ({
  initFormValue,
  tableSource,
  dataRange,
  categories,
  handleConfigChange,
  onSaveConfig,
  dropChange,
  dataSet,
  operation,
  isPercent,
  getNewData,
  filterInfo,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { openFilterModal } = useFilterView({
    saveCallback: (filterInfo) => {
      // FIXME 到这个地方，就结束了，其他的就是用户自己操作给的数据

      getNewData(filterInfo);
    },

    cancelCallback: () => {
      // console.log('取消回调');
    },
  });

  useEffect(() => {
    async function fn() {
      const theme = await bitable.bridge.getTheme();

      if (theme === 'DARK') {
        setIsDarkMode(true);
      }

      bitable.bridge.onThemeChange((event) => {
        if (event.data.theme === 'DARK') {
          setIsDarkMode(true);
        } else {
          setIsDarkMode(false);
        }
      });
    }

    fn();
  }, []);

  const api: any = useRef();

  const isNumberFiled = (values) => {
    // 当「当前值」选择「统计记录总数」或「统计字段数值」选择最终值为「数字」类型字段时，展示此配置项

    const isCOUNTA = values.statistics === 'COUNTA';

    // const isVALUE = values.statistics === 'VALUE';

    // const isUnit = categories.find((item) => item.fieldId === values.selectFiled)?.fieldType === 2;
    // const isUnit = categories.find((item) => item.fieldId === values.selectFiled)?.fieldType === 2;

    // return isCOUNTA || (isVALUE && isUnit);
    // return isCOUNTA || isVALUE;

    return categories.find((item) => item.fieldId === values.selectFiled)?.fieldType !== 99003 || isCOUNTA;
  };

  const [inputValue, setInputValue] = useState('');

  const renderSelectedItem = (optionNode) => {
    const type = categories.find((item) => item.fieldId === optionNode.value)?.fieldType;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconComponent index={type} />
        <div style={{ marginLeft: '5px' }}>{optionNode.label} </div>
      </div>
    );
  };

  const renderOptionItem = (renderProps) => {
    const {
      disabled,
      selected,
      label,
      value,
      focused,
      className,
      style,
      onMouseEnter,
      onClick,
      empty,
      emptyContent,
      ...rest
    } = renderProps;

    const type = categories.find((item) => item.fieldId === value)?.fieldType;

    const searchWords = [inputValue];

    // Notice：
    // 1.props传入的style需在wrapper dom上进行消费，否则在虚拟化场景下会无法正常使用
    // 2.选中(selected)、聚焦(focused)、禁用(disabled)等状态的样式需自行加上，你可以从props中获取到相对的boolean值
    // 3.onMouseEnter需在wrapper dom上绑定，否则上下键盘操作时显示会有问题

    return (
      <div
        className='custom-option-render'
        style={style}
        onClick={() => onClick()}
        onMouseEnter={(e) => onMouseEnter()}
      >
        <IconComponent index={type} />
        {label}
      </div>
    );
  };

  const [customOptionList, setCustomOptionList] = useState([]);

  useEffect(() => {
    // setCustomOptionList(
    //   categories
    //     .filter((item) => [2, 99003].includes(item.fieldType))
    //     .map((category) => ({
    //       value: category.fieldId,
    //       label: category.fieldName,
    //     })),
    // );
  }, []);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let _list = categories
      .filter((item) => [2, 99003].includes(item.fieldType) && item.fieldName.includes(inputValue))
      .map((category) => ({
        value: category.fieldId,
        label: category.fieldName,
      }));

    setCustomOptionList(_list);
  }, [inputValue]);

  const dropItemClick = (e, formState) => {
    let data = e.target.textContent;
    dropChange(data, formState.values);
  };

  return (
    <AppWrapper theme={isDarkMode ? darkTheme : lightTheme}>
      {initFormValue && tableSource.length && categories.length ? (
        <>
          <Form
            className='form'
            initValues={initFormValue}
            getFormApi={(formApi) => (api.current = formApi)}
            onValueChange={(values, changedValue) => handleConfigChange(changedValue, values, api.current)}
          >
            {({ formState, values, formApi }) => (
              <>
                <div className='form-content'>
                  {/* 数据源 */}
                  <Form.Select
                    field='table'
                    filter
                    prefix={
                      <img
                        src={TableIcon}
                        alt=''
                        style={{ margin: '0 8px 0 10px' }}
                      />
                    }
                    label={{ text: '数据源' }}
                    style={{ width: '100%' }}
                    optionList={tableSource.map((item) => ({
                      value: item.tableId,
                      label: item.tableName,
                    }))}
                  />

                  {/* 数据范围 */}
                  <Form.Select
                    filter
                    field='dataRange'
                    prefix={
                      <img
                        src={TableIcon}
                        alt=''
                        style={{ margin: '0 8px 0 10px' }}
                      />
                    }
                    label={{ text: '数据范围', required: true }}
                    style={{ width: '100%' }}
                    optionList={dataRange.map((range) => {
                      const { type } = range;
                      if (type === SourceType.ALL) {
                        return {
                          value: JSON.stringify(range),
                          label: '全部数据',
                        };
                      } else {
                        return {
                          value: JSON.stringify(range),
                          label: range.viewName,
                        };
                      }
                    })}
                  />

                  {/* FIXME 筛选数据 */}
                  {
                    <div className='filter'>
                      <div
                        className='main'
                        onClick={() => openFilterModal({ tableId: formState.values.table, filterInfo })}
                      >
                        <img
                          src={FilterIcon}
                          style={{ marginRight: '2px' }}
                        />
                        筛选数据
                      </div>

                      {filterInfo?.conditions?.length > 0 && (
                        <div className='selected'>已选：{filterInfo?.conditions?.length} 个条件</div>
                      )}
                    </div>
                  }

                  {/* 样式 */}
                  {/* FIXME 暂时不需要样式切换，等有头像再做 */}
                  {/* <Form.RadioGroup
                  field='style'
                  label={{ text: '样式' }}
                  style={{ width: 176 }}
                  type='button'
                  options={[
                    { value: 1, label: '列表' },
                    { value: 2, label: '卡片和列表' },
                  ]}
                /> */}

                  {/* <Divider margin='4x' /> */}

                  {/* 人员 */}
                  <Form.Select
                    filter
                    field='category'
                    label={{ text: '名称' }}
                    style={{ width: '100%' }}
                    renderSelectedItem={renderSelectedItem}
                    renderOptionItem={renderOptionItem}
                    optionList={categories
                      // .filter((item) => [11, 1003, 1004].includes(item.fieldType))
                      .map((category) => {
                        const { fieldName } = category;
                        return {
                          value: category.fieldId,
                          label: fieldName,
                        };
                      })}
                  />

                  {/* 指标 */}
                  <Form.Select
                    field='statistics'
                    label={{ text: '指标' }}
                    style={{ width: '100%' }}
                    optionList={[
                      { value: 'COUNTA', label: '统计记录总数' },
                      { value: 'VALUE', label: '统计字段数值' },
                    ]}
                  />

                  {/* 选择字段 */}
                  {formState.values.statistics === 'VALUE' && (
                    <Form.Select
                      filter
                      showArrow={false}
                      suffix={
                        <Dropdown
                          className='select-suffix'
                          position='bottomRight'
                          trigger={'click'}
                          stopPropagation={true}
                          clickToHide={true}
                          render={
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={(e) => dropItemClick(e, formState)}>求和</Dropdown.Item>
                              <Dropdown.Item onClick={(e) => dropItemClick(e, formState)}>最大值</Dropdown.Item>
                              <Dropdown.Item onClick={(e) => dropItemClick(e, formState)}>最小值</Dropdown.Item>
                              <Dropdown.Item onClick={(e) => dropItemClick(e, formState)}>平均值</Dropdown.Item>
                            </Dropdown.Menu>
                          }
                        >
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            {operation}
                          </div>
                        </Dropdown>
                      }
                      field='selectFiled'
                      label={{ text: '选择字段' }}
                      style={{ width: '100%' }}
                      renderSelectedItem={renderSelectedItem}
                      // outerTopSlot={
                      //   <Input
                      //     onChange={(value) => setInputValue(value)}
                      //     prefix={<IconSearch />}
                      //     showClear
                      //     placeholder='搜索字段'
                      //   ></Input>
                      // }
                      // optionList={customOptionList}

                      optionList={categories
                        .filter(
                          (item) =>
                            [2, 99003, 20, 19, 99002, 99004].includes(item.fieldType) &&
                            item.fieldName.includes(inputValue),
                        )
                        .map((category) => ({
                          value: category.fieldId,
                          label: category.fieldName,
                        }))}
                      renderOptionItem={renderOptionItem}
                    />
                  )}

                  {/* 小数位与格式 */}
                  {formState.values.statistics === 'VALUE' && (
                    <Form.InputGroup
                      label={{ text: <span>小数位与格式</span> }}
                      labelPosition='top'
                      className='decimal-number-line'
                    >
                      <Form.InputNumber
                        placeholder='请输入小数位数'
                        className='decimalNumber'
                        field='decimalNumber'
                        formatter={(value) => `${value}`.replace(/\D/g, '')}
                        min={0}
                        max={1000}
                        showClear
                      />

                      <Form.Select
                        className='displayFormat'
                        field='displayFormat'
                        placeholder='请选择展示格式'
                        optionList={[
                          { value: 1, label: '整数' },
                          { value: 2, label: '千分位' },
                        ]}
                      />
                    </Form.InputGroup>
                  )}

                  {/* 单位 */}
                  {!isPercent && (
                    <Form.InputGroup
                      label={{ text: <span>单位</span> }}
                      labelPosition='top'
                      className='unitLine'
                    >
                      <Form.Input
                        className='unit'
                        disabled={!isNumberFiled(formState.values)}
                        field='unit'
                        showClear
                      />

                      <Form.RadioGroup
                        field='unitPosition'
                        type='button'
                        options={[
                          { value: 'LEFT', label: '左' },
                          { value: 'RIGHT', label: '右' },
                        ]}
                      />
                    </Form.InputGroup>
                  )}

                  {/* 排序 */}
                  <Form.RadioGroup
                    style={{ width: '99.5%' }}
                    label={{ text: '排序' }}
                    field='sort'
                    type='button'
                    options={[
                      {
                        value: 1,
                        label: (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <svg
                              width='17'
                              height='16'
                              viewBox='0 0 17 16'
                              fill='currentColor'
                              xmlns='http://www.w3.org/2000/svg'
                              style={{ marginRight: '2px' }}
                            >
                              <path
                                d='M4.71708 14.5567C4.74696 14.6011 4.79026 14.6346 4.84063 14.6525C4.89101 14.6704 4.9458 14.6717 4.99697 14.6562C5.04814 14.6407 5.09299 14.6093 5.12493 14.5664C5.15686 14.5236 5.17421 14.4716 5.17443 14.4182V1.58347C5.17443 1.51722 5.14809 1.45368 5.1012 1.40683C5.05432 1.35998 4.99073 1.33366 4.92443 1.33366H4.0911C4.02491 1.33366 3.96143 1.35989 3.91456 1.40659C3.8677 1.45329 3.84128 1.51666 3.8411 1.5828V10.5731H2.13443C2.10685 10.5731 2.0798 10.5807 2.05625 10.595C2.03271 10.6094 2.01358 10.6299 2.00097 10.6544C1.98836 10.679 1.98276 10.7065 1.98478 10.734C1.9868 10.7614 1.99637 10.7878 2.01243 10.8103L4.66243 14.4881C4.67283 14.5026 4.68467 14.516 4.69776 14.5281L4.71708 14.5567ZM6.75776 12.4353C6.69145 12.4353 6.62786 12.4089 6.58098 12.3621C6.5341 12.3152 6.50776 12.2517 6.50776 12.1854V11.3527C6.50776 11.2149 6.61976 11.1029 6.75776 11.1029H11.5911C11.6574 11.1029 11.721 11.1293 11.7679 11.1761C11.8148 11.223 11.8411 11.2865 11.8411 11.3527V12.1854C11.8411 12.2517 11.8148 12.3152 11.7679 12.3621C11.721 12.4089 11.6574 12.4353 11.5911 12.4353H6.75776ZM6.50776 7.96664C6.50776 8.10453 6.61976 8.21645 6.75776 8.21645H13.3246C13.4626 8.21645 13.5746 8.10453 13.5746 7.96664V7.13394C13.5746 7.06768 13.5483 7.00414 13.5014 6.95729C13.4545 6.91045 13.3909 6.88413 13.3246 6.88413H6.75776C6.69145 6.88413 6.62786 6.91045 6.58098 6.95729C6.5341 7.00414 6.50776 7.06768 6.50776 7.13394V7.96664ZM6.75776 3.99764C6.69145 3.99764 6.62786 3.97132 6.58098 3.92447C6.5341 3.87762 6.50776 3.81409 6.50776 3.74783V2.91514C6.50776 2.77724 6.61976 2.66533 6.75776 2.66533L14.9181 2.66532C14.9844 2.66532 15.048 2.69164 15.0948 2.73849C15.1417 2.78534 15.1681 2.84888 15.1681 2.91513V3.74783C15.1681 3.81408 15.1417 3.87762 15.0948 3.92446C15.048 3.97131 14.9844 3.99763 14.9181 3.99763L6.75776 3.99764Z'
                                fill='currentColor'
                              />
                            </svg>
                            降序
                          </div>
                        ),
                      },
                      {
                        value: 2,
                        label: (
                          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg
                              width='17'
                              height='16'
                              viewBox='0 0 17 16'
                              fill='currentColor'
                              xmlns='http://www.w3.org/2000/svg'
                              style={{ marginRight: '2px' }}
                            >
                              <path
                                d='M4.71708 1.44325C4.74696 1.39894 4.79026 1.36537 4.84063 1.34746C4.89101 1.32955 4.9458 1.32825 4.99697 1.34376C5.04814 1.35926 5.09299 1.39075 5.12493 1.43359C5.15686 1.47644 5.17421 1.52839 5.17443 1.58182V14.4165C5.17443 14.4828 5.14809 14.5463 5.1012 14.5932C5.05432 14.64 4.99073 14.6663 4.92443 14.6663H4.0911C4.02491 14.6663 3.96143 14.6401 3.91456 14.5934C3.8677 14.5467 3.84128 14.4833 3.8411 14.4172V5.42691H2.13443C2.10685 5.42692 2.0798 5.41933 2.05625 5.40498C2.03271 5.39063 2.01358 5.37006 2.00097 5.34555C1.98836 5.32104 1.98276 5.29353 1.98478 5.26604C1.9868 5.23855 1.99637 5.21216 2.01243 5.18975L4.66243 1.51187C4.67283 1.4974 4.68467 1.48401 4.69776 1.4719L4.71708 1.44325ZM6.75776 3.56474C6.69145 3.56474 6.62786 3.59106 6.58098 3.63791C6.5341 3.68476 6.50776 3.7483 6.50776 3.81455V4.64725C6.50776 4.78515 6.61976 4.89706 6.75776 4.89706H11.5911C11.6574 4.89706 11.721 4.87074 11.7679 4.8239C11.8148 4.77705 11.8411 4.71351 11.8411 4.64725V3.81455C11.8411 3.7483 11.8148 3.68476 11.7679 3.63791C11.721 3.59106 11.6574 3.56474 11.5911 3.56474H6.75776ZM6.50776 8.03336C6.50776 7.89547 6.61976 7.78355 6.75776 7.78355H13.3246C13.4626 7.78355 13.5746 7.89547 13.5746 8.03336V8.86606C13.5746 8.93232 13.5483 8.99586 13.5014 9.04271C13.4545 9.08955 13.3909 9.11587 13.3246 9.11587H6.75776C6.69145 9.11587 6.62786 9.08955 6.58098 9.04271C6.5341 8.99586 6.50776 8.93232 6.50776 8.86606V8.03336ZM6.75776 12.0024C6.69145 12.0024 6.62786 12.0287 6.58098 12.0755C6.5341 12.1224 6.50776 12.1859 6.50776 12.2522V13.0849C6.50776 13.2228 6.61976 13.3347 6.75776 13.3347L14.9181 13.3347C14.9844 13.3347 15.048 13.3084 15.0948 13.2615C15.1417 13.2147 15.1681 13.1511 15.1681 13.0849V12.2522C15.1681 12.1859 15.1417 12.1224 15.0948 12.0755C15.048 12.0287 14.9844 12.0024 14.9181 12.0024L6.75776 12.0024Z'
                                fill='currentColor'
                              />
                            </svg>
                            升序
                          </div>
                        ),
                      },
                    ]}
                  />

                  <Divider />

                  {/* 自定义数量 */}
                  <Form.InputGroup
                    className='amountSwitch'
                    label={{ text: <span>自定义数量</span> }}
                    labelPosition='left'
                  >
                    <Form.Switch field='amountSwitch' />
                  </Form.InputGroup>
                  {formState.values.amountSwitch && (
                    <Form.InputNumber
                      className='amountNumber'
                      noLabel={true}
                      max={50000}
                      min={0}
                      style={{ width: '100%', marginBottom: '0px' }}
                      field='amountNumber'
                    />
                  )}
                </div>

                <Button
                  onClick={() => {
                    onSaveConfig(formState.values);
                  }}
                  className='confirm'
                  style={{ position: 'fixed', bottom: 20, right: 30 }}
                >
                  确定
                </Button>
              </>
            )}
          </Form>
        </>
      ) : null}
    </AppWrapper>
  );
};
