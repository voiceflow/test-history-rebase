window.global = window.global || globalThis;

if (!global.process?.env) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.process = { env: {} };
}
