import { UnauthorizedException } from '@voiceflow/exception';
import type { HashedIDService } from '@voiceflow/nestjs-common';
import type { AuthService } from '@voiceflow/sdk-auth/nestjs';
import { noAuth } from '@voiceflow/sdk-auth/testing';
import type { DeepMocked } from '@voiceflow/test-common/jest';
import type supertest from 'supertest';
import { it } from 'vitest';

export const itShouldBeProtected = (auth: DeepMocked<AuthService>, request: () => supertest.Test) => {
  it('should return a 401 response if not authenticated', () => {
    return request().use(noAuth).expect(401);
  });

  it('should return a 401 response if not authorized', () => {
    auth.assertAuthorized.mockReset().mockRejectedValue(new UnauthorizedException());

    return request().expect(401);
  });
};

export const itShouldDecodeWorkspaceID = (hashedID: DeepMocked<HashedIDService>, request: () => supertest.Test) => {
  it('should return a 404 response with an invalid hashed ID', () => {
    hashedID.decodeWorkspaceID.mockReset().mockImplementation(() => {
      throw new Error();
    });

    return request().expect(404);
  });
};
