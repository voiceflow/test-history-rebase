import Prism from 'prismjs';

import { variables } from './languages';

export { VariablesProperty as PrismVariablesProperty } from './languages';

export enum PrismLanguage {
  VARIABLES = 'VFVariables',
}

Prism.languages[PrismLanguage.VARIABLES] = variables;

export default Prism;
