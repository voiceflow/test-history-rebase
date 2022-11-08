import { Input } from '@voiceflow/ui';

import { styled } from '@/hocs';
import { ANIMATION_SPEED } from '@/styles/theme';

export const IconButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 42px;
  height: 42px;
  margin-left: 4px;
  background-color: ${({ theme }) => theme.colors.white};
  color: rgba(110, 132, 154, 0.85);
`;

export const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transform-origin: right;
  animation: fadein ${ANIMATION_SPEED}s ease, movein ${ANIMATION_SPEED}s ease, scaleY 0.1s ease;
  width: 250px;
  height: ${({ theme }) => theme.components.menuItem.height};
  box-shadow: 0px 1px 3px 0px rgba(17, 49, 96, 0.06);
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.darkerBlue};
  opacity: 1;
  background-color: ${({ theme }) => theme.colors.white};
  padding-left: 16px;
`;

export const SearchInput = styled(Input)`
  border: none !important;
  background: transparent;
  font-size: 15px;
  box-shadow: none !important;
  padding: 10px 12px 10px 0px;

  input::placeholder {
    line-height: 20px;
  }
`;
