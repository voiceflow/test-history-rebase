import { composeConfigs, Configuration, createPartialConfig, Loader, resolvePath } from '@voiceflow/webpack-config';
import buildConfig from '@voiceflow/webpack-config/build/configs/build';
import serveConfig from '@voiceflow/webpack-config/build/configs/serve';
import { babelLoader, staticSVGLoader, svgLoader } from '@voiceflow/webpack-config/build/loaders';
import _flow from 'lodash/flow';
import { Configuration as WebpackConfiguration } from 'webpack';
import { mergeWithRules } from 'webpack-merge';

import commonConfig from './common';
import opts from './opts';

const options = { ...opts, paths: { ...opts.paths, tsconfig: 'tsconfig.serve.json' } };

const createExtendConfigCreator =
  ({
    loader,
    getInclude,
    mergeConfig,
    loaderOptions,
  }: {
    loader: Loader;
    getInclude: (cfg: Configuration) => string[];
    mergeConfig: Record<string, any>;
    loaderOptions?: Record<string, any>;
  }) =>
  (config: WebpackConfiguration): WebpackConfiguration =>
    mergeWithRules({ module: { rules: { oneOf: mergeConfig } } })(
      config,
      composeConfigs(
        createPartialConfig((cfg) => ({
          module: {
            rules: [
              {
                oneOf: [
                  {
                    ...loader(cfg),
                    include: getInclude(cfg),
                    options: loaderOptions,
                  },
                ],
              },
            ],
          },
        }))()
      )(options)
    );

const extendBabel = createExtendConfigCreator({
  loader: babelLoader,
  getInclude: (cfg) => [
    resolvePath(cfg, cfg.paths.sourceDir),
    resolvePath(cfg, `../ui/${cfg.paths.sourceDir}`),
    resolvePath(cfg, `../realtime-sdk/${cfg.paths.sourceDir}`),
  ],
  mergeConfig: { test: 'match', include: 'replace', options: 'merge' },
  loaderOptions: { presets: ['@voiceflow/babel-preset'] },
});

const extendSvg = createExtendConfigCreator({
  loader: (cfg) => ({
    ...svgLoader(cfg),
    use: ({ resource }: { resource: string }) => [
      {
        loader: 'babel-loader',
        options: { presets: ['@voiceflow/babel-preset'], sourceMaps: false },
      },
      {
        loader: '@svgr/webpack',
        options: { babel: false, svgoConfig: { plugins: [{ cleanupIDs: { prefix: `ID-${resource}` } }] } },
      },
    ],
    type: undefined,
  }),
  getInclude: (cfg) => [resolvePath(cfg, cfg.paths.svgsDir), resolvePath(cfg, `../ui/${cfg.paths.svgsDir}`)],
  mergeConfig: { test: 'match', type: 'match', include: 'replace', use: 'replace' },
});

const extendStaticSvg = createExtendConfigCreator({
  loader: staticSVGLoader,
  getInclude: (cfg) => [resolvePath(cfg, cfg.paths.assetsDir), resolvePath(cfg, `../ui/${cfg.paths.assetsDir}`)],
  mergeConfig: { test: 'match', include: 'replace', type: 'match' },
});

const config = _flow(extendBabel, extendSvg, extendStaticSvg)(composeConfigs(commonConfig, buildConfig(), serveConfig())(options));

export default config;
