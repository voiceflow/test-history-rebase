import '@voiceflow/socket-utils';

declare module '@voiceflow/socket-utils' {
  interface AbstractLoguxControl {
    $reply: sinon.SinonSpy;
    $reject: sinon.SinonStub;
  }
}
