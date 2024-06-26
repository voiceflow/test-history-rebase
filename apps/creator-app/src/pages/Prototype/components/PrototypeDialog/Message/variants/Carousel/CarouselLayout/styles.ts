import { Button as UIButton, ButtonGroup, hexToRGBA, toRGBAString } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

export const Container = styled.div`
  overflow-x: hidden;
  position: relative;
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
`;

export const Slide = styled.div`
  transition: transform 0.3s cubic-bezier(0.73, 0.01, 0.35, 1) 0s;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 1px;
  padding-left: 1px;
`;

const baseNavigationButtonStyles = css<{ disabled: boolean }>`
  width: 42px;
  height: 42px;
  z-index: 10;
  bottom: 23%;
  position: absolute;

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0;
    `}
`;

export const BackButton = styled(UIButton).attrs({
  variant: UIButton.Variant.WHITE,
  icon: 'largeArrowLeft',
  rounded: true,
})`
  ${baseNavigationButtonStyles}
  left: 20px;
`;

export const NextButton = styled(UIButton).attrs({
  variant: UIButton.Variant.WHITE,
  icon: 'largeArrowLeft',
  rounded: true,
})`
  transform: scaleX(-1);
  ${baseNavigationButtonStyles}
  right: 20px;
`;

export const Card = styled.div`
  background-color: #fff;
  box-shadow:
    0 4px 12px 0 #13214405,
    0 2px 4px 0 #13214405,
    0 2px 2px 0 #13214402,
    0 1px 1px 0 #13214402,
    0 1px 0 0 #13214407,
    0 0 0 1px #13214413;
  border-radius: 8px;

  display: flex;
  width: 242px;
  flex-shrink: 0;
  flex-direction: column;
`;

export const CardImage = styled.img<{ roundedBottomBorders: boolean }>`
  width: 100%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  ${({ roundedBottomBorders }) =>
    roundedBottomBorders &&
    css`
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    `}
`;

export const CardHeader = styled.header`
  display: flex;
  padding: 16px 20px;
`;

export const CardHeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const CardTitle = styled.div`
  line-height: normal;
  color: #132144;
  font-weight: 600;
  font-size: 15px;
  word-break: break-word;
`;

export const CardDescription = styled.div`
  font-size: 13px;
  color: #62778c;
  line-height: 1.54;
  margin-top: 4px;

  display: -webkit-box;
  max-height: 40px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;

  & a {
    word-break: break-word;
  }
`;

export const Button = styled(ButtonGroup.Button)<{ color?: string; hasInfo: boolean }>`
  ${transition('background-color')}
  color: ${({ color }) => toRGBAString(hexToRGBA(color ?? '#3D82E2'))};
  height: 45px;
  border-radius: 8px;
  border-left: 0;
  border-right: 0;

  ${({ hasInfo }) =>
    hasInfo &&
    css`
      &:first-of-type {
        border-top-left-radius: 0 !important;
        border-top-right-radius: 0 !important;
        border-top-color: #eaeff4;
      }
    `}

  &:last-of-type {
    border-bottom: 0;
  }

  &:hover {
    background-color: #fdfdfd;
  }
`;
