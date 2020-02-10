import { css, styled, units } from '@/hocs';

const Badge = styled.span`
  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;
    `}

  min-width: 22px;
  display: inline-block;
  height: ${units(2.8)}px;
  margin-top: -4px;
  margin-bottom: -4px;
  background: linear-gradient(180deg, #eff5f6a3 0%, #eef4f6 100%), #ffffff;
  border: 1px solid #d4d9e6;
  box-sizing: border-box;
  box-shadow: 0px 1px 0px #d4d9e6;
  border-radius: 5px;
  padding-left: 6px;
  padding-right: 6px;

  color: #62778c;
  font-weight: 600;
  font-size: 13px;
  line-height: 21px;
  text-align: center;
`;

export default Badge;
