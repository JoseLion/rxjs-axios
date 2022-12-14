import defaultAxios, { AxiosResponse } from "axios";
import { Observable } from "rxjs";

import { RxjsAxios } from "./lib/RxjsAxios";

export type AxiosObservable<T> = Observable<AxiosResponse<T>>;

/**
 * Re-export all everything from axios, except anything to do with promises or
 * types enhencements
 */
export {
  AxiosError,
  CanceledError,
  type AxiosAdapter,
  type AxiosBasicCredentials,
  type AxiosHeaders,
  type AxiosInterceptorManager,
  type AxiosInterceptorOptions,
  type AxiosProgressEvent,
  type AxiosProxyConfig,
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type AxiosResponse,
  type AxiosResponseHeaders,
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

/**
 * Export rxjs-axios especifics
 */
export {
  RxjsAxios as Axios,
  AxiosRequestTransformer,
  AxiosResponseTransformer,
  RxjsAxiosDefaults as AxiosDefaults,
} from "./lib/RxjsAxios";

export const axios = RxjsAxios.of(defaultAxios);
