import * as Unleash from 'unleash-client';

export interface InternalContext {
  workspaceID?: number;
  organizationID?: number;
}

export interface Context extends Unleash.Context, InternalContext {}

class Strategy extends Unleash.Strategy {
  protected includes(stringifiedArray: string, value?: number | string): boolean {
    // regexp copied from the default userWithId strategy
    const array = stringifiedArray.split(/\s*,\s*/);

    return !!value && array.includes(String(value));
  }
}

export default Strategy;
