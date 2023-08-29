import { styled } from '@/hocs/styled';

export const Container = styled.div`
  height: 100%;

  .board-container-body {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    background: #f9f9f9;
  }

  .board-container-body-inner {
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
    padding: 0;
  }

  .main-lists {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex: 1 1 auto;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    min-width: 0;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-box-flex: 1;
  }

  .main-lists-inner {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex: 0 0 auto;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    min-width: 0;
    -webkit-box-flex: 0;
  }

  .main-lists-inner {
    position: relative;
    display: flex;
    flex: 0 0 auto;
    min-width: 0;
  }
`;
