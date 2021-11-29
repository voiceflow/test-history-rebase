/* eslint-disable max-classes-per-file */
import { AbstractChannelControl } from '@socket-utils/control/channel';
import { Utils } from '@voiceflow/common';
import { expect } from 'chai';
import sinon from 'sinon';

const MOCK_ACTION_CHANNEL = Utils.protocol.createChannel(['channelID'], ({ channelID }) => `channel/${channelID}`);

class MockChannelControl extends AbstractChannelControl<any, any> {
  channel = MOCK_ACTION_CHANNEL;

  access = () => true;
}

describe('Control | Channel', () => {
  describe('finally()', () => {
    const mockServer = () => ({
      channel: sinon.spy(),
      logger: { error: sinon.spy() },
    });

    it('catches error', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new (class extends MockChannelControl {
        finally = () => {
          throw new Error();
        };
      })(options as any);

      channel.setup();
      await server.channel.args[0][1].finally();

      expect(server.logger.error).to.be.calledWithExactly("error encountered within finally handler of channel 'channel/:channelID'");
    });
  });

  describe('unsubscribe()', () => {
    const mockServer = () => ({
      channel: sinon.spy(),
      logger: { error: sinon.spy() },
    });

    it('catches error', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new (class extends MockChannelControl {
        unsubscribe = () => {
          throw new Error();
        };
      })(options as any);

      channel.setup();
      await server.channel.args[0][1].unsubscribe();

      expect(server.logger.error).to.be.calledWithExactly("error encountered within unsubscribe handler of channel 'channel/:channelID'");
    });
  });
});
