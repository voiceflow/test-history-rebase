import { Crypto, Utils } from '@voiceflow/common';

import logger from '@/logger';
import { ModelConfiguration } from '@/models';

import { AbstractControl } from '../control';

class ConfigurationService extends AbstractControl {
  private cache = new Map<string, ModelConfiguration>();

  private unsubscribe = Utils.functional.noop;

  static buildCache(snapshot: FirebaseFirestore.QuerySnapshot): Map<string, ModelConfiguration> {
    return new Map(
      snapshot.docs.map((doc) => {
        const data = doc.data() as ModelConfiguration;

        return [doc.id, data];
      })
    );
  }

  /**
   * stores models from firestore in the cache
   * automatically synchronizes with changes in firestore
   */
  start(subscriberID: string): Promise<void> {
    const encodedSubscriberID = Crypto.Base64.encode(subscriberID);
    let isSynchronized = false;

    return new Promise((resolve, reject) => {
      const handleError = (error: any, message: string) => {
        logger.error({ message, error });

        if (!isSynchronized) {
          reject(error);
        }
      };

      if (!this.config.FIRESTORE_MODEL_COLLECTION) {
        logger.error('model collection not provided, unable to setup firestore subscription');
        resolve();
        return;
      }

      this.unsubscribe = this.clients.gcloud.firestore.collection(this.config.FIRESTORE_MODEL_COLLECTION).onSnapshot(
        async (snapshot) => {
          if (!snapshot.docs.length) {
            logger.error(`no documents found in the firestore collection '${this.config.FIRESTORE_MODEL_COLLECTION}'`);
          }

          this.cache = ConfigurationService.buildCache(snapshot);

          try {
            await this.services.interaction.synchronizeClients(encodedSubscriberID, Array.from(this.cache.values()));

            if (!isSynchronized) {
              isSynchronized = true;
              resolve();
            }
          } catch (error) {
            handleError(error, 'failed to synchronize model pubsub clients');
          }
        },
        (error) => handleError(error, 'failed to load model configurations from firestore')
      );
    });
  }

  /**
   * look up a configuration based on the model identifier
   * if it is found in the cache it will be returned immediately
   */
  async getConfiguration(modelID: string): Promise<ModelConfiguration> {
    const cached = this.cache.get(modelID);
    if (cached) return cached;

    const doc = await this.clients.gcloud.firestore.doc(`${this.config.FIRESTORE_MODEL_COLLECTION}/${modelID}`).get();

    const data = doc.data() as ModelConfiguration | undefined;

    if (!data) {
      throw new Error(`unable to find configuration for model with ID: ${modelID}`);
    }

    this.cache.set(modelID, data);

    return data;
  }

  stop(): void {
    const { unsubscribe } = this;
    this.unsubscribe = Utils.functional.noop;

    unsubscribe();
    this.cache.clear();
  }
}

export default ConfigurationService;
