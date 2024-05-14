/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-10 23:35
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-14 22:40
 * @desc       :
 */

import styled from 'styled-components';

export const AppWrapper = styled.div`
  position: relative;
  height: 100%;
  flex: 1;
  padding: 24px;
  background: linear-gradient(to bottom, rgba(219, 250, 255, 0.7), rgba(255, 247, 231, 0.7));
  z-index: -2;

  .img-left {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }

  .img-right {
    position: absolute;
    top: 0;
    right: 0;
    z-index: -1;
  }

  .content {
    background-color: #fff;
    height: 100%;
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
    text-align: center;
    width: 24px;
    margin-right: 24px;
  }

  .info {
    display: flex;
    flex: 1;
    justify-content: space-between;
  }

  .name {
    font-size: 14px;
    color: #1f2329;
  }

  .number {
    font-weight: 14px;
    font-weight: 500;
  }

  .number.special {
    font-weight: 900;
  }
`;
