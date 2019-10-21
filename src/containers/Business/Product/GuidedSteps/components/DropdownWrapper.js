import { styled } from '@/hocs';

const DropdownWrapper = styled.div`
  box-shadow: rgba(17, 49, 96, 0.06) 0px 0px 3px;
  background: rgb(255, 255, 255);
  border: 1px solid rgb(212, 217, 230);
  border-image: initial;
  border-radius: 5px;
  transition: box-shadow 0.15s ease 0s, border 0.15s ease 0s;
  width: ${({ size = '100%' }) => size};
  display: flex;
  align-items: center;
  padding: 10px 16px 12px;
  cursor: pointer;

  & > span {
    flex: 1;

    & > span {
      color: rgb(141, 162, 181);
    }
  }
`;

export default DropdownWrapper;
