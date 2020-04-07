import { FlexCenter } from '@/components/Flex';
import { css, styled, transition } from '@/hocs';

type TeamSizeOptionProps = {
  selected: boolean;
};

const TeamSizeOption = styled(FlexCenter)<TeamSizeOptionProps>`
  ${transition('background')}
  background: white;
  border-radius: 5px;
  box-shadow: 0 0 0 1px #dfe3ed;
  padding: 15px 10px;
  color: #62778c;
  margin-bottom: 10px;
  margin-right: 10px;
  cursor: pointer;

  &:nth-child(3n) {
    margin-right: 0;
  }

  ${({ selected }) =>
    selected &&
    css`
      background: #eef4f6;
    `}
`;

export default TeamSizeOption;
