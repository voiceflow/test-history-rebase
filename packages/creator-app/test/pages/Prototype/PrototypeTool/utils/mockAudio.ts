/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore
class Audio {
  play() {
    return Promise.resolve();
  }

  pause() {}
}

global.Audio = Audio;
