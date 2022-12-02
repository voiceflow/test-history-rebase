import { styled } from '@/hocs';

export const List = styled.div<{ inset?: boolean }>`
  position: relative;
  margin-left: -32px;
  margin-right: -32px;
  margin-top: 20px;

  &::before {
    top: 0;
    right: 0;
    left: ${({ inset }) => (inset ? '32px' : '0px')};
    border-top: 1px solid #eaeff4;
    content: '';
    display: block;
    position: absolute;
  }
`;
export const ListHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 32px;

  &::before {
    bottom: 0;
    right: 0;
    left: 32px;
    border-top: 1px solid #eaeff4;
    content: '';
    display: block;
    position: absolute;
  }
`;
export const HeaderTitle = styled.div`
  color: #132144;
  font-weight: 400;
  line-height: normal;
`;
export const HeaderSubtitle = styled.div`
  margin-top: 4px;
  color: #62778c;
  font-size: 13px;
`;
