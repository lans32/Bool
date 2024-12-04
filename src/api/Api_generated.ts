/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AskCompact {
  /** ID */
  id?: number;
  /** Status */
  status?: "dr" | "del" | "f" | "c" | "r";
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Formed at
   * @format date-time
   */
  formed_at?: string | null;
  /**
   * Completed at
   * @format date-time
   */
  completed_at?: string | null;
  /** Creator */
  creator: number;
  /** Moderator */
  moderator?: number | null;
  /** First operand */
  first_operand?: boolean | null;
}

export interface OperationCompact {
  /** ID */
  id?: number;
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /**
   * Operator name
   * @minLength 1
   */
  operator_name: string;
  /**
   * Photo
   * @format uri
   * @maxLength 200
   */
  photo?: string | null;
}

export interface AskOperation {
  /** ID */
  id?: number;
  /** Ask */
  ask: number;
  operation?: OperationCompact;
  /** Second operand */
  second_operand?: boolean | null;
}

export interface User {
  /**
   * Email адрес
   * @format email
   * @minLength 1
   * @maxLength 254
   */
  email: string;
  /**
   * Пароль
   * @minLength 1
   * @maxLength 128
   */
  password: string;
  /**
   * Is staff
   * @default false
   */
  is_staff?: boolean;
  /**
   * Is superuser
   * @default false
   */
  is_superuser?: boolean;
}

export interface Operation {
  /** ID */
  id?: number;
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /**
   * Operator name
   * @minLength 1
   */
  operator_name: string;
  /**
   * Description
   * @minLength 1
   */
  description?: string | null;
  /**
   * Photo
   * @format uri
   * @maxLength 200
   */
  photo?: string | null;
  /** Value 0 */
  value_0?: boolean | null;
  /** Value A */
  value_A?: boolean | null;
  /** Value B */
  value_B?: boolean | null;
  /** Value AB */
  value_AB?: boolean | null;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://127.0.0.1:8000/api" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://127.0.0.1:8000/api
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  asks = {
    /**
     * No description
     *
     * @tags asks
     * @name AsksList
     * @request GET:/asks/
     * @secure
     */
    asksList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/asks/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asks
     * @name AsksUpdate
     * @request PUT:/asks/
     * @secure
     */
    asksUpdate: (data: AskCompact, params: RequestParams = {}) =>
      this.request<AskCompact, any>({
        path: `/asks/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags asks
     * @name AsksOperationsUpdate
     * @request PUT:/asks/{ask_id}/operations/{operation_id}/
     * @secure
     */
    asksOperationsUpdate: (askId: string, operationId: string, data: AskOperation, params: RequestParams = {}) =>
      this.request<AskOperation, any>({
        path: `/asks/${askId}/operations/${operationId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags asks
     * @name AsksOperationsDelete
     * @request DELETE:/asks/{ask_id}/operations/{operation_id}/
     * @secure
     */
    asksOperationsDelete: (askId: string, operationId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/asks/${askId}/operations/${operationId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asks
     * @name AsksRead
     * @request GET:/asks/{id}/
     * @secure
     */
    asksRead: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/asks/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asks
     * @name AsksUpdate2
     * @request PUT:/asks/{id}/
     * @originalName asksUpdate
     * @duplicate
     * @secure
     */
    asksUpdate2: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/asks/${id}/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asks
     * @name AsksDelete
     * @request DELETE:/asks/{id}/
     * @secure
     */
    asksDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/asks/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asks
     * @name AsksCompleteList
     * @request GET:/asks/{id}/complete/
     * @secure
     */
    asksCompleteList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/asks/${id}/complete/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asks
     * @name AsksCompleteUpdate
     * @request PUT:/asks/{id}/complete/
     * @secure
     */
    asksCompleteUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/asks/${id}/complete/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asks
     * @name AsksCompleteDelete
     * @request DELETE:/asks/{id}/complete/
     * @secure
     */
    asksCompleteDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/asks/${id}/complete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asks
     * @name AsksEditList
     * @request GET:/asks/{id}/edit/
     * @secure
     */
    asksEditList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/asks/${id}/edit/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asks
     * @name AsksEditUpdate
     * @request PUT:/asks/{id}/edit/
     * @secure
     */
    asksEditUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/asks/${id}/edit/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asks
     * @name AsksEditDelete
     * @request DELETE:/asks/{id}/edit/
     * @secure
     */
    asksEditDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/asks/${id}/edit/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asks
     * @name AsksFormList
     * @request GET:/asks/{id}/form/
     * @secure
     */
    asksFormList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/asks/${id}/form/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asks
     * @name AsksFormUpdate
     * @request PUT:/asks/{id}/form/
     * @secure
     */
    asksFormUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/asks/${id}/form/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asks
     * @name AsksFormDelete
     * @request DELETE:/asks/{id}/form/
     * @secure
     */
    asksFormDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/asks/${id}/form/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  login = {
    /**
     * No description
     *
     * @tags login
     * @name LoginCreate
     * @request POST:/login/
     * @secure
     */
    loginCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/login/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  operations = {
    /**
     * No description
     *
     * @tags operations
     * @name OperationsList
     * @request GET:/operations/
     * @secure
     */
    operationsList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/operations/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags operations
     * @name OperationsCreate
     * @request POST:/operations/
     * @secure
     */
    operationsCreate: (data: Operation, params: RequestParams = {}) =>
      this.request<Operation, any>({
        path: `/operations/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags operations
     * @name OperationsRead
     * @request GET:/operations/{id}/
     * @secure
     */
    operationsRead: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/operations/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags operations
     * @name OperationsCreate2
     * @request POST:/operations/{id}/
     * @originalName operationsCreate
     * @duplicate
     * @secure
     */
    operationsCreate2: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/operations/${id}/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags operations
     * @name OperationsUpdate
     * @request PUT:/operations/{id}/
     * @secure
     */
    operationsUpdate: (id: string, data: Operation, params: RequestParams = {}) =>
      this.request<Operation, any>({
        path: `/operations/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags operations
     * @name OperationsDelete
     * @request DELETE:/operations/{id}/
     * @secure
     */
    operationsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/operations/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags operations
     * @name OperationsDraftCreate
     * @request POST:/operations/{id}/draft/
     * @secure
     */
    operationsDraftCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/operations/${id}/draft/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags operations
     * @name OperationsImageList
     * @request GET:/operations/{id}/image/
     * @secure
     */
    operationsImageList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/operations/${id}/image/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags operations
     * @name OperationsImageCreate
     * @request POST:/operations/{id}/image/
     * @secure
     */
    operationsImageCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/operations/${id}/image/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags operations
     * @name OperationsImageUpdate
     * @request PUT:/operations/{id}/image/
     * @secure
     */
    operationsImageUpdate: (id: string, data: Operation, params: RequestParams = {}) =>
      this.request<Operation, any>({
        path: `/operations/${id}/image/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags operations
     * @name OperationsImageDelete
     * @request DELETE:/operations/{id}/image/
     * @secure
     */
    operationsImageDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/operations/${id}/image/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersAuthCreate
     * @request POST:/users/auth/
     * @secure
     */
    usersAuthCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/auth/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersCheckList
     * @request GET:/users/check/
     * @secure
     */
    usersCheckList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/check/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersProfile
     * @request PUT:/users/profile/
     * @secure
     */
    usersProfile: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/profile/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
