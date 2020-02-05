const path = require('path');

require('@babel/register')({
  plugins: [
    [
      'babel-plugin-webpack-alias-7',
      {
        config: path.resolve(__dirname, '../../webpack/common'),
      },
    ],
  ],
});
