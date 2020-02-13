import Select from '@/components/Select';
import * as SvgIcon from '@/components/SvgIcon';
import TextEditor from '@/components/TextEditor';
import { styled } from '@/hocs';

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
