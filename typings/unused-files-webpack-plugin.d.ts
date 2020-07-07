declare module 'unused-files-webpack-plugin' {
  import webpack from 'webpack';

  export interface Options {
    patterns?: string[];
    failOnUnused: boolean;
    globOptions?: {
      ignore?: string | string[];
      cwd?: string;
    };
  }

  export class UnusedFilesWebpackPlugin extends webpack.Plugin {
    constructor(options: Options);
  }
}
