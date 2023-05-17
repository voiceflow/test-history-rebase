export interface SAMLProvider {
  id: number;
  issuer: string;
  entryPoint: string;
  certificate: string;
  organizationID: string;
  legacyProviderID: string | null;
}
