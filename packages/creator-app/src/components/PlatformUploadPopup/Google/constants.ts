import { AnyStageType, GoogleStageType } from '@/constants/platforms';
import { css } from '@/hocs';

export const GOOGLE_CONSOLE_URL = 'https://console.actions.google.com/';

export const GOOGLE_CONSOLE_PROJECT_URL = (projectID: string) => `https://console.actions.google.com/project/${projectID}/simulator/`;

export const getGooglePopupLayout = (props?: { jobStage?: AnyStageType | null; multiSelect?: boolean }) => {
  if (props?.multiSelect) {
    return css`
      width: 254px;
      right: 180px;
      padding: 0px;
    `;
  }

  switch (props?.jobStage) {
    case GoogleStageType.WAIT_PROJECT:
      return css`
        width: 254px;
        padding: 0px;
      `;

    case GoogleStageType.SUCCESS:
    case GoogleStageType.ERROR:
      return css`
        width: 350px;
      `;
    default:
      return css``;
  }
};
