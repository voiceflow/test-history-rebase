import { FlexCenter } from '@voiceflow/ui';
import { rgba } from 'polished';

import { css, styled, transition } from '@/hocs/styled';

export const Container = styled.div<{ disabled?: boolean }>`
  ${transition('opacity', 'border-color', 'box-shadow', 'opacity')};

  position: relative;
  width: 286px;
  min-height: 240px;
  padding: 24px;
  cursor: pointer;
  box-shadow: none;
  background-color: #fdfdfd;
  box-sizing: border-box;
  border: 1px solid #dfe3ed;
  border-radius: 12px;
  text-align: left;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.65;
      pointer-events: none;
    `}

  :hover {
    box-shadow:
      0 8px 16px 0 rgba(17, 49, 96, 0.16),
      0 0 0 1px rgba(17, 49, 96, 0.06);
    border-color: transparent;
  }

  :last-child {
    margin-right: 0;
  }
`;

export const FeatureStatusBubble = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  padding: 4px 10px;
  border-radius: 11.5px;
  box-shadow: 0 1px 2px 0 rgba(17, 49, 96, 0.24);
  background-color: #fff;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: #5d9df5;
`;

export const IconImage = styled.img<{ size: number }>`
  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
  `}
`;

export const PlatformDescription = styled.div`
  font-size: 15px;
  color: #62778c;
  margin-top: 10px;
  min-height: 45px;
  margin-bottom: 24px;
`;

export const PlatformFeatureBubble = styled.div<{ color: string }>`
  ${transition('border-color')};

  display: inline-block;
  padding: 4px 8px;
  font-weight: 600;
  letter-spacing: 0.7px;
  background-color: #fff;
  border: solid 1px transparent;
  border-radius: 17px;

  font-size: 11px;
  text-transform: uppercase;
  margin-right: 6px;

  ${({ color }) => css`
    color: ${color};
    border-color: ${rgba(color, 0.2)} !important;

    :hover {
      border-color: ${rgba(color, 0.4)} !important;
    }
  `}
`;

export const PlatformIcon = styled(FlexCenter)`
  width: 42px;
  height: 42px;
  box-shadow:
    0 1px 3px 0 rgba(17, 49, 96, 0.16),
    0 0 0 1px rgba(17, 49, 96, 0.04);
  border-radius: 8px;
  background-color: #fff;
`;

export const PlatformName = styled.div`
  color: #132144;
  font-size: 18px;
  font-weight: 600;
  margin-top: 16px;
`;
