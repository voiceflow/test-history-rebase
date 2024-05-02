import type { Config } from '@svgr/core';
import { transform } from '@svgr/core';
import { promises } from 'fs';
import type { Plugin } from 'vite';

export enum ExportType {
  URL = 'url',
  COMPONENT = 'component',
}

export interface Options extends Omit<Config, 'jsx' | 'plugins' | 'runtimeConfig'> {
  defaultExport?: ExportType;
}

const compileSvg = async (source: string, id: string, options: Options): Promise<string> =>
  transform(
    source,
    {
      ...options,
      plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
      runtimeConfig: false,
      jsx: {
        babelConfig: {
          plugins: [['@babel/plugin-transform-react-jsx', { useBuiltIns: true }]],
        },
      },
    },
    { filePath: id }
  );

const SVG_REGEX = /\.svg(?:\?(component|url))?$/;

const reactSvgPlugin = ({ defaultExport = ExportType.URL, ...options }: Options = {}): Plugin => {
  const cache = new Map<string, [sourceCodeHash: string, processedCode: string]>();

  return {
    name: '@voiceflow/react-svg',
    async transform(source, id) {
      const matchedSvg = id.match(SVG_REGEX);

      if (!matchedSvg) return undefined;

      const type = matchedSvg[1] ?? defaultExport;

      if (type === ExportType.URL) {
        return source;
      }

      if (type === ExportType.COMPONENT) {
        const idWithoutQuery = id.replace('.svg?component', '.svg');

        const code = await promises.readFile(idWithoutQuery, 'utf-8');

        let result = cache.get(idWithoutQuery);

        if (!result || result[0] !== code) {
          const compiledSvg = await compileSvg(code, idWithoutQuery, options);

          result = [code, compiledSvg];

          cache.set(idWithoutQuery, result);
        }

        return result[1];
      }

      return undefined;
    },
  };
};

export default reactSvgPlugin;
