export interface IIntentRequiredEntityAutomaticRepromptPopper {
  entityID: string;
  entityIDs: string[];
  entityName: string;
  onEntityReplace: (props: { oldEntityID: string; entityID: string }) => void;
}
