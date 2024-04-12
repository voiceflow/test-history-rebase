import { Observable } from 'rxjs';

export const createFrom = <T>(asyncCollection: () => AsyncIterableIterator<T>): Observable<T> =>
  new Observable<T>((subscriber) => {
    (async () => {
      try {
        for await (const value of asyncCollection()) {
          subscriber.next(value);
        }
        subscriber.complete();
      } catch (err) {
        subscriber.error(err);
      }
    })();
  });
