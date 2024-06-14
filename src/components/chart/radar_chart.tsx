/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-06 18:47
 * @LastAuthor : itchaox
 * @LastTime   : 2024-06-14 09:15
 * @desc       :
 */
import { AppWrapper } from './style';

import image1 from '../../assets/1.png';
import image2 from '../../assets/2.png';
import image3 from '../../assets/3.png';
import LeftImage from '../../assets/left.png';
import RightImage from '../../assets/right.png';

import { useState, useEffect } from 'react';
import { bitable, dashboard } from '@lark-base-open/js-sdk';
import { lightTheme, darkTheme } from '../../utils/theme';

import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

interface RadarChartProps {
  dataSet: Array<(string | number)[]>;
  formState: any;
  isPercent: boolean;
  backgroundColor: string;
  textColor: string;
}

export function RadarChart({ dataSet, formState, isPercent, backgroundColor, textColor }: RadarChartProps) {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    async function fn() {
      await dashboard.setRendered();
    }

    fn();
  }, [dataSet, formState, isPercent]);

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

  const getIndexImage = (index) => {
    const images = [image1, image2, image3];
    return (
      <img
        className='index-img'
        src={images[index - 1]}
        alt={`Image ${index}`}
      />
    );
  };

  // 先排序再 slice，否则可能出现排序在前面的数据消失了
  // 降序排序
  let temData = dataSet
    .sort((a: any, b: any) => (formState.sort === 1 ? b[1] - a[1] : a[1] - b[1]))
    .filter((item) => item[0] !== '' && item[1] !== '');

  let _data = !formState?.amountSwitch ? [...temData.slice(1)] : [...temData.slice(1, formState?.amountNumber + 1)];

  const formatDecimal = (number, onlyDot = false) => {
    let decimalPlaces = formState.decimalNumber;
    let formatOption = formState.displayFormat;
    // 将数字转换为字符串
    let numberString = number.toString();

    // 查找小数点的位置
    const dotIndex = numberString.indexOf('.');

    // 获取整数部分
    let integerPart = dotIndex === -1 ? numberString : numberString.slice(0, dotIndex);

    // 获取小数部分
    let decimalPart = dotIndex === -1 ? '' : numberString.slice(dotIndex + 1);

    // 判断是否需要添加千分位分隔符
    if (formatOption === 2 && !onlyDot) {
      // 将整数部分按千分位分隔
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // 如果指定的小数位数为0,直接返回格式化后的整数部分
    if (decimalPlaces === 0 || !decimalPlaces) {
      return integerPart;
    }

    // 如果小数部分的位数已经等于要保留的位数,直接返回格式化后的数字
    if (decimalPart.length === decimalPlaces) {
      return integerPart + '.' + decimalPart;
    }

    // 如果小数部分的位数多于要保留的位数,截取指定位数的小数
    if (decimalPart.length > decimalPlaces) {
      decimalPart = decimalPart.slice(0, decimalPlaces);
      return integerPart + '.' + decimalPart;
    }

    // 如果小数部分的位数少于要保留的位数,在小数后面补足0
    decimalPart = decimalPart.padEnd(decimalPlaces, '0');

    return integerPart + '.' + decimalPart;
  };

  const getNewData = (data) => {
    let sortedData = [...data];

    let rank = 1;
    let prevScore = formatDecimal(
      sortedData[0][1] *
        (isPercent || formState?.displayFormat === 3 ? 100 : formState?.displayFormat === 4 ? 1000 : 1),
      true,
    );

    // FIXME 小数点更新后，更新排名

    sortedData.forEach((data, index) => {
      const currentScore = formatDecimal(
        data[1] * (isPercent || formState?.displayFormat === 3 ? 100 : formState?.displayFormat === 4 ? 1000 : 1),
        true,
      );

      if (
        formState.sort === 1
          ? parseFloat(currentScore) < parseFloat(prevScore)
          : parseFloat(currentScore) > parseFloat(prevScore)
      ) {
        rank = formState.isParallel ? index + 1 : sortedData[index - 1][sortedData[index - 1].length - 1] + 1;
      }
      data.push(rank);
      prevScore = currentScore;
    });

    return sortedData;
  };

  return (
    <AppWrapper
      theme={isDarkMode ? darkTheme : lightTheme}
      textColor={textColor}
      backgroundColor={backgroundColor}
    >
      <img
        className='img-left'
        src={LeftImage}
      />
      <img
        className='img-right'
        src={RightImage}
      />

      <div className='scroll'>
        {_data.length > 0 && (
          <div className='content'>
            {getNewData(_data).map((item, index) => (
              <div
                className='line'
                key={item[0]}
              >
                {/* 序号 */}
                {item[item.length - 1] <= 3 ? (
                  <div className='index'>{getIndexImage(item[item.length - 1])}</div>
                ) : (
                  <div className='index'>{item[item.length - 1]}</div>
                )}

                <div className='info'>
                  {/* 名字 */}
                  <div className='name'>{item[0]}</div>

                  {/* 数值 */}
                  <div className={`number ${item[item.length - 1] <= 2 ? 'special' : ''}`}>
                    <div>
                      {formState?.displayFormat === 5 ? (
                        <div>{dayjs(item[1]).format('YYYY/MM/DD')}</div>
                      ) : (
                        <div>
                          {(formState?.prefix ?? '') +
                            ' ' +
                            formatDecimal(
                              +item[1] *
                                (isPercent || formState?.displayFormat === 3
                                  ? 100
                                  : formState?.displayFormat === 4
                                  ? 1000
                                  : 1),
                            ) +
                            (formState?.displayFormat === 3 ? '%' : formState?.displayFormat === 4 ? '‰' : '') +
                            ' ' +
                            (formState?.suffix ?? '')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 暂无数据 */}
        {_data.length === 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              height: '100%',
              marginTop: '-24px',
            }}
          >
            <img
              draggable='false'
              width='120'
              height='120'
              src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTExMi4zOTQgMTIuMjM4SDM1LjYyN2MtNC4wNzYgMC03LjYwNCAzLjE0Ny04LjI3MyA3LjQ3NEwxNC4xNiAxMTAuODk5aDc2LjI4bDExLjg1Ny04My4xMjFoNy45MDFhMy45NzIgMy45NzIgMCAwIDAgMy44NjUtMy4wMmMxLjk3OC04LjExIDIuNDY4LTEyLjUxOS0xLjY2OC0xMi41MTlaIiBmaWxsPSIjQkJCRkM0IiBmaWxsLW9wYWNpdHk9Ii40NSIvPjxwYXRoIGQ9Ik0xNS4zMzcgMTAyLjc2Yy01LjEzNC0xLjA5LTExLjA1OS00LjQxNC0xMS4wNTktOC4zNzd2Ny4wMDVjMCAzLjEyIDIuMjQ4IDguMTQ3IDkuOTE0IDkuMjgxbDEuMTQ1LTcuOTA5Wm04NC40MjktNTcuMjk2YzMuOTIzIDIuNDQ0IDguMTg2IDYuNDUyIDkuODAyIDEwLjM5NS41MjUgMS4yODIuNzcgMi41NTcuNjMzIDMuNzY5LjE2LTEuNDE0LjI4NS0yLjcyNy4zODMtMy45Mi4zMjMtMy45NTcuMzQ3LTYuNTkzLjM0Ny03LjE3Ni0uMjQzLTIuMjctMi41NzItNy44ODQtMTAuMDI5LTExLjAzNGwtLjE0NiAxLjAyNmM2Ljg2OSAzIDguOTQzIDguMTQgOS4xNzUgMTAuMDY0LS4wMDEuNTU2LS4wMjMgMi40NTYtLjIxNSA1LjMwNC0uOTg3LTEuNzQyLTIuMzc2LTMuNDMtMy45MjQtNC45NDhhMzIuNjYgMzIuNjYgMCAwIDAtNS44NzMtNC41NTlsLS4xNTMgMS4wNzlabTQuMTA0LTIzLjcxOWMuOTEyLTMuNTQgMS43NjQtNS4xMTQgMi43MzctNi40OSAxLjMzOC0xLjcwNiAzLjQwNi0zLjAxNyA1Ljc3OS0zLjAxNyA0LjEzNCAwIDMuNjQ3IDQuNDA1IDEuNzE0IDEyLjU1N2EzLjk3NSAzLjk3NSAwIDAgMS0zLjg3MyAzLjA0N2gtNy44NzhsMS41MjEtNi4wOTdaIiBmaWxsPSIjMEMyOTZFIi8+PHBhdGggZD0iTTEwNy4xNzcgNzkuMDUyYy0xMC4zOCA2LjcyNC0yOC41NTYgOS43NjYtNDAuMzA0IDEzLjAyMS0xMy4yMTYgMy42NS0xNy41OTMgNS4wNS0yNi42MTcgOS45MTFsLS40NjctOC43MzhjOC40MS00LjQxOSAxMy40NTctNS42NzMgMjUuOTY4LTkuMTI5IDEyLjkwNi0zLjU3NiAyOS4wNzQtNi45OSA0MC45NDctMTMuODg3IiBmaWxsPSIjMDBENkI5Ii8+PHBhdGggZD0iTTExMC45MzIgNTcuMzMyVjQ3LjIyOGMwIDEwLjc4Ni0yMC40NDQgMTYuOTktNDAuNDc2IDIxLjQ3OFY3Ni42YzIwLjY0Ny00LjgzMiA0MC40NzYtMTEuMiA0MC40NzYtMTkuMjY4Wk00LjI5NCAxMDAuNTM0di03LjAwN2MwLTUuNzQ4IDcuODM1LTEwLjUxNiAxNC4zODYtMTMuODY5bC0xLjA1NCA4LjU1Yy02LjMxIDMuNjItMTMuMzMyIDguMzYxLTEzLjMzMiAxMi4zMjZaIiBmaWxsPSIjMzM3MEZGIi8+PHBhdGggZD0iTTUyLjU1IDMyLjAwOGEzLjUgMy41IDAgMCAwLTUuMTU2LS4wMzNMMzMuMjM4IDQ3LjE5NGEuNS41IDAgMSAxLS43MzItLjY4MWwxNC4xNTYtMTUuMjE4YTQuNSA0LjUgMCAwIDEgNi42MjguMDQzbDEwLjc2NCAxMS44N2EzLjUgMy41IDAgMCAwIDUuMjE0LS4wMzJsMTEuNTYzLTEzLjA3YS41LjUgMCAwIDEgLjc0OS42NjJsLTExLjU2MyAxMy4wN2E0LjUgNC41IDAgMCAxLTYuNzA0LjA0MUw1Mi41NDkgMzIuMDFaTTMwLjM2MiA2MGEuNS41IDAgMCAwIC41LjVoMTQuOTI2YS41LjUgMCAwIDAgMC0xSDMwLjg2MmEuNS41IDAgMCAwLS41LjVabS0xLjU5NSAxMC4zMjJhLjUuNSAwIDAgMCAuNS41SDUzLjZhLjUuNSAwIDEgMCAwLTFIMjkuMjY3YS41LjUgMCAwIDAtLjUuNVoiIGZpbGw9IiM4Rjk1OUUiLz48L3N2Zz4='
            ></img>
            <div style={{ fontSize: '14px', color: '#646a73' }}>{t('zan-wu-shu-ju')}</div>
          </div>
        )}
      </div>
    </AppWrapper>
  );
}
