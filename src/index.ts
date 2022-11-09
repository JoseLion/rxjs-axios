import defaultAxios, { AxiosResponse } from "axios";
import { Observable } from "rxjs";

import { RxjsAxios } from "./lib/RxjsAxios";

export type AxiosObservable<T> = Observable<AxiosResponse<T>>;

/**
 * Re-export all everithing from axios, except anything to do with promises.
 */
export {
  AxiosError,
  CanceledError,
  type AxiosAdapter,
  type AxiosBasicCredentials,
  type AxiosDefaults,
  type AxiosHeaders,
  type AxiosInterceptorManager,
  type AxiosInterceptorOptions,
  type AxiosProgressEvent,
  type AxiosProxyConfig,
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type AxiosRequestTransformer,
  type AxiosResponse,
  type AxiosResponseHeaders,
  type AxiosResponseTransformer,
  type CreateAxiosDefaults,
  type CustomParamsSerializer,
  type FormDataVisitorHelpers,
  type FormSerializerOptions,
  type GenericAbortSignal,
  type GenericFormData,
  type GenericHTMLFormElement,
  type HeadersDefaults,
  type HttpStatusCode,
  type Method,
  type ParamEncoder,
  type ParamsSerializerOptions,
  type RawAxiosRequestHeaders,
  type RawAxiosResponseHeaders,
  type ResponseType,
  type SerializerOptions,
  type SerializerVisitor,
  type TransitionalOptions,
  type responseEncoding,
} from "axios";
export { RxjsAxios as Axios } from "./lib/RxjsAxios";

export const axios = RxjsAxios.of(defaultAxios);
