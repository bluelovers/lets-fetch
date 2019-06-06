import { Resolvable } from './util';
import Bluebird from 'bluebird';
export declare const SymbolRequest: unique symbol;
export declare const SymbolError: unique symbol;
export interface IHttpRequest<O = unknown, R = unknown, F = unknown> {
    request?(url: string, options?: O): PromiseLike<R>;
    [SymbolRequest]?: F;
}
export interface ILetsWrapOptionsCore<H extends IHttpRequest> {
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
    requestOptions?: Partial<IUnpackHttpRequestOptions<H>>;
    internalRetry?: IRetryFn;
    internalRetryWait?: IRetryWaitFn;
    $http?: H;
}
export declare class LetsWrap<H extends IHttpRequest<any, any, any>, O = Record<string, unknown>> {
    protected defaultOptions: ILetsWrapOptions<H, O>;
    $http: H;
    static toRequestLike<O3, R3, T3>(request: any, orig?: T3): IHttpRequest<O3, R3, T3>;
    constructor(defaultOptions?: ILetsWrapOptions<H, O>);
    defaultHttp(options?: ILetsWrapOptions<H, O>): H;
    setDefault(options?: ILetsWrapOptions<H, O>): void;
    /**
     * Send a request using the underlying fetch API
     */
    request<T = IUnpackReturnTypeHttpRequest<H>>(url: string, options?: ILetsWrapOptions<H, O>): Bluebird<T>;
    /**
     * Request a single url
     */
    single<T = IUnpackReturnTypeHttpRequest<H>>(url: string, options?: ILetsWrapOptions<H, O>): Bluebird<T>;
    /**
     * return a IterableIterator (need use yield or .all())
     */
    paginate<T = IUnpackReturnTypeHttpRequest<H>>(initUrl: string, initOptions?: ILetsWrapOptions<H, O>, pageConfig?: {
        initPage?: number;
        hasPage?(page: number): boolean;
        requestPage?(page: number, url: string, options?: ILetsWrapOptions<H, O>): {
            url: string;
            options: ILetsWrapOptions<H, O>;
            requestOptions: ILetsWrapOptions<H, O>["requestOptions"];
        };
    }): IterableIterator<Bluebird<T>> & {
        prev(): IteratorResult<Bluebird<T>>;
        all(): Bluebird<T[]>;
    };
    many<T extends unknown[] = IUnpackReturnTypeHttpRequest<H>[]>(urls: string[], options?: ILetsWrapOptions<H, O>): Bluebird<T>;
    mergeOptions(options: ILetsWrapOptions<H, O>): ILetsWrapOptions<H, O>;
    requestOptions(options: ILetsWrapOptions<H, O>, url?: string): Partial<IUnpackHttpRequestOptions<H>>;
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
    readonly options: ILetsWrapOptions<H, O>;
    clone<H2 extends IHttpRequest = H, O2 = O>(options?: ILetsWrapOptions<H | H2, O | O2>): LetsWrap<H2, O2>;
}
export declare type ILetsWrapOptions<H extends IHttpRequest, O = Record<string, unknown>> = ILetsWrapOptionsCore<H> & O;
export declare type IUnpackReturnTypeHttpRequest<H> = H extends IHttpRequest<any, infer R> ? (R extends Resolvable<infer U> ? U : R) : unknown;
export declare type IUnpackHttpRequestOptions<H> = H extends IHttpRequest<infer R, any> ? R : unknown;
export interface IRetryFn {
    <T extends Error>(tries: number, err?: T): Resolvable<boolean>;
}
export interface IRetryWaitFn {
    (tries: number): Resolvable<number>;
}
export default LetsWrap;
