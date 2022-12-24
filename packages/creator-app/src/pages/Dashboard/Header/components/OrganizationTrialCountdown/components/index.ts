import { colors, ThemeColor } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

import { COUNTDOWN_COLOR_MAP, CountdownStatus } from '../constants';

export const CountdownContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const CountdownText = styled.div<{ status?: CountdownStatus }>`
  ${({ status }) =>
    status && status === CountdownStatus.EXPIRED
      ? `color: ${COUNTDOWN_COLOR_MAP[CountdownStatus.EXPIRED].text}`
      : `color: ${colors(ThemeColor.PRIMARY)}`};
  text-transform: uppercase;
  font-weight: 600;
  font-family: Open Sans;
`;

export const CountdownIcon = styled.div<{ daysLeft?: number; status?: CountdownStatus }>`
  width: 42px;
  height: 42px;
  margin-right: 16px;
  ${({ daysLeft }) => (daysLeft && daysLeft > 9 ? 'padding: 12px 14px 12px 14px' : 'padding: 12px 14px 12px 18px')};
  ${({ status }) => status && `box-shadow: ${COUNTDOWN_COLOR_MAP[status].boxShadow}`};
  ${({ status }) => status && `background-image: ${COUNTDOWN_COLOR_MAP[status].backgroundImage}`};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-items: center;
  cursor: pointer;

  font-family: Open Sans;
  font-size: 13px;
  font-weight: 600;
  ${({ status }) => status && `color: ${COUNTDOWN_COLOR_MAP[status].text}`};
`;
