import { createJobService } from '@/client/services';
import { GENERAL_SERVICE_ENDPOINT } from '@/config';
import type { TwilioPrototypeStageType } from '@/constants/platforms';
import type { TwilioPrototypeJob } from '@/models';

const whatsappServiceClient = {
  prototype: createJobService<TwilioPrototypeJob.AnyJob, TwilioPrototypeStageType>(
    `${GENERAL_SERVICE_ENDPOINT}/twilio/prototype`
  ),
};

export default whatsappServiceClient;
