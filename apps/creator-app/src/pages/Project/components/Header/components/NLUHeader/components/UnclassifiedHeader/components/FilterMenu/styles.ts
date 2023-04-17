import { Text, transition } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const Section = styled.div<{ isActive?: boolean; clickable?: boolean }>`
  ${transition('background-color')};
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  background-color: #fff;

  ${({ clickable, isActive }) =>
    clickable &&
    !isActive &&
    css`
      &:hover {
        background-color: #fdfdfd;
      }
    `};

  ${({ isActive }) =>
    isActive &&
    css`
      background-color: rgb(238 244 246 / 65%);

      ${SectionTitle} {
        font-weight: 600;
      }
    `}
`;

export const SectionTitle = styled(Text)`
  font-size: 15px;
  color: #132144;
`;

export const SectionHeader = styled.div<{ clickable?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;
    `};
`;

export const SectionContent = styled.div`
  margin-top: 13px;
`;

export const HeaderTitle = styled(Text)`
  text-transform: uppercase;
  font-size: 13px;
  color: #62778c;
  font-weight: 600;
`;
