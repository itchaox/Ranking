/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-10 23:35
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-22 23:36
 * @desc       :
 */

import styled from 'styled-components';

export const AppWrapper = styled.div`
  width: 340px;
  display: flex;
  padding: 20px;
  border-left: 0.5px solid ${(props) => props.theme.borderColor};

  .form {
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

  .decimal-number-line {
    width: 100%;
    display: flex;

    .decimalNumber {
      width: 50%;
    }

    .displayFormat {
      flex: 1;
    }
  }

  .amountSwitch {
    height: 32px;
    line-height: 32px;
    position: fixed;
    right: 20px;
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

  /* .select-suffix {
  } */

  .semi-select-suffix {
    margin: 3px 14px 3px 0;
    font-size: 12px;
    padding: 5px;
    border-radius: 6px;
    z-index: 9;

    &:hover {
      background-color: ${(props) => props.theme.hoverBackgroundColor};
    }
  }

  .semi-form-field-label {
    font-weight: 400;
  }

  .semi-form-field:last-child {
    margin-top: -16px;
  }

  /* 

  .semi-input-wrapper {
    border-radius: 6px;
    border: 1px solid ${(props) => props.theme.borderColor};
    background-color: ${(props) => props.theme.backgroundColor};
  }

  .semi-input-number-suffix-btns {
    margin-left: 0;
    width: 40px;

    svg {
      width: 14px;
      height: 14px;
    }

    .semi-input-number-button {
      width: 100%;

      border-bottom: 1px solid ${(props) => props.theme.borderColor};
      border-right: 1px solid ${(props) => props.theme.borderColor};

      &:nth-child(1) {
        border-top: 1px solid ${(props) => props.theme.borderColor};
      }
    }
  }

  .semi-select {
    border-radius: 6px;
    border: 1px solid ${(props) => props.theme.borderColor};
    background-color: ${(props) => props.theme.backgroundColor};
    z-index: 0;
  }

  .semi-radioGroup {
    width: 45%;
    background-color: ${(props) => props.theme.backgroundColor};
    border: 1px solid ${(props) => props.theme.borderColor};
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
  } */
`;
