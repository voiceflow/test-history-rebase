import { css, styled } from '@/hocs';

// TODO: refactor to use CSS grid and flexbox instead of this float and absolute positioning maddness
export const UserCardWrapper = styled.div`
  position: absolute;
`;

export const Card = styled.div`
  position: relative;
  width: 450px;
  height: 250px;
  overflow: hidden;
  background: linear-gradient(#f8f8f8, #fff);
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.4);
`;

export const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 150px;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(#de685e, #ee786e);
  transition: width 0.4s;

  div {
    margin: 0 auto;
    transform: scale(2.5);
  }
`;

export const LeftPanelText = styled.p`
  margin: 0 auto;
  padding: 0.125rem 0.75rem;
  color: #fff;
  font-weight: bold;
  font-size: 0.75em;
  white-space: nowrap;
  text-transform: uppercase;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 100px;
`;

export const RightPanel = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  box-sizing: border-box;
  width: 300px;
  height: 100%;
  padding: 1rem;
  padding-top: 0;
`;

export const RightPanelHeader = styled.p`
  margin-top: 1.2em;
  margin-bottom: 0;
  font-size: 1.2em;
  text-align: center;
`;

export const RightPanelText = styled.p`
  margin: 8px 0 0;
  color: #99a5a6;
  text-align: center;
`;

export const Footer = styled.div`
  margin-top: 10px;
  padding-right: 20px;
  text-align: right;
`;

export const linkStyles = css`
  color: #00b7ff;
  font-size: 13px;
  text-align: center;

  &:hover {
    color: #00b7ff;
    text-decoration: none;
  }
`;
