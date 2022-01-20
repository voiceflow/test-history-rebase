import client from '@/client';
import { EventName } from '@/ducks/tracking/constants';

export const trackProfileNameChanged = () => () => client.api.analytics.track(EventName.PROFILE_NAME_CHANGED);

export const trackProfileEmailChanged = () => () => client.api.analytics.track(EventName.PROFILE_EMAIL_CHANGED);

export const trackProfilePasswordChanged = () => () => client.api.analytics.track(EventName.PROFILE_PASSWORD_CHANGED);
