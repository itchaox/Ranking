/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-06 18:47
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-18 13:57
 * @desc       :
 */
import { AppWrapper } from './style';

import image1 from '../../assets/1.png';
import image2 from '../../assets/2.png';
import image3 from '../../assets/3.png';
import LeftImage from '../../assets/left.png';
import RightImage from '../../assets/right.png';

interface RadarChartProps {
  dataSet: Array<(string | number)[]>;
  formState: any;
  isPercent: boolean;
}

export function RadarChart({ dataSet, formState, isPercent }: RadarChartProps) {
  console.log('🚀  formState:', formState);

  const getIndexImage = (index) => {
    const images = [image1, image2, image3];
    return (
      <img
        className='index-img'
        src={images[index]}
        alt={`Image ${index}`}
      />
    );
  };

  let _temdata = !formState?.amountSwitch ? [...dataSet.slice(1)] : [...dataSet.slice(1, formState?.amountNumber + 1)];

  // 降序排序
  let _data = _temdata.sort((a: any, b: any) => b[1] - a[1]);

  const formatDecimal = (number) => {
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
    if (formatOption === 2) {
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

  return (
    <AppWrapper>
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
            {_data.map((item, index) => (
              <div
                className='line'
                key={item[0]}
              >
                {index <= 2 ? (
                  <div className='index'>{getIndexImage(index)}</div>
                ) : (
                  <div className='index'>{index + 1}</div>
                )}
                <div className='info'>
                  <div className='name'>{item[0]}</div>

                  <div className={`number ${index <= 2 ? 'special' : ''}`}>
                    {/* <div>
                      {formState?.unitPosition === 'LEFT'
                        ? `${formState?.unit || ''} ${item[1]}`
                        : `${item[1]} ${formState?.unit || ''}`}
                    </div> */}
                    {isPercent ? (
                      <div>{`${formatDecimal(+item[1]) * 100}%`}</div>
                    ) : (
                      <div>
                        {formState?.unitPosition === 'LEFT'
                          ? `${formState?.unit || ''} ${formatDecimal(+item[1])}`
                          : `${formatDecimal(+item[1])} ${formState?.unit || ''}`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppWrapper>
  );
}
