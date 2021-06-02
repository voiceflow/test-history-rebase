declare module 'filemanager-webpack-plugin' {
  // eslint-disable-next-line import/no-extraneous-dependencies
  import webpack from 'webpack';

  export interface CopyEvent {
    source: string;
    destination: string;
  }

  export interface MoveEvent {
    source: string;
    destination: string;
  }

  export interface DeleteEvent {
    source: string;
    options?: {
      force: boolean;
    };
  }

  export interface ArchiveEvent {
    source: string;
    destination: string;
    format?: 'zip' | 'tar ';
  }

  export interface Events {
    copy?: CopyEvent[];
    move?: MoveEvent[];
    delete?: (string | DeleteEvent)[];
    mkdir?: string[];
    archive?: [];
  }

  export interface Options {
    runTasksInSeries?: boolean;
    context?: string;
    events?: {
      onStart?: Events | Events[];
      onEnd?: Events | Events[];
    };
  }

  const FilemanagerWebpackPlugin: {
    new (options: Options): webpack.WebpackPluginInstance;
  };

  export default FilemanagerWebpackPlugin;
}
