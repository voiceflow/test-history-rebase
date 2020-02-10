import { styled } from '@/hocs';
import { FadeLeft } from '@/styles/animations';

const BlockEditorBody = styled.div`
  ${FadeLeft}
  flex: 1;
  overflow-y: ${(props) => (props.expanded ? 'visible' : 'auto')};
`;

export default BlockEditorBody;
