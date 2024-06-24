import * as Yup from 'yup';

export const SCHEME = Yup.object({
  name: Yup.string().required('Name is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  address: Yup.string().required('Address is required'),
  cardCompleted: Yup.boolean().required(),
});

export interface CardFormValues extends Yup.InferType<typeof SCHEME> {}

export const INITIAL_VALUES: CardFormValues = {
  name: '',
  city: '',
  state: '',
  country: '',
  address: '',
  cardCompleted: false,
};
