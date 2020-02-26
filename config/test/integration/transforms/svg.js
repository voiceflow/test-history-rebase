/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-var-requires */
const path = require('path');
const babel = require('babel-core');
const reactPreset = require('babel-preset-react');
const escapeFileName = require('jest-svg-transformer/lib/escape-file-name').default;

module.exports = {
  process(src, filename) {
    if (path.extname(filename) !== '.svg') {
      return src;
    }

    return babel.transform(
      `
        import React from 'react'; 
        export default () => (<svg data-file-name="${escapeFileName(filename)}" />);
      `,
      {
        filename,
        presets: [[reactPreset, { flow: false, typescript: true }]],
        retainLines: true,
      }
    ).code;
  },
};
