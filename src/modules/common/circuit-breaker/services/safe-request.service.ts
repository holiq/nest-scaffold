import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { urlJoin } from 'url-join-ts';
import { CBOptions, CircuitBreaker } from '../circuit-breaker.provider';

@Injectable()
export class SafeRequestService {
  constructor(private readonly circuitBreaker: CircuitBreaker) {}

  private getResponse() {
    return {
      getErrorData: (err) => err.response?.data,
      getResponseData: (response) => response.data,
      getErrorStatus: (err) => err.response?.status,
    };
  }

  async get<T = unknown, D = unknown, R = AxiosResponse<T, unknown>>(
    url: string,
    config?: AxiosRequestConfig<D> & {
      cbOptions?: Omit<
        CBOptions,
        | 'method'
        | 'path'
        | 'getErrorData'
        | 'getResponseData'
        | 'getErrorStatus'
      >;
    },
  ): Promise<R> {
    const { cbOptions = {}, ...restConfig } = config || {};
    return this.circuitBreaker.fire<R>(
      axios.get,
      {
        ...this.getResponse(),
        ...cbOptions,
        path: config?.baseURL ? urlJoin(config?.baseURL, url) : url,
        method: 'get',
      },
      url,
      restConfig,
    );
  }

  async post<T = unknown, D = unknown, R = AxiosResponse<T, unknown>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D> & {
      cbOptions?: Omit<
        CBOptions,
        | 'method'
        | 'path'
        | 'getErrorData'
        | 'getResponseData'
        | 'getErrorStatus'
      >;
    },
  ): Promise<R> {
    const { cbOptions = {}, ...restConfig } = config || {};

    return this.circuitBreaker.fire<R>(
      axios.post,
      {
        ...this.getResponse(),
        ...cbOptions,
        path: config?.baseURL ? urlJoin(config?.baseURL, url) : url,
        method: 'post',
      },
      url,
      data,
      restConfig,
    );
  }

  async patch<T = unknown, D = unknown, R = AxiosResponse<T, unknown>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D> & {
      cbOptions?: Omit<
        CBOptions,
        | 'method'
        | 'path'
        | 'getErrorData'
        | 'getResponseData'
        | 'getErrorStatus'
      >;
    },
  ): Promise<R> {
    const { cbOptions = {}, ...restConfig } = config || {};

    return this.circuitBreaker.fire<R>(
      axios.patch,
      {
        ...this.getResponse(),
        ...cbOptions,
        path: config?.baseURL ? urlJoin(config?.baseURL, url) : url,
        method: 'patch',
      },
      url,
      data,
      restConfig,
    );
  }

  async put<T = unknown, D = unknown, R = AxiosResponse<T, unknown>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D> & {
      cbOptions?: Omit<
        CBOptions,
        | 'method'
        | 'path'
        | 'getErrorData'
        | 'getResponseData'
        | 'getErrorStatus'
      >;
    },
  ): Promise<R> {
    const { cbOptions = {}, ...restConfig } = config || {};

    return this.circuitBreaker.fire<R>(
      axios.put,
      {
        ...this.getResponse(),
        ...cbOptions,
        path: config?.baseURL ? urlJoin(config?.baseURL, url) : url,
        method: 'put',
      },
      url,
      data,
      restConfig,
    );
  }

  async delete<T = unknown, D = unknown, R = AxiosResponse<T, unknown>>(
    url: string,
    config?: AxiosRequestConfig<D> & {
      cbOptions?: Omit<
        CBOptions,
        | 'method'
        | 'path'
        | 'getErrorData'
        | 'getResponseData'
        | 'getErrorStatus'
      >;
    },
  ): Promise<R> {
    const { cbOptions = {}, ...restConfig } = config || {};

    return this.circuitBreaker.fire<R>(
      axios.delete,
      {
        ...this.getResponse(),
        ...cbOptions,
        path: config?.baseURL ? urlJoin(config?.baseURL, url) : url,
        method: 'delete',
      },
      url,
      restConfig,
    );
  }
}
