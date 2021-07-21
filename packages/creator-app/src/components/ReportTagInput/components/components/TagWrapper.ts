import { SvgIconContainer } from '@voiceflow/ui';

import { styled } from '@/hocs';

const TagWrapper = styled.span<{ onClick: any }>`
  margin: 0 3px 3px 0;
  padding: 4px 0px 4px 12px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.16);
  background-image: linear-gradient(to bottom, rgba(238, 244, 246, 0.85), #eef4f6);
  cursor: default;

  div {
    max-width: 175px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  & > ${SvgIconContainer} {
    color: ${({ theme }) => theme.iconColors.disabled};
    padding-right: 9px;
  }
`;

export default TagWrapper;
