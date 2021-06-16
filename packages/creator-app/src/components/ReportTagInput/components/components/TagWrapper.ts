import * as SvgIcon from '@/components/SvgIcon';
import { styled } from '@/hocs';

const TagWrapper = styled.span`
  margin: 0 3px 3px 0;
  padding: 4px 12px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  word-break: break-all;
  font-size: 13px;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.16);
  background-image: linear-gradient(to bottom, rgba(238, 244, 246, 0.85), #eef4f6);

  & > ${SvgIcon.Container} {
    color: ${({ theme }) => theme.iconColors.disabled};
    padding-left: 9.7px;
  }
`;

export default TagWrapper;
