import { BlockText, Box } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

const activeContainerStyles = css`
  border-color: #3d82e2;

  &:hover {
    border-color: #3d82e2;
  }
`;

export const Container = styled.div<{ isActive?: boolean }>`
  ${transition('border-color')}

  padding: 16px 68px 16px 24px;
  border: 1.5px solid #e1e4e7;
  cursor: pointer;
  border-radius: 8px;
  position: relative;

  &:hover {
    border-color: #d4d9e6;
  }

  &:active {
    ${activeContainerStyles}
  }

  ${({ isActive }) => isActive && activeContainerStyles}
`;

export const Title = styled(BlockText)`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
`;

export const Description = styled(BlockText)`
  color: #62778c;
  margin-bottom: 12px;
`;

export const BadgeContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`;

export const Bubble = styled(Box.FlexCenter)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  margin-right: -2px;
  background-color: #fff;
  box-shadow: 0px 1px 3px rgba(19, 33, 68, 0.04), 0px 1px 1px rgba(19, 33, 68, 0.01), 0px 1px 0px rgba(19, 33, 68, 0.03),
    0px 0px 0px 1px rgba(19, 33, 68, 0.06);
`;
