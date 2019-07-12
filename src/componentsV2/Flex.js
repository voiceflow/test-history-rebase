/* eslint-disable xss/no-mixed-html */
import styled, { css } from 'styled-components';

export const flexStyles = css`
  display: ${({ inline }) => (inline ? 'inline-flex' : 'flex')};
  align-items: center;
`;

const Flex = styled.div`
  ${flexStyles}
`;

export default Flex;

export const flexCenterStyles = css`
  ${flexStyles}
  justify-content: center;
`;

export const FlexCenter = styled.div`
  ${flexCenterStyles}
`;

export const flexApartStyles = css`
  ${flexStyles}
  justify-content: space-between;
`;

export const FlexApart = styled.div`
  ${flexApartStyles}
`;

export const flexAroundStyles = css`
  ${flexStyles}
  justify-content: space-around;
`;

export const FlexAround = styled.div`
  ${flexAroundStyles}
`;

export const flexLabelStyles = css`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FlexLabel = styled.div`
  ${flexLabelStyles}
`;
