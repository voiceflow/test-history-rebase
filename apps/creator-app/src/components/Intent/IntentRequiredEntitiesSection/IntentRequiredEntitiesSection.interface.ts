export interface IIntentRequiredEntities {
  onAdd: (entityID: string) => void;
  children: React.ReactNode;
  entityIDs: string[];
}
