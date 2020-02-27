export class NoValidTemplateError extends Error {
  constructor() {
    super('no valid template exists');
  }
}

export const STATE_KEY = 'workspace';
