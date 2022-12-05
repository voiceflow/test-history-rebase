import { css, styled } from '@/hocs';

export enum DescriptorVariant {
  PREFIX = 'prefix',
  SUFFIX = 'suffix',
}

export const DescriptorContainer = styled.div<{ variant?: DescriptorVariant }>`
  font-size: 13px;
  color: #62778c;

  ${({ variant }) =>
    variant === DescriptorVariant.PREFIX &&
    css`
      position: relative;
      bottom: 6px;
      margin-bottom: 16px;
    `}
`;
