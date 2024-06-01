/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-10 23:35
 * @LastAuthor : itchaox
 * @LastTime   : 2024-06-01 13:50
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

    position: absolute;
    right: 0;
  }

  .amountNumber {
  }

  .filter {
    font-size: 12px;
    display: flex;
    align-items: center;

    .main {
      color: #1456f0;
      margin-right: 10px;

      &:hover {
        cursor: pointer;
      }
    }

    .selected {
      color: #94969f;
    }
  }

  .confirm {
    width: 78px;
    height: 32px;
    line-height: 32px;
    background-color: #2955e7;
    color: #fff;
    border-radius: 6px;
    border: none !important;

    &:hover {
      background-color: #2955e790;
    }
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

  /* FIXME 修改 ui 组件样式 */

  /* .select-suffix {
  } */

  .semi-form-field-group {
    position: relative;
  }

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
    margin-bottom: 8px;
  }

  .semi-form-field:first-child {
    padding-top: 0;
  }

  .semi-form-field:last-child {
    margin-top: -18px;
  }

  .semi-input-wrapper {
    border-radius: 6px !important;
    border: 1px solid ${(props) => props.theme.borderColor};
    background-color: ${(props) => props.theme.backgroundColor};
  }

  .semi-select {
    border-radius: 6px !important;
    border: 1px solid ${(props) => props.theme.borderColor};
    background-color: ${(props) => props.theme.backgroundColor};
    z-index: 0;
  }

  .semi-input-number-suffix-btns {
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

  .semi-radioGroup {
    flex: 1;
    /* width: 100%; */
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
      height: 100%;
      line-height: 100%;
      &:hover {
        background-color: rgba(20, 86, 240, 0.1);
      }
    }
  }

  .semi-switch-checked {
    background-color: #1456f0;
  }
`;
