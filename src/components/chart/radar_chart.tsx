/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-06 18:47
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-13 23:29
 * @desc       :
 */
import { AppWrapper } from './style';

interface RadarChartProps {
  dataSet: Array<(string | number)[]>;
  formState: any;
}

export function RadarChart({ dataSet, formState }: RadarChartProps) {
  let _data = !formState?.amountSwitch ? dataSet.slice(1) : dataSet.slice(1, formState?.amountNumber + 1);
  return (
    <AppWrapper className='radar-chart'>
      {_data.map((item) => (
        <div
          className='line'
          key={item[0]}
        >
          <div className='name'>{item[0]}</div>

          <div>
            {formState?.unitPosition === 'LEFT' ? (
              <span>
                {formState?.unit ? formState?.unit : ''}
                {' ' + item[1]}
              </span>
            ) : (
              <span>
                {item[1] + ' '}
                {formState?.unit ? formState?.unit : ''}
              </span>
            )}
          </div>
        </div>
      ))}
    </AppWrapper>
  );
}
