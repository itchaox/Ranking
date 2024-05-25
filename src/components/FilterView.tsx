import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Button, Modal, Select, Input } from '@douyinfe/semi-ui';

import type { IFieldMeta, IFilterInfo } from '@lark-base-open/js-sdk';
import { bitable } from '@lark-base-open/js-sdk';

import { AppWrapper } from './style';

type modalPropsType = {
  infoTxt?: string;
  successCallback?: (values?: any) => void;
};

export const useFilterView = (props: modalPropsType = {}) => {
  const { infoTxt = '这是一段提示', successCallback = () => {} } = props;

  const [show, setShow] = useState<boolean>(false);

  interface IExternalParams {
    tableId: string;
    filterInfo?: IFilterInfo;
  }

  const [externalParams, setExternalParams] = useState<any>();
  // externalParams， tableId, filterInfo

  // 筛选的字段列表
  const [filterFieldList, setFilterFieldList] = useState<IFieldMeta[]>([]);

  // 筛选列表
  const [filterList, setFilterList] = useState<any>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const rootRef = useRef<ReturnType<typeof ReactDOM.createRoot> | null>(null);

  const getOperatorOptionList = (filedType: number) => {
    const _arr1 = [1, 3, 4, 13, 15, 22, 99001, 99005];
    const _arr2 = [2, 1005, 99002, 99003, 99004];
    const _arr3 = [11, 17, 18, 19, 20, 21, 23, 1003, 1004];
    const _arr4 = [5, 1001, 1002];

    let type = 1;

    if (_arr1.includes(filedType)) {
      type = 1;
    } else if (_arr2.includes(filedType)) {
      type = 2;
    } else if (_arr3.includes(filedType)) {
      type = 3;
    } else if (_arr4.includes(filedType)) {
      type = 4;
    }

    const list = [
      {
        value: 'is',
        label: '等于',
        type: [1, 2, 4],
      },
      {
        value: 'isNot',
        label: '不等于',
        type: [1, 2],
      },
      {
        value: 'contains',
        label: '包含',
        type: [1],
      },
      {
        value: 'doesNotContain',
        label: '不包含',
        type: [1],
      },
      {
        value: 'isGreater',
        label: '晚于',
        type: [4],
      },
      {
        value: 'isLess',
        label: '早于',
        type: [4],
      },
      {
        value: 'isEmpty',
        label: '为空',
        type: [1, 2, 3, 4],
      },
      {
        value: 'isNotEmpty',
        label: '不为空',
        type: [1, 2, 3, 4],
      },
      {
        value: 'isGreater',
        label: '大于',
        type: [2],
      },
      {
        value: 'isGreaterEqual',
        label: '大于或等于',
        type: [2],
      },
      {
        value: 'isLess',
        label: '小于',
        type: [2],
      },
      {
        value: 'isLessEqual',
        label: '小于或等于',
        type: [2],
      },
    ];

    return list.filter((item) => item.type.includes(type));
  };

  const addFilter = () => {
    let _arr = [
      ...filterList,
      {
        id: filterFieldList[0]?.id,
        name: filterFieldList[0]?.name,
        type: filterFieldList[0]?.type,
        operator: 'is',
        value: '',
      },
    ];

    setFilterList(_arr);
  };

  const createContainer = useCallback(() => {
    if (!containerRef.current) {
      const div = document.createElement('div');
      div.id = 'myContainer';
      document.body.append(div);
      containerRef.current = div;
      rootRef.current = ReactDOM.createRoot(div);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (containerRef.current) {
        rootRef.current?.unmount();
        document.body.removeChild(containerRef.current);
        containerRef.current = null;
        rootRef.current = null;
      }
    };
  }, []);

  const unMounted = useCallback(() => {
    if (containerRef.current) {
      rootRef.current?.unmount();
      document.body.removeChild(containerRef.current);
      containerRef.current = null;
      rootRef.current = null;
    }
  }, []);

  // 确定按钮
  const success = useCallback(
    (values: any) => {
      console.log('filterList', filterList);

      // interface IFilterInfo {
      //   conjunction: FilterConjunction;
      //   conditions: FilterInfoCondition[];
      // }

      // FilterConjunction 过滤条件的生效条件
      // FilterNumber 过滤条件数量

      // FIXME 把这些东西抛出去

      successCallback({
        filterNumber: filterList.length,
        filterInfo: {
          conjunction: 'and',
          conditions: filterList.map((item) => ({
            fieldId: item.id, // field 唯一标识
            // conditionId?: string; // condition 唯一标识，新增时可不传入
            value: item.value, // 字段匹配值
            operator: item.operator, // 匹配操作符
          })),
        },
      });

      // externalParams.getNewData({
      //   filterNumber: filterList.length,
      //   filterInfo: {
      //     conjunction: 'and',
      //     conditions: filterList.map((item) => ({
      //       fieldId: item.id, // field 唯一标识
      //       // conditionId?: string; // condition 唯一标识，新增时可不传入
      //       value: item.value, // 字段匹配值
      //       operator: item.operator, // 匹配操作符
      //     })),
      //   },
      // });

      setShow(false);
      unMounted();
    },
    [unMounted, successCallback],
  );

  // 取消按钮
  const cancel = useCallback(() => {
    setShow(false);
    unMounted();
  }, [unMounted]);

  useEffect(() => {
    async function fn() {
      if (!show) return;

      // 弹窗打开时
      const table = await bitable.base.getTable(externalParams?.tableId);

      const viewList = await table.getViewList();

      const view = await table.getViewById(viewList[0]?.id);

      const fieldMetaList = await view.getFieldMetaList();

      // FIXME 哪些字段不需要处理（按钮没有，但是按钮和流程的 type 都为 0，这个如何判断呢） 流程 和按钮字段在 js sdk 中找不到
      setFilterFieldList(fieldMetaList.filter((item) => item.type !== 0));
    }

    fn();
  }, [show]);

  const filterFiledChange = (value, index) => {
    let _activeItem = filterFieldList.find((i) => i.id === value);
    let _arr = [...filterList];

    // 字段名
    _arr[index] = {
      id: _activeItem.id,
      name: _activeItem.name,
      type: _activeItem.type,

      // 重新初始化条件下拉框
      operator: getOperatorOptionList(_activeItem.type)[0]?.value,
      value: '',
    };

    setFilterList(_arr);
  };

  useEffect(() => {
    if (show && containerRef.current && rootRef.current) {
      rootRef.current.render(
        <Modal
          onCancel={cancel}
          visible={show}
          onOk={() => success(null)}
          title={'设置筛选条件'}
          destroyOnClose
          width='45%'
          centered
          maskClosable={false}
          footer={[
            <Button
              key='cancel'
              onClick={cancel}
            >
              取消
            </Button>,
            <Button
              key='success'
              theme='solid'
              onClick={() => success(null)}
            >
              保存
            </Button>,
          ]}
          getContainer={() => containerRef.current!}
        >
          <AppWrapper>
            {filterList.map((item, index) => (
              <div
                key={item.id + index}
                className='line'
              >
                {/* 字段名 */}
                <div className='left'>
                  <Select
                    filter
                    value={item.id}
                    onChange={(value) => filterFiledChange(value, index)}
                    optionList={filterFieldList.map((i) => ({
                      value: i.id,
                      label: i.name,
                    }))}
                  />
                </div>

                <div className='right'>
                  {/* 条件 */}
                  <div className='operator'>
                    <Select
                      filter
                      value={item.operator}
                      onChange={(value) => {
                        let _arr = [...filterList];
                        _arr[index].operator = value;
                        setFilterList(_arr);
                      }}
                      optionList={getOperatorOptionList(item.type)}
                      // optionList={[
                      //   { value: 'is', label: '等于', type: 2 },
                      //   { value: 'isNot', label: '不等于' },
                      //   { value: 'contains', label: '包含' },
                      // ]}
                    />
                  </div>

                  {/* 字段值 */}
                  <div className='value'>
                    <Input
                      value={item.value}
                      onChange={(value) => {
                        let _arr = [...filterList];
                        _arr[index].value = value;
                        setFilterList(_arr);
                      }}
                      placeholder='请输入'
                    />
                  </div>
                  <div
                    className='delete'
                    onClick={() => {
                      let _arr = [...filterList];
                      _arr.splice(index, 1);
                      setFilterList(_arr);
                    }}
                  >
                    ❎
                  </div>
                </div>
              </div>
            ))}
          </AppWrapper>
          <Button onClick={addFilter}>+ 添加条件</Button>
        </Modal>,
      );
    }
  }, [show, cancel, containerRef, infoTxt, success, externalParams]);

  const openFilterView = (params: any) => {
    createContainer();
    setExternalParams(params);
    setShow(true);
  };

  return { openFilterView };
};
