"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var LetsWrap_1;
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const bluebird_1 = __importDefault(require("bluebird"));
const bindAll_1 = require("lodash-decorators/bindAll");
exports.SymbolRequest = Symbol('request');
exports.SymbolError = Symbol('error');
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
            [exports.SymbolRequest]: orig || request,
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
        return bluebird_1.default
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
        return bluebird_1.default
            .resolve(options)
            .then((options) => {
            const { internalRetry, internalRetryWait } = options;
            const callRequest = () => {
                return this.request(url, options)
                    .catch(async (err) => {
                    if (await internalRetry(++tries, err)) {
                        await bluebird_1.default.delay(await internalRetryWait(tries));
                        return callRequest();
                    }
                    return bluebird_1.default.reject(err);
                });
            };
            if (timeout > 0) {
                return util_1.resolveTimeout(callRequest(), (timeout | 0) + 1);
            }
            return callRequest();
        })
            .tapCatch(err => {
            err[exports.SymbolError] = err[exports.SymbolError] || {};
            err[exports.SymbolError].tries = tries;
            err[exports.SymbolError].url = url;
            if (timeout > 0) {
                err[exports.SymbolError].timeout = (timeout | 0) + 1;
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
                return bluebird_1.default.resolve(fn)
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
                            await bluebird_1.default.delay(waitTime | 0);
                        }
                    }
                    return ls;
                });
            },
        });
    }
    many(urls, options) {
        return bluebird_1.default
            .resolve(this.mergeOptions(options))
            .then((options) => {
            const { waitTime } = options;
            return bluebird_1.default
                .resolve(urls)[waitTime ? 'mapSeries' : 'map'](async (url) => {
                return this.single(url, options).tap(() => bluebird_1.default.delay(waitTime | 0));
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
    bindAll_1.BindAll(),
    __metadata("design:paramtypes", [Object])
], LetsWrap);
exports.LetsWrap = LetsWrap;
exports.default = LetsWrap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUNBQXVFO0FBQ3ZFLHdEQUFnQztBQUNoQyx1REFBbUQ7QUFLdEMsUUFBQSxhQUFhLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsV0FBVyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQStCM0MsTUFBTSxjQUFjLEdBQWEsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO0FBQzdDLE1BQU0sa0JBQWtCLEdBQWlCLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFHdEQsSUFBYSxRQUFRLGdCQUFyQixNQUFhLFFBQVE7SUFlcEIsWUFBc0IsaUJBQXlDLEVBQVM7UUFBbEQsbUJBQWMsR0FBZCxjQUFjLENBQW9DO1FBRXZFLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBUyxDQUFDLENBQUE7SUFDM0IsQ0FBQztJQWRELE1BQU0sQ0FBQyxhQUFhLENBQWEsT0FBTyxFQUFFLElBQVM7UUFFbEQsT0FBTztZQUNOLE9BQU8sQ0FBQyxHQUFXLEVBQUUsT0FBWTtnQkFFaEMsT0FBTyxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBQzdCLENBQUM7WUFDRCxDQUFDLHFCQUFhLENBQUMsRUFBRSxJQUFJLElBQUksT0FBTztTQUNoQyxDQUFBO0lBQ0YsQ0FBQztJQU9ELFdBQVcsQ0FBQyxPQUFnQztRQUUzQyxNQUFNLElBQUksY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUE7SUFDNUMsQ0FBQztJQUVELFVBQVUsQ0FBQyxPQUFnQztRQUUxQyxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFBO1FBRXhDLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXJDLE9BQU8sQ0FBQyxjQUFjLEdB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QUFjLENBQVEsQ0FBQyxDQUFBO0lBQzlELENBQUM7Q0FFRCxDQUFBO0FBbFVZLFFBQVE7SUFEcEIsaUJBQU8sRUFBRTs7R0FDRyxRQUFRLENBa1VwQjtBQWxVWSw0QkFBUTtBQXNWckIsa0JBQWUsUUFBUSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVzb2x2YWJsZSwgcmVzb2x2ZUNhbGwsIHJlc29sdmVUaW1lb3V0LCB3YWl0IH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBCaW5kQWxsIH0gZnJvbSAnbG9kYXNoLWRlY29yYXRvcnMvYmluZEFsbCdcbmltcG9ydCB7IElUU092ZXJ3cml0ZSB9IGZyb20gJ3RzLXR5cGUnXG5pbXBvcnQgeyBBeGlvc0luc3RhbmNlIH0gZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHsgSUh0dHBSZXF1ZXN0QXhpb3NPcHRpb25zIH0gZnJvbSAnLi9hZGFwdGVyL2F4aW9zL2F4aW9zJztcblxuZXhwb3J0IGNvbnN0IFN5bWJvbFJlcXVlc3QgPSBTeW1ib2woJ3JlcXVlc3QnKTtcbmV4cG9ydCBjb25zdCBTeW1ib2xFcnJvciA9IFN5bWJvbCgnZXJyb3InKTtcblxuZXhwb3J0IGludGVyZmFjZSBJSHR0cFJlcXVlc3Q8TyA9IHVua25vd24sIFIgPSB1bmtub3duLCBGID0gdW5rbm93bj5cbntcblx0cmVxdWVzdD8odXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBPKTogUHJvbWlzZUxpa2U8Uj5cblxuXHRbU3ltYm9sUmVxdWVzdF0/OiBGXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxldHNXcmFwT3B0aW9uc0NvcmU8SCBleHRlbmRzIElIdHRwUmVxdWVzdD5cbntcblx0LyoqXG5cdCAqIHdhaXQgdGltZSBpbiBiZXR3ZWVuIHJlcXVlc3RzIChvbmx5IGZvciBcIm1hbnlcIilcblx0ICogYXMgc29vbiBhcyB0aGlzIGlzIHNldCwgcmVxdWVzdHMgd2lsbCBiZSBzZW50IGluIHNlcmllcyBpbnN0ZWFkIG9mIHBhcmFsbGVsXG5cdCAqL1xuXHR3YWl0VGltZT86IG51bWJlcixcblxuXHQvKipcblx0ICogcmVxdWVzdC9yZXNwb25zZSB0aW1lb3V0IGluIG1zLCAwIHRvIGRpc2FibGVcblx0ICogKCEpIG9ubHkgYXZhaWxhYmxlIGluIG5vZGUuanMgZW52aXJvbm1lbnRzXG5cdCAqL1xuXHR0aW1lb3V0PzogbnVtYmVyLFxuXG5cdHJlcXVlc3RPcHRpb25zPzogUGFydGlhbDxJVW5wYWNrSHR0cFJlcXVlc3RPcHRpb25zPEg+PixcblxuXHRpbnRlcm5hbFJldHJ5PzogSVJldHJ5Rm4sXG5cdGludGVybmFsUmV0cnlXYWl0PzogSVJldHJ5V2FpdEZuLFxuXG5cdCRodHRwPzogSFxufVxuXG5jb25zdCBfaW50ZXJuYWxSZXRyeTogSVJldHJ5Rm4gPSAoKSA9PiBmYWxzZTtcbmNvbnN0IF9pbnRlcm5hbFJldHJ5V2FpdDogSVJldHJ5V2FpdEZuID0gKHRyaWVzKSA9PiAwO1xuXG5AQmluZEFsbCgpXG5leHBvcnQgY2xhc3MgTGV0c1dyYXA8SCBleHRlbmRzIElIdHRwUmVxdWVzdDxhbnksIGFueSwgYW55PiwgTyA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+Plxue1xuXHRwdWJsaWMgJGh0dHA6IEg7XG5cblx0c3RhdGljIHRvUmVxdWVzdExpa2U8TzMsIFIzLCBUMz4ocmVxdWVzdCwgb3JpZz86IFQzKTogSUh0dHBSZXF1ZXN0PE8zLCBSMywgVDM+XG5cdHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVxdWVzdCh1cmw6IHN0cmluZywgb3B0aW9ucz86IE8zKTogUHJvbWlzZUxpa2U8UjM+XG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiByZXF1ZXN0KHVybCwgb3B0aW9ucylcblx0XHRcdH0sXG5cdFx0XHRbU3ltYm9sUmVxdWVzdF06IG9yaWcgfHwgcmVxdWVzdCxcblx0XHR9XG5cdH1cblxuXHRjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZGVmYXVsdE9wdGlvbnM6IElMZXRzV3JhcE9wdGlvbnM8SCwgTz4gPSB7fSBhcyBhbnkpXG5cdHtcblx0XHR0aGlzLnNldERlZmF1bHQoe30gYXMgYW55KVxuXHR9XG5cblx0ZGVmYXVsdEh0dHAob3B0aW9ucz86IElMZXRzV3JhcE9wdGlvbnM8SCwgTz4pOiBIXG5cdHtcblx0XHR0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoYG5vdCBpbXBsZW1lbnRlZGApXG5cdH1cblxuXHRzZXREZWZhdWx0KG9wdGlvbnM/OiBJTGV0c1dyYXBPcHRpb25zPEgsIE8+KVxuXHR7XG5cdFx0bGV0IGRlZmF1bHRPcHRpb25zID0gdGhpcy5kZWZhdWx0T3B0aW9uc1xuXG5cdFx0b3B0aW9ucyA9IHRoaXMubWVyZ2VPcHRpb25zKG9wdGlvbnMpO1xuXG5cdFx0b3B0aW9ucy5yZXF1ZXN0T3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMucmVxdWVzdE9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLnJlcXVlc3RPcHRpb25zKTtcblxuXHRcdG9wdGlvbnMuaW50ZXJuYWxSZXRyeSA9IG9wdGlvbnMuaW50ZXJuYWxSZXRyeSB8fCBkZWZhdWx0T3B0aW9ucy5pbnRlcm5hbFJldHJ5IHx8IF9pbnRlcm5hbFJldHJ5O1xuXHRcdG9wdGlvbnMuaW50ZXJuYWxSZXRyeVdhaXQgPSBvcHRpb25zLmludGVybmFsUmV0cnlXYWl0IHx8IGRlZmF1bHRPcHRpb25zLmludGVybmFsUmV0cnlXYWl0IHx8IF9pbnRlcm5hbFJldHJ5V2FpdDtcblxuXHRcdE9iamVjdC5hc3NpZ24odGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0dGhpcy4kaHR0cCA9IHRoaXMuZGVmYXVsdE9wdGlvbnMuJGh0dHAgfHwgdGhpcy4kaHR0cDtcblxuXHRcdGRlbGV0ZSB0aGlzLmRlZmF1bHRPcHRpb25zLiRodHRwO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNlbmQgYSByZXF1ZXN0IHVzaW5nIHRoZSB1bmRlcmx5aW5nIGZldGNoIEFQSVxuXHQgKi9cblx0cmVxdWVzdDxUID0gSVVucGFja1JldHVyblR5cGVIdHRwUmVxdWVzdDxIPj4odXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBJTGV0c1dyYXBPcHRpb25zPEgsIE8+KTogQmx1ZWJpcmQ8VD5cblx0e1xuXHRcdHJldHVybiBCbHVlYmlyZFxuXHRcdFx0LnJlc29sdmUodGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucykpXG5cdFx0XHQudGhlbigob3B0aW9ucykgPT5cblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuJGh0dHAucmVxdWVzdCh1cmwsIHRoaXMucmVxdWVzdE9wdGlvbnMob3B0aW9ucywgdXJsKSlcblx0XHRcdH0pXG5cdFx0XHQudGFwKHYgPT5cblx0XHRcdHtcblx0XHRcdFx0Lypcblx0XHRcdFx0Y29uc29sZS5kaXIoe1xuXHRcdFx0XHRcdHVybCxcblx0XHRcdFx0XHR2LFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0ICovXG5cdFx0XHR9KSBhcyBhbnkgYXMgQmx1ZWJpcmQ8VD5cblx0XHRcdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXF1ZXN0IGEgc2luZ2xlIHVybFxuXHQgKi9cblx0c2luZ2xlPFQgPSBJVW5wYWNrUmV0dXJuVHlwZUh0dHBSZXF1ZXN0PEg+Pih1cmw6IHN0cmluZywgb3B0aW9ucz86IElMZXRzV3JhcE9wdGlvbnM8SCwgTz4pOiBCbHVlYmlyZDxUPlxuXHR7XG5cdFx0bGV0IHRyaWVzID0gMTtcblxuXHRcdG9wdGlvbnMgPSB0aGlzLm1lcmdlT3B0aW9ucyhvcHRpb25zKTtcblxuXHRcdGxldCB7IHRpbWVvdXQgfSA9IG9wdGlvbnM7XG5cblx0XHRyZXR1cm4gQmx1ZWJpcmRcblx0XHRcdC5yZXNvbHZlKG9wdGlvbnMpXG5cdFx0XHQudGhlbigob3B0aW9ucykgPT5cblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgeyBpbnRlcm5hbFJldHJ5LCBpbnRlcm5hbFJldHJ5V2FpdCB9ID0gb3B0aW9ucztcblxuXHRcdFx0XHRjb25zdCBjYWxsUmVxdWVzdCA9ICgpID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5yZXF1ZXN0KHVybCwgb3B0aW9ucylcblx0XHRcdFx0XHRcdC5jYXRjaChhc3luYyAoZXJyKSA9PlxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRpZiAoYXdhaXQgaW50ZXJuYWxSZXRyeSgrK3RyaWVzLCBlcnIpKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0YXdhaXQgQmx1ZWJpcmQuZGVsYXkoYXdhaXQgaW50ZXJuYWxSZXRyeVdhaXQodHJpZXMpKVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBjYWxsUmVxdWVzdCgpXG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gQmx1ZWJpcmQucmVqZWN0KGVycilcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0aWYgKHRpbWVvdXQgPiAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc29sdmVUaW1lb3V0KGNhbGxSZXF1ZXN0KCksICh0aW1lb3V0IHwgMCkgKyAxKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGNhbGxSZXF1ZXN0KClcblx0XHRcdH0pXG5cdFx0XHQudGFwQ2F0Y2goZXJyID0+XG5cdFx0XHR7XG5cblx0XHRcdFx0ZXJyW1N5bWJvbEVycm9yXSA9IGVycltTeW1ib2xFcnJvcl0gfHwge307XG5cdFx0XHRcdGVycltTeW1ib2xFcnJvcl0udHJpZXMgPSB0cmllcztcblx0XHRcdFx0ZXJyW1N5bWJvbEVycm9yXS51cmwgPSB1cmw7XG5cblx0XHRcdFx0aWYgKHRpbWVvdXQgPiAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZXJyW1N5bWJvbEVycm9yXS50aW1lb3V0ID0gKHRpbWVvdXQgfCAwKSArIDE7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSkgYXMgYW55IGFzIEJsdWViaXJkPFQ+XG5cdFx0XHQ7XG5cdH1cblxuXHQvKipcblx0ICogcmV0dXJuIGEgSXRlcmFibGVJdGVyYXRvciAobmVlZCB1c2UgeWllbGQgb3IgLmFsbCgpKVxuXHQgKi9cblx0cGFnaW5hdGU8VCA9IElVbnBhY2tSZXR1cm5UeXBlSHR0cFJlcXVlc3Q8SD4+KGluaXRVcmw6IHN0cmluZywgaW5pdE9wdGlvbnM/OiBJTGV0c1dyYXBPcHRpb25zPEgsIE8+LCBwYWdlQ29uZmlnPzoge1xuXHRcdGluaXRQYWdlPzogbnVtYmVyLFxuXHRcdGhhc1BhZ2U/KHBhZ2U6IG51bWJlcik6IGJvb2xlYW4sXG5cdFx0cmVxdWVzdFBhZ2U/KHBhZ2U6IG51bWJlciwgdXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBJTGV0c1dyYXBPcHRpb25zPEgsIE8+KToge1xuXHRcdFx0dXJsOiBzdHJpbmcsXG5cdFx0XHRvcHRpb25zOiBJTGV0c1dyYXBPcHRpb25zPEgsIE8+LFxuXHRcdFx0cmVxdWVzdE9wdGlvbnM6IElMZXRzV3JhcE9wdGlvbnM8SCwgTz5bXCJyZXF1ZXN0T3B0aW9uc1wiXVxuXHRcdH0sXG5cdH0pXG5cdHtcblx0XHRjb25zdCB7IGhhc1BhZ2UgPSAoKSA9PiB0cnVlLCBpbml0UGFnZSA9IDAgfSA9IHBhZ2VDb25maWc7XG5cdFx0bGV0IHsgcmVxdWVzdFBhZ2UgfSA9IHBhZ2VDb25maWc7XG5cdFx0aW5pdE9wdGlvbnMgPSB0aGlzLm1lcmdlT3B0aW9ucyhpbml0T3B0aW9ucyk7XG5cdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XG5cdFx0bGV0IGN1cnJlbnRQYWdlID0gaW5pdFBhZ2UgfCAwO1xuXG5cdFx0aWYgKHJlcXVlc3RQYWdlID09IG51bGwpXG5cdFx0e1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmVxdWVzdFBhZ2UgPSAocGFnZTogbnVtYmVyLFxuXHRcdFx0XHR1cmwsXG5cdFx0XHRcdG9wdGlvbnMsXG5cdFx0XHQpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGxldCByZXF1ZXN0T3B0aW9ucyA9IHRoaXMucmVxdWVzdE9wdGlvbnMob3B0aW9ucyk7XG5cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXF1ZXN0T3B0aW9ucy5wYXJhbXMgPSByZXF1ZXN0T3B0aW9ucy5wYXJhbXMgfHwge307XG5cdFx0XHRcdHJlcXVlc3RPcHRpb25zLnBhcmFtcy5wYWdlID0gcGFnZTtcblxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHJlcXVlc3RPcHRpb25zLmRhdGEgPSByZXF1ZXN0T3B0aW9ucy5kYXRhIHx8IHt9O1xuXHRcdFx0XHRyZXF1ZXN0T3B0aW9ucy5kYXRhLnBhZ2UgPSBwYWdlO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dXJsLFxuXHRcdFx0XHRcdG9wdGlvbnMsXG5cdFx0XHRcdFx0cmVxdWVzdE9wdGlvbnMsXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRsZXQgZm4gPSAoZnVuY3Rpb24qICgpXG5cdFx0e1xuXHRcdFx0d2hpbGUgKGhhc1BhZ2UoY3VycmVudFBhZ2UpKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgeyB1cmwsIG9wdGlvbnMsIHJlcXVlc3RPcHRpb25zIH0gPSByZXF1ZXN0UGFnZShjdXJyZW50UGFnZSwgaW5pdFVybCwgaW5pdE9wdGlvbnMpO1xuXG5cdFx0XHRcdGlmIChyZXF1ZXN0T3B0aW9ucyAhPSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0b3B0aW9ucy5yZXF1ZXN0T3B0aW9ucyA9IHJlcXVlc3RPcHRpb25zO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y3VycmVudFBhZ2UrKztcblxuXHRcdFx0XHR5aWVsZCBzZWxmLnNpbmdsZTxUPih1cmwsIG9wdGlvbnMpO1xuXHRcdFx0fVxuXG5cdFx0fSkuYmluZCh0aGlzKSgpO1xuXG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oZm4gYXMgSXRlcmFibGVJdGVyYXRvcjxCbHVlYmlyZDxUPj4sIHtcblx0XHRcdHByZXYoKVxuXHRcdFx0e1xuXHRcdFx0XHRjdXJyZW50UGFnZS0tO1xuXHRcdFx0XHRyZXR1cm4gZm4ubmV4dCgpXG5cdFx0XHR9LFxuXHRcdFx0YWxsKClcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIEJsdWViaXJkLnJlc29sdmUoZm4pXG5cdFx0XHRcdFx0LnRoZW4oYXN5bmMgKCkgPT5cblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCB7IHdhaXRUaW1lIH0gPSBpbml0T3B0aW9ucztcblx0XHRcdFx0XHRcdGN1cnJlbnRQYWdlID0gaW5pdFBhZ2UgfCAwO1xuXG5cdFx0XHRcdFx0XHRsZXQgbHM6IFRbXSA9IFtdO1xuXHRcdFx0XHRcdFx0bGV0IHY6IEl0ZXJhdG9yUmVzdWx0PEJsdWViaXJkPFQ+Pjtcblx0XHRcdFx0XHRcdHdoaWxlICh2ID0gZm4ubmV4dCgpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsZXQgciA9IGF3YWl0IHYudmFsdWU7XG5cblx0XHRcdFx0XHRcdFx0aWYgKHYuZG9uZSlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGlmICh2LnZhbHVlICE9IG51bGwpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0bHMucHVzaChyKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGxzLnB1c2gocik7XG5cblx0XHRcdFx0XHRcdFx0aWYgKHdhaXRUaW1lKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0YXdhaXQgQmx1ZWJpcmQuZGVsYXkod2FpdFRpbWUgfCAwKVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gbHM7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQ7XG5cdFx0XHR9LFxuXHRcdH0pO1xuXHR9XG5cblx0bWFueTxUIGV4dGVuZHMgdW5rbm93bltdID0gSVVucGFja1JldHVyblR5cGVIdHRwUmVxdWVzdDxIPltdPih1cmxzOiBzdHJpbmdbXSxcblx0XHRvcHRpb25zPzogSUxldHNXcmFwT3B0aW9uczxILCBPPixcblx0KTogQmx1ZWJpcmQ8VD5cblx0e1xuXHRcdHJldHVybiBCbHVlYmlyZFxuXHRcdFx0LnJlc29sdmUodGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucykpXG5cdFx0XHQudGhlbigob3B0aW9ucykgPT5cblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgeyB3YWl0VGltZSB9ID0gb3B0aW9ucztcblxuXHRcdFx0XHRyZXR1cm4gQmx1ZWJpcmRcblx0XHRcdFx0XHQucmVzb2x2ZSh1cmxzKVxuXHRcdFx0XHRcdFt3YWl0VGltZSA/ICdtYXBTZXJpZXMnIGFzIGFueSBhcyAnbWFwJyA6ICdtYXAnXShhc3luYyAodXJsKSA9PlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuc2luZ2xlKHVybCwgb3B0aW9ucykudGFwKCgpID0+IEJsdWViaXJkLmRlbGF5KHdhaXRUaW1lIHwgMCkpXG5cblx0XHRcdFx0fSkgYXMgYW55IGFzIEJsdWViaXJkPFQ+XG5cdFx0XHRcdFx0O1xuXHRcdFx0fSlcblx0XHRcdDtcblx0fVxuXG5cdG1lcmdlT3B0aW9ucyhvcHRpb25zOiBJTGV0c1dyYXBPcHRpb25zPEgsIE8+KTogSUxldHNXcmFwT3B0aW9uczxILCBPPlxuXHR7XG5cdFx0bGV0IGRlZmF1bHRPcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdGxldCByZXF1ZXN0T3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLnJlcXVlc3RPcHRpb25zLCBvcHRpb25zLnJlcXVlc3RPcHRpb25zKSBhcyBPO1xuXG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30gYXMgSUxldHNXcmFwT3B0aW9uczxILCBPPiwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMsIHtcblx0XHRcdHJlcXVlc3RPcHRpb25zLFxuXHRcdH0pO1xuXHR9XG5cblx0cmVxdWVzdE9wdGlvbnMob3B0aW9uczogSUxldHNXcmFwT3B0aW9uczxILCBPPiwgdXJsPzogc3RyaW5nKVxuXHR7XG5cdFx0bGV0IHJvID0ge1xuXHRcdFx0Li4ub3B0aW9ucy5yZXF1ZXN0T3B0aW9ucyxcblx0XHR9O1xuXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGlmIChyby50aW1lb3V0ID09IG51bGwgJiYgb3B0aW9ucy50aW1lb3V0KVxuXHRcdHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJvLnRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXRcblx0XHR9XG5cblx0XHRpZiAodXJsICE9IG51bGwpXG5cdFx0e1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cm8udXJsID0gdXJsXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJvO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCBhIGN1c3RvbSBkZWNpZGVyIGZ1bmN0aW9uIHRoYXQgZGVjaWRlcyB0byByZXRyeVxuXHQgKiBiYXNlZCBvbiB0aGUgbnVtYmVyIG9mIHRyaWVzIGFuZCB0aGUgcHJldmlvdXMgZXJyb3Jcblx0ICovXG5cdHNldFJldHJ5KGRlY2lkZXI6IElSZXRyeUZuKVxuXHR7XG5cdFx0dGhpcy5kZWZhdWx0T3B0aW9ucy5pbnRlcm5hbFJldHJ5ID0gZGVjaWRlcjtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCBhIGN1c3RvbSBmdW5jdGlvbiB0aGF0IHNldHMgaG93IGxvbmcgd2Ugc2hvdWxkXG5cdCAqIHNsZWVwIGJldHdlZW4gZWFjaCBmYWlsZWQgcmVxdWVzdFxuXHQgKi9cblx0c2V0UmV0cnlXYWl0KGNhbGxiYWNrOiBJUmV0cnlXYWl0Rm4pXG5cdHtcblx0XHR0aGlzLmRlZmF1bHRPcHRpb25zLmludGVybmFsUmV0cnlXYWl0ID0gY2FsbGJhY2s7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdGdldCBvcHRpb25zKCk6IElMZXRzV3JhcE9wdGlvbnM8SCwgTz5cblx0e1xuXHRcdHJldHVybiB7XG5cdFx0XHQuLi50aGlzLmRlZmF1bHRPcHRpb25zLFxuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0JGh0dHA6IHRoaXMuJGh0dHAsXG5cdFx0fVxuXHR9XG5cblx0Y2xvbmU8SDIgZXh0ZW5kcyBJSHR0cFJlcXVlc3QgPSBILCBPMiA9IE8+KG9wdGlvbnM/OiBJTGV0c1dyYXBPcHRpb25zPEggfCBIMiwgTyB8IE8yPik6IExldHNXcmFwPEgyLCBPMj5cblx0e1xuXHRcdHJldHVybiBuZXcgTGV0c1dyYXAodGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucyBhcyBhbnkpIGFzIGFueSlcblx0fVxuXG59XG5cbmV4cG9ydCB0eXBlIElMZXRzV3JhcE9wdGlvbnM8SCBleHRlbmRzIElIdHRwUmVxdWVzdCwgTyA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+PiA9IElMZXRzV3JhcE9wdGlvbnNDb3JlPEg+ICYgT1xuXG5leHBvcnQgdHlwZSBJVW5wYWNrUmV0dXJuVHlwZUh0dHBSZXF1ZXN0PEg+ID1cblx0SCBleHRlbmRzIElIdHRwUmVxdWVzdDxhbnksIGluZmVyIFI+ID8gKFIgZXh0ZW5kcyBSZXNvbHZhYmxlPGluZmVyIFU+ID8gVSA6IFIpIDogdW5rbm93blxuXG5leHBvcnQgdHlwZSBJVW5wYWNrSHR0cFJlcXVlc3RPcHRpb25zPEg+ID1cblx0SCBleHRlbmRzIElIdHRwUmVxdWVzdDxpbmZlciBSLCBhbnk+ID8gUiA6IHVua25vd25cblxuZXhwb3J0IGludGVyZmFjZSBJUmV0cnlGblxue1xuXHQ8VCBleHRlbmRzIEVycm9yPih0cmllczogbnVtYmVyLCBlcnI/OiBUKTogUmVzb2x2YWJsZTxib29sZWFuPlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSZXRyeVdhaXRGblxue1xuXHQodHJpZXM6IG51bWJlcik6IFJlc29sdmFibGU8bnVtYmVyPlxufVxuXG5leHBvcnQgZGVmYXVsdCBMZXRzV3JhcFxuIl19