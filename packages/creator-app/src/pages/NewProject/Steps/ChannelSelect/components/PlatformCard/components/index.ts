import { FlexCenter } from '@voiceflow/ui';
import { rgba } from 'polished';

import { css, styled, transition } from '@/hocs';

export const Container = styled.div<{ disabled?: boolean }>`
  ${transition()};
  border: solid 1px #dfe3ed;
  border-radius: 8px;
  padding: 24px;
  margin: 10px;
  box-shadow: none;
  height: 198px;
  flex-basis: 26%;
  box-sizing: content-box;

  :hover {
    cursor: pointer;
    box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
    border: solid 1px transparent;
    background: linear-gradient(180deg, rgba(253, 253, 253) 0%, rgba(250, 251, 252) 100%);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.4;
      background-color: rgb(249, 249, 249);
    `}

  :last-child {
    margin-right: 0;
  }
`;

export const PlatformIcon = styled(FlexCenter)`
  border-radius: 50%;
  box-shadow: 0 2px 4px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.04);
  padding: 4px;
  width: 48px;
  height: 48px;
`;

export const PlatformName = styled.div`
  text-align: left;
  color: #132144;
  font-size: 18px;
  font-weight: 600;
  margin-top: 16px;
`;

export const PlatformDescription = styled.div`
  font-size: 15px;
  text-align: left;
  color: #62778c;
  margin-top: 10px;
  min-height: 45px;
  margin-bottom: 24px;
`;

export const FeaturesContainer = styled.div`
  text-align: left;
`;

export const IconImage = styled.img<{ size: number }>`
  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
  `}
`;

export const PlatformFeatureBubble = styled.div<{ color: string; borderColor: Record<string, number> }>`
  ${transition('border-color')};
  border-radius: 17px;
  border: solid 1px rgba(85, 137, 235, 0.3);
  display: inline-block;
  padding: 4px 8px;
  font-weight: 600;
  letter-spacing: 0.7px;
  background-color: #fff;

  font-size: 11px;
  text-transform: uppercase;
  margin-right: 6px;

  ${({ color, borderColor }) => css`
    color: ${color};
    border-color: ${rgba(borderColor.red, borderColor.green, borderColor.blue, 0.3)} !important;

    :hover {
      border-color: ${rgba(borderColor.red, borderColor.green, borderColor.blue, 0.6)} !important;
    }
  `}
`;
