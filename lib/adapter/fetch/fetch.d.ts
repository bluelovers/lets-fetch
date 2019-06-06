import _fetch from 'cross-fetch';
import Bluebird from 'bluebird';
import LetsWrap, { ILetsWrapOptions } from '../..';
export interface IFetch {
    request: typeof _fetch;
}
export declare const enum EnumResponseType {
    response = "response",
    json = "json",
    text = "text"
}
export interface ILetsWrapFetchOptions<T = EnumResponseType.response | EnumResponseType.text | EnumResponseType.json | string | 'text' | 'json' | 'response'> extends ILetsWrapOptions<IFetch, RequestInit> {
    /**
     * response type, can be "json", "text" or "response"
     */
    type?: T;
    http?: IFetch;
}
export declare class LetsWrapFetch extends LetsWrap<IFetch, ILetsWrapFetchOptions> {
    constructor(options?: ILetsWrapFetchOptions);
    single<T = Response>(url: string, options?: ILetsWrapFetchOptions<EnumResponseType | string>): Bluebird<T>;
    many<T extends unknown[] = Response[]>(urls: string[], options?: ILetsWrapFetchOptions): Bluebird<T>;
    requestOptions(options: ILetsWrapFetchOptions): Partial<RequestInit>;
    request<T = Response>(url: string, options?: ILetsWrapFetchOptions): Bluebird<T>;
}
export default LetsWrapFetch;
