import Bluebird from 'bluebird';
export declare type Resolvable<R> = R | PromiseLike<R>;
export declare const enum EnumResponseType {
    response = "response",
    json = "json",
    text = "text"
}
/**
 * You can pass `single` and `many` an optional `options` parameter.
 * The available options with their corresponding defaults are:
 */
export interface IOptions<T extends EnumResponseType = EnumResponseType> extends RequestInit {
    /**
     * response type, can be "json", "text" or "response"
     */
    type?: T;
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
}
export declare class ResponseError<T = unknown> extends Error {
    /**
     * response is the last response object (so you can e.g. access err.response.status)
     */
    response: Response;
    /**
     * content is the parsed body of the response, if available
     * @param {string} message
     */
    content: T;
    constructor(response: Response, content: T, message?: string);
}
export declare const fetch: {
    (input: RequestInfo, init?: RequestInit): Promise<Response>;
    (input: RequestInfo, init?: RequestInit): Promise<Response>;
};
/**
 * Set a custom decider function that decides to retry
 * based on the number of tries and the previous error
 */
export declare function retry(decider: <T extends Error>(tries: number, err: T) => Resolvable<boolean>): void;
/**
 * Set a custom function that sets how long we should
 * sleep between each failed request
 */
export declare function retryWait(callback: (tries: number) => Resolvable<number>): void;
/**
 * Request a single url
 */
export declare function single<T>(url: string, options?: IOptions): Bluebird<T>;
/**
 * Send a request using the underlying fetch API
 */
export declare function request<T>(url: string, options: IOptions<EnumResponseType.json>): Bluebird<T>;
/**
 * Send a request using the underlying fetch API
 */
export declare function request<T extends string>(url: string, options: IOptions<EnumResponseType.text>): Bluebird<T>;
/**
 * Send a request using the underlying fetch API
 */
export declare function request<T extends Response>(url: string, options: IOptions<EnumResponseType.response>): Bluebird<T>;
/**
 * Send a request using the underlying fetch API
 */
export declare function request<T>(url: string, options: IOptions): Bluebird<T>;
/**
 * Send a request using the underlying fetch API
 */
export declare function request<T extends Response>(url: string, options?: IOptions): Bluebird<T>;
/**
 * Request multiple pages
 */
export declare function many<T extends unknown[]>(urls: string[], options?: IOptions): Bluebird<T>;
