import AddMinusButton from '@/componentsV2/AddMinusButton';
import Flex from '@/componentsV2/Flex';
import Input from '@/componentsV2/Input';
import { styled } from '@/hocs';

export { default as DraggableItem } from './DraggableItem';
export { default as IntentContainer } from './IntentContainer';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 600px;
  border-top: 1px solid #eaeff4;
`;

export const ListSection = styled(Flex)`
  border-right: 1px solid #eaeff4;
  width: 60%;
`;

export const IntentSection = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const ListContainer = styled.div`
  width: 100%;
  overflow: auto;
  flex: 2;
  border-top: 1px solid #eaeff4;
`;
export const SearchContainer = styled.div`
  flex: 1;
`;

export const AddIntentButton = styled(AddMinusButton)`
  margin-right: 30px;
`;

export const ListActionsContainer = styled(Flex)`
  height: 50px;
  width: 100%;
`;

export const SearchInput = styled(Input)`
  box-shadow: none !important;
  padding-left: 30px;
  border: none !important;
  ::placeholder {
    line-height: 22px;
  }
`;
