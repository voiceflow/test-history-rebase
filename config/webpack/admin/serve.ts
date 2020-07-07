import merge from 'webpack-merge';
import { port } from 'webpack-nano/argv';

import paths from '../../paths';
import serveConfig from '../common/serve';
import buildConfig from './build';

export default merge(buildConfig, serveConfig(port ?? 3001, paths.admin.buildDir));
