/**
 * Created by user on 2019/6/5.
 */
import LetsWrap, { ILetsWrapOptions, IHttpRequest } from '../../index';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
export declare type IHttpRequestAxios<O3 extends AxiosRequestConfig = AxiosRequestConfig, R3 extends AxiosResponse = AxiosResponse, T3 extends AxiosInstance = AxiosInstance> = IHttpRequest<O3, R3, T3>;
export declare class LetsWrapAxios<O4 extends AxiosRequestConfig, R4 extends AxiosResponse, T4 extends AxiosInstance> extends LetsWrap<IHttpRequestAxios<O4, R4, T4>, O4> {
    constructor(options?: ILetsWrapOptions<IHttpRequestAxios<O4, R4, T4>, O4>);
    defaultHttp(options?: ILetsWrapOptions<IHttpRequestAxios<O4, R4, T4>, O4>): IHttpRequest<O4, R4, T4>;
    createAxios(options?: ILetsWrapOptions<IHttpRequestAxios<O4, R4, T4>, O4>): T4;
    requestOption(options: ILetsWrapOptions<IHttpRequestAxios<O4, R4, T4>, O4>, url?: string): Partial<O4>;
}
export declare function isAxios<T4 extends AxiosInstance = AxiosInstance>(axios: any): axios is T4;
export declare function toRequestLike<O3 extends AxiosRequestConfig, R3 extends AxiosResponse, T3 extends AxiosInstance>(axios: T3): IHttpRequest<O3, R3, T3>;
export default LetsWrapAxios;
