import { FlexCenter, SvgIcon } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

const OptionalEntityContainer = styled(FlexCenter)`
  ${transition('border-color')}
  border-radius: 6px;
  border: solid 1px ${({ theme }) => theme.colors.separatorSecondary};
  padding: 3px 8px 3px 4px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  font-weight: 600;
  cursor: pointer;

  ${SvgIcon.Container} {
    opacity: 0.8;
    margin-right: 4px;
  }
  &:hover {
    ${SvgIcon.Container} {
      opacity: 1;
    }
    border-color: solid 1px ${({ theme }) => theme.colors.separatorSecondary};
  }
`;

export default OptionalEntityContainer;
