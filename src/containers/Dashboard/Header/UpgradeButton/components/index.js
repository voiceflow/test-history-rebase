import Flex from '@/componentsV2/Flex';
import IconButton from '@/componentsV2/IconButton';
import { styled, transition } from '@/hocs';

export const UpgradeText = styled.div`
  color: #132144;
  font-weight: 600;
  display: inline-block;
  font-size: 13px;
  ${transition(['color'])}
`;

export const UpgradeIcon = styled(IconButton)`
  background: #e9f5ee;
  border-color: #cae3d4;
  box-shadow: inset 0 0 0 2px #fff !important;
  margin-right: 10px;
  pointer-events: none;
  user-select: none;
  ${transition(['border'])}
`;

export const Container = styled(Flex)`
  ${transition()}
  cursor: pointer;
  :hover {
    ${UpgradeIcon} {
      border-color: #8fc9a5;
    }
    ${UpgradeText} {
      color: #279745;
    }
  }
`;
