import styled from 'styled-components';

const TestingHeaderWrapper = styled.div`
  .testing-back {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -32px;
    margin-bottom: -32px;
    padding-right: 32px;
    border-right: 1px solid #eaeff4;
    padding-left: 6px;
    cursor: pointer;
    font-size: 15px;
    line-height: 18px;
  }

  .icon-back {
    margin-right: 13px;
    line-height: inherit;
  }

  .start-test-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    // width: 192px;
    // Google width: 203px;

    height: 42px;
    padding: 11px 58px 12px 22px;
    color: #fff !important;
    font-weight: 500;
    font-size: 15px;
    text-transform: none;
    background: linear-gradient(180deg, rgba(93, 157, 245, 0.85) 0%, #2c85ff 100%);
    border: none;
    border-radius: 50px;
    box-shadow: 0 0 4px 0 rgba(17, 49, 96, 0.08), 0 4px 8px 0 rgba(17, 49, 96, 0.16);
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
      background: linear-gradient(0deg, #2c85ff, #2c85ff);
      border: none !important;
      box-shadow: 0px 4px 8px rgba(17, 49, 96, 0.16), 0px 0px 4px rgba(17, 49, 96, 0.08);
    }
    &:active {
      background: linear-gradient(0deg, #2c85ff, #2c85ff);
      border: none !important;
      box-shadow: 0px 7px 12px rgba(17, 49, 96, 0.16), 0px 0px 4px rgba(17, 49, 96, 0.08);
    }

    .start-sub-btn {
      position: absolute;
      top: 6px;
      right: 7px;
      display: flex;
      width: 30px;
      height: 30px;
      color: #fff;
      text-align: center;
      background-color: #00000030;
      border-radius: 100%;
      transition: all 0.2s;
      justify-content: center;
      align-items: center;
    }
  }

  .separator-dot {
    color: #8da2b5;
    margin-left: 12px;
    margin-right: 12px;
  }
`;

export default TestingHeaderWrapper;
