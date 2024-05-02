// import Module from 'module';

// const originalRequire = Module.prototype.require;

// const MockedMap = new Map<string, () => object>();

// Module.prototype.require = Object.assign(function (path: string, ...args) {
//   if (MockedMap.has(path)) {
//     return MockedMap.get(path);
//   }

//   return originalRequire.call(this, path, ...args);
// }, originalRequire);

// export const mockRequire = (path: string, module: object) => {
//   MockedMap.set(path, () => module);
// };
