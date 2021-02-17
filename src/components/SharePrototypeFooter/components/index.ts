import Flex, { FlexCenter } from '@/components/Flex';
import { styled } from '@/hocs';

export const OutterContainer = styled.div<{ visible?: boolean }>`
  position: relative;
  overflow: hidden;
  padding-top: 3px;
  background: transparent;
`;
export const Container = styled(Flex)`
  min-width: 500px;
  height: 74px;
  margin: 49px 0 0;
  padding: 16px 10px;
  box-shadow: 0 -4px 2px -3px rgba(17, 49, 96, 0.08);
  background-color: white;
  z-index: 2;
  margin: 0 40px;
  flex-direction: row;
`;

export const LeftEdge = styled.div`
  width: 100px;
  height: 100px;
  left: 10px;
  top: 12px;
  border-radius: 20px;
  transform: rotate(20deg);
  background-color: white;
  position: absolute;
  z-index: -1;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.08);
`;

export const RightEdge = styled.div`
  width: 100px;
  height: 100px;
  right: 10px;
  top: 12px;
  border-radius: 20px;
  transform: rotate(-20deg);
  background-color: white;
  position: absolute;
  z-index: -1;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.08);
`;

export const ActionButtonContainer = styled(FlexCenter)`
  padding: 10px 15px;

  :last-child {
    padding-right: 0;
  }
`;
