import { RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA, SSE_METADATA } from '@nestjs/common/constants.js';

export const PostSSE = (path?: string): MethodDecorator => {
  return (_target, _key, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, RequestMethod.POST, descriptor.value);
    Reflect.defineMetadata(SSE_METADATA, true, descriptor.value);
    return descriptor;
  };
};
