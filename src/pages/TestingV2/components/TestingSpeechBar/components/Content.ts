import { FlexCenter } from '@/components/Flex';
import { css, styled, transition } from '@/hocs';

type ContentProps = {
  isListening: boolean;
};

const Content = styled(FlexCenter)<ContentProps>`
  width: 100%;
  margin: 0 auto;
  padding: 15px 55px 15px 55px;

  position: relative;
  color: #ffffffb0;
  background: linear-gradient(#344161, #263353);
  border: 1px solid #132144;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  cursor: pointer;
  user-select: none;

  ${transition('transform')}

  ${({ isListening }) =>
    isListening &&
    css`
      transform: scale(1.02);
    `}

  span {
    color: #fff;
  }
`;

export default Content;
