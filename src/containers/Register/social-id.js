/* eslint-disable no-secrets/no-secrets */
exports.googleClient =
  process.env.NODE_ENV === 'development'
    ? '60536514156-l794manf17ebpnu30foh7a7nkomp0p9i.apps.googleusercontent.com'
    : '60536514156-b0rhdgh006vmo07p1as9s236jmqurugj.apps.googleusercontent.com';
exports.fbId = '382723665627980';
