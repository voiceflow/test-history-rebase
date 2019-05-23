'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const sinon = require('sinon');

const { TTSManager } = require('../../../lib/services');

describe('ttsManager unit tests', () => {
  afterEach(() => sinon.restore());

  it('getSpeech for string', async () => {
    const services = {
      polly: sinon.stub().resolves({ foo: 'thing' }),
    };

    const ttsManager = new TTSManager(services);

    const result = await ttsManager.getSpeech('some text');

    expect(result).to.eql({ foo: 'thing' });
    expect(services.polly.callCount).to.eql(1);
    expect(services.polly.args[0][0]).to.eql({
      OutputFormat: 'mp3',
      Text: '<speak>some text</speak>',
      TextType: 'ssml',
      VoiceId: 'Joanna',
    });
  });
});
