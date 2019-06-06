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
import { resolveTimeout } from './util';
import Bluebird from 'bluebird';
import { BindAll } from 'lodash-decorators/bindAll';
export const SymbolRequest = Symbol('request');
export const SymbolError = Symbol('error');
const _internalRetry = () => false;
const _internalRetryWait = (tries) => 0;
let LetsWrap = LetsWrap_1 = class LetsWrap {
    constructor(defaultOptions = {}) {
        this.defaultOptions = defaultOptions;
        this.setDefault({});
    }
    static toRequestLike(request, orig) {
        return {
            request(url, options) {
                return request(url, options);
            },
            [SymbolRequest]: orig || request,
        };
    }
    defaultHttp(options) {
        throw new ReferenceError(`not implemented`);
    }
    setDefault(options) {
        let defaultOptions = this.defaultOptions;
        options = this.mergeOptions(options);
        options.requestOptions = Object.assign({}, options.requestOptions, defaultOptions.requestOptions);
        options.internalRetry = options.internalRetry || defaultOptions.internalRetry || _internalRetry;
        options.internalRetryWait = options.internalRetryWait || defaultOptions.internalRetryWait || _internalRetryWait;
        Object.assign(this.defaultOptions, options);
        // @ts-ignore
        this.$http = this.defaultOptions.$http || this.$http;
        delete this.defaultOptions.$http;
    }
    /**
     * Send a request using the underlying fetch API
     */
    request(url, options) {
        return Bluebird
            .resolve(this.mergeOptions(options))
            .then((options) => {
            return this.$http.request(url, this.requestOptions(options, url));
        })
            .tap(v => {
            /*
            console.dir({
                url,
                v,
            });
             */
        });
    }
    /**
     * Request a single url
     */
    single(url, options) {
        let tries = 1;
        options = this.mergeOptions(options);
        let { timeout } = options;
        return Bluebird
            .resolve(options)
            .then((options) => {
            const { internalRetry, internalRetryWait } = options;
            const callRequest = () => {
                return this.request(url, options)
                    .catch(async (err) => {
                    if (await internalRetry(++tries, err)) {
                        await Bluebird.delay(await internalRetryWait(tries));
                        return callRequest();
                    }
                    return Bluebird.reject(err);
                });
            };
            if (timeout > 0) {
                return resolveTimeout(callRequest(), (timeout | 0) + 1);
            }
            return callRequest();
        })
            .tapCatch(err => {
            err[SymbolError] = err[SymbolError] || {};
            err[SymbolError].tries = tries;
            err[SymbolError].url = url;
            if (timeout > 0) {
                err[SymbolError].timeout = (timeout | 0) + 1;
            }
        });
    }
    /**
     * return a IterableIterator (need use yield or .all())
     */
    paginate(initUrl, initOptions, pageConfig) {
        const { hasPage = () => true, initPage = 0 } = pageConfig;
        let { requestPage } = pageConfig;
        initOptions = this.mergeOptions(initOptions);
        const self = this;
        let currentPage = initPage | 0;
        if (requestPage == null) {
            // @ts-ignore
            requestPage = (page, url, options) => {
                let requestOptions = this.requestOptions(options);
                // @ts-ignore
                requestOptions.params = requestOptions.params || {};
                requestOptions.params.page = page;
                // @ts-ignore
                requestOptions.data = requestOptions.data || {};
                requestOptions.data.page = page;
                return {
                    url,
                    options,
                    requestOptions,
                };
            };
        }
        let fn = (function* () {
            while (hasPage(currentPage)) {
                let { url, options, requestOptions } = requestPage(currentPage, initUrl, initOptions);
                if (requestOptions != null) {
                    options.requestOptions = requestOptions;
                }
                currentPage++;
                yield self.single(url, options);
            }
        }).bind(this)();
        return Object.assign(fn, {
            prev() {
                currentPage--;
                return fn.next();
            },
            all() {
                return Bluebird.resolve(fn)
                    .then(async () => {
                    const { waitTime } = initOptions;
                    currentPage = initPage | 0;
                    let ls = [];
                    let v;
                    while (v = fn.next()) {
                        let r = await v.value;
                        if (v.done) {
                            if (v.value != null) {
                                ls.push(r);
                            }
                            break;
                        }
                        ls.push(r);
                        if (waitTime) {
                            await Bluebird.delay(waitTime | 0);
                        }
                    }
                    return ls;
                });
            },
        });
    }
    many(urls, options) {
        return Bluebird
            .resolve(this.mergeOptions(options))
            .then((options) => {
            const { waitTime } = options;
            return Bluebird
                .resolve(urls)[waitTime ? 'mapSeries' : 'map'](async (url) => {
                return this.single(url, options).tap(() => Bluebird.delay(waitTime | 0));
            });
        });
    }
    mergeOptions(options) {
        let defaultOptions = this.options;
        // @ts-ignore
        options = options || {};
        let requestOptions = Object.assign({}, defaultOptions.requestOptions, options.requestOptions);
        return Object.assign({}, defaultOptions, options, {
            requestOptions,
        });
    }
    requestOptions(options, url) {
        let ro = {
            ...options.requestOptions,
        };
        // @ts-ignore
        if (ro.timeout == null && options.timeout) {
            // @ts-ignore
            ro.timeout = options.timeout;
        }
        if (url != null) {
            // @ts-ignore
            ro.url = url;
        }
        return ro;
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
            $http: this.$http,
        };
    }
    clone(options) {
        return new LetsWrap_1(this.mergeOptions(options));
    }
};
LetsWrap = LetsWrap_1 = __decorate([
    BindAll(),
    __metadata("design:paramtypes", [Object])
], LetsWrap);
export { LetsWrap };
export default LetsWrap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBMkIsY0FBYyxFQUFRLE1BQU0sUUFBUSxDQUFDO0FBQ3ZFLE9BQU8sUUFBUSxNQUFNLFVBQVUsQ0FBQztBQUNoQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sMkJBQTJCLENBQUE7QUFLbkQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvQyxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBK0IzQyxNQUFNLGNBQWMsR0FBYSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDN0MsTUFBTSxrQkFBa0IsR0FBaUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUd0RCxJQUFhLFFBQVEsZ0JBQXJCLE1BQWEsUUFBUTtJQWVwQixZQUFzQixpQkFBeUMsRUFBUztRQUFsRCxtQkFBYyxHQUFkLGNBQWMsQ0FBb0M7UUFFdkUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFTLENBQUMsQ0FBQTtJQUMzQixDQUFDO0lBZEQsTUFBTSxDQUFDLGFBQWEsQ0FBYSxPQUFPLEVBQUUsSUFBUztRQUVsRCxPQUFPO1lBQ04sT0FBTyxDQUFDLEdBQVcsRUFBRSxPQUFZO2dCQUVoQyxPQUFPLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFDN0IsQ0FBQztZQUNELENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxJQUFJLE9BQU87U0FDaEMsQ0FBQTtJQUNGLENBQUM7SUFPRCxXQUFXLENBQUMsT0FBZ0M7UUFFM0MsTUFBTSxJQUFJLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0lBQzVDLENBQUM7SUFFRCxVQUFVLENBQUMsT0FBZ0M7UUFFMUMsSUFBSSxjQUFjLEdBQUcsSUFB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RixDQUFDO0lBRUQsS0FBSyxDQUFzQyxPQUEwQztRQUVwRixPQUFPLElBQUksVUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBYyxDQUFRLENBQUMsQ0FBQTtJQUM5RCxDQUFDO0NBRUQsQ0FBQTtBQWxVWSxRQUFRO0lBRHBCLE9BQU8sRUFBRTs7R0FDRyxRQUFRLENBa1VwQjtTQWxVWSxRQUFRO0FBc1ZyQixlQUFlLFFBQVEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlc29sdmFibGUsIHJlc29sdmVDYWxsLCByZXNvbHZlVGltZW91dCwgd2FpdCB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgQmluZEFsbCB9IGZyb20gJ2xvZGFzaC1kZWNvcmF0b3JzL2JpbmRBbGwnXG5pbXBvcnQgeyBJVFNPdmVyd3JpdGUgfSBmcm9tICd0cy10eXBlJ1xuaW1wb3J0IHsgQXhpb3NJbnN0YW5jZSB9IGZyb20gJ2F4aW9zJztcbmltcG9ydCB7IElIdHRwUmVxdWVzdEF4aW9zT3B0aW9ucyB9IGZyb20gJy4vYWRhcHRlci9heGlvcy9heGlvcyc7XG5cbmV4cG9ydCBjb25zdCBTeW1ib2xSZXF1ZXN0ID0gU3ltYm9sKCdyZXF1ZXN0Jyk7XG5leHBvcnQgY29uc3QgU3ltYm9sRXJyb3IgPSBTeW1ib2woJ2Vycm9yJyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUh0dHBSZXF1ZXN0PE8gPSB1bmtub3duLCBSID0gdW5rbm93biwgRiA9IHVua25vd24+XG57XG5cdHJlcXVlc3Q/KHVybDogc3RyaW5nLCBvcHRpb25zPzogTyk6IFByb21pc2VMaWtlPFI+XG5cblx0W1N5bWJvbFJlcXVlc3RdPzogRlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElMZXRzV3JhcE9wdGlvbnNDb3JlPEggZXh0ZW5kcyBJSHR0cFJlcXVlc3Q+XG57XG5cdC8qKlxuXHQgKiB3YWl0IHRpbWUgaW4gYmV0d2VlbiByZXF1ZXN0cyAob25seSBmb3IgXCJtYW55XCIpXG5cdCAqIGFzIHNvb24gYXMgdGhpcyBpcyBzZXQsIHJlcXVlc3RzIHdpbGwgYmUgc2VudCBpbiBzZXJpZXMgaW5zdGVhZCBvZiBwYXJhbGxlbFxuXHQgKi9cblx0d2FpdFRpbWU/OiBudW1iZXIsXG5cblx0LyoqXG5cdCAqIHJlcXVlc3QvcmVzcG9uc2UgdGltZW91dCBpbiBtcywgMCB0byBkaXNhYmxlXG5cdCAqICghKSBvbmx5IGF2YWlsYWJsZSBpbiBub2RlLmpzIGVudmlyb25tZW50c1xuXHQgKi9cblx0dGltZW91dD86IG51bWJlcixcblxuXHRyZXF1ZXN0T3B0aW9ucz86IFBhcnRpYWw8SVVucGFja0h0dHBSZXF1ZXN0T3B0aW9uczxIPj4sXG5cblx0aW50ZXJuYWxSZXRyeT86IElSZXRyeUZuLFxuXHRpbnRlcm5hbFJldHJ5V2FpdD86IElSZXRyeVdhaXRGbixcblxuXHQkaHR0cD86IEhcbn1cblxuY29uc3QgX2ludGVybmFsUmV0cnk6IElSZXRyeUZuID0gKCkgPT4gZmFsc2U7XG5jb25zdCBfaW50ZXJuYWxSZXRyeVdhaXQ6IElSZXRyeVdhaXRGbiA9ICh0cmllcykgPT4gMDtcblxuQEJpbmRBbGwoKVxuZXhwb3J0IGNsYXNzIExldHNXcmFwPEggZXh0ZW5kcyBJSHR0cFJlcXVlc3Q8YW55LCBhbnksIGFueT4sIE8gPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj5cbntcblx0cHVibGljICRodHRwOiBIO1xuXG5cdHN0YXRpYyB0b1JlcXVlc3RMaWtlPE8zLCBSMywgVDM+KHJlcXVlc3QsIG9yaWc/OiBUMyk6IElIdHRwUmVxdWVzdDxPMywgUjMsIFQzPlxuXHR7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlcXVlc3QodXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBPMyk6IFByb21pc2VMaWtlPFIzPlxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gcmVxdWVzdCh1cmwsIG9wdGlvbnMpXG5cdFx0XHR9LFxuXHRcdFx0W1N5bWJvbFJlcXVlc3RdOiBvcmlnIHx8IHJlcXVlc3QsXG5cdFx0fVxuXHR9XG5cblx0Y29uc3RydWN0b3IocHJvdGVjdGVkIGRlZmF1bHRPcHRpb25zOiBJTGV0c1dyYXBPcHRpb25zPEgsIE8+ID0ge30gYXMgYW55KVxuXHR7XG5cdFx0dGhpcy5zZXREZWZhdWx0KHt9IGFzIGFueSlcblx0fVxuXG5cdGRlZmF1bHRIdHRwKG9wdGlvbnM/OiBJTGV0c1dyYXBPcHRpb25zPEgsIE8+KTogSFxuXHR7XG5cdFx0dGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKGBub3QgaW1wbGVtZW50ZWRgKVxuXHR9XG5cblx0c2V0RGVmYXVsdChvcHRpb25zPzogSUxldHNXcmFwT3B0aW9uczxILCBPPilcblx0e1xuXHRcdGxldCBkZWZhdWx0T3B0aW9ucyA9IHRoaXMuZGVmYXVsdE9wdGlvbnNcblxuXHRcdG9wdGlvbnMgPSB0aGlzLm1lcmdlT3B0aW9ucyhvcHRpb25zKTtcblxuXHRcdG9wdGlvbnMucmVxdWVzdE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLnJlcXVlc3RPcHRpb25zLCBkZWZhdWx0T3B0aW9ucy5yZXF1ZXN0T3B0aW9ucyk7XG5cblx0XHRvcHRpb25zLmludGVybmFsUmV0cnkgPSBvcHRpb25zLmludGVybmFsUmV0cnkgfHwgZGVmYXVsdE9wdGlvbnMuaW50ZXJuYWxSZXRyeSB8fCBfaW50ZXJuYWxSZXRyeTtcblx0XHRvcHRpb25zLmludGVybmFsUmV0cnlXYWl0ID0gb3B0aW9ucy5pbnRlcm5hbFJldHJ5V2FpdCB8fCBkZWZhdWx0T3B0aW9ucy5pbnRlcm5hbFJldHJ5V2FpdCB8fCBfaW50ZXJuYWxSZXRyeVdhaXQ7XG5cblx0XHRPYmplY3QuYXNzaWduKHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHRoaXMuJGh0dHAgPSB0aGlzLmRlZmF1bHRPcHRpb25zLiRodHRwIHx8IHRoaXMuJGh0dHA7XG5cblx0XHRkZWxldGUgdGhpcy5kZWZhdWx0T3B0aW9ucy4kaHR0cDtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZW5kIGEgcmVxdWVzdCB1c2luZyB0aGUgdW5kZXJseWluZyBmZXRjaCBBUElcblx0ICovXG5cdHJlcXVlc3Q8VCA9IElVbnBhY2tSZXR1cm5UeXBlSHR0cFJlcXVlc3Q8SD4+KHVybDogc3RyaW5nLCBvcHRpb25zPzogSUxldHNXcmFwT3B0aW9uczxILCBPPik6IEJsdWViaXJkPFQ+XG5cdHtcblx0XHRyZXR1cm4gQmx1ZWJpcmRcblx0XHRcdC5yZXNvbHZlKHRoaXMubWVyZ2VPcHRpb25zKG9wdGlvbnMpKVxuXHRcdFx0LnRoZW4oKG9wdGlvbnMpID0+XG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiB0aGlzLiRodHRwLnJlcXVlc3QodXJsLCB0aGlzLnJlcXVlc3RPcHRpb25zKG9wdGlvbnMsIHVybCkpXG5cdFx0XHR9KVxuXHRcdFx0LnRhcCh2ID0+XG5cdFx0XHR7XG5cdFx0XHRcdC8qXG5cdFx0XHRcdGNvbnNvbGUuZGlyKHtcblx0XHRcdFx0XHR1cmwsXG5cdFx0XHRcdFx0dixcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCAqL1xuXHRcdFx0fSkgYXMgYW55IGFzIEJsdWViaXJkPFQ+XG5cdFx0XHQ7XG5cdH1cblxuXHQvKipcblx0ICogUmVxdWVzdCBhIHNpbmdsZSB1cmxcblx0ICovXG5cdHNpbmdsZTxUID0gSVVucGFja1JldHVyblR5cGVIdHRwUmVxdWVzdDxIPj4odXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBJTGV0c1dyYXBPcHRpb25zPEgsIE8+KTogQmx1ZWJpcmQ8VD5cblx0e1xuXHRcdGxldCB0cmllcyA9IDE7XG5cblx0XHRvcHRpb25zID0gdGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucyk7XG5cblx0XHRsZXQgeyB0aW1lb3V0IH0gPSBvcHRpb25zO1xuXG5cdFx0cmV0dXJuIEJsdWViaXJkXG5cdFx0XHQucmVzb2x2ZShvcHRpb25zKVxuXHRcdFx0LnRoZW4oKG9wdGlvbnMpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IHsgaW50ZXJuYWxSZXRyeSwgaW50ZXJuYWxSZXRyeVdhaXQgfSA9IG9wdGlvbnM7XG5cblx0XHRcdFx0Y29uc3QgY2FsbFJlcXVlc3QgPSAoKSA9PlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMucmVxdWVzdCh1cmwsIG9wdGlvbnMpXG5cdFx0XHRcdFx0XHQuY2F0Y2goYXN5bmMgKGVycikgPT5cblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0aWYgKGF3YWl0IGludGVybmFsUmV0cnkoKyt0cmllcywgZXJyKSlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGF3YWl0IEJsdWViaXJkLmRlbGF5KGF3YWl0IGludGVybmFsUmV0cnlXYWl0KHRyaWVzKSlcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY2FsbFJlcXVlc3QoKVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIEJsdWViaXJkLnJlamVjdChlcnIpXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGlmICh0aW1lb3V0ID4gMClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiByZXNvbHZlVGltZW91dChjYWxsUmVxdWVzdCgpLCAodGltZW91dCB8IDApICsgMSlcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBjYWxsUmVxdWVzdCgpXG5cdFx0XHR9KVxuXHRcdFx0LnRhcENhdGNoKGVyciA9PlxuXHRcdFx0e1xuXG5cdFx0XHRcdGVycltTeW1ib2xFcnJvcl0gPSBlcnJbU3ltYm9sRXJyb3JdIHx8IHt9O1xuXHRcdFx0XHRlcnJbU3ltYm9sRXJyb3JdLnRyaWVzID0gdHJpZXM7XG5cdFx0XHRcdGVycltTeW1ib2xFcnJvcl0udXJsID0gdXJsO1xuXG5cdFx0XHRcdGlmICh0aW1lb3V0ID4gMClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGVycltTeW1ib2xFcnJvcl0udGltZW91dCA9ICh0aW1lb3V0IHwgMCkgKyAxO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0pIGFzIGFueSBhcyBCbHVlYmlyZDxUPlxuXHRcdFx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIHJldHVybiBhIEl0ZXJhYmxlSXRlcmF0b3IgKG5lZWQgdXNlIHlpZWxkIG9yIC5hbGwoKSlcblx0ICovXG5cdHBhZ2luYXRlPFQgPSBJVW5wYWNrUmV0dXJuVHlwZUh0dHBSZXF1ZXN0PEg+Pihpbml0VXJsOiBzdHJpbmcsIGluaXRPcHRpb25zPzogSUxldHNXcmFwT3B0aW9uczxILCBPPiwgcGFnZUNvbmZpZz86IHtcblx0XHRpbml0UGFnZT86IG51bWJlcixcblx0XHRoYXNQYWdlPyhwYWdlOiBudW1iZXIpOiBib29sZWFuLFxuXHRcdHJlcXVlc3RQYWdlPyhwYWdlOiBudW1iZXIsIHVybDogc3RyaW5nLCBvcHRpb25zPzogSUxldHNXcmFwT3B0aW9uczxILCBPPik6IHtcblx0XHRcdHVybDogc3RyaW5nLFxuXHRcdFx0b3B0aW9uczogSUxldHNXcmFwT3B0aW9uczxILCBPPixcblx0XHRcdHJlcXVlc3RPcHRpb25zOiBJTGV0c1dyYXBPcHRpb25zPEgsIE8+W1wicmVxdWVzdE9wdGlvbnNcIl1cblx0XHR9LFxuXHR9KVxuXHR7XG5cdFx0Y29uc3QgeyBoYXNQYWdlID0gKCkgPT4gdHJ1ZSwgaW5pdFBhZ2UgPSAwIH0gPSBwYWdlQ29uZmlnO1xuXHRcdGxldCB7IHJlcXVlc3RQYWdlIH0gPSBwYWdlQ29uZmlnO1xuXHRcdGluaXRPcHRpb25zID0gdGhpcy5tZXJnZU9wdGlvbnMoaW5pdE9wdGlvbnMpO1xuXHRcdGNvbnN0IHNlbGYgPSB0aGlzO1xuXHRcdGxldCBjdXJyZW50UGFnZSA9IGluaXRQYWdlIHwgMDtcblxuXHRcdGlmIChyZXF1ZXN0UGFnZSA9PSBudWxsKVxuXHRcdHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJlcXVlc3RQYWdlID0gKHBhZ2U6IG51bWJlcixcblx0XHRcdFx0dXJsLFxuXHRcdFx0XHRvcHRpb25zLFxuXHRcdFx0KSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgcmVxdWVzdE9wdGlvbnMgPSB0aGlzLnJlcXVlc3RPcHRpb25zKG9wdGlvbnMpO1xuXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmVxdWVzdE9wdGlvbnMucGFyYW1zID0gcmVxdWVzdE9wdGlvbnMucGFyYW1zIHx8IHt9O1xuXHRcdFx0XHRyZXF1ZXN0T3B0aW9ucy5wYXJhbXMucGFnZSA9IHBhZ2U7XG5cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXF1ZXN0T3B0aW9ucy5kYXRhID0gcmVxdWVzdE9wdGlvbnMuZGF0YSB8fCB7fTtcblx0XHRcdFx0cmVxdWVzdE9wdGlvbnMuZGF0YS5wYWdlID0gcGFnZTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHVybCxcblx0XHRcdFx0XHRvcHRpb25zLFxuXHRcdFx0XHRcdHJlcXVlc3RPcHRpb25zLFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IGZuID0gKGZ1bmN0aW9uKiAoKVxuXHRcdHtcblx0XHRcdHdoaWxlIChoYXNQYWdlKGN1cnJlbnRQYWdlKSlcblx0XHRcdHtcblx0XHRcdFx0bGV0IHsgdXJsLCBvcHRpb25zLCByZXF1ZXN0T3B0aW9ucyB9ID0gcmVxdWVzdFBhZ2UoY3VycmVudFBhZ2UsIGluaXRVcmwsIGluaXRPcHRpb25zKTtcblxuXHRcdFx0XHRpZiAocmVxdWVzdE9wdGlvbnMgIT0gbnVsbClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG9wdGlvbnMucmVxdWVzdE9wdGlvbnMgPSByZXF1ZXN0T3B0aW9ucztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGN1cnJlbnRQYWdlKys7XG5cblx0XHRcdFx0eWllbGQgc2VsZi5zaW5nbGU8VD4odXJsLCBvcHRpb25zKTtcblx0XHRcdH1cblxuXHRcdH0pLmJpbmQodGhpcykoKTtcblxuXHRcdHJldHVybiBPYmplY3QuYXNzaWduKGZuIGFzIEl0ZXJhYmxlSXRlcmF0b3I8Qmx1ZWJpcmQ8VD4+LCB7XG5cdFx0XHRwcmV2KClcblx0XHRcdHtcblx0XHRcdFx0Y3VycmVudFBhZ2UtLTtcblx0XHRcdFx0cmV0dXJuIGZuLm5leHQoKVxuXHRcdFx0fSxcblx0XHRcdGFsbCgpXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKGZuKVxuXHRcdFx0XHRcdC50aGVuKGFzeW5jICgpID0+XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgeyB3YWl0VGltZSB9ID0gaW5pdE9wdGlvbnM7XG5cdFx0XHRcdFx0XHRjdXJyZW50UGFnZSA9IGluaXRQYWdlIHwgMDtcblxuXHRcdFx0XHRcdFx0bGV0IGxzOiBUW10gPSBbXTtcblx0XHRcdFx0XHRcdGxldCB2OiBJdGVyYXRvclJlc3VsdDxCbHVlYmlyZDxUPj47XG5cdFx0XHRcdFx0XHR3aGlsZSAodiA9IGZuLm5leHQoKSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bGV0IHIgPSBhd2FpdCB2LnZhbHVlO1xuXG5cdFx0XHRcdFx0XHRcdGlmICh2LmRvbmUpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodi52YWx1ZSAhPSBudWxsKVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGxzLnB1c2gocik7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRscy5wdXNoKHIpO1xuXG5cdFx0XHRcdFx0XHRcdGlmICh3YWl0VGltZSlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGF3YWl0IEJsdWViaXJkLmRlbGF5KHdhaXRUaW1lIHwgMClcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIGxzO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0O1xuXHRcdFx0fSxcblx0XHR9KTtcblx0fVxuXG5cdG1hbnk8VCBleHRlbmRzIHVua25vd25bXSA9IElVbnBhY2tSZXR1cm5UeXBlSHR0cFJlcXVlc3Q8SD5bXT4odXJsczogc3RyaW5nW10sXG5cdFx0b3B0aW9ucz86IElMZXRzV3JhcE9wdGlvbnM8SCwgTz4sXG5cdCk6IEJsdWViaXJkPFQ+XG5cdHtcblx0XHRyZXR1cm4gQmx1ZWJpcmRcblx0XHRcdC5yZXNvbHZlKHRoaXMubWVyZ2VPcHRpb25zKG9wdGlvbnMpKVxuXHRcdFx0LnRoZW4oKG9wdGlvbnMpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IHsgd2FpdFRpbWUgfSA9IG9wdGlvbnM7XG5cblx0XHRcdFx0cmV0dXJuIEJsdWViaXJkXG5cdFx0XHRcdFx0LnJlc29sdmUodXJscylcblx0XHRcdFx0XHRbd2FpdFRpbWUgPyAnbWFwU2VyaWVzJyBhcyBhbnkgYXMgJ21hcCcgOiAnbWFwJ10oYXN5bmMgKHVybCkgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLnNpbmdsZSh1cmwsIG9wdGlvbnMpLnRhcCgoKSA9PiBCbHVlYmlyZC5kZWxheSh3YWl0VGltZSB8IDApKVxuXG5cdFx0XHRcdH0pIGFzIGFueSBhcyBCbHVlYmlyZDxUPlxuXHRcdFx0XHRcdDtcblx0XHRcdH0pXG5cdFx0XHQ7XG5cdH1cblxuXHRtZXJnZU9wdGlvbnMob3B0aW9uczogSUxldHNXcmFwT3B0aW9uczxILCBPPik6IElMZXRzV3JhcE9wdGlvbnM8SCwgTz5cblx0e1xuXHRcdGxldCBkZWZhdWx0T3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0XHRsZXQgcmVxdWVzdE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucy5yZXF1ZXN0T3B0aW9ucywgb3B0aW9ucy5yZXF1ZXN0T3B0aW9ucykgYXMgTztcblxuXHRcdHJldHVybiBPYmplY3QuYXNzaWduKHt9IGFzIElMZXRzV3JhcE9wdGlvbnM8SCwgTz4sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zLCB7XG5cdFx0XHRyZXF1ZXN0T3B0aW9ucyxcblx0XHR9KTtcblx0fVxuXG5cdHJlcXVlc3RPcHRpb25zKG9wdGlvbnM6IElMZXRzV3JhcE9wdGlvbnM8SCwgTz4sIHVybD86IHN0cmluZylcblx0e1xuXHRcdGxldCBybyA9IHtcblx0XHRcdC4uLm9wdGlvbnMucmVxdWVzdE9wdGlvbnMsXG5cdFx0fTtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRpZiAocm8udGltZW91dCA9PSBudWxsICYmIG9wdGlvbnMudGltZW91dClcblx0XHR7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyby50aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0XG5cdFx0fVxuXG5cdFx0aWYgKHVybCAhPSBudWxsKVxuXHRcdHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJvLnVybCA9IHVybFxuXHRcdH1cblxuXHRcdHJldHVybiBybztcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgYSBjdXN0b20gZGVjaWRlciBmdW5jdGlvbiB0aGF0IGRlY2lkZXMgdG8gcmV0cnlcblx0ICogYmFzZWQgb24gdGhlIG51bWJlciBvZiB0cmllcyBhbmQgdGhlIHByZXZpb3VzIGVycm9yXG5cdCAqL1xuXHRzZXRSZXRyeShkZWNpZGVyOiBJUmV0cnlGbilcblx0e1xuXHRcdHRoaXMuZGVmYXVsdE9wdGlvbnMuaW50ZXJuYWxSZXRyeSA9IGRlY2lkZXI7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgYSBjdXN0b20gZnVuY3Rpb24gdGhhdCBzZXRzIGhvdyBsb25nIHdlIHNob3VsZFxuXHQgKiBzbGVlcCBiZXR3ZWVuIGVhY2ggZmFpbGVkIHJlcXVlc3Rcblx0ICovXG5cdHNldFJldHJ5V2FpdChjYWxsYmFjazogSVJldHJ5V2FpdEZuKVxuXHR7XG5cdFx0dGhpcy5kZWZhdWx0T3B0aW9ucy5pbnRlcm5hbFJldHJ5V2FpdCA9IGNhbGxiYWNrO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRnZXQgb3B0aW9ucygpOiBJTGV0c1dyYXBPcHRpb25zPEgsIE8+XG5cdHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Li4udGhpcy5kZWZhdWx0T3B0aW9ucyxcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdCRodHRwOiB0aGlzLiRodHRwLFxuXHRcdH1cblx0fVxuXG5cdGNsb25lPEgyIGV4dGVuZHMgSUh0dHBSZXF1ZXN0ID0gSCwgTzIgPSBPPihvcHRpb25zPzogSUxldHNXcmFwT3B0aW9uczxIIHwgSDIsIE8gfCBPMj4pOiBMZXRzV3JhcDxIMiwgTzI+XG5cdHtcblx0XHRyZXR1cm4gbmV3IExldHNXcmFwKHRoaXMubWVyZ2VPcHRpb25zKG9wdGlvbnMgYXMgYW55KSBhcyBhbnkpXG5cdH1cblxufVxuXG5leHBvcnQgdHlwZSBJTGV0c1dyYXBPcHRpb25zPEggZXh0ZW5kcyBJSHR0cFJlcXVlc3QsIE8gPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4gPSBJTGV0c1dyYXBPcHRpb25zQ29yZTxIPiAmIE9cblxuZXhwb3J0IHR5cGUgSVVucGFja1JldHVyblR5cGVIdHRwUmVxdWVzdDxIPiA9XG5cdEggZXh0ZW5kcyBJSHR0cFJlcXVlc3Q8YW55LCBpbmZlciBSPiA/IChSIGV4dGVuZHMgUmVzb2x2YWJsZTxpbmZlciBVPiA/IFUgOiBSKSA6IHVua25vd25cblxuZXhwb3J0IHR5cGUgSVVucGFja0h0dHBSZXF1ZXN0T3B0aW9uczxIPiA9XG5cdEggZXh0ZW5kcyBJSHR0cFJlcXVlc3Q8aW5mZXIgUiwgYW55PiA/IFIgOiB1bmtub3duXG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJldHJ5Rm5cbntcblx0PFQgZXh0ZW5kcyBFcnJvcj4odHJpZXM6IG51bWJlciwgZXJyPzogVCk6IFJlc29sdmFibGU8Ym9vbGVhbj5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmV0cnlXYWl0Rm5cbntcblx0KHRyaWVzOiBudW1iZXIpOiBSZXNvbHZhYmxlPG51bWJlcj5cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGV0c1dyYXBcbiJdfQ==