import type { AlexaProject } from '@voiceflow/alexa-types';
import type { Nullable } from '@voiceflow/common';
import axios from 'axios';

import { createProjectService, PROJECT_RESOURCE_ENDPOINT } from '@/client/services';
import { ALEXA_SERVICE_ENDPOINT } from '@/config';

const projectAlexaService = {
  ...createProjectService<AlexaProject.Project>(ALEXA_SERVICE_ENDPOINT),

  updateSelectedVendor: (projectID: string, vendorID: Nullable<string>) =>
    axios
      .put<{
        skillID: Nullable<string>;
        vendorID: Nullable<string>;
      }>(`${ALEXA_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/${projectID}/member/selected-vendor`, { vendorID })
      .then((res) => res.data),

  updateVendorSkillID: (projectID: string, vendorID: string, skillID: string) =>
    axios
      .put<void>(
        `${ALEXA_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/${projectID}/member/vendors/${vendorID}/skill-id`,
        { skillID }
      )
      .then((res) => res.data),

  copyProduct: (projectID: string, productID: string) =>
    axios
      .post<AlexaProject.Product>(
        `${ALEXA_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/${projectID}/products/${productID}/copy`
      )
      .then((res) => res.data),

  createProduct: (projectID: string, product: AlexaProject.Product) =>
    axios
      .post<AlexaProject.Product>(
        `${ALEXA_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/${projectID}/products`,
        product
      )
      .then((res) => res.data),

  updateProduct: (projectID: string, productID: string, product: AlexaProject.Product) =>
    axios
      .put<AlexaProject.Product>(
        `${ALEXA_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/${projectID}/products/${productID}`,
        product
      )
      .then((res) => res.data),

  deleteProduct: (projectID: string, productID: string) =>
    axios
      .delete(`${ALEXA_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/${projectID}/products/${productID}`)
      .then((res) => res.data),
};

export default projectAlexaService;
