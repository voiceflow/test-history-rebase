import * as Notifications from '@/ducks/notifications';
import { styled } from '@/hocs/styled';

export const Container = styled.div`
  margin-left: 32px;
  padding-right: 32px;
  padding-top: 15px;
  padding-bottom: 15px;
  border-bottom: solid 1px #eaeff4;
  font-size: 15px;
  line-height: 1.47;
`;

export const TimeContainer = styled.div`
  margin-top: 4px;
  color: #62778c;
  font-size: 13px;
  &:first-letter {
    text-transform: uppercase;
  }
`;

export const Content = styled.div<{ type: Notifications.NotificationType }>`
  display: inline;
  color: #2b3950;
  font-size: 13px;

  ${({ type }) => type === Notifications.NotificationType.FEATURE && 'color: #5d9df5;'}
  ${({ type }) => type === Notifications.NotificationType.CHANGE && 'color: #00cc87;'}
`;
