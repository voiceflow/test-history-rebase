import { Box, fontResetStyle, Input } from '@voiceflow/ui';

import Page from '@/components/Page';
import { css, styled, transition, units } from '@/hocs/styled';

export const StyledPageContent = styled(Page.Content)`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

export const LinksWrapper = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
  padding: 12px 16px;
`;

const linkActiveStyle = css`
  color: #3d82e2;
  background-color: rgb(61 130 226 / 10%);
`;

export const Link = styled.button<{ isActive?: boolean }>`
  ${fontResetStyle};
  ${transition('color', 'background-color')}
  background-color: transparent;
  height: 36px;
  color: #949db0;
  font-weight: 600;
  border: 0;
  padding: 8px 16px;
  border-radius: 8px;
  line-height: normal;

  &:hover {
    ${linkActiveStyle}
  }

  ${({ isActive }) => isActive && linkActiveStyle}
`;

export const Footer = styled(Box.Flex)`
  width: 100%;
  justify-content: ${({ justifyContent = 'flex-end' }) => justifyContent};
  padding: ${units(3)}px ${units(4)}px;
  background: #fbfbfb;
  border-top: 1px solid ${({ theme }) => theme.colors.separatorSecondary};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

export const VoiceflowInput = styled(Input)`
  input {
    text-overflow: ellipsis;
    color: #8da2b5;
  }
`;
