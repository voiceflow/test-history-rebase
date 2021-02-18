import { styled, transition } from '@/hocs';

const DEFAULT_COLOR_SCHEME = '#539af5';

const StartButton = styled.button<{ color?: string }>`
  ${transition('opacity')};

  min-width: 260px;
  padding: 20px 48px;
  position: relative;
  color: white;
  font-weight: 600;
  font-size: 18px;
  border: none;
  border-radius: 12px;
  opacity: 0.8;
  background-color: ${({ color = DEFAULT_COLOR_SCHEME }) => color};

  &:hover {
    opacity: 1;
  }
`;

export default StartButton;
