import * as Yup from 'yup';

export const SCHEME = Yup.object({
  name: Yup.string().required('Name is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  address: Yup.string().required('Address is required'),
  cardCompleted: Yup.boolean(),
  cardAuthorization: Yup.object({
    additionalInformation: Yup.mixed().optional(),
    token: Yup.string(),
    vaultToken: Yup.string(),
  }).optional(),
});

export interface Values extends Yup.InferType<typeof SCHEME> {}

export const INITIAL_VALUES: Values = {
  name: '',
  city: '',
  state: '',
  country: '',
  address: '',
  cardCompleted: false,
  cardAuthorization: undefined,
};
