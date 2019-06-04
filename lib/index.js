"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const bluebird_1 = __importDefault(require("bluebird"));
var EnumResponseType;
(function (EnumResponseType) {
    EnumResponseType["response"] = "response";
    EnumResponseType["json"] = "json";
    EnumResponseType["text"] = "text";
})(EnumResponseType = exports.EnumResponseType || (exports.EnumResponseType = {}));
class ResponseError extends Error {
    constructor(response, content, message) {
        super((message != null) ? message : 'Status ' + response.status);
        this.response = response;
        this.content = content;
    }
}
exports.ResponseError = ResponseError;
const defaultOptions = {
    type: "json" /* json */,
    method: 'GET',
    headers: {},
    body: undefined,
};
let internalRetry = (tries, err) => false;
let internalRetryWait = (tries) => 0;
exports.fetch = cross_fetch_1.default;
/**
 * Set a custom decider function that decides to retry
 * based on the number of tries and the previous error
 */
function retry(decider) {
    internalRetry = decider;
}
exports.retry = retry;
/**
 * Set a custom function that sets how long we should
 * sleep between each failed request
 */
function retryWait(callback) {
    internalRetryWait = callback;
}
exports.retryWait = retryWait;
/**
 * Request a single url
 */
function single(url, options = {}) {
    let tries = 1;
    // Execute the request and retry if there are errors (and the
    // retry decider decided that we should try our luck again)
    const callRequest = () => request(url, options).catch(async (err) => {
        if (await internalRetry(++tries, err)) {
            return wait(callRequest, internalRetryWait(tries));
        }
        throw err;
    });
    return callRequest();
}
exports.single = single;
/**
 * Send a request using the underlying fetch API
 */
function request(url, options) {
    options = Object.assign({}, defaultOptions, options);
    let savedContent;
    let savedResponse;
    return new bluebird_1.default((resolve, reject) => {
        exports.fetch(url, options)
            .then(handleResponse)
            .then(handleBody)
            .catch(handleError);
        function handleResponse(response) {
            // Save the response for checking the status later
            savedResponse = response;
            // Decode the response body
            switch (options.type) {
                case "text" /* text */:
                    return response.text();
                case "json" /* json */:
                    return response.json();
                case "response" /* response */:
                default:
                    return response;
            }
        }
        function handleBody(content) {
            // Bubble an error if the response status is not okay
            if (savedResponse && savedResponse.status >= 400) {
                savedContent = content;
                throw new Error(`Response status indicates error`);
            }
            // All is well!
            resolve(content);
        }
        function handleError(err) {
            // Overwrite potential decoding errors when the actual problem was the response
            if (savedResponse && savedResponse.status >= 400) {
                err = new ResponseError(savedResponse, savedContent);
            }
            else {
                err = new ResponseError(savedResponse, savedContent, err.message);
            }
            reject(err);
        }
    });
}
exports.request = request;
/**
 * Request multiple pages
 */
function many(urls, options = {}) {
    let { waitTime } = options;
    return bluebird_1.default
        .resolve(urls)[waitTime ? 'mapSeries' : 'map'](async (url) => {
        return single(url, options).tap(() => bluebird_1.default.delay(waitTime));
    });
}
exports.many = many;
/**
 * Wait a specific time before executing a callback
 */
