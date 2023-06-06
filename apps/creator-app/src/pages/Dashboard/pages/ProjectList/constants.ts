export enum SortByTypes {
  LastViewed = 'lastViewed',
  DateCreated = 'dateCreated',
  Alphabetically = 'alphabetically',
}

export interface SortOptionType {
  id: SortByTypes;
  label: string;
  value: SortByTypes;
}

export const SortByOptions: SortOptionType[] = [
  {
    id: SortByTypes.LastViewed,
    label: 'Last viewed',
    value: SortByTypes.LastViewed,
  },
  {
    id: SortByTypes.DateCreated,
    label: 'Date created',
    value: SortByTypes.DateCreated,
  },
  {
    id: SortByTypes.Alphabetically,
    label: 'Alphabetically',
    value: SortByTypes.Alphabetically,
  },
];
