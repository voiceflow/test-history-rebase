import { AlexaProject } from '@voiceflow/alexa-types';

import { ExtraOptions } from './types';

export interface ProductClient {
  create: (projectID: string, product: AlexaProject.Product) => Promise<AlexaProject.Product>;

  delete: (projectID: string, productID: string) => Promise<void>;

  update: (projectID: string, productID: string, product: AlexaProject.Product) => Promise<void>;
}

const Client = ({ alexa }: ExtraOptions): ProductClient => ({
  create: (projectID, product) => alexa.post<AlexaProject.Product>(`/project/${projectID}/products/`, product).then((res) => res.data),

  delete: (projectID, productID) => alexa.delete(`/project/${projectID}/products/${productID}`),

  update: (projectID, productID, product) => alexa.put(`/project/${projectID}/products/${productID}`, product),
});

export default Client;
