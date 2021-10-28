import { AlexaStageType, AnyStageType } from '@/constants/platforms';
import { css } from '@/hocs';

export const ALEXA_LEARN_MORE_URL = 'https://www.voiceflow.com/tutorials/uploading-and-testing-on-your-alexa-device';

export const ALEXA_SIMULATOR_URL = (amazonID: string, locale: string): string =>
  `https://developer.amazon.com/alexa/console/ask/test/${amazonID}/development/${locale}/`;

export const getAlexaPopupLayout = (props?: { jobStage?: AnyStageType | null }) => {
  switch (props?.jobStage) {
    case AlexaStageType.IDLE:
    case AlexaStageType.ERROR:
    case AlexaStageType.WAIT_VENDORS:
      return css`
        width: 254px;
        padding: 0px;
      `;
    case AlexaStageType.SUCCESS:
      return css`
        width: 350px;
        height: auto;
        padding: 0px;
      `;
    default:
      return css`
        width: 254px;
        right: 180px;
        padding: 0px;
      `;
  }
};
