import Bluebird from 'bluebird';
export declare function getBluebirdCancelable(): typeof Bluebird;
export declare type Resolvable<R> = R | PromiseLike<R>;
export declare function delay<R>(ms: Resolvable<number>): Bluebird<number>;
export declare function resolveCall<P extends any[], R>(fn: Resolvable<((...argv: P) => R)>, ...argArray: P): Bluebird<R>;
export declare function resolveTimeout<T>(value: PromiseLike<T>, timeout: number): Bluebird<T>;
/**
 * Wait a specific time before executing a callback
 */
export declare function wait<T>(callback: Resolvable<() => Resolvable<T>>, ms: Resolvable<number>): Bluebird<Resolvable<T>>;
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
