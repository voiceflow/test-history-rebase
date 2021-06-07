import merge from 'webpack-merge';
import { port } from 'webpack-nano/argv';

import serveConfig from '../common/serve';
import buildConfig from './build';

export default merge(buildConfig, serveConfig(port ?? 3001));
