import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const HeaderContainer = styled.div`
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borders};
  padding: 9px 16px 9px 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const RightSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-align: left;
`;

export const StyledTabButton = styled(Box.FlexCenter)`
  padding: 8px 22px 10px;
  color: ${({ theme }) => theme.colors.quaternary};
  font-weight: 600;
  cursor: pointer;
  line-height: 18px;
  height: 42px;
`;
