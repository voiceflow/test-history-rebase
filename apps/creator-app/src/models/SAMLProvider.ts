export interface SAMLProvider {
  _id: string;
  entryPoint: string;
  issuer: string;
  certificate: string;
  organizationID: string;
}
