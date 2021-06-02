import { styled } from '@/hocs';

const HomeButton = styled.div`
  background: #fff;
  color: #8da2b5;
  box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.06), 0 2px 4px 0 rgba(17, 49, 96, 0.08);
  transition: all 0.1s ease;
  display: flex;
  font-size: 13px;
  justify-content: center;
  align-items: center;
  padding: 4px 8px 4px 6px;
  border-radius: 5px;
  cursor: pointer;
  animation: fadein 0.3s ease, movein 0.3s ease;

  & > *:first-child {
    margin-right: 5px;
  }

  &:hover {
    color: #62778c;
  }
`;

export default HomeButton;
