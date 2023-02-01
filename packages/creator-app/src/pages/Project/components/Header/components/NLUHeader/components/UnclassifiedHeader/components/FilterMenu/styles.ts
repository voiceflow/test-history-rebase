import { Text, transition } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const Section = styled.div<{ isActive?: boolean }>`
  ${transition('background-color')};
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  background-color: #fff;

  ${({ isActive }) =>
    isActive &&
    css`
      background-color: #eef4f6;

      ${SectionTitle} {
        font-weight: 600;
      }
    `}
`;

export const SectionTitle = styled(Text)`
  font-size: 15px;
  color: #132144;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
