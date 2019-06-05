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
            [SymbolRequest]: orig || request
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
            return this.$http.request(url, this.requestOption(options, url));
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
    requestOption(options, url) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBMkIsY0FBYyxFQUFRLE1BQU0sUUFBUSxDQUFDO0FBQ3ZFLE9BQU8sUUFBUSxNQUFNLFVBQVUsQ0FBQztBQUNoQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sMkJBQTJCLENBQUE7QUFJbkQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvQyxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBK0IzQyxNQUFNLGNBQWMsR0FBYSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDN0MsTUFBTSxrQkFBa0IsR0FBaUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUd0RCxJQUFhLFFBQVEsZ0JBQXJCLE1BQWEsUUFBUTtJQWVwQixZQUFzQixpQkFBeUMsRUFBUztRQUFsRCxtQkFBYyxHQUFkLGNBQWMsQ0FBb0M7UUFFdkUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFTLENBQUMsQ0FBQTtJQUMzQixDQUFDO0lBZEQsTUFBTSxDQUFDLGFBQWEsQ0FBYSxPQUFPLEVBQUUsSUFBUztRQUVsRCxPQUFPO1lBQ04sT0FBTyxDQUFDLEdBQVcsRUFBRSxPQUFZO2dCQUVoQyxPQUFPLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFDN0IsQ0FBQztZQUNELENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxJQUFJLE9BQU87U0FDaEMsQ0FBQTtJQUNGLENBQUM7SUFPRCxXQUFXLENBQUMsT0FBZ0M7UUFFM0MsTUFBTSxJQUFJLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0lBQzVDLENBQUM7SUFFRCxVQUFVLENBQUMsT0FBZ0M7UUFFMUMsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQTtRQUV4QyxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVyQyxPQUFPLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRWxHLE9BQU8sQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLGFBQWEsSUFBSSxjQUFjLENBQUMsYUFBYSxJQUFJLGNBQWMsQ0FBQztRQUNoRyxPQUFPLENBQUMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixJQUFJLGNBQWMsQ0FBQyxpQkFBaUIsSUFBSSxrQkFBa0IsQ0FBQztRQUVoSCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFNUMsYUFBYTtRQUNiLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztRQUVyRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7T0FFRztJQUNILE9BQU8sQ0FBc0MsR0FBVyxFQUFFLE9BQWdDO1FBRXpGLE9BQU8sUUFBUTthQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ25DLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBRWpCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDakUsQ0FBQyxDQUFDO2FBQ0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBRVI7Ozs7O2VBS0c7UUFDSixDQUFDLENBQXVCLENBQ3ZCO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0gsTUFBTSxDQUFzQyxHQUFXLEVBQUUsT0FBZ0M7UUFFeEYsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBRWQsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckMsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUUxQixPQUFPLFFBQVE7YUFDYixPQUFPLENBQUMsT0FBTyxDQUFDO2FBQ2hCLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBRWpCLE1BQU0sRUFBRSxhQUFhLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxPQUFPLENBQUM7WUFFckQsTUFBTSxXQUFXLEdBQUcsR0FBRyxFQUFFO2dCQUV4QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQztxQkFDL0IsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTtvQkFFcEIsSUFBSSxNQUFNLGFBQWEsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsRUFDckM7d0JBQ0MsTUFBTSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0saUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTt3QkFDcEQsT0FBTyxXQUFXLEVBQUUsQ0FBQTtxQkFDcEI7b0JBRUQsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUM1QixDQUFDLENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQztZQUVGLElBQUksT0FBTyxHQUFHLENBQUMsRUFDZjtnQkFDQyxPQUFPLGNBQWMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTthQUN2RDtZQUVELE9BQU8sV0FBVyxFQUFFLENBQUE7UUFDckIsQ0FBQyxDQUFDO2FBQ0QsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBRWYsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDMUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDL0IsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFFM0IsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUNmO2dCQUNDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzdDO1FBRUYsQ0FBQyxDQUF1QixDQUN2QjtJQUNILENBQUM7SUFFRCxJQUFJLENBQTBELElBQWMsRUFDM0UsT0FBZ0M7UUFHaEMsT0FBTyxRQUFRO2FBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDbkMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFFakIsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLE9BQU8sQ0FBQztZQUU3QixPQUFPLFFBQVE7aUJBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUNiLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBMkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO2dCQUUvRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRXpFLENBQUMsQ0FBdUIsQ0FDdEI7UUFDSCxDQUFDLENBQUMsQ0FDRDtJQUNILENBQUM7SUFFRCxZQUFZLENBQUMsT0FBK0I7UUFFM0MsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNsQyxhQUFhO1FBQ2IsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFFeEIsSUFBSSxjQUFjLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsY0FBYyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsY0FBYyxDQUFNLENBQUM7UUFFbkcsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQTRCLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRTtZQUMzRSxjQUFjO1NBQ2QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUErQixFQUFFLEdBQVk7UUFFMUQsSUFBSSxFQUFFLEdBQUc7WUFDUixHQUFHLE9BQU8sQ0FBQyxjQUFjO1NBQ3pCLENBQUM7UUFFRixhQUFhO1FBQ2IsSUFBSSxFQUFFLENBQUMsT0FBTyxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsT0FBTyxFQUN6QztZQUNDLGFBQWE7WUFDYixFQUFFLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUE7U0FDNUI7UUFFRCxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQ2Y7WUFDQyxhQUFhO1lBQ2IsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7U0FDWjtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ1gsQ0FBQztJQUVEOzs7T0FHRztJQUNILFFBQVEsQ0FBQyxPQUFpQjtRQUV6QixJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUM7UUFFNUMsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsWUFBWSxDQUFDLFFBQXNCO1FBRWxDLElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDO1FBRWpELE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELElBQUksT0FBTztRQUVWLE9BQU87WUFDTixHQUFHLElBQUksQ0FBQyxjQUFjO1lBQ3RCLGFBQWE7WUFDYixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7U0FDakIsQ0FBQTtJQUNGLENBQUM7SUFFRCxLQUFLLENBQXNDLE9BQTBDO1FBRXBGLE9BQU8sSUFBSSxVQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFjLENBQVEsQ0FBQyxDQUFBO0lBQzlELENBQUM7Q0FFRCxDQUFBO0FBdE5ZLFFBQVE7SUFEcEIsT0FBTyxFQUFFOztHQUNHLFFBQVEsQ0FzTnBCO1NBdE5ZLFFBQVE7QUEwT3JCLGVBQWUsUUFBUSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVzb2x2YWJsZSwgcmVzb2x2ZUNhbGwsIHJlc29sdmVUaW1lb3V0LCB3YWl0IH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBCaW5kQWxsIH0gZnJvbSAnbG9kYXNoLWRlY29yYXRvcnMvYmluZEFsbCdcbmltcG9ydCB7IElUU092ZXJ3cml0ZSB9IGZyb20gJ3RzLXR5cGUnXG5pbXBvcnQgeyBBeGlvc0luc3RhbmNlIH0gZnJvbSAnYXhpb3MnO1xuXG5leHBvcnQgY29uc3QgU3ltYm9sUmVxdWVzdCA9IFN5bWJvbCgncmVxdWVzdCcpO1xuZXhwb3J0IGNvbnN0IFN5bWJvbEVycm9yID0gU3ltYm9sKCdlcnJvcicpO1xuXG5leHBvcnQgaW50ZXJmYWNlIElIdHRwUmVxdWVzdDxPID0gdW5rbm93biwgUiA9IHVua25vd24sIEYgPSB1bmtub3duPlxue1xuXHRyZXF1ZXN0Pyh1cmw6IHN0cmluZywgb3B0aW9ucz86IE8pOiBQcm9taXNlTGlrZTxSPlxuXG5cdFtTeW1ib2xSZXF1ZXN0XT86IEZcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJTGV0c1dyYXBPcHRpb25zQ29yZTxIIGV4dGVuZHMgSUh0dHBSZXF1ZXN0Plxue1xuXHQvKipcblx0ICogd2FpdCB0aW1lIGluIGJldHdlZW4gcmVxdWVzdHMgKG9ubHkgZm9yIFwibWFueVwiKVxuXHQgKiBhcyBzb29uIGFzIHRoaXMgaXMgc2V0LCByZXF1ZXN0cyB3aWxsIGJlIHNlbnQgaW4gc2VyaWVzIGluc3RlYWQgb2YgcGFyYWxsZWxcblx0ICovXG5cdHdhaXRUaW1lPzogbnVtYmVyLFxuXG5cdC8qKlxuXHQgKiByZXF1ZXN0L3Jlc3BvbnNlIHRpbWVvdXQgaW4gbXMsIDAgdG8gZGlzYWJsZVxuXHQgKiAoISkgb25seSBhdmFpbGFibGUgaW4gbm9kZS5qcyBlbnZpcm9ubWVudHNcblx0ICovXG5cdHRpbWVvdXQ/OiBudW1iZXIsXG5cblx0cmVxdWVzdE9wdGlvbnM/OiBQYXJ0aWFsPElVbnBhY2tIdHRwUmVxdWVzdE9wdGlvbnM8SD4+LFxuXG5cdGludGVybmFsUmV0cnk/OiBJUmV0cnlGbixcblx0aW50ZXJuYWxSZXRyeVdhaXQ/OiBJUmV0cnlXYWl0Rm4sXG5cblx0JGh0dHA/OiBIXG59XG5cbmNvbnN0IF9pbnRlcm5hbFJldHJ5OiBJUmV0cnlGbiA9ICgpID0+IGZhbHNlO1xuY29uc3QgX2ludGVybmFsUmV0cnlXYWl0OiBJUmV0cnlXYWl0Rm4gPSAodHJpZXMpID0+IDA7XG5cbkBCaW5kQWxsKClcbmV4cG9ydCBjbGFzcyBMZXRzV3JhcDxIIGV4dGVuZHMgSUh0dHBSZXF1ZXN0PGFueSwgYW55LCBhbnk+LCBPID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4+XG57XG5cdHB1YmxpYyAkaHR0cDogSDtcblxuXHRzdGF0aWMgdG9SZXF1ZXN0TGlrZTxPMywgUjMsIFQzPihyZXF1ZXN0LCBvcmlnPzogVDMpOiBJSHR0cFJlcXVlc3Q8TzMsIFIzLCBUMz5cblx0e1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXF1ZXN0KHVybDogc3RyaW5nLCBvcHRpb25zPzogTzMpOiBQcm9taXNlTGlrZTxSMz5cblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHJlcXVlc3QodXJsLCBvcHRpb25zKVxuXHRcdFx0fSxcblx0XHRcdFtTeW1ib2xSZXF1ZXN0XTogb3JpZyB8fCByZXF1ZXN0XG5cdFx0fVxuXHR9XG5cblx0Y29uc3RydWN0b3IocHJvdGVjdGVkIGRlZmF1bHRPcHRpb25zOiBJTGV0c1dyYXBPcHRpb25zPEgsIE8+ID0ge30gYXMgYW55KVxuXHR7XG5cdFx0dGhpcy5zZXREZWZhdWx0KHt9IGFzIGFueSlcblx0fVxuXG5cdGRlZmF1bHRIdHRwKG9wdGlvbnM/OiBJTGV0c1dyYXBPcHRpb25zPEgsIE8+KTogSFxuXHR7XG5cdFx0dGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKGBub3QgaW1wbGVtZW50ZWRgKVxuXHR9XG5cblx0c2V0RGVmYXVsdChvcHRpb25zPzogSUxldHNXcmFwT3B0aW9uczxILCBPPilcblx0e1xuXHRcdGxldCBkZWZhdWx0T3B0aW9ucyA9IHRoaXMuZGVmYXVsdE9wdGlvbnNcblxuXHRcdG9wdGlvbnMgPSB0aGlzLm1lcmdlT3B0aW9ucyhvcHRpb25zKTtcblxuXHRcdG9wdGlvbnMucmVxdWVzdE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLnJlcXVlc3RPcHRpb25zLCBkZWZhdWx0T3B0aW9ucy5yZXF1ZXN0T3B0aW9ucyk7XG5cblx0XHRvcHRpb25zLmludGVybmFsUmV0cnkgPSBvcHRpb25zLmludGVybmFsUmV0cnkgfHwgZGVmYXVsdE9wdGlvbnMuaW50ZXJuYWxSZXRyeSB8fCBfaW50ZXJuYWxSZXRyeTtcblx0XHRvcHRpb25zLmludGVybmFsUmV0cnlXYWl0ID0gb3B0aW9ucy5pbnRlcm5hbFJldHJ5V2FpdCB8fCBkZWZhdWx0T3B0aW9ucy5pbnRlcm5hbFJldHJ5V2FpdCB8fCBfaW50ZXJuYWxSZXRyeVdhaXQ7XG5cblx0XHRPYmplY3QuYXNzaWduKHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHRoaXMuJGh0dHAgPSB0aGlzLmRlZmF1bHRPcHRpb25zLiRodHRwIHx8IHRoaXMuJGh0dHA7XG5cblx0XHRkZWxldGUgdGhpcy5kZWZhdWx0T3B0aW9ucy4kaHR0cDtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZW5kIGEgcmVxdWVzdCB1c2luZyB0aGUgdW5kZXJseWluZyBmZXRjaCBBUElcblx0ICovXG5cdHJlcXVlc3Q8VCA9IElVbnBhY2tSZXR1cm5UeXBlSHR0cFJlcXVlc3Q8SD4+KHVybDogc3RyaW5nLCBvcHRpb25zPzogSUxldHNXcmFwT3B0aW9uczxILCBPPik6IEJsdWViaXJkPFQ+XG5cdHtcblx0XHRyZXR1cm4gQmx1ZWJpcmRcblx0XHRcdC5yZXNvbHZlKHRoaXMubWVyZ2VPcHRpb25zKG9wdGlvbnMpKVxuXHRcdFx0LnRoZW4oKG9wdGlvbnMpID0+XG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiB0aGlzLiRodHRwLnJlcXVlc3QodXJsLCB0aGlzLnJlcXVlc3RPcHRpb24ob3B0aW9ucywgdXJsKSlcblx0XHRcdH0pXG5cdFx0XHQudGFwKHYgPT5cblx0XHRcdHtcblx0XHRcdFx0Lypcblx0XHRcdFx0Y29uc29sZS5kaXIoe1xuXHRcdFx0XHRcdHVybCxcblx0XHRcdFx0XHR2LFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0ICovXG5cdFx0XHR9KSBhcyBhbnkgYXMgQmx1ZWJpcmQ8VD5cblx0XHRcdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXF1ZXN0IGEgc2luZ2xlIHVybFxuXHQgKi9cblx0c2luZ2xlPFQgPSBJVW5wYWNrUmV0dXJuVHlwZUh0dHBSZXF1ZXN0PEg+Pih1cmw6IHN0cmluZywgb3B0aW9ucz86IElMZXRzV3JhcE9wdGlvbnM8SCwgTz4pOiBCbHVlYmlyZDxUPlxuXHR7XG5cdFx0bGV0IHRyaWVzID0gMTtcblxuXHRcdG9wdGlvbnMgPSB0aGlzLm1lcmdlT3B0aW9ucyhvcHRpb25zKTtcblxuXHRcdGxldCB7IHRpbWVvdXQgfSA9IG9wdGlvbnM7XG5cblx0XHRyZXR1cm4gQmx1ZWJpcmRcblx0XHRcdC5yZXNvbHZlKG9wdGlvbnMpXG5cdFx0XHQudGhlbigob3B0aW9ucykgPT5cblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgeyBpbnRlcm5hbFJldHJ5LCBpbnRlcm5hbFJldHJ5V2FpdCB9ID0gb3B0aW9ucztcblxuXHRcdFx0XHRjb25zdCBjYWxsUmVxdWVzdCA9ICgpID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5yZXF1ZXN0KHVybCwgb3B0aW9ucylcblx0XHRcdFx0XHRcdC5jYXRjaChhc3luYyAoZXJyKSA9PlxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRpZiAoYXdhaXQgaW50ZXJuYWxSZXRyeSgrK3RyaWVzLCBlcnIpKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0YXdhaXQgQmx1ZWJpcmQuZGVsYXkoYXdhaXQgaW50ZXJuYWxSZXRyeVdhaXQodHJpZXMpKVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBjYWxsUmVxdWVzdCgpXG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gQmx1ZWJpcmQucmVqZWN0KGVycilcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0aWYgKHRpbWVvdXQgPiAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc29sdmVUaW1lb3V0KGNhbGxSZXF1ZXN0KCksICh0aW1lb3V0IHwgMCkgKyAxKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGNhbGxSZXF1ZXN0KClcblx0XHRcdH0pXG5cdFx0XHQudGFwQ2F0Y2goZXJyID0+IHtcblxuXHRcdFx0XHRlcnJbU3ltYm9sRXJyb3JdID0gZXJyW1N5bWJvbEVycm9yXSB8fCB7fTtcblx0XHRcdFx0ZXJyW1N5bWJvbEVycm9yXS50cmllcyA9IHRyaWVzO1xuXHRcdFx0XHRlcnJbU3ltYm9sRXJyb3JdLnVybCA9IHVybDtcblxuXHRcdFx0XHRpZiAodGltZW91dCA+IDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRlcnJbU3ltYm9sRXJyb3JdLnRpbWVvdXQgPSAodGltZW91dCB8IDApICsgMTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9KSBhcyBhbnkgYXMgQmx1ZWJpcmQ8VD5cblx0XHRcdDtcblx0fVxuXG5cdG1hbnk8VCBleHRlbmRzIHVua25vd25bXSA9IElVbnBhY2tSZXR1cm5UeXBlSHR0cFJlcXVlc3Q8SD5bXT4odXJsczogc3RyaW5nW10sXG5cdFx0b3B0aW9ucz86IElMZXRzV3JhcE9wdGlvbnM8SCwgTz4sXG5cdCk6IEJsdWViaXJkPFQ+XG5cdHtcblx0XHRyZXR1cm4gQmx1ZWJpcmRcblx0XHRcdC5yZXNvbHZlKHRoaXMubWVyZ2VPcHRpb25zKG9wdGlvbnMpKVxuXHRcdFx0LnRoZW4oKG9wdGlvbnMpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IHsgd2FpdFRpbWUgfSA9IG9wdGlvbnM7XG5cblx0XHRcdFx0cmV0dXJuIEJsdWViaXJkXG5cdFx0XHRcdFx0LnJlc29sdmUodXJscylcblx0XHRcdFx0XHRbd2FpdFRpbWUgPyAnbWFwU2VyaWVzJyBhcyBhbnkgYXMgJ21hcCcgOiAnbWFwJ10oYXN5bmMgKHVybCkgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLnNpbmdsZSh1cmwsIG9wdGlvbnMpLnRhcCgoKSA9PiBCbHVlYmlyZC5kZWxheSh3YWl0VGltZSB8IDApKVxuXG5cdFx0XHRcdH0pIGFzIGFueSBhcyBCbHVlYmlyZDxUPlxuXHRcdFx0XHRcdDtcblx0XHRcdH0pXG5cdFx0XHQ7XG5cdH1cblxuXHRtZXJnZU9wdGlvbnMob3B0aW9uczogSUxldHNXcmFwT3B0aW9uczxILCBPPik6IElMZXRzV3JhcE9wdGlvbnM8SCwgTz5cblx0e1xuXHRcdGxldCBkZWZhdWx0T3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0XHRsZXQgcmVxdWVzdE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucy5yZXF1ZXN0T3B0aW9ucywgb3B0aW9ucy5yZXF1ZXN0T3B0aW9ucykgYXMgTztcblxuXHRcdHJldHVybiBPYmplY3QuYXNzaWduKHt9IGFzIElMZXRzV3JhcE9wdGlvbnM8SCwgTz4sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zLCB7XG5cdFx0XHRyZXF1ZXN0T3B0aW9ucyxcblx0XHR9KTtcblx0fVxuXG5cdHJlcXVlc3RPcHRpb24ob3B0aW9uczogSUxldHNXcmFwT3B0aW9uczxILCBPPiwgdXJsPzogc3RyaW5nKVxuXHR7XG5cdFx0bGV0IHJvID0ge1xuXHRcdFx0Li4ub3B0aW9ucy5yZXF1ZXN0T3B0aW9ucyxcblx0XHR9O1xuXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGlmIChyby50aW1lb3V0ID09IG51bGwgJiYgb3B0aW9ucy50aW1lb3V0KVxuXHRcdHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJvLnRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXRcblx0XHR9XG5cblx0XHRpZiAodXJsICE9IG51bGwpXG5cdFx0e1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cm8udXJsID0gdXJsXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJvO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCBhIGN1c3RvbSBkZWNpZGVyIGZ1bmN0aW9uIHRoYXQgZGVjaWRlcyB0byByZXRyeVxuXHQgKiBiYXNlZCBvbiB0aGUgbnVtYmVyIG9mIHRyaWVzIGFuZCB0aGUgcHJldmlvdXMgZXJyb3Jcblx0ICovXG5cdHNldFJldHJ5KGRlY2lkZXI6IElSZXRyeUZuKVxuXHR7XG5cdFx0dGhpcy5kZWZhdWx0T3B0aW9ucy5pbnRlcm5hbFJldHJ5ID0gZGVjaWRlcjtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCBhIGN1c3RvbSBmdW5jdGlvbiB0aGF0IHNldHMgaG93IGxvbmcgd2Ugc2hvdWxkXG5cdCAqIHNsZWVwIGJldHdlZW4gZWFjaCBmYWlsZWQgcmVxdWVzdFxuXHQgKi9cblx0c2V0UmV0cnlXYWl0KGNhbGxiYWNrOiBJUmV0cnlXYWl0Rm4pXG5cdHtcblx0XHR0aGlzLmRlZmF1bHRPcHRpb25zLmludGVybmFsUmV0cnlXYWl0ID0gY2FsbGJhY2s7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdGdldCBvcHRpb25zKCk6IElMZXRzV3JhcE9wdGlvbnM8SCwgTz5cblx0e1xuXHRcdHJldHVybiB7XG5cdFx0XHQuLi50aGlzLmRlZmF1bHRPcHRpb25zLFxuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0JGh0dHA6IHRoaXMuJGh0dHAsXG5cdFx0fVxuXHR9XG5cblx0Y2xvbmU8SDIgZXh0ZW5kcyBJSHR0cFJlcXVlc3QgPSBILCBPMiA9IE8+KG9wdGlvbnM/OiBJTGV0c1dyYXBPcHRpb25zPEggfCBIMiwgTyB8IE8yPik6IExldHNXcmFwPEgyLCBPMj5cblx0e1xuXHRcdHJldHVybiBuZXcgTGV0c1dyYXAodGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucyBhcyBhbnkpIGFzIGFueSlcblx0fVxuXG59XG5cbmV4cG9ydCB0eXBlIElMZXRzV3JhcE9wdGlvbnM8SCBleHRlbmRzIElIdHRwUmVxdWVzdCwgTyA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+PiA9IElMZXRzV3JhcE9wdGlvbnNDb3JlPEg+ICYgT1xuXG5leHBvcnQgdHlwZSBJVW5wYWNrUmV0dXJuVHlwZUh0dHBSZXF1ZXN0PEg+ID1cblx0SCBleHRlbmRzIElIdHRwUmVxdWVzdDxhbnksIGluZmVyIFI+ID8gKFIgZXh0ZW5kcyBSZXNvbHZhYmxlPGluZmVyIFU+ID8gVSA6IFIpIDogdW5rbm93blxuXG5leHBvcnQgdHlwZSBJVW5wYWNrSHR0cFJlcXVlc3RPcHRpb25zPEg+ID1cblx0SCBleHRlbmRzIElIdHRwUmVxdWVzdDxpbmZlciBSLCBhbnk+ID8gUiA6IHVua25vd25cblxuZXhwb3J0IGludGVyZmFjZSBJUmV0cnlGblxue1xuXHQ8VCBleHRlbmRzIEVycm9yPih0cmllczogbnVtYmVyLCBlcnI/OiBUKTogUmVzb2x2YWJsZTxib29sZWFuPlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSZXRyeVdhaXRGblxue1xuXHQodHJpZXM6IG51bWJlcik6IFJlc29sdmFibGU8bnVtYmVyPlxufVxuXG5leHBvcnQgZGVmYXVsdCBMZXRzV3JhcFxuIl19