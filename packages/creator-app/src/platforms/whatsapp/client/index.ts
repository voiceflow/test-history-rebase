import { createJobService } from '@/client/services';
import { GENERAL_SERVICE_ENDPOINT } from '@/config';
import { TwilioPrototypeStageType } from '@/constants/platforms';
import { TwilioPrototypeJob } from '@/models';

const whatsappServiceClient = {
  prototype: createJobService<TwilioPrototypeJob.AnyJob, TwilioPrototypeStageType>(`${GENERAL_SERVICE_ENDPOINT}/twilio/prototype`),
};

export default whatsappServiceClient;
