import { AxiosResponse } from "axios";
import { Observable } from "rxjs";

export function observify<T, R extends AxiosResponse<T>>(
  makeRequest: () => Promise<R>,
  controller: AbortController,
): Observable<R> {
  return new Observable(subscriber => {
    makeRequest()
      .then(response => subscriber.next(response))
      .catch(error => subscriber.error(error))
      .finally(() => subscriber.complete());

    return { unsubscribe: () => controller.abort() };
  });
}
