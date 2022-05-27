export enum ModelFlag {
  /**
   * specifies a version that should receive normal traffic
   */
  NORMAL = 'n',
  /**
   * specifies a version that should provide feedback
   */
  FEEDBACK = 'F',
  /**
   * specifies a version that is part of an AB test
   */
  AB_TEST = 'ab',
  /**
   * specifies a version that should receive shadow traffic
   */
  SHADOW = 's',
}

export type ModelVersionArguments = [traffic: number, ...flags: ModelFlag[]];

export interface RawModelConfiguration {
  [versionID: string]: ModelVersionArguments;
}

export interface ModelVersionConfiguration {
  id: string;

  /**
   * percent of traffic that should be routed to this version
   */
  traffic: number;
  /**
   * flags that affect how traffic is distributed
   */
  flags: ModelFlag[];
}

export interface ModelConfiguration {
  id: string;

  versions: {
    [versionID: string]: ModelVersionConfiguration;
  };
}
