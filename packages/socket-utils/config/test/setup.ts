import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import dotenv from 'dotenv';
import sinonChai from 'sinon-chai';

dotenv.config({ path: './.env.test' });

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(deepEqualInAnyOrder);
