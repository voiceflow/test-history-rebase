import Box from '@/components/Box';
import { css, styled } from '@/styles';
import { fadeInDownStyle } from '@/styles/animations';

export const baseStyles = css`
  border-radius: 8px;
  box-shadow:
    0px 12px 24px rgba(19, 33, 68, 0.04),
    0px 8px 12px rgba(19, 33, 68, 0.04),
    0px 4px 4px rgba(19, 33, 68, 0.02),
    0px 2px 2px rgba(19, 33, 68, 0.01),
    0px 1px 1px rgba(19, 33, 68, 0.01),
    0px 0px 0px rgba(17, 49, 96, 0.03),
    0px 0px 0px 1px rgba(17, 49, 96, 0.06);
`;

const Container = styled(Box)`
  ${fadeInDownStyle}
  ${baseStyles}

  display: flex;
  background-color: #fff;
  overflow: hidden;
`;

export default Container;
