import { styled } from '@/hocs';

const HomeButton = styled.div`
  background: #fff;
  color: #8da2b5;
  box-shadow: 0px 2px 4px rgba(17, 49, 96, 0.16), 0px 0px 0px rgba(17, 49, 96, 0.04);
  transition: all 0.1s ease;
  display: flex;
  font-size: 13px;
  justify-content: center;
  align-items: center;
  padding: 4px 8px 4px 6px;
  border-radius: 5px;
  cursor: pointer;

  & > *:first-child {
    margin-right: 5px;
  }

  &:hover {
    color: #62778c;
  }
`;

export default HomeButton;
