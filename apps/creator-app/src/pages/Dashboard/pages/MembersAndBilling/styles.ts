import Page from '@/components/Page';
import { css, styled, transition } from '@/hocs/styled';

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

export const StyledPageContent = styled(Page.Content)`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;
