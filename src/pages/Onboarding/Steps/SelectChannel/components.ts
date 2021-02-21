import { flexStyles } from '@/components/Flex';
import { styled, units } from '@/hocs';

export const DocsLink = styled.a`
  ${flexStyles};

  position: absolute;
  left: 50px;
  bottom: ${units(5)}px;
  font-size: 15px;
  font-weight: 600;
  opacity: 0.8;
  cursor: pointer;

  span {
    color: #6e849a;
    margin-right: 12px;
  }

  :hover span {
    color: #5d9df5;
  }

  &&& {
    color: #62778c;

    :hover {
      color: #5d9df5;
      text-decoration: none;
    }
  }
`;
