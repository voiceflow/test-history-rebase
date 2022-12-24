import { styled } from '@/hocs/styled';

const ButtonSquare = styled.button`
  width: 36px;
  height: 36px;
  padding: 10px;
  color: #8da2b5;
  background-color: inherit;
  border: none;
  border-radius: 5px;
  transition: all 0.12s linear;

  &:hover {
    color: #62778c;
    background-image: linear-gradient(-180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%);
    box-shadow: inset 0 0 0 1px #dfe3ed;
  }

  &:active {
    color: #132144;
    background-image: linear-gradient(-180deg, rgba(238, 244, 246, 0.95) 0%, #eef4f6 100%);
    box-shadow: inset 0 0 0 1px #dfe3ed;
  }
`;

export default ButtonSquare;
