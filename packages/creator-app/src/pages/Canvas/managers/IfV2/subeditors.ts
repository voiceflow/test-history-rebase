import NoMatchPathNameForm from './components/NoMatchPathNameForm';

export const EDITORS_BY_PATH = {
  noMatchPath: NoMatchPathNameForm,
};

export type IFV2ManagerEditors = keyof typeof EDITORS_BY_PATH;
