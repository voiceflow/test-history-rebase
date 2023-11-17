import { ModuleMetadata } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { HashedIDModule, HashedIDService, InternalExceptionFilter } from '@voiceflow/nestjs-common';
import { ENVIRONMENT_VARIABLES, EnvModule } from '@voiceflow/nestjs-env';
import { AuthGuard, AuthModule, AuthService } from '@voiceflow/sdk-auth/nestjs';
import { createMock, DeepMocked } from '@voiceflow/test-common/vitest';

import { EnvironmentVariables } from '@/app.env';

export const mockEncoding = (hash: DeepMocked<HashedIDService>) => {
  hash.encodeID.mockImplementation((rawID) => `hash(${rawID})`);
  hash.encodeWorkspaceID.mockImplementation((rawID) => `ws_hash(${rawID})`);
  hash.decodeID.mockImplementation(() => {
    throw new Error('hashed ID decoding must be explicitly setup for tests to pass');
  });
  hash.decodeWorkspaceID.mockImplementation(() => {
    throw new Error('hashed workspace ID decoding must be explicitly setup for tests to pass');
  });
};

export const createControllerTestModule = (
  metadata: ModuleMetadata,
  {
    authService = createMock<AuthService>(),
    hashedIDService = createMock<HashedIDService>(),
  }: {
    authService?: DeepMocked<AuthService>;
    hashedIDService?: DeepMocked<HashedIDService>;
  } = {}
) => {
  return Test.createTestingModule({
    ...metadata,
    imports: [EnvModule, AuthModule, HashedIDModule, ...(metadata.imports ?? [])],
    providers: [
      {
        provide: APP_GUARD,
        useClass: AuthGuard,
      },
      {
        provide: APP_FILTER,
        useClass: InternalExceptionFilter,
      },
      ...(metadata.providers ?? []),
    ],
  })
    .overrideProvider(ENVIRONMENT_VARIABLES)
    .useValue(createMock<EnvironmentVariables>())
    .overrideProvider(AuthService)
    .useValue(authService)
    .overrideProvider(HashedIDService)
    .useValue(hashedIDService);
};
