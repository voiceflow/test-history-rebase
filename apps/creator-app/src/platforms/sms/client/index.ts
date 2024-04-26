import { generalService } from '@/client/fetch';
import { createJobService } from '@/client/services';
import { GENERAL_SERVICE_ENDPOINT } from '@/config';
import type { SMSPublishStageType, TwilioPrototypeStageType } from '@/constants/platforms';
import type { SMSPublishJob, TwilioPrototypeJob } from '@/models';

import type { MessagingServiceType, PhoneNumberType } from '../types';

const smsServiceClient = {
  prototype: createJobService<TwilioPrototypeJob.AnyJob, TwilioPrototypeStageType>(
    `${GENERAL_SERVICE_ENDPOINT}/twilio/prototype`
  ),
  publish: createJobService<SMSPublishJob.AnyJob, SMSPublishStageType>(
    `${GENERAL_SERVICE_ENDPOINT}/twilio/sms/publish`
  ),
  getServices: (projectID: string, { numbers }: { numbers?: boolean } = {}) =>
    generalService.get<MessagingServiceType[]>(`twilio/sms/${projectID}/services${numbers ? '?numbers=1' : ''}`),
  createService: (projectID: string, serviceName: string) =>
    generalService.post<MessagingServiceType>(`twilio/sms/${projectID}/services`, { serviceName }),
  getNumbers: (projectID: string) => generalService.get<PhoneNumberType[]>(`twilio/sms/${projectID}/numbers`),
  setNumbers: (projectID: string, numbers: string[]) =>
    generalService.post<void>(`twilio/sms/${projectID}/numbers`, { numbers }),
};

export default smsServiceClient;
