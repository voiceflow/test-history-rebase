/* eslint-disable no-param-reassign */
import BackendUtils from '@voiceflow/backend-utils';
import { ValidationChain } from 'express-validator';

import type { ControllersMap } from './controllers';
import type { AbstractController } from './controllers/utils';
import type { MiddlewaresMap } from './middlewares';

type Validations = Record<string, ValidationChain>;

export const validate = (validations: Validations) => (_target: object, _key: string, descriptor: PropertyDescriptor) => {
  descriptor.value = Object.assign(descriptor.value, { validations });

  return descriptor;
};

export const getInstanceMethodNames = (obj: AbstractController) => {
  const proto = Object.getPrototypeOf(obj);
  if (proto.constructor.name === 'Object') return Object.getOwnPropertyNames(obj);
  return Object.getOwnPropertyNames(proto).filter((name) => name !== 'constructor');
};

export const responseBuilder = new BackendUtils.ResponseBuilder();

export const routeWrapper = (routers: ControllersMap | MiddlewaresMap) => {
  return Object.values(routers).forEach((routes) => {
    getInstanceMethodNames(routes).forEach((route) => {
      if (typeof routes[route] === 'function') {
        const routeHandler = routes[route].bind(routes);
        routeHandler.validations = routes[route].validations;
        routeHandler.callback = routes[route].callback;

        routes[route] = responseBuilder.route(routeHandler);
      }
    });
  });
};
