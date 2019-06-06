/**
 * Created by user on 2019/6/5.
 */
import LetsWrap, { ILetsWrapOptions, IHttpRequest } from '../../index';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse as _AxiosResponse } from 'axios';
export declare type IHttpRequestAxios<O3 extends AxiosRequestConfig = AxiosRequestConfig, R3 extends AxiosResponse = AxiosResponse, T3 extends AxiosInstance = AxiosInstance> = IHttpRequest<O3, R3, T3>;
export declare type IHttpRequestAxiosOptions<O3 extends AxiosRequestConfig = AxiosRequestConfig, R3 extends AxiosResponse = AxiosResponse, T3 extends AxiosInstance = AxiosInstance> = ILetsWrapOptions<IHttpRequestAxios<O3, R3, T3>, O3>;
export interface IAxiosResponseClientRequest extends Record<symbol | string, any> {
    res?: {
        responseUrl?: string;
        redirects?: string[];
        headers?: HeadersInit;
        rawHeaders?: string[];
    };
    path?: string;
    method?: string;
    finished?: boolean;
}
export interface AxiosResponse<T = any> extends Omit<_AxiosResponse<T>, 'request' | 'headers'> {
    headers: HeadersInit;
    request?: IAxiosResponseClientRequest;
}
export { AxiosResponse as IAxiosResponse };
export declare class LetsWrapAxios<O4 extends AxiosRequestConfig, R4 extends AxiosResponse, T4 extends AxiosInstance> extends LetsWrap<IHttpRequestAxios<O4, R4, T4>, O4> {
    constructor(options?: IHttpRequestAxiosOptions<O4, R4, T4>);
    defaultHttp(options?: IHttpRequestAxiosOptions<O4, R4, T4>): IHttpRequest<O4, R4, T4>;
    createAxios(options?: IHttpRequestAxiosOptions<O4, R4, T4>): T4;
    requestOptions(options: IHttpRequestAxiosOptions<O4, R4, T4>, url?: string): Partial<O4>;
}
export declare function isAxios<T4 extends AxiosInstance = AxiosInstance>(axios: any): axios is T4;
export declare function toRequestLike<O3 extends AxiosRequestConfig, R3 extends AxiosResponse, T3 extends AxiosInstance>(axios: T3): IHttpRequest<O3, R3, T3>;
export default LetsWrapAxios;
