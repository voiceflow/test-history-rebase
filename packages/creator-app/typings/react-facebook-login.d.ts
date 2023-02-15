declare module 'react-facebook-login/dist/facebook-login-render-props' {
  import React from 'react';
  import { ReactFacebookLoginProps } from 'react-facebook-login';

  const FacebookLogin: React.FC<ReactFacebookLoginProps & { render: (renderProps: { onClick: () => void }) => void }>;

  export default FacebookLogin;
}
