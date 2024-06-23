import { Observable } from "rxjs";

import type { AxiosResponse } from "./RxjsAxios";

type RequestFn<R> = (signal: AbortSignal) => Promise<R>;

export function observify<T, R extends AxiosResponse<T>>(makeRequest: RequestFn<R>): Observable<R> {
  return new Observable(subscriber => {
    const controller = new AbortController();

    makeRequest(controller.signal)
      .then(response => subscriber.next(response))
      .catch((error: unknown) => subscriber.error(error))
      .finally(() => subscriber.complete());

    return () => controller.abort();
  });
}
