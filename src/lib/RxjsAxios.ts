import axios, {
  AxiosDefaults,
  AxiosError,
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse, AxiosResponseHeaders, Cancel,
  CreateAxiosDefaults,
  FormSerializerOptions,
  GenericFormData,
  GenericHTMLFormElement,
} from "axios";
import { Observable } from "rxjs";

import { observify } from "./observify";

export type AxiosRequestTransformer<T> = (
  this: AxiosRequestConfig<T>,
  data: T,
  headers: AxiosRequestHeaders
) => T;

export type AxiosResponseTransformer<T> = (
  this: AxiosRequestConfig<T>,
  data: T,
  headers: AxiosResponseHeaders,
  status?: number
) => T;

export interface RxjsAxiosDefaults<T = unknown> extends AxiosDefaults<T> {
  transformRequest?: AxiosRequestTransformer<T> | AxiosRequestTransformer<T>[];
  transformResponse?: AxiosResponseTransformer<T> | AxiosResponseTransformer<T>[];
}

interface Interceptors {
  request: AxiosInterceptorManager<AxiosRequestConfig<unknown>>;
  response: AxiosInterceptorManager<AxiosResponse<unknown>>;
}

interface Abortable {
  controller: AbortController;
  signal: AbortSignal;
}

export class RxjsAxios {

  private axios: AxiosInstance;

  private constructor(instance: AxiosInstance) {
    this.axios = instance;
  }

  public static of(instance: AxiosInstance): RxjsAxios {
    return new RxjsAxios(instance);
  }

  public static create<D>(config?: CreateAxiosDefaults<D>): RxjsAxios {
    const instance = axios.create(config);

    return new RxjsAxios(instance);
  }

  public static isAxiosError<T, D>(error: unknown): error is AxiosError<T, D> {
    return axios.isAxiosError<T, D>(error);
  }

  public static isCancel(error: unknown): error is Cancel {
    return axios.isCancel(error);
  }

  public static toFormData(
    sourceObj: object,
    targetFormData?: GenericFormData,
    options?: FormSerializerOptions,
  ): GenericFormData {
    return axios.toFormData(sourceObj, targetFormData, options);
  }

  public static formToJSON(form: GenericFormData | GenericHTMLFormElement): object {
    return axios.formToJSON(form);
  }

  public get defaults(): RxjsAxiosDefaults {
    return this.axios.defaults;
  }

  public get interceptors(): Interceptors {
    return this.axios.interceptors;
  }

  public request<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    config: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);
    const { controller, signal } = this.makeCancellable();

    return observify(
      () => this.axios.request<T, R, D>({ ...reqConfig, signal }),
      controller,
    );
  }

  public get<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);
    const { controller, signal } = this.makeCancellable();

    return observify(
      () => this.axios.get<T, R, D>(url, { ...reqConfig, signal }),
      controller,
    );
  }

  public delete<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);
    const { controller, signal } = this.makeCancellable();

    return observify(
      () => this.axios.delete<T, R, D>(url, { ...reqConfig, signal }),
      controller,
    );
  }

  public head<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);
    const { controller, signal } = this.makeCancellable();

    return observify(
      () => this.axios.head<T, R, D>(url, { ...reqConfig, signal }),
      controller,
    );
  }

  public options<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);
    const { controller, signal } = this.makeCancellable();

    return observify(
      () => this.axios.options<T, R, D>(url, { ...reqConfig, signal }),
      controller,
    );
  }

  public post<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);
    const { controller, signal } = this.makeCancellable();

    return observify(
      () => this.axios.post<T, R, D>(url, data, { ...reqConfig, signal }),
      controller,
    );
  }

  public put<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);
    const { controller, signal } = this.makeCancellable();

    return observify(
      () => this.axios.put<T, R, D>(url, data, { ...reqConfig, signal }),
      controller,
    );
  }

  public patch<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);
    const { controller, signal } = this.makeCancellable();

    return observify(
      () => this.axios.patch<T, R, D>(url, data, { ...reqConfig, signal }),
      controller,
    );
  }

  public postForm<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);
    const { controller, signal } = this.makeCancellable();

    return observify(
      () => this.axios.postForm<T, R, D>(url, data, { ...reqConfig, signal }),
      controller,
    );
  }

  public putForm<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);
    const { controller, signal } = this.makeCancellable();

    return observify(
      () => this.axios.putForm<T, R, D>(url, data, { ...reqConfig, signal }),
      controller,
    );
  }

  public patchForm<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);
    const { controller, signal } = this.makeCancellable();

    return observify(
      () => this.axios.patchForm<T, R, D>(url, data, { ...reqConfig, signal }),
      controller,
    );
  }

  private validateConfig<D>(config?: AxiosRequestConfig<D>): AxiosRequestConfig<D> | undefined {
    if (config !== undefined) {
      const insteadMsg = "Instead, unsubscribe from the observable to cancel the request.";
      const { cancelToken, signal, ...rest } = config;

      if (cancelToken !== undefined) {
        console.warn(`Use of "cancelToken" is deprecated by Axios and has no effect on rxjs-axios. ${insteadMsg}`);
      }

      if (signal !== undefined) {
        console.warn(`Use of "signal" has no effect on rxjs-axios. ${insteadMsg}`);
      }

      return rest;
    }

    return config;
  }

  private makeCancellable(): Abortable {
    const controller = new AbortController();
    const signal = controller.signal;

    return {
      controller,
      signal,
    };
  }
}
