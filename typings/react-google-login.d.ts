import 'react-google-login';

declare module 'react-google-login' {
  interface GoogleLoginResponse {
    profileObj: { name: string; email: string; googleId: string; imageUrl: string };
    tokenId: string;
  }
}
