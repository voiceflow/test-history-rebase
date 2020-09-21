import { AlexaProduct, AlexaProjectData, AlexaProjectMemberData } from '@voiceflow/alexa-types';
import { Project } from '@voiceflow/api-sdk';
import axios from 'axios';

import { ALEXA_SERVICE_ENDPOINT } from '@/config';
import { Nullable } from '@/types';

type GeneralProject = Project<AlexaProjectData, AlexaProjectMemberData>;

const RESOURCE_ENDPOINT = 'project';

const projectAlexaServiceC = {
  copyProject: (projectID: string, data?: Partial<GeneralProject>) =>
    axios.post<GeneralProject>(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}/copy`, data).then((res) => res.data),

  updateSelectedVendor: (projectID: string, vendorID: Nullable<string>) =>
    axios
      .put<{ skillID: Nullable<string>; vendorID: Nullable<string> }>(
        `${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}/member/selected-vendor`,
        { vendorID }
      )
      .then((res) => res.data),

  updateVendorSkillID: (projectID: string, vendorID: string, skillID: string) =>
    axios
      .put<void>(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}/member/vendors/${vendorID}/skill-id`, { skillID })
      .then((res) => res.data),

  copyProduct: (projectID: string, productID: string) =>
    axios.post<AlexaProduct>(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}/products/${productID}/copy`).then((res) => res.data),

  createProduct: (projectID: string, product: AlexaProduct) =>
    axios.post<AlexaProduct>(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}/products`, product).then((res) => res.data),

  updateProduct: (projectID: string, productID: string, product: AlexaProduct) =>
    axios.put<AlexaProduct>(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}/products/${productID}`, product).then((res) => res.data),

  deleteProduct: (projectID: string, productID: string) =>
    axios.delete(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}/products/${productID}`).then((res) => res.data),
};

export default projectAlexaServiceC;
