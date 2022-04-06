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

class Server {}
mockRequire('@logux/server', { Server });

const parseId = (id: string) => ({ userId: id });
mockRequire('@logux/core', { parseId });

class AbstractControl {
  constructor(options: any) {
    Object.assign(this, options);
  }
}
class AbstractLoguxControl extends AbstractControl {}
class AbstractActionControl extends AbstractLoguxControl {
  $reply = sinon.spy(() => sinon.spy());

  reply = this.$reply;
}
class AbstractNoopActionControl extends AbstractActionControl {}
mockRequire('@voiceflow/socket-utils', { AbstractControl, AbstractLoguxControl, AbstractActionControl, AbstractNoopActionControl });
