import { css, keyframes, styled } from '@/hocs/styled';

const placeHolderShimmer = keyframes`
  0%{
    background-position: -(calc(100vw - 277px)) 0
  }
  100%{
    background-position: calc((100vw - 277px)) 0
  }
`;

const animationStyle = css`
  animation: ${placeHolderShimmer} 1.8s ease infinite forwards;
  -webkit-animation: ${placeHolderShimmer} 1.8s ease infinite;
  -moz-animation: ${placeHolderShimmer} 1.8s ease infinite;
  background: #eff0f2;
  background: linear-gradient(to right, #eff0f2 8%, #e1e3e7 38%, #eff0f2 54%);
  background-size: calc(100vw - 277px) calc(100vh - 277px);
`;

export const LoadingDot = styled.div`
  border-radius: 11px;
  background-color: #eff0f2;
  width: 21px;
  height: 21px;
  margin-right: 24px;
  ${animationStyle}
`;

export const LoadingBarTitle = styled.div`
  border-radius: 6px;
  background-color: #eff0f2;
  opacity: 1;
  width: 452px;
  height: 24px;
  ${animationStyle}
`;

export const LoadingBarSubtitle = styled.div`
  border-radius: 5px;
  background-color: #eff0f2;
  width: 210px;
  height: 16px;
  margin-top: 8px;
  ${animationStyle}
`;

export const LoadingBarDescription = styled.div`
  border-radius: 6px;
  background-color: #eff0f2;
  width: 54px;
  height: 24px;
  margin-left: 8px;
  ${animationStyle}
`;

export const LoadingRow = styled.div`
  height: 90px;
  display: flex;
  padding: 20px 27px;
`;
