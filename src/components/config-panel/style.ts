/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-10 23:35
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-15 23:33
 * @desc       :
 */

import styled from 'styled-components';

export const AppWrapper = styled.div`
  width: 340px;
  display: flex;
  padding: 20px;
  border-left: 1px solid #ccc;

  .form {
    /* position: relative; */
    width: 100%;
  }

  .form-content {
    height: calc(100% - 50px);
    overflow: auto;
  }

  .unitLine {
    width: 100%;
    .unit {
      width: 50%;
      margin-right: 10px;
    }
  }

  .amountSwitch {
    height: 32px;
    line-height: 32px;
  }

  .amountNumber {
    padding-top: -12px;
  }

  .confirm {
    width: 78px;
    height: 32px;
    line-height: 32px;
    background-color: #2955e7;
    color: #fff;
    border-radius: 6px;

    &:hover {
      background-color: #2955e790;
    }
  }

  /* FIXME 修改 ui 组件样式 */

  .semi-input-wrapper {
    border-radius: 6px;
    border: 1px solid #d0d3d6;
    background-color: #fff;
  }

  .semi-select {
    border-radius: 6px;
    border: 1px solid #d0d3d6;
    background-color: #fff;
  }

  .semi-radioGroup {
    width: 45%;
    background-color: #fff;
    border: 1px solid rgba(222, 224, 227, 1);
    border-radius: 6px;

    .semi-radio {
      width: 50%;

      .semi-radio-content {
        width: 100%;
      }
    }

    .semi-radio-addon-buttonRadio-checked {
      background-color: rgba(20, 86, 240, 0.1);
      color: rgba(20, 86, 240, 1);
    }

    .semi-radio-addon-buttonRadio {
      &:hover {
        background-color: rgba(20, 86, 240, 0.1);
      }
    }
  }

  .semi-switch-checked {
    background-color: #1456f0;
  }
`;
