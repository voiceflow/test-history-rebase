import { css, styled } from '../styles';

export type FlexProps = {
  column?: boolean;
  inline?: boolean;
  fullWidth?: boolean;
};

export const flexStyles = css<FlexProps>`
  display: ${({ inline }) => (inline ? 'inline-flex' : 'flex')};
  align-items: center;

  ${({ column }) =>
    column &&
    css`
      flex-direction: column;
    `}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
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

export const flexStartStyles = css`
  ${flexStyles}
  justify-content: flex-start;
`;

export const flexEndStyles = css`
  ${flexStyles}
  justify-content: flex-end;
`;

export const FlexStart = styled.div`
  ${flexStartStyles}
`;

export const FlexEnd = styled.div`
  ${flexEndStyles}
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
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const FlexLabel = styled.div`
  ${flexLabelStyles}
`;
