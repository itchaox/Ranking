import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Button, Modal, Select, Input, DatePicker, Divider, Checkbox } from '@douyinfe/semi-ui';

import type { IFieldMeta, IFilterInfo } from '@lark-base-open/js-sdk';
import { bitable } from '@lark-base-open/js-sdk';

import { AppWrapper } from './style';

import IconComponent from './FiledIcon';

import zhLocal from './locales/zh.js';
import enLocal from './locales/en.js';
import jaLocal from './locales/ja.js';

interface IModalPropsType {
  // 点击保存按钮的回调函数
  saveCallback: (filterInfo: IFilterInfo) => void;

  // 点击取消按钮的回调函数
  cancelCallback?: () => void;
}

export const useFilterView = (props: IModalPropsType) => {
  const { saveCallback = () => {}, cancelCallback = () => {} } = props;

  const [show, setShow] = useState<boolean>(false);
  const [localText, setLocalText] = useState(enLocal);

  interface IExternalParams {
    // 表格 id
    tableId: string;

    // 过滤条件数据
    filterInfo: IFilterInfo;
  }

  const [externalParams, setExternalParams] = useState<IExternalParams>();

  // 筛选的字段列表
  const [filterFieldList, setFilterFieldList] = useState<IFieldMeta[]>([]);

  // 筛选列表
  const [filterList, setFilterList] = useState<any>([]);

  const [selectOptColorInfo, setSelectOptColorInfo] = useState();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const rootRef = useRef<ReturnType<typeof ReactDOM.createRoot> | null>(null);

  const [conjunction, setConjunction] = useState('and');

  // 获取颜色列表
  useEffect(() => {
    async function fn() {
      const res = await bitable.ui.getSelectOptionColorInfoList();
      setSelectOptColorInfo(res);
    }

    fn();
  }, []);

  bitable.bridge.getLanguage().then((lang) => {
    if (lang === 'zh') {
      setLocalText(zhLocal);
    } else if (lang === 'ja') {
      setLocalText(jaLocal);
    } else {
      setLocalText(enLocal);
    }
  });

  const getOperatorOptionList = (filedType: number) => {
    const _arr1 = [1, 3, 4, 13, 15, 22, 99001, 99005];
    const _arr2 = [2, 1005, 99002, 99003, 99004];
    // const _arr3 = [11, 17, 18, 19, 20, 21, 23, 1003, 1004];
    const _arr3 = [11, 17, 23, 1003, 1004];
    const _arr4 = [5, 1001, 1002];
    const _arr5 = [19, 20];
    const _arr6 = [18, 21];

    let type = 1;

    if (_arr1.includes(filedType)) {
      type = 1;
    } else if (_arr2.includes(filedType)) {
      type = 2;
    } else if (_arr3.includes(filedType)) {
      type = 3;
    } else if (_arr4.includes(filedType)) {
      type = 4;
    } else if (_arr5.includes(filedType)) {
      type = 5;
    } else if (_arr6.includes(filedType)) {
      type = 6;
    }

    const list = [
      {
        value: 'is',
        label: localText.is,
        type: [1, 2, 4, 5, 6],
      },
      {
        value: 'isNot',
        label: localText.isNot,
        type: [1, 2, 5, 6],
      },
      {
        value: 'contains',
        label: localText.contains,
        type: [1, 5, 6],
      },
      {
        value: 'doesNotContain',
        label: localText.doesNotContain,
        type: [1, 5, 6],
      },
      {
        value: 'isGreater',
        label: localText.isGreater,
        type: [4],
      },
      {
        value: 'isLess',
        label: localText.isLess,
        type: [4],
      },
      {
        value: 'isEmpty',
        label: localText.isEmpty,
        type: [1, 2, 3, 4, 5, 6],
      },
      {
        value: 'isNotEmpty',
        label: localText.isNotEmpty,
        type: [1, 2, 3, 4, 5, 6],
      },
      {
        value: 'isGreater',
        label: localText.isGreater1,
        type: [2, 5],
      },
      {
        value: 'isGreaterEqual',
        label: localText.isGreaterEqual,
        type: [2, 5],
      },
      {
        value: 'isLess',
        label: localText.isLess1,
        type: [2, 5],
      },
      {
        value: 'isLessEqual',
        label: localText.isLessEqual,
        type: [2, 5],
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
  const success = useCallback(() => {
    // FIXME 把这些东西抛出去

    saveCallback(
      // 过滤条件的生效条件
      {
        conjunction,
        conditions: filterList.map((item) => ({
          fieldId: item.id,
          value: item.value,
          operator: item.operator,
          type: item.type,
          name: item.name,
        })),
      },
    );

    setShow(false);
    unMounted();
  }, [unMounted, saveCallback]);

  // 取消按钮
  const cancel = useCallback(() => {
    setShow(false);
    unMounted();

    cancelCallback();
  }, [unMounted]);

  let [table, setTable] = useState();

  // FIXME 打开弹窗初始化效果
  useEffect(() => {
    async function fn() {
      if (!show) return;

      // 弹窗打开时
      const _table = await bitable.base.getTable(externalParams?.tableId);
      setTable(_table);

      // 条件复显
      if (externalParams?.filterInfo?.conditions) {
        let _arr = externalParams?.filterInfo?.conditions?.map((item) => {
          return {
            ...item,
            id: item?.fieldId || item?.id,
            type: item?.fieldType || item?.type,
          };
        });

        _arr = await Promise.all(
          _arr.map(async (item, index) => {
            // 单选/多选
            if (item?.type === 3 || item?.type === 4) {
              const selectField = await _table.getField(item.id);
              let options = await selectField.getOptions();

              // 获取颜色
              options = options.map((item) => {
                const obj = selectOptColorInfo.find((i) => item.color === i.id);
                return {
                  ...obj,
                  ...item,
                };
              });

              // 更新选项
              _arr[index] = {
                options,
                ..._arr[index],
              };
            }

            return _arr[index];
          }),
        );

        setFilterList(_arr);
      }

      // 外部未传数据则初始化
      if (!externalParams?.filterInfo?.conjunction) {
        setFilterList([]);
        setConjunction('and');
      }

      const viewList = await _table.getViewList();

      const view = await _table.getViewById(viewList[0]?.id);

      const fieldMetaList = await view.getFieldMetaList();

      // FIXME 哪些字段不需要处理（按钮没有，但是按钮和流程的 type 都为 0，这个如何判断呢） 流程 和按钮字段在 js sdk 中找不到
      // FIXME JS SDK 异常，日期筛选字段 暂时隐藏（或者测试哪些是正常的）

      setFilterFieldList(fieldMetaList.filter((item) => ![0, 5, 1001, 1002].includes(item.type)));
    }

    fn();
  }, [show]);

  const filterFiledChange = async (value, index) => {
    let _activeItem = filterFieldList.find((i) => i.id === value);
    let _arr = [...filterList];

    // 文本项\数字类,不需要再掉数据
    _arr[index] = {
      id: _activeItem.id,
      name: _activeItem.name,
      type: _activeItem.type,

      // 重新初始化条件下拉框
      operator: getOperatorOptionList(_activeItem.type)[0]?.value,
      value: '',
    };

    // 单选/多选
    if (_activeItem?.type === 3 || _activeItem?.type === 4) {
      const selectField = await table.getField(value);
      let options = await selectField.getOptions();

      // 获取颜色
      options = options.map((item) => {
        const obj = selectOptColorInfo.find((i) => item.color === i.id);
        return {
          ...obj,
          ...item,
        };
      });

      // 更新选项
      _arr[index] = {
        options,
        name: _activeItem.name,
        type: _activeItem.type,
        id: _activeItem.id,
        operator: 'is',
        value: '',
      };
    }

    if ([5, 1001, 1002].includes(_activeItem?.type)) {
      _arr[index] = {
        id: _activeItem.id,
        name: _activeItem.name,
        type: _activeItem.type,
        // 重新初始化条件下拉框
        operator: 'is',
        duration: 'definite',
        value: '',
      };
    }

    // 复选框
    if (_activeItem?.type === 7) {
      _arr[index].operator = 'is';
      _arr[index].value = true;
    }

    setFilterList(_arr);
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

    const type = filterFieldList.find((item) => item.id === value)?.type;

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

  useEffect(() => {
    if (show && containerRef.current && rootRef.current) {
      rootRef.current.render(
        <Modal
          onCancel={cancel}
          visible={show}
          onOk={() => success()}
          title={localText.setFilter}
          destroyOnClose
          width='45%'
          centered
          maskClosable={false}
          footer={[
            <Button
              key='cancel'
              onClick={cancel}
            >
              {localText.cancel}
            </Button>,
            <Button
              key='success'
              theme='solid'
              onClick={() => success()}
            >
              {localText.save}
            </Button>,
          ]}
          getContainer={() => containerRef.current!}
        >
          <AppWrapper>
            {filterList.length > 1 && (
              <div className='filterConjunction'>
                <span>{localText.meet}</span>
                <Select
                  className='conjunctionSelect'
                  size='small'
                  value={conjunction}
                  onChange={(value) => setConjunction(value)}
                  optionList={[
                    {
                      value: 'and',
                      label: localText.all,
                    },
                    {
                      value: 'or',
                      label: localText.or,
                    },
                  ]}
                />
                <span>{localText.condition}</span>
              </div>
            )}

            {filterList.map((item, index) => (
              <div
                key={item.id + index}
                className='line'
              >
                {/* FIXME 字段名 */}
                <div className='left'>
                  <Select
                    filter
                    value={item.id}
                    onChange={(value) => filterFiledChange(value, index)}
                    renderOptionItem={renderOptionItem}
                    optionList={filterFieldList.map((i) => ({
                      value: i.id,
                      label: i.name,
                    }))}
                  />
                </div>

                <div className='right'>
                  {/* FIXME  条件 */}
                  <div className='operator'>
                    {item.type === 7 ? (
                      <div>{localText.is}</div>
                    ) : (
                      <Select
                        filter
                        value={item.operator}
                        onChange={(value) => {
                          let _arr = [...filterList];
                          _arr[index].operator = value;
                          setFilterList(_arr);
                        }}
                        optionList={getOperatorOptionList(item.type)}
                      />
                    )}
                  </div>

                  {/* FIXME 字段值 */}

                  {
                    <div className='value'>
                      {item.operator !== 'isEmpty' && item.operator !== 'isNotEmpty' && (
                        <div>
                          {/* 输入框 */}
                          {[1, 2, 13, 15, 18, 19, 20, 21, 22, 1005, 99001, 99002, 99003, 99004, 99005].includes(
                            item.type,
                          ) && (
                            <Input
                              defaultValue={item.value}
                              onChange={(value) => {
                                let _arr = [...filterList];
                                _arr[index].value = value;
                                setFilterList(_arr);
                              }}
                              placeholder={localText.enter}
                            />
                          )}

                          {/* 下拉框 */}
                          {[3, 4].includes(item.type) && (
                            <Select
                              multiple={item.type === 4}
                              maxTagCount={2}
                              placeholder={localText.select}
                              style={{ width: '100%' }}
                              filter
                              // value={item.value}
                              value={Array.isArray(item.value) && item.type === 3 ? item.value[0] : item.value}
                              onChange={(value) => {
                                let _arr = [...filterList];
                                _arr[index].value = value;
                                setFilterList(_arr);
                              }}
                              optionList={item.options.map((i) => ({
                                value: i.id,
                                label: i.name,
                                ...i,
                              }))}
                              // FIXME 选项的自定义渲染
                              renderOptionItem={(renderProps) => (
                                <div
                                  className='optionItem'
                                  onClick={() => renderProps?.onClick()}
                                >
                                  <span
                                    style={{
                                      backgroundColor: renderProps.bgColor,
                                      color: renderProps.textColor,
                                      padding: '2px 4px',
                                      marginLeft: '10px',
                                      borderRadius: '30%',
                                    }}
                                  >
                                    {renderProps.label}
                                  </span>
                                </div>
                              )}
                            />
                          )}

                          {/* 日期 */}

                          {[5, 1001, 1002].includes(item.type) && (
                            <>
                              <Select
                                filter
                                value={item.duration || 'definite'}
                                onChange={(value) => {
                                  let _arr = [...filterList];

                                  _arr[index].duration = value;

                                  if (item.duration !== 'definite') {
                                    _arr[index].value = value;
                                  }
                                  setFilterList(_arr);
                                }}
                                optionList={[
                                  { value: 'definite', label: localText.definite },
                                  { value: 'Today', label: localText.Today },
                                  { value: 'Tomorrow', label: localText.Tomorrow },
                                  { value: 'Yesterday', label: localText.Yesterday },
                                  { value: 'CurrentWeek', label: localText.CurrentWeek },
                                  { value: 'LastWeek', label: localText.LastWeek },
                                  { value: 'CurrentMonth', label: localText.CurrentMonth },
                                  { value: 'LastMonth', label: localText.LastMonth },
                                  { value: 'TheLastWeek', label: localText.TheLastWeek },
                                  { value: 'TheNextWeek', label: localText.TheNextWeek },
                                  { value: 'TheLastMonth', label: localText.TheLastMonth },
                                  { value: 'TheNextMonth', label: localText.TheNextMonth },
                                ]}
                              />

                              {/* FIXME 具体日期 */}

                              {item.duration === 'definite' && (
                                <DatePicker
                                  format='yyyy/MM/dd'
                                  onChange={(date, dateString) => {
                                    const dateObject = new Date(date);
                                    const timestamp = dateObject.getTime(); // 获取时间戳
                                    let _arr = [...filterList];
                                    _arr[index].value = timestamp;
                                    setFilterList(_arr);
                                  }}
                                />
                              )}
                            </>
                          )}

                          {/* 复选框 */}
                          {item.type === 7 && (
                            <>
                              <Checkbox
                                defaultChecked={item.value}
                                onChange={(e) => (item.value = e.target.checked)}
                              />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  }

                  <div
                    className='delete'
                    onClick={() => {
                      let _arr = [...filterList];
                      _arr.splice(index, 1);
                      setFilterList(_arr);
                    }}
                  >
                    <svg
                      width='1.2em'
                      height='1.2em'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      data-icon='CloseSmallOutlined'
                    >
                      <path
                        d='M5.636 5.636a1 1 0 0 0 0 1.414l4.95 4.95-4.95 4.95a1 1 0 1 0 1.414 1.414l4.95-4.95 4.95 4.95a1 1 0 0 0 1.414-1.414L13.414 12l4.95-4.95a1 1 0 0 0-1.415-1.414L12 10.586l-4.95-4.95a1 1 0 0 0-1.413 0Z'
                        fill='currentColor'
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            ))}

            <div
              onClick={addFilter}
              className='add'
            >
              + {localText.add}
            </div>
          </AppWrapper>
        </Modal>,
      );
    }
  }, [show, cancel, containerRef, success, externalParams]);

  // 打开筛选弹窗
  const openFilterModal = (params: IExternalParams) => {
    createContainer();
    setExternalParams(params);
    setShow(true);
  };

  return { openFilterModal };
};
