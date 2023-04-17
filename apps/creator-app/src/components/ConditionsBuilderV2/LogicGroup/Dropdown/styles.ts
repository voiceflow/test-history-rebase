import { Box } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';
import { ClassName } from '@/styles/constants';

const activeStyle = ({ active }: { active?: boolean }) =>
  active &&
  css`
    color: #3d82e2;
    opacity: 1;
  `;

interface VerticalLineProps {
  topLine?: boolean;
  bottomLine?: boolean;
  active?: boolean;
}

export const VerticalLine = styled.div<VerticalLineProps>`
  border: solid 1px rgba(212, 217, 230, 0.65);
  height: calc(50% - 26.5px);

  ${({ topLine }) =>
    topLine &&
    css`
      border-radius: 0 0 50px 50px;
    `}
  width: 0px;
  margin-right: 13px;

  ${({ bottomLine }) =>
    bottomLine &&
    css`
      border-radius: 50px 50px 0 0;
    `}

  ${({ active }: { active?: boolean }) =>
    active &&
    css`
      border-color: rgba(61, 130, 226, 0.3);
    `}
`;

export const DropdownContainer = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;

  color: #62778c;
  width: 100%;
  justify-content: space-between;

  &:hover {
    color: #3d82e2;
    opacity: 1;
    .${ClassName.SVG_ICON} {
      color: #3d82e2;
      opacity: 1;
    }
  }

  ${activeStyle}
`;

export const OuterContainer = styled(Box)`
  display: flex;
  align-self: stretch;
  flex-direction: column;
  align-items: end;

  width: 78px;
`;

export const CaretDownContainer = styled(Box.FlexCenter)<{ active?: boolean }>`
  ${transition('color', 'opacity')}
  color: #6e849a;
  cursor: pointer;
  height: 16px;
  width: 16px;
  margin-right: 6px;

  &:hover {
    opacity: 1;
    color: #3d82e2;
  }

  ${activeStyle}
`;

export const LogicOptionDisplay = styled(Box.FlexCenter)`
  ${transition('color', 'opacity')}

  cursor: pointer;
  padding-left: 20px;
  font-weight: 600;

  &:hover {
    color: #3d82e2;
  }
`;

interface LineProps {
  active?: boolean;
}

const activeBorderColor = ({ active }: LineProps) =>
  active &&
  css`
    border-color: rgba(61, 130, 226, 0.3);
  `;

const curveStyles = css<LineProps>`
  border-left: 2px solid rgba(212, 217, 230, 0.65);
  height: 13px;
  width: 13px;

  ${activeBorderColor}
`;

export const TopCurve = styled.div<LineProps>`
  ${curveStyles}
  border-top: 2px solid rgba(212, 217, 230, 0.65);
  border-radius: 50px 0 0 0;
`;

export const BottomCurve = styled.div<LineProps>`
  ${curveStyles}
  border-bottom: 2px solid rgba(212, 217, 230, 0.65);
  border-radius: 0 0 0 50px;
`;

export const BoxLine = styled.div<LineProps>`
  border: solid 1px rgba(212, 217, 230, 0.65);
  border-radius: 8px;
  border-radius: 0 50px 50px 0;
  height: 0px;
  width: 0px;

  ${activeBorderColor}
`;
