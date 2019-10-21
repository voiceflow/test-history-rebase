// eslint-disable-next-line import/prefer-default-export
export function identifyAppCuesUser(creatorID, user) {
  if (window.Appcues) {
    window.Appcues.identify(creatorID, {
      email: user.email,
      name: user.name,
    });
  }
}
