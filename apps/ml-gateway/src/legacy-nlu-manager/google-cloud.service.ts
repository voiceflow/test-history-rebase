import { Firestore } from '@google-cloud/firestore';
import { PubSub } from '@google-cloud/pubsub';
import { Inject, Injectable } from '@nestjs/common';
import { ENVIRONMENT_VARIABLES } from '@voiceflow/nestjs-env';

import type { EnvironmentVariables } from '@/app.env';

@Injectable()
export class GoogleCloudService {
  public firestore: Firestore;

  public pubsub: PubSub;

  constructor(
    @Inject(ENVIRONMENT_VARIABLES)
    env: EnvironmentVariables
  ) {
    this.firestore = new Firestore();
    this.pubsub = new PubSub(env.PUBSUB_PROJECT_KEY ? { projectId: env.PUBSUB_PROJECT_KEY } : {});
  }
}
