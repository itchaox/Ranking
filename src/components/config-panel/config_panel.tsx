/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-10 19:41
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-14 16:37
 * @desc       :
 */
import { FC, useEffect, useRef, useState } from 'react';
// import { Form, Select, FormInstance, Radio } from 'antd';
import { IDataRange, SourceType, ICategory } from '@lark-base-open/js-sdk';
import { AppWrapper } from './style';
import { Button, Form, useFormApi } from '@douyinfe/semi-ui';

export const ConfigPanel: FC<any> = ({
  initFormValue,
  tableSource,
  dataRange,
  categories,
  handleConfigChange,
  onSaveConfig,
  dataSet,
  currencyCode,
}) => {
  // const [form] = Form.useForm();

  // window.__form__ = form;

  const api: any = useRef();

  const isNumberFiled = (values) => {
    // 当「当前值」选择「统计记录总数」或「统计字段数值」选择最终值为「数字」类型字段时，展示此配置项

    // const isCOUNTA = values.statistics === 'COUNTA';
    // const isVALUE = values.statistics === 'VALUE';

    // const isUnit = categories.find((item) => item.fieldId === values.selectFiled)?.fieldType === 2;
    // const isUnit = categories.find((item) => item.fieldId === values.selectFiled)?.fieldType === 2;

    // return isCOUNTA || (isVALUE && isUnit);
    // return isCOUNTA || isVALUE;

    return categories.find((item) => item.fieldId === values.selectFiled)?.fieldType === 2;
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
                {/* 数据源 */}
                <Form.Select
                  field='table'
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

                {/* 人员 */}
                <Form.Select
                  field='category'
                  label={{ text: '人员' }}
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
                    prefix={
                      categories.find((item) => item.fieldId === formState.values.selectField)?.fieldType === 2
                        ? '#'
                        : '¥'
                    }
                    suffix='后缀'
                    field='selectFiled'
                    label={{ text: '选择字段' }}
                    style={{ width: '100%' }}
                    optionList={categories
                      .filter((item) => [2, 99003].includes(item.fieldType))
                      .map((category) => {
                        const { fieldName } = category;
                        return {
                          value: category.fieldId,
                          label: fieldName,
                        };
                      })}
                  />
                )}

                {/* 单位 */}
                {/* {isShowUnit(formState.values) && ( */}
                {
                  <Form.InputGroup
                    label={{ text: <span>单位</span> }}
                    labelPosition='top'
                  >
                    <Form.Input
                      // initValue={currencyCode ? currencyCode : ''}
                      initValue=''
                      disabled={!isNumberFiled(formState.values)}
                      style={{ width: 100 }}
                      field='unit'
                      showClear
                    />

                    <Form.RadioGroup
                      field='unitPosition'
                      style={{ width: 100 }}
                      type='button'
                      initValue={'LEFT'}
                      options={[
                        { value: 'LEFT', label: '左' },
                        { value: 'RIGHT', label: '右' },
                      ]}
                    />
                  </Form.InputGroup>
                }

                {/* 自定义数量 */}
                <Form.InputGroup
                  style={{ width: '100%' }}
                  className='amountSwitch'
                  label={{ text: <span>自定义数量</span> }}
                  labelPosition='left'
                >
                  <Form.Switch field='amountSwitch' />
                </Form.InputGroup>

                {formState.values.amountSwitch && (
                  <Form.InputNumber
                    noLabel={true}
                    initValue={10}
                    max={dataSet.length - 1}
                    min={0}
                    style={{ width: '100%' }}
                    field='amountNumber'
                  />
                )}

                <Button
                  onClick={() => {
                    onSaveConfig(formState.values);
                  }}
                  style={{ position: 'fixed', bottom: 30, right: 30 }}
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
