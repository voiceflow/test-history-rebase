import { css, styled } from '@/styles';

export interface FlexProps {
  gap?: number | [number, number];
  column?: boolean;
  inline?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch' | null;
}

export const flexStyles = css<FlexProps>`
  display: ${({ inline }) => (inline ? 'inline-flex' : 'flex')};
  align-items: ${({ alignItems }) => alignItems || 'center'};

  ${({ gap }) =>
    gap &&
    css`
      gap: ${Array.isArray(gap) ? `${gap[0]}px ${gap[1]}px` : `${gap}px`};
    `}

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

  ${({ fullHeight }) =>
    fullHeight &&
    css`
      height: 100%;
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

export const flexColumnStyles = css`
  ${flexStyles}
  flex-direction: column;
`;

export const FlexLabel = styled.div`
  ${flexLabelStyles}
`;
