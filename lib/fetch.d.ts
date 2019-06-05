import _fetch from 'cross-fetch';
import Bluebird from 'bluebird';
import LetsWrap, { ILetsWrapOptions } from './core';
export interface IFetch {
    request: typeof _fetch;
}
export declare const enum EnumResponseType {
    response = "response",
    json = "json",
    text = "text"
}
export interface ILetsWrapFetchOptions<T extends EnumResponseType | string = EnumResponseType.response | EnumResponseType.text | EnumResponseType.json | string> extends Omit<ILetsWrapOptions<RequestInit, Response>, 'http' | 'type'> {
    /**
     * response type, can be "json", "text" or "response"
     */
    type?: T;
    http?: IFetch;
}
export declare class LetsWrapFetch extends LetsWrap<RequestInit, Response, IFetch> {
    constructor(options?: ILetsWrapFetchOptions);
    retry: (decider: import("./core").IRetryFn) => this;
    retryWait: (callback: import("./core").IRetryWaitFn) => this;
    single<T = Response>(url: string, options?: ILetsWrapFetchOptions<EnumResponseType | string>): Bluebird<T>;
    many<T extends unknown[] = Response[]>(urls: string[], options?: ILetsWrapFetchOptions): Bluebird<T>;
    request<T = Response>(url: string, options?: ILetsWrapFetchOptions): Bluebird<T>;
}
