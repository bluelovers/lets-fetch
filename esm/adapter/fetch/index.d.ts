import { LetsWrapFetch, ILetsWrapFetchOptions } from './fetch';
import Bluebird from 'bluebird';
import { EnumResponseType } from './fetch';
declare let oo: LetsWrapFetch;
declare const request: <T = Response>(url: string, options?: ILetsWrapFetchOptions<string>) => Bluebird<T>, setRetry: (decider: import("../..").IRetryFn) => LetsWrapFetch, setRetryWait: (callback: import("../..").IRetryWaitFn) => LetsWrapFetch, single: <T = Response>(url: string, options?: ILetsWrapFetchOptions<string>) => Bluebird<T>, many: <T extends unknown[] = Response[]>(urls: string[], options?: ILetsWrapFetchOptions<string>) => Bluebird<T>, setDefault: (options?: import("../..").ILetsWrapOptions<import("./fetch").IFetch, ILetsWrapFetchOptions<string>>) => void;
export { request, single, many, setDefault };
export { setRetry as retry, setRetryWait as retryWait, setRetry, setRetryWait, };
export { LetsWrapFetch, ILetsWrapFetchOptions, EnumResponseType };
export default oo;
