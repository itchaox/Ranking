/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-10 19:41
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-18 08:49
 * @desc       :
 */
import { FC, useEffect, useRef, useState } from 'react';
// import { Form, Select, FormInstance, Radio } from 'antd';
import { IDataRange, SourceType, ICategory } from '@lark-base-open/js-sdk';
import { AppWrapper } from './style';
import { Button, Form, Divider, Input, Dropdown } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';

import { People, ViewList } from '@icon-park/react';

import NumberIcon from '../../assets/icons/Number.svg';
import CurrencyIcon from '../../assets/icons/Currency.svg';

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
}) => {
  const api: any = useRef();

  const isNumberFiled = (values) => {
    // 当「当前值」选择「统计记录总数」或「统计字段数值」选择最终值为「数字」类型字段时，展示此配置项

    const isCOUNTA = values.statistics === 'COUNTA';

    // const isVALUE = values.statistics === 'VALUE';

    // const isUnit = categories.find((item) => item.fieldId === values.selectFiled)?.fieldType === 2;
    // const isUnit = categories.find((item) => item.fieldId === values.selectFiled)?.fieldType === 2;

    // return isCOUNTA || (isVALUE && isUnit);
    // return isCOUNTA || isVALUE;

    return categories.find((item) => item.fieldId === values.selectFiled)?.fieldType === 2 || isCOUNTA;
  };

  const [inputValue, setInputValue] = useState('');

  const renderSelectedItem = (optionNode) => {
    const type = categories.find((item) => item.fieldId === optionNode.value)?.fieldType;
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={type === 2 ? NumberIcon : CurrencyIcon}
          style={{ marginRight: '5px' }}
        />
        <div>{optionNode.label} </div>
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
        <img src={type === 2 ? NumberIcon : CurrencyIcon} />
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
    <AppWrapper>
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
                    prefix={
                      <ViewList
                        theme='outline'
                        size='14'
                        fill='#646A73'
                        style={{ margin: '0 5px' }}
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
                    field='dataRange'
                    prefix={
                      <ViewList
                        theme='outline'
                        size='14'
                        fill='#646A73'
                        style={{ margin: '0 5px' }}
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

                  <Divider margin='4px' />

                  {/* 人员 */}
                  <Form.Select
                    field='category'
                    label={{ text: '人员' }}
                    prefix={
                      <People
                        theme='outline'
                        size='14'
                        fill='#646A73'
                        style={{ margin: '0 5px' }}
                      />
                    }
                    style={{ width: '100%' }}
                    optionList={categories
                      .filter((item) => [11, 1003, 1004].includes(item.fieldType))
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
                      outerTopSlot={
                        <Input
                          onChange={(value) => setInputValue(value)}
                          prefix={<IconSearch />}
                          showClear
                          placeholder='搜索字段'
                        ></Input>
                      }
                      // optionList={customOptionList}

                      optionList={categories
                        .filter((item) => [2, 99003].includes(item.fieldType) && item.fieldName.includes(inputValue))
                        .map((category) => ({
                          value: category.fieldId,
                          label: category.fieldName,
                        }))}
                      renderOptionItem={renderOptionItem}
                    />
                  )}

                  {/* 单位 */}
                  {/* {isShowUnit(formState.values) && ( */}
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

                  <Divider margin='4px' />

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
                      style={{ width: '100%', marginTop: '-12px' }}
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
