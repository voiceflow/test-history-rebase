/* eslint-disable import/no-unresolved, global-require */
require('ts-node/register/transpile-only');

const path = require('path');
const { tsConfigPathsPlugin, svgLoader } = require('../../../config/webpack/common/fragments');

const svgPath = path.resolve(__dirname, '../../../src/svgs');

module.exports = {
  stories: ['../../../src/**/*.story.mdx'],
  addons: ['@storybook/addon-links', {
      name: '@storybook/addon-essentials',
    options: {
        docs: {
          configureJSX: true,
          babelOptions: {},
          sourceLoaderOptions: null,
        }
      },
    }
  ],

  webpackFinal: (config, {babelOptions}) => {
    config.resolve.plugins = [tsConfigPathsPlugin];
    config.resolve.modules = ['node_modules', 'packages/storybook/node_modules'];
    config.resolve.alias.brace = path.resolve(__dirname, '../../../node_modules/brace');

    const svgRule = config.module.rules.find(rule => rule.test.test('.svg'));
    svgRule.exclude = svgPath;

    config.module.rules.push({
      ...svgLoader(babelOptions),
      include: svgPath,
    });

    return config
  },
};
