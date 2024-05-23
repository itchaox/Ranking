/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-10 23:35
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-24 01:28
 * @desc       :
 */

import styled from 'styled-components';

export const AppWrapper = styled.div`
  position: relative;
  flex: 1;
  padding: 24px;
  padding-bottom: 0;

  /* background: linear-gradient(to bottom, rgba(219, 250, 255, 0.7), rgba(255, 247, 231, 0.7)); */
  background: ${(props) => `${props.theme.background}`};

  height: 100%;
  color: ${(props) => `${props.theme.textColor}`};

  .img-left {
    position: absolute;
    left: 0;
    top: 0;
  }

  .img-right {
    position: absolute;
    top: 0;
    right: 0;
  }

  .scroll {
    height: 100%;
    position: relative;
    overflow-y: auto;
  }

  .content {
    background-color: ${(props) => `${props.theme.contentBackgroundColor}`};

    padding: 24px;
    border-radius: 6px;
  }

  .index-img {
    width: 24px;
    height: 24px;
  }

  .line {
    height: 44px;
    line-height: 44px;
    display: flex;
  }

  .index {
    font-size: 14px;
    font-style: italic;
    font-weight: 700;
    width: 24px;
    margin-right: 24px;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .info {
    display: flex;
    flex: 1;
    justify-content: space-between;
  }

  .name {
    font-size: 14px;
  }

  .number {
    font-size: 14px;
    font-weight: 500;
    color: '#1F2329';
    font-family: 'd-din';
  }

  .number.special {
    font-weight: 900;
  }

  *::-webkit-scrollbar  {
    width: 8px;
  }

  *::-webkit-scrollbar-thumb {
    /* 滑块颜色 */
    background: #cccccc90;

    /* 滑块圆角 */
    border-radius: 10px;
  }

  /* 兼容Firefox、IE */
  * {
    scrollbar-width: 10px;
    scrollbar-base-color: green;
    scrollbar-track-color: red;
    scrollbar-arrow-color: blue;
  }
`;
