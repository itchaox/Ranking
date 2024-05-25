/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-10 23:35
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-25 13:24
 * @desc       :
 */

import styled from 'styled-components';

export const AppWrapper = styled.div`
  .line {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      flex: 1;
    }

    .right {
      display: flex;
      flex: 2;
      align-items: center;
    }

    .operator {
      /* margin-right: 10px; */
    }

    .value {
      flex: 1;
      margin: 0 5px;
    }

    .delete {
      cursor: pointer;
    }
  }
`;
