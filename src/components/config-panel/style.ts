/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-10 23:35
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-14 17:35
 * @desc       :
 */

import styled from 'styled-components';

export const AppWrapper = styled.div`
  width: 340px;
  display: flex;
  padding: 20px;
  border-left: 1px solid #ccc;

  .form {
    width: 100%;
  }

  .amountSwitch {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* FIXME 修改 ui 组件样式 */

  .semi-select {
    border-radius: 6px;
    border: 1px solid #d0d3d6;
    background-color: #fff;
  }

  .semi-switch-checked {
    background-color: #1456f0;
  }
`;
