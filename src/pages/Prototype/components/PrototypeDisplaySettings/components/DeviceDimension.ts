import { css, styled } from '@/hocs';

export type DeviceDimensionProps = {
  selected?: boolean;
};

const DeviceDimension = styled.div<DeviceDimensionProps>`
  color: #8da2b5;

  ${({ selected }) =>
    selected &&
    css`
      color: #62778c;
    `}
`;

export default DeviceDimension;
