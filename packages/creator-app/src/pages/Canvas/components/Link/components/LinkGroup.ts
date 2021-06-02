import { styled } from '@/hocs';
import { CANVAS_ACTIVATION_CLASSNAME, LINK_ACTIVE_CLASSNAME } from '@/pages/Canvas/constants';

export type LinkGroupProps = {
  isVisible: boolean;
};

const LinkGroup = styled.g.attrs<LinkGroupProps>(({ isVisible }) => ({
  style: {
    visibility: isVisible ? 'visible' : 'hidden',
  },
}))<LinkGroupProps>`
  .${CANVAS_ACTIVATION_CLASSNAME} &:not(.${LINK_ACTIVE_CLASSNAME}) {
    opacity: 0.7;
  }
`;

export default LinkGroup;
