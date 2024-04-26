import { Box, toRGBAString } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';
import type { Color } from '@/types';

import Message from '../Message/Base';

export const Container = styled.div`
  position: sticky;
  bottom: 0;
  height: 65px;
  margin-left: -24px;
  margin-right: -24px;
  background-image: linear-gradient(to bottom, rgba(253, 253, 253, 0), rgba(253, 253, 253, 0.3) 8%, #fdfdfd 80%);
`;

export const ScrollContainer = styled.div`
  padding: 0 20px 15px 20px;
  white-space: nowrap;
`;

export const InlineContainer = styled(Box.Flex)`
  padding-top: 8px;
  margin-left: 40px;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

interface ButtonProps {
  rgbaColor: Color;
}

export const Button = styled(Message.FadeUp)<ButtonProps>`
  ${transition('color', 'background')};
  border-radius: 25px;
  box-shadow: 0 1px 1px 0 rgba(17, 49, 96, 0.06);
  border: solid 1px ${({ rgbaColor }) => toRGBAString({ ...rgbaColor, a: 0.4 })};
  color: ${({ rgbaColor }) => toRGBAString(rgbaColor)};
  background: white;
  cursor: pointer;
  margin: 5px;
  padding: 8px 20px;
  display: inline-block;

  :hover,
  :active {
    color: white;
    background: ${({ rgbaColor }) => toRGBAString(rgbaColor)};
  }
`;

export const ActionButton = styled(Button)`
  ${transition('border')};
  border: solid 1px rgba(141, 162, 181, 0.4);
  color: #132144;
  text-transform: none;

  :hover,
  :active {
    color: #132144;
    background: rgba(238, 244, 246, 0.5);
    border: solid 1px rgba(141, 162, 181, 0.6);
  }
`;
