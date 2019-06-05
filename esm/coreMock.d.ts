import LetsWrap from './core';
import Bluebird from 'bluebird';
declare type IMockResponse = Partial<Response>;
export declare class LetsWrapMock {
    target: Partial<LetsWrap>;
    reqResponses: (unknown | Error)[];
    reqOptions: any[];
    reqUrls: string[];
    mockingEnabled: boolean;
    constructor(target: Partial<LetsWrap>);
    addResponse(content: any): void;
    addResponseError<T>(response: IMockResponse, content: T): void;
    reset(): void;
    urls(): string[];
    lastUrl(): string;
    lastOption(): any;
    enableMocking(bool: boolean): void;
    single<T>(url: string, opt?: any): Bluebird<T>;
    many<T extends unknown[]>(urls: string[], opt?: any): Bluebird<T>;
}
export default LetsWrapMock;
