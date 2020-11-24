import Flex, { FlexCenter } from '@/components/Flex';
import Select from '@/components/Select';
import * as SvgIcon from '@/components/SvgIcon';
import TextEditor from '@/components/TextEditor';
import { css, styled, transition } from '@/hocs';

export { default as Speaker } from './Speaker';

export { default as SpeakerWrapper } from './SpeakerWrapper';

export const VoiceSelect = styled(Select)`
  max-width: 200px;
`;

export const Editor = styled(TextEditor)`
  align-items: flex-start;

  & > ${SvgIcon.Container} {
    margin-top: 3px;
  }

  .public-DraftEditor-content {
    max-height: 430px;
    overflow-x: hidden;
  }
`;

export const DefaultVoiceContainer = styled(FlexCenter)`
  ${transition('opacity')}
  position: absolute;
  top: 0;
  right: 24px;
  bottom: 0;

  opacity: 0;

  svg {
    ${transition('color')}

    color: #becedc;

    &:hover {
      color: #6e849a;
    }
  }

  ${({ active }) =>
    active &&
    css`
      opacity: 1 !important;

      svg {
        color: #e5b813 !important;
      }
    `}
`;

export const VoiceItem = styled(Flex)`
  margin-left: -36px;
  margin-right: -24px;
  padding-left: 36px;
  padding-right: 46px;
  flex: 1;
  height: 100%;

  &:hover {
    ${DefaultVoiceContainer} {
      opacity: 1;
    }
  }
`;
