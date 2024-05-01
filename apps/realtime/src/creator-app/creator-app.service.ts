import { Inject, Injectable } from '@nestjs/common';

import { type CreatorAppModuleOptions } from './creator-app.interface';
import { CREATOR_APP_MODULE_OPTIONS_TOKEN } from './creator-app.module-definition';
/**
 * @description - This is the service that is used to generate links available in creator-app
 */
@Injectable()
export class CreatorAppService {
  private baseURL: string;

  constructor(
    @Inject(CREATOR_APP_MODULE_OPTIONS_TOKEN)
    readonly options: CreatorAppModuleOptions
  ) {
    this.baseURL = options.baseURL;
  }

  private getURL(path: string): URL {
    return new URL(path, this.baseURL);
  }

  getCanvasURL({ versionID, diagramID }: { versionID: string; diagramID: string }): URL {
    return this.getURL(`/project/${versionID}/canvas/${diagramID}`);
  }

  getCommentingURL({
    threadID,
    versionID,
    diagramID,
    commentID,
  }: {
    threadID: string;
    versionID: string;
    diagramID: string;
    commentID: string;
  }): URL {
    const canvasURL = this.getCanvasURL({ versionID, diagramID });

    canvasURL.pathname = `${canvasURL.pathname}/commenting/${threadID}/${commentID}`;

    return canvasURL;
  }
}
