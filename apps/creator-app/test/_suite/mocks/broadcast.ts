import { vi } from 'vitest';

interface MessageEvent<T = any> {
  data: T;
}

class MockBroadcastChannel<T = any> {
  name: string;

  onmessage: ((event: MessageEvent<T>) => void) | null;

  constructor(name: string) {
    this.name = name;
    this.onmessage = null;
  }

  postMessage(message: T): void {
    if (this.onmessage) {
      const event: MessageEvent<T> = { data: message };
      this.onmessage(event);
    }
  }

  close(): void {
    // no-op
  }

  addEventListener(event: 'message', listener: (event: MessageEvent<T>) => void): void {
    if (event === 'message') {
      this.onmessage = listener;
    }
  }
}

vi.stubGlobal('BroadcastChannel', MockBroadcastChannel);
