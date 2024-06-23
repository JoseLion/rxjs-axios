import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosInterceptorManager,
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type AxiosResponseHeaders,
  type Cancel,
  type CreateAxiosDefaults,
  type FormSerializerOptions,
  type GenericFormData,
  type GenericHTMLFormElement,
  type AxiosResponse as OriginalAxiosResponse,
} from "axios";
import pino from "pino";

import { observify } from "./observify";

import type { Observable } from "rxjs";

export type AxiosResponse<T, D = unknown> = OriginalAxiosResponse<T, D>;

export type AxiosObservable<T> = Observable<AxiosResponse<T>>;

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

interface Interceptors {
  request: AxiosInterceptorManager<AxiosRequestConfig<unknown>>;
  response: AxiosInterceptorManager<AxiosResponse<unknown>>;
}

const logger = pino({ browser: { asObject: false } });

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

  public get defaults(): CreateAxiosDefaults<unknown> {
    return this.axios.defaults;
  }

  public get interceptors(): Interceptors {
    return this.axios.interceptors;
  }

  public request<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    config: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);

    return observify(signal => this.axios.request<T, R, D>({ ...reqConfig, signal }));
  }

  public get<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);

    return observify(signal => this.axios.get<T, R, D>(url, { ...reqConfig, signal }));
  }

  public delete<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);

    return observify(signal => this.axios.delete<T, R, D>(url, { ...reqConfig, signal }));
  }

  public head<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);

    return observify(signal => this.axios.head<T, R, D>(url, { ...reqConfig, signal }));
  }

  public options<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);

    return observify(signal => this.axios.options<T, R, D>(url, { ...reqConfig, signal }));
  }

  public post<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);

    return observify(signal => this.axios.post<T, R, D>(url, data, { ...reqConfig, signal }));
  }

  public put<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);

    return observify(signal => this.axios.put<T, R, D>(url, data, { ...reqConfig, signal }));
  }

  public patch<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);

    return observify(signal => this.axios.patch<T, R, D>(url, data, { ...reqConfig, signal }));
  }

  public postForm<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);

    return observify(signal => this.axios.postForm<T, R, D>(url, data, { ...reqConfig, signal }));
  }

  public putForm<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);

    return observify(signal => this.axios.putForm<T, R, D>(url, data, { ...reqConfig, signal }));
  }

  public patchForm<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const reqConfig = this.validateConfig(config);

    return observify(signal => this.axios.patchForm<T, R, D>(url, data, { ...reqConfig, signal }));
  }

  private validateConfig<D>(config?: AxiosRequestConfig<D>): AxiosRequestConfig<D> | undefined {
    if (config !== undefined) {
      const insteadMsg = "Instead, unsubscribe from the observable to cancel the request.";
      const { cancelToken, signal, ...rest } = config;

      if (cancelToken !== undefined) {
        logger.warn(`Use of "cancelToken" is deprecated by Axios and has no effect on rxjs-axios. ${insteadMsg}`);
      }

      if (signal !== undefined) {
        logger.warn(`Use of "signal" has no effect on rxjs-axios. ${insteadMsg}`);
      }

      return rest;
    }

    return config;
  }
}