function wait(callback, ms) {
    return bluebird_1.default
        .resolve(ms)
        .tap(ms => bluebird_1.default.delay(ms))
        .then(() => callback());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4REFBZ0M7QUFDaEMsd0RBQStCO0FBSS9CLElBQWtCLGdCQUtqQjtBQUxELFdBQWtCLGdCQUFnQjtJQUVqQyx5Q0FBcUIsQ0FBQTtJQUNyQixpQ0FBYSxDQUFBO0lBQ2IsaUNBQWEsQ0FBQTtBQUNkLENBQUMsRUFMaUIsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFLakM7QUEwQkQsTUFBYSxhQUEyQixTQUFRLEtBQUs7SUFZcEQsWUFBWSxRQUFrQixFQUFFLE9BQVUsRUFBRSxPQUFnQjtRQUUzRCxLQUFLLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUVoRSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtRQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtJQUN2QixDQUFDO0NBQ0Q7QUFuQkQsc0NBbUJDO0FBRUQsTUFBTSxjQUFjLEdBQWE7SUFDaEMsSUFBSSxtQkFBdUI7SUFDM0IsTUFBTSxFQUFFLEtBQUs7SUFDYixPQUFPLEVBQUUsRUFBRTtJQUNYLElBQUksRUFBRSxTQUFTO0NBQ2YsQ0FBQTtBQUVELElBQUksYUFBYSxHQUFHLENBQWtCLEtBQWEsRUFBRSxHQUFNLEVBQXVCLEVBQUUsQ0FBQyxLQUFLLENBQUE7QUFDMUYsSUFBSSxpQkFBaUIsR0FBRyxDQUFDLEtBQWEsRUFBc0IsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUVuRCxRQUFBLEtBQUssR0FBRyxxQkFBTSxDQUFDO0FBRTVCOzs7R0FHRztBQUNILFNBQWdCLEtBQUssQ0FBQyxPQUF3RTtJQUU3RixhQUFhLEdBQUcsT0FBTyxDQUFBO0FBQ3hCLENBQUM7QUFIRCxz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QVEsQ0FBQyxDQUFDLENBQUMsV0FBMkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBRS9ELE9BQU8sTUFBTSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtJQUNoRSxDQUFDLENBQWdCLENBQ2Y7QUFDSCxDQUFDO0FBWEQsb0JBV0M7QUFFRDs7R0FFRztBQUNILFNBQVMsSUFBSSxDQUFJLFFBQTZCLEVBQUUsRUFBc0I7SUFFckUsT0FBTyxrQkFBUTtTQUNiLE9BQU8sQ0FBQyxFQUFFLENBQUM7U0FDWCxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxrQkFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM3QixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FDdEI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF9mZXRjaCBmcm9tICdjcm9zcy1mZXRjaCdcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCdcblxuZXhwb3J0IHR5cGUgUmVzb2x2YWJsZTxSPiA9IFIgfCBQcm9taXNlTGlrZTxSPjtcblxuZXhwb3J0IGNvbnN0IGVudW0gRW51bVJlc3BvbnNlVHlwZVxue1xuXHRyZXNwb25zZSA9ICdyZXNwb25zZScsXG5cdGpzb24gPSAnanNvbicsXG5cdHRleHQgPSAndGV4dCcsXG59XG5cbi8qKlxuICogWW91IGNhbiBwYXNzIGBzaW5nbGVgIGFuZCBgbWFueWAgYW4gb3B0aW9uYWwgYG9wdGlvbnNgIHBhcmFtZXRlci5cbiAqIFRoZSBhdmFpbGFibGUgb3B0aW9ucyB3aXRoIHRoZWlyIGNvcnJlc3BvbmRpbmcgZGVmYXVsdHMgYXJlOlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElPcHRpb25zPFQgZXh0ZW5kcyBFbnVtUmVzcG9uc2VUeXBlID0gRW51bVJlc3BvbnNlVHlwZT4gZXh0ZW5kcyBSZXF1ZXN0SW5pdFxue1xuXHQvKipcblx0ICogcmVzcG9uc2UgdHlwZSwgY2FuIGJlIFwianNvblwiLCBcInRleHRcIiBvciBcInJlc3BvbnNlXCJcblx0ICovXG5cdHR5cGU/OiBULFxuXG5cdC8qKlxuXHQgKiB3YWl0IHRpbWUgaW4gYmV0d2VlbiByZXF1ZXN0cyAob25seSBmb3IgXCJtYW55XCIpXG5cdCAqIGFzIHNvb24gYXMgdGhpcyBpcyBzZXQsIHJlcXVlc3RzIHdpbGwgYmUgc2VudCBpbiBzZXJpZXMgaW5zdGVhZCBvZiBwYXJhbGxlbFxuXHQgKi9cblx0d2FpdFRpbWU/OiBudW1iZXIsXG5cblx0LyoqXG5cdCAqIHJlcXVlc3QvcmVzcG9uc2UgdGltZW91dCBpbiBtcywgMCB0byBkaXNhYmxlXG5cdCAqICghKSBvbmx5IGF2YWlsYWJsZSBpbiBub2RlLmpzIGVudmlyb25tZW50c1xuXHQgKi9cblx0dGltZW91dD86IG51bWJlcixcbn1cblxuZXhwb3J0IGNsYXNzIFJlc3BvbnNlRXJyb3I8VCA9IHVua25vd24+IGV4dGVuZHMgRXJyb3Jcbntcblx0LyoqXG5cdCAqIHJlc3BvbnNlIGlzIHRoZSBsYXN0IHJlc3BvbnNlIG9iamVjdCAoc28geW91IGNhbiBlLmcuIGFjY2VzcyBlcnIucmVzcG9uc2Uuc3RhdHVzKVxuXHQgKi9cblx0cmVzcG9uc2U6IFJlc3BvbnNlO1xuXHQvKipcblx0ICogY29udGVudCBpcyB0aGUgcGFyc2VkIGJvZHkgb2YgdGhlIHJlc3BvbnNlLCBpZiBhdmFpbGFibGVcblx0ICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2Vcblx0ICovXG5cdGNvbnRlbnQ6IFQ7XG5cblx0Y29uc3RydWN0b3IocmVzcG9uc2U6IFJlc3BvbnNlLCBjb250ZW50OiBULCBtZXNzYWdlPzogc3RyaW5nKVxuXHR7XG5cdFx0c3VwZXIoKG1lc3NhZ2UgIT0gbnVsbCkgPyBtZXNzYWdlIDogJ1N0YXR1cyAnICsgcmVzcG9uc2Uuc3RhdHVzKVxuXG5cdFx0dGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlXG5cdFx0dGhpcy5jb250ZW50ID0gY29udGVudFxuXHR9XG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zOiBJT3B0aW9ucyA9IHtcblx0dHlwZTogRW51bVJlc3BvbnNlVHlwZS5qc29uLFxuXHRtZXRob2Q6ICdHRVQnLFxuXHRoZWFkZXJzOiB7fSxcblx0Ym9keTogdW5kZWZpbmVkLFxufVxuXG5sZXQgaW50ZXJuYWxSZXRyeSA9IDxUIGV4dGVuZHMgRXJyb3I+KHRyaWVzOiBudW1iZXIsIGVycjogVCk6IFJlc29sdmFibGU8Ym9vbGVhbj4gPT4gZmFsc2VcbmxldCBpbnRlcm5hbFJldHJ5V2FpdCA9ICh0cmllczogbnVtYmVyKTogUmVzb2x2YWJsZTxudW1iZXI+ID0+IDBcblxuZXhwb3J0IGNvbnN0IGZldGNoID0gX2ZldGNoO1xuXG4vKipcbiAqIFNldCBhIGN1c3RvbSBkZWNpZGVyIGZ1bmN0aW9uIHRoYXQgZGVjaWRlcyB0byByZXRyeVxuICogYmFzZWQgb24gdGhlIG51bWJlciBvZiB0cmllcyBhbmQgdGhlIHByZXZpb3VzIGVycm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXRyeShkZWNpZGVyOiA8VCBleHRlbmRzIEVycm9yPih0cmllczogbnVtYmVyLCBlcnI6IFQpID0+IFJlc29sdmFibGU8Ym9vbGVhbj4pXG57XG5cdGludGVybmFsUmV0cnkgPSBkZWNpZGVyXG59XG5cbi8qKlxuICogU2V0IGEgY3VzdG9tIGZ1bmN0aW9uIHRoYXQgc2V0cyBob3cgbG9uZyB3ZSBzaG91bGRcbiAqIHNsZWVwIGJldHdlZW4gZWFjaCBmYWlsZWQgcmVxdWVzdFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmV0cnlXYWl0KGNhbGxiYWNrOiAodHJpZXM6IG51bWJlcikgPT4gUmVzb2x2YWJsZTxudW1iZXI+KVxue1xuXHRpbnRlcm5hbFJldHJ5V2FpdCA9IGNhbGxiYWNrXG59XG5cbi8qKlxuICogUmVxdWVzdCBhIHNpbmdsZSB1cmxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNpbmdsZTxUPih1cmw6IHN0cmluZywgb3B0aW9uczogSU9wdGlvbnMgPSB7fSk6IEJsdWViaXJkPFQ+XG57XG5cdGxldCB0cmllcyA9IDFcblxuXHQvLyBFeGVjdXRlIHRoZSByZXF1ZXN0IGFuZCByZXRyeSBpZiB0aGVyZSBhcmUgZXJyb3JzIChhbmQgdGhlXG5cdC8vIHJldHJ5IGRlY2lkZXIgZGVjaWRlZCB0aGF0IHdlIHNob3VsZCB0cnkgb3VyIGx1Y2sgYWdhaW4pXG5cdGNvbnN0IGNhbGxSZXF1ZXN0ID0gKCkgPT4gcmVxdWVzdDxUPih1cmwsIG9wdGlvbnMpLmNhdGNoKGFzeW5jIChlcnIpID0+XG5cdHtcblx0XHRpZiAoYXdhaXQgaW50ZXJuYWxSZXRyeSgrK3RyaWVzLCBlcnIpKVxuXHRcdHtcblx0XHRcdHJldHVybiB3YWl0KGNhbGxSZXF1ZXN0LCBpbnRlcm5hbFJldHJ5V2FpdCh0cmllcykpXG5cdFx0fVxuXG5cdFx0dGhyb3cgZXJyXG5cdH0pXG5cblx0cmV0dXJuIGNhbGxSZXF1ZXN0KClcbn1cblxuLyoqXG4gKiBTZW5kIGEgcmVxdWVzdCB1c2luZyB0aGUgdW5kZXJseWluZyBmZXRjaCBBUElcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3Q8VD4odXJsOiBzdHJpbmcsIG9wdGlvbnM6IElPcHRpb25zPEVudW1SZXNwb25zZVR5cGUuanNvbj4pOiBCbHVlYmlyZDxUPlxuLyoqXG4gKiBTZW5kIGEgcmVxdWVzdCB1c2luZyB0aGUgdW5kZXJseWluZyBmZXRjaCBBUElcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3Q8VCBleHRlbmRzIHN0cmluZz4odXJsOiBzdHJpbmcsIG9wdGlvbnM6IElPcHRpb25zPEVudW1SZXNwb25zZVR5cGUudGV4dD4pOiBCbHVlYmlyZDxUPlxuLyoqXG4gKiBTZW5kIGEgcmVxdWVzdCB1c2luZyB0aGUgdW5kZXJseWluZyBmZXRjaCBBUElcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3Q8VCBleHRlbmRzIFJlc3BvbnNlPih1cmw6IHN0cmluZywgb3B0aW9uczogSU9wdGlvbnM8RW51bVJlc3BvbnNlVHlwZS5yZXNwb25zZT4pOiBCbHVlYmlyZDxUPlxuLyoqXG4gKiBTZW5kIGEgcmVxdWVzdCB1c2luZyB0aGUgdW5kZXJseWluZyBmZXRjaCBBUElcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3Q8VD4odXJsOiBzdHJpbmcsIG9wdGlvbnM6IElPcHRpb25zKTogQmx1ZWJpcmQ8VD5cbi8qKlxuICogU2VuZCBhIHJlcXVlc3QgdXNpbmcgdGhlIHVuZGVybHlpbmcgZmV0Y2ggQVBJXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXF1ZXN0PFQgZXh0ZW5kcyBSZXNwb25zZT4odXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBJT3B0aW9ucyk6IEJsdWViaXJkPFQ+XG4vKipcbiAqIFNlbmQgYSByZXF1ZXN0IHVzaW5nIHRoZSB1bmRlcmx5aW5nIGZldGNoIEFQSVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdDxUPih1cmw6IHN0cmluZywgb3B0aW9uczogSU9wdGlvbnMpOiBCbHVlYmlyZDxUPlxue1xuXHRvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpXG5cdGxldCBzYXZlZENvbnRlbnRcblx0bGV0IHNhdmVkUmVzcG9uc2VcblxuXHRyZXR1cm4gbmV3IEJsdWViaXJkKChyZXNvbHZlLCByZWplY3QpID0+XG5cdHtcblx0XHRmZXRjaCh1cmwsIG9wdGlvbnMpXG5cdFx0XHQudGhlbihoYW5kbGVSZXNwb25zZSlcblx0XHRcdC50aGVuKGhhbmRsZUJvZHkpXG5cdFx0XHQuY2F0Y2goaGFuZGxlRXJyb3IpXG5cblx0XHRmdW5jdGlvbiBoYW5kbGVSZXNwb25zZShyZXNwb25zZTogUmVzcG9uc2UpXG5cdFx0e1xuXHRcdFx0Ly8gU2F2ZSB0aGUgcmVzcG9uc2UgZm9yIGNoZWNraW5nIHRoZSBzdGF0dXMgbGF0ZXJcblx0XHRcdHNhdmVkUmVzcG9uc2UgPSByZXNwb25zZVxuXG5cdFx0XHQvLyBEZWNvZGUgdGhlIHJlc3BvbnNlIGJvZHlcblx0XHRcdHN3aXRjaCAob3B0aW9ucy50eXBlKVxuXHRcdFx0e1xuXHRcdFx0XHRjYXNlIEVudW1SZXNwb25zZVR5cGUudGV4dDpcblx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UudGV4dCgpXG5cdFx0XHRcdGNhc2UgRW51bVJlc3BvbnNlVHlwZS5qc29uOlxuXHRcdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKClcblx0XHRcdFx0Y2FzZSBFbnVtUmVzcG9uc2VUeXBlLnJlc3BvbnNlOlxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHJldHVybiByZXNwb25zZVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGhhbmRsZUJvZHkoY29udGVudClcblx0XHR7XG5cdFx0XHQvLyBCdWJibGUgYW4gZXJyb3IgaWYgdGhlIHJlc3BvbnNlIHN0YXR1cyBpcyBub3Qgb2theVxuXHRcdFx0aWYgKHNhdmVkUmVzcG9uc2UgJiYgc2F2ZWRSZXNwb25zZS5zdGF0dXMgPj0gNDAwKVxuXHRcdFx0e1xuXHRcdFx0XHRzYXZlZENvbnRlbnQgPSBjb250ZW50XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgUmVzcG9uc2Ugc3RhdHVzIGluZGljYXRlcyBlcnJvcmApXG5cdFx0XHR9XG5cblx0XHRcdC8vIEFsbCBpcyB3ZWxsIVxuXHRcdFx0cmVzb2x2ZShjb250ZW50KVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGhhbmRsZUVycm9yKGVycjogRXJyb3IgfCBSZXNwb25zZUVycm9yKVxuXHRcdHtcblx0XHRcdC8vIE92ZXJ3cml0ZSBwb3RlbnRpYWwgZGVjb2RpbmcgZXJyb3JzIHdoZW4gdGhlIGFjdHVhbCBwcm9ibGVtIHdhcyB0aGUgcmVzcG9uc2Vcblx0XHRcdGlmIChzYXZlZFJlc3BvbnNlICYmIHNhdmVkUmVzcG9uc2Uuc3RhdHVzID49IDQwMClcblx0XHRcdHtcblx0XHRcdFx0ZXJyID0gbmV3IFJlc3BvbnNlRXJyb3Ioc2F2ZWRSZXNwb25zZSwgc2F2ZWRDb250ZW50KVxuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRlcnIgPSBuZXcgUmVzcG9uc2VFcnJvcihzYXZlZFJlc3BvbnNlLCBzYXZlZENvbnRlbnQsIGVyci5tZXNzYWdlKVxuXHRcdFx0fVxuXG5cdFx0XHRyZWplY3QoZXJyKVxuXHRcdH1cblx0fSlcbn1cblxuLyoqXG4gKiBSZXF1ZXN0IG11bHRpcGxlIHBhZ2VzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYW55PFQgZXh0ZW5kcyB1bmtub3duW10+KHVybHM6IHN0cmluZ1tdLCBvcHRpb25zOiBJT3B0aW9ucyA9IHt9KTogQmx1ZWJpcmQ8VD5cbntcblx0bGV0IHsgd2FpdFRpbWUgfSA9IG9wdGlvbnM7XG5cblx0cmV0dXJuIEJsdWViaXJkXG5cdFx0LnJlc29sdmUodXJscylcblx0XHRbd2FpdFRpbWUgPyAnbWFwU2VyaWVzJyBhcyBhbnkgYXMgJ21hcCcgOiAnbWFwJ10oYXN5bmMgKHVybCkgPT5cblx0e1xuXHRcdHJldHVybiBzaW5nbGUodXJsLCBvcHRpb25zKS50YXAoKCkgPT4gQmx1ZWJpcmQuZGVsYXkod2FpdFRpbWUpKVxuXHR9KSBhcyBCbHVlYmlyZDxUPlxuXHRcdDtcbn1cblxuLyoqXG4gKiBXYWl0IGEgc3BlY2lmaWMgdGltZSBiZWZvcmUgZXhlY3V0aW5nIGEgY2FsbGJhY2tcbiAqL1xuZnVuY3Rpb24gd2FpdDxUPihjYWxsYmFjazogKCkgPT4gUmVzb2x2YWJsZTxUPiwgbXM6IFJlc29sdmFibGU8bnVtYmVyPilcbntcblx0cmV0dXJuIEJsdWViaXJkXG5cdFx0LnJlc29sdmUobXMpXG5cdFx0LnRhcChtcyA9PiBCbHVlYmlyZC5kZWxheShtcykpXG5cdFx0LnRoZW4oKCkgPT4gY2FsbGJhY2soKSlcblx0XHQ7XG59XG4iXX0=