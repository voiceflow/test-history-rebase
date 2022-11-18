import { FlexCenter, transition } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const Container = styled(FlexCenter)`
  height: 100%;
  min-height: 115px;
  border: 1px solid #d4d9e6;
  border-radius: 6px;
  padding: 32px;
  color: #62778c;
  cursor: auto;
  width: 100%;
  position: relative;
  background: white;
  flex: 1;
  display: flex;
  justify-content: left;
  align-items: center;
  text-align: center;
  cursor: pointer;
  ${transition('background', 'color', 'border-color', 'background-color')}

  &:active, &:focus {
    outline: none;
  }

  &:hover {
    background: rgba(238, 244, 246, 0.5);
  }
`;
