import { flexStyles, units } from '@voiceflow/ui';

import { styled } from '@/hocs';

import { FOOTER_HEIGHT } from '../constants';

const Footer = styled.footer`
  ${flexStyles}
  border-top: 1px solid ${({ theme }) => theme.colors.separatorSecondary};
  padding: ${units(3)}px ${units(4)}px;
  min-height: ${FOOTER_HEIGHT}px;
`;

export default Footer;
