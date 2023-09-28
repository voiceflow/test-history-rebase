export const BroadcastOnly =
  () =>
  <Payload extends { context: { broadcastOnly?: boolean } }>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(payload: Payload, ...args: any[]) => Promise<void>>
  ) => {
    const originalMethod = descriptor.value!;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = function (payload, ...args: any[]) {
      if (payload.context.broadcastOnly) {
        return Promise.resolve();
      }

      return originalMethod.apply(this, [payload, ...args]);
    };

    return descriptor;
  };
