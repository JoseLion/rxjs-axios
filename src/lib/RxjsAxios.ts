import axios, {
  AxiosDefaults,
  AxiosError,
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse, Cancel,
  CancelToken,
  CancelTokenSource,
  CancelTokenStatic,
  CreateAxiosDefaults,
  FormSerializerOptions,
  GenericFormData,
  GenericHTMLFormElement,
} from "axios";
import { Observable } from "rxjs";

import { observify } from "./observify";

interface Interceptors {
  request: AxiosInterceptorManager<AxiosRequestConfig>;
  response: AxiosInterceptorManager<AxiosResponse>;
}

interface Cancellable {
  cancelSource: CancelTokenSource;
  cancelToken: CancelToken;
}

export class RxjsAxios {

  private axios: AxiosInstance;

  private CancelToken: CancelTokenStatic;

  private constructor(instance: AxiosInstance) {
    this.axios = instance;
    this.CancelToken = axios.CancelToken;
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

  public get defaults(): AxiosDefaults {
    return this.axios.defaults;
  }

  public get interceptors(): Interceptors {
    return this.axios.interceptors;
  }

  public request<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    config: AxiosRequestConfig<D>,
  ): Observable<R> {
    const { cancelSource, cancelToken } = this.makeCancellable();

    return observify(
      () => this.axios.request<T, R, D>({ ...config, cancelToken }),
      cancelSource,
    );
  }

  public get<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const { cancelSource, cancelToken } = this.makeCancellable();

    return observify(
      () => this.axios.get<T, R, D>(url, { ...config, cancelToken }),
      cancelSource,
    );
  }

  public delete<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const { cancelSource, cancelToken } = this.makeCancellable();

    return observify(
      () => this.axios.delete<T, R, D>(url, { ...config, cancelToken }),
      cancelSource,
    );
  }

  public head<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const { cancelSource, cancelToken } = this.makeCancellable();

    return observify(
      () => this.axios.head<T, R, D>(url, { ...config, cancelToken }),
      cancelSource,
    );
  }

  public options<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const { cancelSource, cancelToken } = this.makeCancellable();

    return observify(
      () => this.axios.options<T, R, D>(url, { ...config, cancelToken }),
      cancelSource,
    );
  }

  public post<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const { cancelSource, cancelToken } = this.makeCancellable();

    return observify(
      () => this.axios.post<T, R, D>(url, data, { ...config, cancelToken }),
      cancelSource,
    );
  }

  public put<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const { cancelSource, cancelToken } = this.makeCancellable();

    return observify(
      () => this.axios.put<T, R, D>(url, data, { ...config, cancelToken }),
      cancelSource,
    );
  }

  public patch<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const { cancelSource, cancelToken } = this.makeCancellable();

    return observify(
      () => this.axios.patch<T, R, D>(url, data, { ...config, cancelToken }),
      cancelSource,
    );
  }

  public postForm<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const { cancelSource, cancelToken } = this.makeCancellable();

    return observify(
      () => this.axios.postForm<T, R, D>(url, data, { ...config, cancelToken }),
      cancelSource,
    );
  }

  public putForm<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const { cancelSource, cancelToken } = this.makeCancellable();

    return observify(
      () => this.axios.putForm<T, R, D>(url, data, { ...config, cancelToken }),
      cancelSource,
    );
  }

  public patchForm<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    const { cancelSource, cancelToken } = this.makeCancellable();

    return observify(
      () => this.axios.patchForm<T, R, D>(url, data, { ...config, cancelToken }),
      cancelSource,
    );
  }

  private makeCancellable(): Cancellable {
    const cancelSource = this.CancelToken.source();
    const cancelToken = cancelSource.token;

    return {
      cancelSource,
      cancelToken,
    };
  }
}
