import { Observable } from "rxjs";

import type { AxiosResponse } from "./RxjsAxios";

export function observify<T, R extends AxiosResponse<T>>(
  makeRequest: () => Promise<R>,
  controller: AbortController,
): Observable<R> {
  return new Observable(subscriber => {
    makeRequest()
      .then(response => subscriber.next(response))
      .catch((error: unknown) => subscriber.error(error))
      .finally(() => subscriber.complete());

    return { unsubscribe: () => controller.abort() };
  });
}
