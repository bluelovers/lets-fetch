var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LetsWrap_1;
import { wait } from './util';
import Bluebird from 'bluebird';
import { BindAll } from 'lodash-decorators/bindAll';
const _internalRetry = () => false;
const _internalRetryWait = (tries) => 0;
let LetsWrap = LetsWrap_1 = class LetsWrap {
    constructor(defaultOptions = {}) {
        this.defaultOptions = defaultOptions;
        this.setDefault({});
    }
    setDefault(options) {
        let defaultOptions = this.defaultOptions;
        options = this.mergeOptions(options);
        options.requestOptions = Object.assign({}, options.requestOptions, defaultOptions.requestOptions);
        options.internalRetry = options.internalRetry || defaultOptions.internalRetry || _internalRetry;
        options.internalRetryWait = options.internalRetryWait || defaultOptions.internalRetryWait || _internalRetryWait;
        Object.assign(this.defaultOptions, options);
        // @ts-ignore
        this.$http = this.defaultOptions.http || this.$http;
        delete this.defaultOptions.http;
    }
    /**
     * Send a request using the underlying fetch API
     */
    request(url, options) {
        return Bluebird
            .resolve(this.mergeOptions(options))
            .then((options) => {
            return this.$http.request(url, options.requestOptions);
        });
    }
    /**
     * Request a single url
     */
    single(url, options) {
        let tries = 1;
        return Bluebird
            .resolve(this.mergeOptions(options))
            .then((options) => {
            const { internalRetry, internalRetryWait } = options;
            const callRequest = () => {
                return this.request(url, options)
                    .catch(async (err) => {
                    if (await internalRetry(++tries, err)) {
                        return wait(callRequest, internalRetryWait(tries));
                    }
                    return Bluebird.reject(err);
                });
            };
            return callRequest();
        });
    }
    many(urls, options = {}) {
        return Bluebird
            .resolve(this.mergeOptions(options))
            .then((options) => {
            const { waitTime } = options;
            return Bluebird
                .resolve(urls)[waitTime ? 'mapSeries' : 'map'](async (url) => {
                return this.single(url, options).tap(() => Bluebird.delay(waitTime));
            });
        });
    }
    mergeOptions(options) {
        let defaultOptions = this.options;
        options = options || {};
        let requestOptions = Object.assign({}, defaultOptions.requestOptions, options.requestOptions);
        return Object.assign({}, defaultOptions, options, {
            requestOptions,
        });
    }
    /**
     * Set a custom decider function that decides to retry
     * based on the number of tries and the previous error
     */
    setRetry(decider) {
        this.defaultOptions.internalRetry = decider;
        return this;
    }
    /**
     * Set a custom function that sets how long we should
     * sleep between each failed request
     */
    setRetryWait(callback) {
        this.defaultOptions.internalRetryWait = callback;
        return this;
    }
    get options() {
        return {
            ...this.defaultOptions,
            // @ts-ignore
            http: this.$http,
        };
    }
    clone(options = {}) {
        return new LetsWrap_1(this.mergeOptions(options));
    }
};
LetsWrap = LetsWrap_1 = __decorate([
    BindAll(),
    __metadata("design:paramtypes", [Object])
], LetsWrap);
export { LetsWrap };
export default LetsWrap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQTJCLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUN2RCxPQUFPLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLDJCQUEyQixDQUFBO0FBdUNuRCxNQUFNLGNBQWMsR0FBYSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDN0MsTUFBTSxrQkFBa0IsR0FBaUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUd0RCxJQUFhLFFBQVEsZ0JBQXJCLE1BQWEsUUFBUTtJQUlwQixZQUFzQixpQkFBeUMsRUFBRTtRQUEzQyxtQkFBYyxHQUFkLGNBQWMsQ0FBNkI7UUFFaEUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNwQixDQUFDO0lBRUQsVUFBVSxDQUFDLE9BQStCO1FBRXpDLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUE7UUFFeEMsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckMsT0FBTyxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVsRyxPQUFPLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxhQUFhLElBQUksY0FBYyxDQUFDLGFBQWEsSUFBSSxjQUFjLENBQUM7UUFDaEcsT0FBTyxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsSUFBSSxjQUFjLENBQUMsaUJBQWlCLElBQUksa0JBQWtCLENBQUM7UUFFaEgsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFD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RztJQUNILFFBQVEsQ0FBQyxPQUFpQjtRQUV6QixJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUM7UUFFNUMsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsWUFBWSxDQUFDLFFBQXNCO1FBRWxDLElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDO1FBRWpELE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELElBQUksT0FBTztRQUVWLE9BQU87WUFDTixHQUFHLElBQUksQ0FBQyxjQUFjO1lBQ3RCLGFBQWE7WUFDYixJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUs7U0FDaEIsQ0FBQTtJQUNGLENBQUM7SUFFRCxLQUFLLENBQXlCLFVBQTRDLEVBQUU7UUFFM0UsT0FBTyxJQUFJLFVBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQWMsQ0FBUSxDQUFDLENBQUE7SUFDOUQsQ0FBQztDQUNELENBQUE7QUE5SVksUUFBUTtJQURwQixPQUFPLEVBQUU7O0dBQ0csUUFBUSxDQThJcEI7U0E5SVksUUFBUTtBQWdKckIsZUFBZSxRQUFRLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXNvbHZhYmxlLCByZXNvbHZlQ2FsbCwgd2FpdCB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgQmluZEFsbCB9IGZyb20gJ2xvZGFzaC1kZWNvcmF0b3JzL2JpbmRBbGwnXG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJldHJ5Rm5cbntcblx0PFQgZXh0ZW5kcyBFcnJvcj4odHJpZXM6IG51bWJlciwgZXJyPzogVCk6IFJlc29sdmFibGU8Ym9vbGVhbj5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmV0cnlXYWl0Rm5cbntcblx0KHRyaWVzOiBudW1iZXIpOiBSZXNvbHZhYmxlPG51bWJlcj5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBJSHR0cFJlcXVlc3Q8TywgUj5cbntcblx0cmVxdWVzdCh1cmw6IHN0cmluZywgb3B0aW9ucz86IE8pOiBQcm9taXNlTGlrZTxSPlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElMZXRzV3JhcE9wdGlvbnM8TywgUj5cbntcblx0LyoqXG5cdCAqIHdhaXQgdGltZSBpbiBiZXR3ZWVuIHJlcXVlc3RzIChvbmx5IGZvciBcIm1hbnlcIilcblx0ICogYXMgc29vbiBhcyB0aGlzIGlzIHNldCwgcmVxdWVzdHMgd2lsbCBiZSBzZW50IGluIHNlcmllcyBpbnN0ZWFkIG9mIHBhcmFsbGVsXG5cdCAqL1xuXHR3YWl0VGltZT86IG51bWJlcixcblxuXHQvKipcblx0ICogcmVxdWVzdC9yZXNwb25zZSB0aW1lb3V0IGluIG1zLCAwIHRvIGRpc2FibGVcblx0ICogKCEpIG9ubHkgYXZhaWxhYmxlIGluIG5vZGUuanMgZW52aXJvbm1lbnRzXG5cdCAqL1xuXHR0aW1lb3V0PzogbnVtYmVyLFxuXG5cdHJlcXVlc3RPcHRpb25zPzogUGFydGlhbDxPPixcblxuXHRpbnRlcm5hbFJldHJ5PzogSVJldHJ5Rm4sXG5cdGludGVybmFsUmV0cnlXYWl0PzogSVJldHJ5V2FpdEZuLFxuXG5cdGh0dHA/OiBJSHR0cFJlcXVlc3Q8TywgUj5cbn1cblxuY29uc3QgX2ludGVybmFsUmV0cnk6IElSZXRyeUZuID0gKCkgPT4gZmFsc2U7XG5jb25zdCBfaW50ZXJuYWxSZXRyeVdhaXQ6IElSZXRyeVdhaXRGbiA9ICh0cmllcykgPT4gMDtcblxuQEJpbmRBbGwoKVxuZXhwb3J0IGNsYXNzIExldHNXcmFwPE8gPSB7fSwgUiA9IFJlc3BvbnNlLCBIID0gSUh0dHBSZXF1ZXN0PE8sIFI+Plxue1xuXHRwdWJsaWMgJGh0dHA6IEg7XG5cblx0Y29uc3RydWN0b3IocHJvdGVjdGVkIGRlZmF1bHRPcHRpb25zOiBJTGV0c1dyYXBPcHRpb25zPE8sIFI+ID0ge30pXG5cdHtcblx0XHR0aGlzLnNldERlZmF1bHQoe30pXG5cdH1cblxuXHRzZXREZWZhdWx0KG9wdGlvbnM6IElMZXRzV3JhcE9wdGlvbnM8TywgUj4pXG5cdHtcblx0XHRsZXQgZGVmYXVsdE9wdGlvbnMgPSB0aGlzLmRlZmF1bHRPcHRpb25zXG5cblx0XHRvcHRpb25zID0gdGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucyk7XG5cblx0XHRvcHRpb25zLnJlcXVlc3RPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucy5yZXF1ZXN0T3B0aW9ucywgZGVmYXVsdE9wdGlvbnMucmVxdWVzdE9wdGlvbnMpO1xuXG5cdFx0b3B0aW9ucy5pbnRlcm5hbFJldHJ5ID0gb3B0aW9ucy5pbnRlcm5hbFJldHJ5IHx8IGRlZmF1bHRPcHRpb25zLmludGVybmFsUmV0cnkgfHwgX2ludGVybmFsUmV0cnk7XG5cdFx0b3B0aW9ucy5pbnRlcm5hbFJldHJ5V2FpdCA9IG9wdGlvbnMuaW50ZXJuYWxSZXRyeVdhaXQgfHwgZGVmYXVsdE9wdGlvbnMuaW50ZXJuYWxSZXRyeVdhaXQgfHwgX2ludGVybmFsUmV0cnlXYWl0O1xuXG5cdFx0T2JqZWN0LmFzc2lnbih0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHR0aGlzLiRodHRwID0gdGhpcy5kZWZhdWx0T3B0aW9ucy5odHRwIHx8IHRoaXMuJGh0dHA7XG5cblx0XHRkZWxldGUgdGhpcy5kZWZhdWx0T3B0aW9ucy5odHRwO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNlbmQgYSByZXF1ZXN0IHVzaW5nIHRoZSB1bmRlcmx5aW5nIGZldGNoIEFQSVxuXHQgKi9cblx0cmVxdWVzdDxUID0gUj4odXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBJTGV0c1dyYXBPcHRpb25zPE8sIFI+KTogQmx1ZWJpcmQ8VD5cblx0e1xuXHRcdHJldHVybiBCbHVlYmlyZFxuXHRcdFx0LnJlc29sdmUodGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucykpXG5cdFx0XHQudGhlbigob3B0aW9ucykgPT5cblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuICh0aGlzLiRodHRwIGFzIGFueSBhcyBJSHR0cFJlcXVlc3Q8TywgUj4pLnJlcXVlc3QodXJsLCBvcHRpb25zLnJlcXVlc3RPcHRpb25zIGFzIGFueSlcblx0XHRcdH0pIGFzIGFueSBhcyBCbHVlYmlyZDxUPlxuXHRcdFx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlcXVlc3QgYSBzaW5nbGUgdXJsXG5cdCAqL1xuXHRzaW5nbGU8VCA9IFI+KHVybDogc3RyaW5nLCBvcHRpb25zPzogSUxldHNXcmFwT3B0aW9uczxPLCBSPik6IEJsdWViaXJkPFQ+XG5cdHtcblx0XHRsZXQgdHJpZXMgPSAxO1xuXG5cdFx0cmV0dXJuIEJsdWViaXJkXG5cdFx0XHQucmVzb2x2ZSh0aGlzLm1lcmdlT3B0aW9ucyhvcHRpb25zKSlcblx0XHRcdC50aGVuKChvcHRpb25zKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCB7IGludGVybmFsUmV0cnksIGludGVybmFsUmV0cnlXYWl0IH0gPSBvcHRpb25zO1xuXG5cdFx0XHRcdGNvbnN0IGNhbGxSZXF1ZXN0ID0gKCkgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLnJlcXVlc3QodXJsLCBvcHRpb25zKVxuXHRcdFx0XHRcdFx0LmNhdGNoKGFzeW5jIChlcnIpID0+XG5cdFx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHRcdFx0aWYgKGF3YWl0IGludGVybmFsUmV0cnkoKyt0cmllcywgZXJyKSlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB3YWl0KGNhbGxSZXF1ZXN0LCBpbnRlcm5hbFJldHJ5V2FpdCh0cmllcykpXG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gQmx1ZWJpcmQucmVqZWN0KGVycilcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0cmV0dXJuIGNhbGxSZXF1ZXN0KClcblx0XHRcdH0pIGFzIGFueSBhcyBCbHVlYmlyZDxUPlxuXHRcdFx0O1xuXHR9XG5cblx0bWFueTxUIGV4dGVuZHMgdW5rbm93bltdID0gUltdPih1cmxzOiBzdHJpbmdbXSwgb3B0aW9uczogSUxldHNXcmFwT3B0aW9uczxPLCBSPiA9IHt9KTogQmx1ZWJpcmQ8VD5cblx0e1xuXHRcdHJldHVybiBCbHVlYmlyZFxuXHRcdFx0LnJlc29sdmUodGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucykpXG5cdFx0XHQudGhlbigob3B0aW9ucykgPT5cblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgeyB3YWl0VGltZSB9ID0gb3B0aW9ucztcblxuXHRcdFx0XHRyZXR1cm4gQmx1ZWJpcmRcblx0XHRcdFx0XHQucmVzb2x2ZSh1cmxzKVxuXHRcdFx0XHRcdFt3YWl0VGltZSA/ICdtYXBTZXJpZXMnIGFzIGFueSBhcyAnbWFwJyA6ICdtYXAnXShhc3luYyAodXJsKSA9PlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuc2luZ2xlKHVybCwgb3B0aW9ucykudGFwKCgpID0+IEJsdWViaXJkLmRlbGF5KHdhaXRUaW1lKSlcblxuXHRcdFx0XHR9KSBhcyBhbnkgYXMgQmx1ZWJpcmQ8VD5cblx0XHRcdFx0XHQ7XG5cdFx0XHR9KVxuXHRcdFx0O1xuXHR9XG5cblx0bWVyZ2VPcHRpb25zKG9wdGlvbnM6IElMZXRzV3JhcE9wdGlvbnM8TywgUj4pOiBJTGV0c1dyYXBPcHRpb25zPE8sIFI+XG5cdHtcblx0XHRsZXQgZGVmYXVsdE9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0XHRsZXQgcmVxdWVzdE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucy5yZXF1ZXN0T3B0aW9ucywgb3B0aW9ucy5yZXF1ZXN0T3B0aW9ucykgYXMgTztcblxuXHRcdHJldHVybiBPYmplY3QuYXNzaWduKHt9IGFzIElMZXRzV3JhcE9wdGlvbnM8TywgUj4sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zLCB7XG5cdFx0XHRyZXF1ZXN0T3B0aW9ucyxcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgYSBjdXN0b20gZGVjaWRlciBmdW5jdGlvbiB0aGF0IGRlY2lkZXMgdG8gcmV0cnlcblx0ICogYmFzZWQgb24gdGhlIG51bWJlciBvZiB0cmllcyBhbmQgdGhlIHByZXZpb3VzIGVycm9yXG5cdCAqL1xuXHRzZXRSZXRyeShkZWNpZGVyOiBJUmV0cnlGbilcblx0e1xuXHRcdHRoaXMuZGVmYXVsdE9wdGlvbnMuaW50ZXJuYWxSZXRyeSA9IGRlY2lkZXI7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgYSBjdXN0b20gZnVuY3Rpb24gdGhhdCBzZXRzIGhvdyBsb25nIHdlIHNob3VsZFxuXHQgKiBzbGVlcCBiZXR3ZWVuIGVhY2ggZmFpbGVkIHJlcXVlc3Rcblx0ICovXG5cdHNldFJldHJ5V2FpdChjYWxsYmFjazogSVJldHJ5V2FpdEZuKVxuXHR7XG5cdFx0dGhpcy5kZWZhdWx0T3B0aW9ucy5pbnRlcm5hbFJldHJ5V2FpdCA9IGNhbGxiYWNrO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRnZXQgb3B0aW9ucygpOiBJTGV0c1dyYXBPcHRpb25zPE8sIFI+XG5cdHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Li4udGhpcy5kZWZhdWx0T3B0aW9ucyxcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdGh0dHA6IHRoaXMuJGh0dHAsXG5cdFx0fVxuXHR9XG5cblx0Y2xvbmU8SDIgPSBILCBSMiA9IFIsIE8yID0gTz4ob3B0aW9uczogSUxldHNXcmFwT3B0aW9uczxPIHwgTzIsIFIgfCBSMj4gPSB7fSk6IExldHNXcmFwPE8yLCBSMiwgSDI+XG5cdHtcblx0XHRyZXR1cm4gbmV3IExldHNXcmFwKHRoaXMubWVyZ2VPcHRpb25zKG9wdGlvbnMgYXMgYW55KSBhcyBhbnkpXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGV0c1dyYXBcbiJdfQ==