export interface SAMLProvider {
  _id: string;
  issuer: string;
  entryPoint: string;
  certificate: string;
  organizationID: string;
}
