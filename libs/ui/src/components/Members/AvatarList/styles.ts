import { MemberIcon } from '@ui/components/User';
import { styled } from '@ui/styles';

export const Container = styled.div`
  display: flex;
  z-index: 0;

  & > div {
    margin-right: 12px;

    :last-child {
      margin-right: 0;
    }
  }
`;

export const List = styled.div`
  display: flex;
  margin-left: 5px;

  & > div {
    margin-left: -2px;
  }
`;

export const AddIcon = styled(MemberIcon)`
  width: 30px;
  height: 30px;
  color: #8da2b580;
  line-height: 30px;
  background-color: transparent;
  border: 1px dashed #8da2b580;
  box-shadow: none;

  &:hover {
    color: #8da2b5;
    border: 1px dashed #8da2b5;
    cursor: pointer;
  }
`;

export const Count = styled.div`
  color: #62778c;
  user-select: none;
`;
