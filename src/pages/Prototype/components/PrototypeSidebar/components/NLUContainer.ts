import { FlexCenter } from '@/components/Flex';
import Text from '@/components/Text';
import { css, styled } from '@/hocs';

type NLUContainerProps = {
  containsLoader?: boolean;
};

const NLUContainer = styled(FlexCenter).attrs({ column: true })<NLUContainerProps>`
  & > ${Text} {
    text-align: center;
    white-space: pre-line;
    min-width: 270px;
    max-width: 270px;
  }

  ${({ containsLoader }) =>
    containsLoader &&
    css`
      height: 100%;
    `}
`;

export default NLUContainer;
