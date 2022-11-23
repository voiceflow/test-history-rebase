import { Dropdown as UIDropdown, SvgIcon } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

export const Dropdown = styled(UIDropdown)`
  font-size: 12px;
  color: #62778c;
`;

export const Trigger = styled.div<{ disabled?: boolean }>`
  color: #62778c;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  display: flex;

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
    `}
`;

export const TriggerCarret = styled(SvgIcon).attrs({ size: 20, icon: 'arrowToggleV2', rotation: 90 })`
  display: inline-block;
  transform: rotate(90deg);
  margin-left: 3px;
  color: #6e849a;
  opacity: 0.85;
`;
