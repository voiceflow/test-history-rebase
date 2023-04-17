export interface MessagingServiceType {
  id: string;
  name: string;
  numbers?: PhoneNumberType[];
}

export interface PhoneNumberType {
  id: string;
  phoneNumber: string;
  selected: boolean;
}
