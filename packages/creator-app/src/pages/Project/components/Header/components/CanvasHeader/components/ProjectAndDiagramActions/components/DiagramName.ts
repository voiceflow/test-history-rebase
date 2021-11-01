import { css, styled, transition } from '@/hocs';

interface DiagramNameProps {
  active?: boolean;
  disabled?: boolean;
  highlighted?: boolean;
}

const DiagramName = styled.div<DiagramNameProps>`
  ${transition('opacity', 'color')}

  color: #6e849a;
  cursor: pointer;
  opacity: 0.6;
  font-size: 16px;
  margin-right: 12px;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'all')};

  &::last-child {
    margin-right: 0;
  }

  &:hover {
    opacity: 1;
  }

  ${({ active, highlighted, disabled }) =>
    highlighted &&
    css`
      opacity: 1;
      color: ${active ? '#4986da' : '#5d9df5'};
      border-bottom: ${disabled ? 'none' : '1px dotted currentColor'};

      &:hover {
        color: #4986da;
      }
    `}

  ${({ highlighted, disabled }) =>
    highlighted &&
    !disabled &&
    css`
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    `}
`;

export default DiagramName;
