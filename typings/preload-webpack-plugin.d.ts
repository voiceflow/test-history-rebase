declare module 'preload-webpack-plugin' {
  import webpack from 'webpack';

  type Options = Partial<{
    rel: 'preload';
    include: string;
    exclude: string;
    as: string | ((entry: string) => string);
    fileBlacklist: RegExp[];
  }>;

  const PreloadWebpackPlugin: { new (options?: Options): webpack.Plugin };

  export default PreloadWebpackPlugin;
}
