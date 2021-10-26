import { Project } from '@voiceflow/alexa-types';

import { ExtraOptions } from './types';

export interface ProductClient {
  create: (projectID: string, product: Project.AlexaProduct) => Promise<Project.AlexaProduct>;

  delete: (projectID: string, productID: string) => Promise<void>;

  update: (projectID: string, productID: string, product: Project.AlexaProduct) => Promise<void>;
}

const Client = ({ alexa }: ExtraOptions): ProductClient => ({
  create: (projectID, product) => alexa.post<Project.AlexaProduct>(`/project/${projectID}/products/`, product).then((res) => res.data),

  delete: (projectID, productID) => alexa.delete(`/project/${projectID}/products/${productID}`),

  update: (projectID, productID, product) => alexa.put(`/project/${projectID}/products/${productID}`, product),
});

export default Client;
