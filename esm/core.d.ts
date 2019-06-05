import { Resolvable } from './util';
import Bluebird from 'bluebird';
export interface IRetryFn {
    <T extends Error>(tries: number, err?: T): Resolvable<boolean>;
}
export interface IRetryWaitFn {
    (tries: number): Resolvable<number>;
}
export interface IHttpRequest<O, R> {
    request(url: string, options?: O): PromiseLike<R>;
}
export interface ILetsWrapOptions<O, R> {
    /**
     * wait time in between requests (only for "many")
     * as soon as this is set, requests will be sent in series instead of parallel
     */
    waitTime?: number;
    /**
     * request/response timeout in ms, 0 to disable
     * (!) only available in node.js environments
     */
    timeout?: number;
    requestOptions?: Partial<O>;
    internalRetry?: IRetryFn;
    internalRetryWait?: IRetryWaitFn;
    http?: IHttpRequest<O, R>;
}
export declare class LetsWrap<O = {}, R = Response, H = IHttpRequest<O, R>> {
    protected defaultOptions: ILetsWrapOptions<O, R>;
    $http: H;
    constructor(defaultOptions?: ILetsWrapOptions<O, R>);
    setDefault(options: ILetsWrapOptions<O, R>): void;
    /**
     * Send a request using the underlying fetch API
     */
    request<T = R>(url: string, options?: ILetsWrapOptions<O, R>): Bluebird<T>;
    /**
     * Request a single url
     */
    single<T = R>(url: string, options?: ILetsWrapOptions<O, R>): Bluebird<T>;
    many<T extends unknown[] = R[]>(urls: string[], options?: ILetsWrapOptions<O, R>): Bluebird<T>;
    mergeOptions(options: ILetsWrapOptions<O, R>): ILetsWrapOptions<O, R>;
    /**
     * Set a custom decider function that decides to retry
     * based on the number of tries and the previous error
     */
    setRetry(decider: IRetryFn): this;
    /**
     * Set a custom function that sets how long we should
     * sleep between each failed request
     */
    setRetryWait(callback: IRetryWaitFn): this;
    readonly options: ILetsWrapOptions<O, R>;
    clone<H2 = H, R2 = R, O2 = O>(options?: ILetsWrapOptions<O | O2, R | R2>): LetsWrap<O2, R2, H2>;
}
export default LetsWrap;
