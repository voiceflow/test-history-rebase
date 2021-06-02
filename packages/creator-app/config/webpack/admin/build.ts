import merge from 'webpack-merge';

import commonBuildConfig from '../common/build';
import commonConfig from './common';

export default merge(commonConfig, commonBuildConfig);
