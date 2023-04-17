/* eslint-disable max-classes-per-file */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import dotenv from 'dotenv';
import mockRequire from 'mock-require';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

dotenv.config({ path: './.env.test' });

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(deepEqualInAnyOrder);

mockRequire('nanoevents', { createNanoEvents: () => ({}) });

class Server {}
mockRequire('@logux/server', { Server });

class AsyncRejectionError extends Error {
  constructor(message: string, public code?: number) {
    super(message);
  }
}

class AbstractControl {
  constructor(options: any) {
    Object.assign(this, options);
  }
}
class AbstractLoguxControl extends AbstractControl {}
class AbstractActionControl extends AbstractLoguxControl {
  $reply = sinon.spy(() => sinon.spy());

  $reject = sinon.stub().callsFake((message, code) => {
    throw new AsyncRejectionError(message, code);
  });

  reply = this.$reply;

  reject = this.$reject;
}
class AbstractNoopActionControl extends AbstractActionControl {}
mockRequire('@voiceflow/socket-utils', {
  AsyncRejectionError,
  AbstractControl,
  AbstractLoguxControl,
  AbstractActionControl,
  AbstractNoopActionControl,
});
