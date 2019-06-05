import LetsWrap, { IUnpackHttpRequestOptions, IUnpackReturnTypeHttpRequest } from './index';
import Bluebird from 'bluebird';
import { ResponseError } from './util';
export declare class LetsWrapMock<T extends Partial<LetsWrap<any, any>>, R = IUnpackReturnTypeHttpRequest<T["$http"]> | Partial<Response> | unknown, O = IUnpackHttpRequestOptions<T["$http"]> | unknown> {
    target: T;
    reqResponses: (R | Error | ResponseError)[];
    reqOptions: O[];
    reqUrls: string[];
    mockingEnabled: boolean;
    constructor(target: T);
    addResponse(content: any): void;
    addResponseError<T>(response: R, content: T): void;
    reset(): void;
    urls(): string[];
    lastUrl(): string;
    lastOption(): O;
    enableMocking(bool: boolean): void;
    single<T>(url: string, opt?: any): Bluebird<T>;
    many<T extends unknown[]>(urls: string[], opt?: any): Bluebird<T>;
}
export default LetsWrapMock;
