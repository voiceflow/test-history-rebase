import { css, styled } from '@ui/styles';

const sizeStyles = {
  small: css`
    position: relative;
    margin-right: -4px;
    margin-left: -4px;
    margin-top: -2px;
    height: 20px;

    .react-toggle-track {
      width: 39px;
      height: 19px;
    }

    .react-toggle-thumb {
      width: 13px;
      height: 13px;
    }

    .react-toggle--checked .react-toggle-thumb {
      left: 23px;
    }
  `,
  'extra-small': css`
    .react-toggle-track {
      width: 32px;
      height: 16px;
    }

    .react-toggle-thumb {
      width: 12px;
      height: 12px;
      top: 2px;
      left: 2px;
    }

    .react-toggle--checked .react-toggle-thumb {
      left: 18px;
    }
  `,
};

const ToggleContainer = styled.div<{ size?: 'small' | 'extra-small' | 'normal' }>`
  display: flex;
  ${({ size }) => size !== 'normal' && sizeStyles[size as 'small' | 'extra-small']}
`;

export default ToggleContainer;
