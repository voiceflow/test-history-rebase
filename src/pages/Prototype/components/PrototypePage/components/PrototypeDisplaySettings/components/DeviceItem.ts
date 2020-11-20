import { Flex } from '@/components/Box';
import { css, styled } from '@/hocs';

export type DeviceItemProps = {
  selected?: boolean;
};

const DeviceItem = styled(Flex)<DeviceItemProps>`
  justify-content: space-between;
  height: 42px;
  padding: 12px 32px;
  cursor: pointer;
  position: relative;
  font-size: 13px;

  :hover {
    background-color: #eef4f6;
  }

  ${({ selected }) =>
    selected &&
    css`
      border: solid 1px #dfe3ed;
      background-color: #eef4f6;
    `}
`;

export default DeviceItem;
