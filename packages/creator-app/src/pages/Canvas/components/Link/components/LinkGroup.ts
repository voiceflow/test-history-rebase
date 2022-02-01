import { styled } from '@/hocs';

export interface LinkGroupProps {
  isVisible: boolean;
}

const LinkGroup = styled.g.attrs<LinkGroupProps>(({ isVisible }) => ({
  style: {
    visibility: isVisible ? 'visible' : 'hidden',
  },
}))<LinkGroupProps>``;

export default LinkGroup;
