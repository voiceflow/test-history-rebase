import { SectionV2 } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

interface EditorWrapperProps {
  height?: number;
}

export const EditorWrapper = styled.section<EditorWrapperProps>`
  border-radius: 6px;
  border: 1px #dfe3ed solid;
  height: ${({ height = 246 }) => `${height}px`};
  margin: 0px 32px 21px;
  overflow: hidden;
`;

export const CollapseSection = styled(SectionV2.CollapseSection)`
  background-color: #fff;
`;
