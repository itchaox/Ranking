/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-06 18:47
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-14 22:39
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
}

export function RadarChart({ dataSet, formState }: RadarChartProps) {
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

  let _data = !formState?.amountSwitch ? dataSet.slice(1) : dataSet.slice(1, formState?.amountNumber + 1);
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
                {formState?.unitPosition === 'LEFT'
                  ? `${formState?.unit || ''} ${item[1]}`
                  : `${item[1]} ${formState?.unit || ''}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppWrapper>
  );
}
