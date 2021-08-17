import { Project } from '@voiceflow/alexa-types';
import axios from 'axios';

import { ALEXA_SERVICE_ENDPOINT } from '@/config';
import { Nullable } from '@/types';

import { createProjectService, PROJECT_RESOURCE_ENDPOINT } from '../utils';

const projectAlexaService = {
  ...createProjectService<Project.AlexaProject>(ALEXA_SERVICE_ENDPOINT),

  updateSelectedVendor: (projectID: string, vendorID: Nullable<string>) =>
    axios
      .put<{ skillID: Nullable<string>; vendorID: Nullable<string> }>(
        `${ALEXA_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/${projectID}/member/selected-vendor`,
        { vendorID }
      )
      .then((res) => res.data),

  updateVendorSkillID: (projectID: string, vendorID: string, skillID: string) =>
    axios
      .put<void>(`${ALEXA_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/${projectID}/member/vendors/${vendorID}/skill-id`, { skillID })
      .then((res) => res.data),

  copyProduct: (projectID: string, productID: string) =>
    axios
      .post<Project.AlexaProduct>(`${ALEXA_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/${projectID}/products/${productID}/copy`)
      .then((res) => res.data),

  createProduct: (projectID: string, product: Project.AlexaProduct) =>
    axios.post<Project.AlexaProduct>(`${ALEXA_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/${projectID}/products`, product).then((res) => res.data),

  updateProduct: (projectID: string, productID: string, product: Project.AlexaProduct) =>
    axios
      .put<Project.AlexaProduct>(`${ALEXA_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/${projectID}/products/${productID}`, product)
      .then((res) => res.data),

  deleteProduct: (projectID: string, productID: string) =>
    axios.delete(`${ALEXA_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/${projectID}/products/${productID}`).then((res) => res.data),
};

export default projectAlexaService;
