import { Flex, SvgIcon } from '@voiceflow/ui';

import { styled, transition, units } from '@/hocs/styled';

export const UpgradeText = styled.div`
  ${transition('color')}

  color: #132144;
  font-weight: 600;
  display: inline-block;
  font-size: 13px;
`;

export const UpgradeIcon = styled(SvgIcon)`
  ${transition('border')}

  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: #e9f5ee;
  border: 1px solid #cae3d4;
  border-radius: 50%;
  color: #4c944f;
  box-shadow: inset 0 0 0 2px #fff !important;
  margin-right: ${units(2)}px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const Container = styled(Flex)`
  cursor: pointer;

  &:hover {
    ${UpgradeIcon} {
      border-color: #8fc9a5;
    }

    ${UpgradeText} {
      color: #279745;
    }
  }
`;
