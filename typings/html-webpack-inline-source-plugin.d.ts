declare module 'html-webpack-inline-source-plugin' {
  import webpack from 'webpack';

  const InlineSourcePlugin: { new (): webpack.Plugin };

  export default InlineSourcePlugin;
}
