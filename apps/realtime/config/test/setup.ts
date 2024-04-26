/// <reference types="vitest/globals" />

/* eslint-disable max-classes-per-file */
import dotenv from 'dotenv';
import { enablePatches } from 'immer';

enablePatches();

dotenv.config({ path: './.env.test' });

vi.mock('@logux/core', () => ({ parseId: (id: string) => ({ userId: id }) }));

class AbstractControl {
  constructor(options: any) {
    Object.assign(this, options);
  }
}

class AsyncRejectionError extends Error {
  constructor(
    message: string,
    public code?: number
  ) {
    super(message);
  }
}

class AbstractLoguxControl extends AbstractControl {}

class AbstractActionControl extends AbstractLoguxControl {
  $reply = vi.fn(() => vi.fn());

  $reject = vi.fn().mockImplementation((message, code) => {
    throw new AsyncRejectionError(message, code);
  });

  reply = this.$reply;

  reject = this.$reject;
}
class AbstractNoopActionControl extends AbstractActionControl {}

vi.mock('@voiceflow/socket-utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@voiceflow/socket-utils')>();

  return {
    ...actual,
    AbstractControl,
    AsyncRejectionError,
    AbstractLoguxControl,
    AbstractActionControl,
    AbstractNoopActionControl,
  };
});

vi.mock('@voiceflow/common', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@voiceflow/common')>();

  return {
    ...actual,
    Utils: {
      ...actual.Utils,
      id: {
        ...actual.Utils.id,
        cuid: Object.assign(vi.fn(actual.Utils.id.cuid), {
          slug: vi.fn(actual.Utils.id.cuid.slug),
        }),
      },
    },
  };
});
