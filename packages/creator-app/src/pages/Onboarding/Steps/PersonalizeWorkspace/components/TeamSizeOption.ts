import { FlexCenter } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

interface TeamSizeOptionProps {
  selected: boolean;
}

const TeamSizeOption = styled(FlexCenter)<TeamSizeOptionProps>`
  ${transition('background', 'box-shadow')}
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
    selected
      ? css`
          background: rgba(238, 244, 246, 0.85);
          color: #132144;
        `
      : css`
          :hover {
            box-shadow: 0 2px 4px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.04);
          }
        `}
`;

export default TeamSizeOption;
