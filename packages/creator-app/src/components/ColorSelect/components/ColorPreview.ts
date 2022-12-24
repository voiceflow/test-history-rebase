import { styled } from '@/hocs/styled';

const BACKGROUND_IMAGE =
  // eslint-disable-next-line no-secrets/no-secrets
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==';

interface ColorPreviewProps {
  disabled?: boolean;
}

const ColorPreview = styled.div<ColorPreviewProps>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  position: relative;
  box-shadow: 0 1px 2px 0 rgba(19, 33, 68, 0.2), 0 0 1px 0 rgba(19, 33, 68, 0.08);
  border: solid 2px #fff;
  z-index: 0;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  &:before,
  &:after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    content: '';
  }

  &:before {
    background-image: url('${BACKGROUND_IMAGE}');
    background-position: center center;
    background-size: 50%;
    border-radius: 12px;
  }

  &:after {
    background-color: currentColor;
    border-radius: 12px;
  }
`;

export default ColorPreview;
