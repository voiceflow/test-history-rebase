export interface IIntentRequiredEntities {
  onAdd: (entityID: string) => void;
  entityIDs: string[];
  children: React.ReactNode;
}
