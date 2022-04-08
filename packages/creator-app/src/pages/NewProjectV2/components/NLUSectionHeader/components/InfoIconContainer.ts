import { css, styled, transition } from '@/hocs';

interface InfoIconContainerProps {
  show: boolean;
}

const InfoIconContainer = styled.div<InfoIconContainerProps>`
  ${transition('opacity')};

  opacity: 0;
  ${({ show }) =>
    show &&
    css`
      opacity: 1;
    `};
`;

export default InfoIconContainer;
