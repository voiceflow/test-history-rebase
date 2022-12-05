import { styled } from '@/hocs';

export const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
  text-transform: capitalize;
`;

export const SettingsSectionContainer = styled.div<{ marginBottom?: number }>`
  margin-bottom: ${({ marginBottom }) => marginBottom || 40}px;
  width: 100%;
`;
