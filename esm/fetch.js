var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import _fetch from 'cross-fetch';
import Bluebird from 'bluebird';
import LetsWrap from './core';
import { BindAll } from 'lodash-decorators/bindAll';
export var EnumResponseType;
(function (EnumResponseType) {
    EnumResponseType["response"] = "response";
    EnumResponseType["json"] = "json";
    EnumResponseType["text"] = "text";
})(EnumResponseType || (EnumResponseType = {}));
let LetsWrapFetch = class LetsWrapFetch extends LetsWrap {
    constructor(options) {
        super(options);
        this.retry = this.setRetry;
        this.retryWait = this.setRetryWait;
        // @ts-ignore
        this.defaultOptions.type = this.defaultOptions.type || "json" /* json */;
        this.$http = this.$http || {
            request: _fetch,
        };
    }
    single(url, options) {
        return super.single(url, options);
    }
    many(urls, options) {
        return super.many(urls, options);
    }
    request(url, options) {
        let savedResponse;
        let savedContent;
        // @ts-ignore
        options = this.mergeOptions(options);
        console.dir(options);
        return super.request(url, options)
            .then((response) => {
            savedResponse = response;
            switch (options.type) {
                case "text" /* text */:
                case 'text':
                    return response.text();
                case "json" /* json */:
                case 'json':
                    return response.json();
                case "response" /* response */:
                case 'response':
                default:
                    return response;
            }
            return response;
        })
            .then((content) => {
            savedContent = content;
            console.dir(content);
            if (savedResponse && savedResponse.status >= 400) {
                throw new Error(`Response status indicates error`);
            }
            return content;
        }).catch((err) => {
            err._response_ = savedResponse;
            err._content_ = savedContent;
            err._url_ = url;
            return Bluebird.reject(err);
        });
    }
};
LetsWrapFetch = __decorate([
    BindAll(),
    __metadata("design:paramtypes", [Object])
], LetsWrapFetch);
export { LetsWrapFetch };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZmV0Y2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxNQUFNLE1BQU0sYUFBYSxDQUFBO0FBQ2hDLE9BQU8sUUFBUSxNQUFNLFVBQVUsQ0FBQTtBQUMvQixPQUFPLFFBQThCLE1BQU0sUUFBUSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQTtBQU9uRCxNQUFNLENBQU4sSUFBa0IsZ0JBS2pCO0FBTEQsV0FBa0IsZ0JBQWdCO0lBRWpDLHlDQUFxQixDQUFBO0lBQ3JCLGlDQUFhLENBQUE7SUFDYixpQ0FBYSxDQUFBO0FBQ2QsQ0FBQyxFQUxpQixnQkFBZ0IsS0FBaEIsZ0JBQWdCLFFBS2pDO0FBYUQsSUFBYSxhQUFhLEdBQTFCLE1BQWEsYUFBYyxTQUFRLFFBQXVDO0lBRXpFLFlBQVksT0FBK0I7UUFFMUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBVWhCLFVBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3RCLGNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBVDdCLGFBQWE7UUFDYixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUkscUJBQXlCLENBQUE7UUFFNUUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJO1lBQzFCLE9BQU8sRUFBRSxNQUFNO1NBQ2YsQ0FBQTtJQUNGLENBQUM7SUFLRCxNQUFNLENBQWUsR0FBVyxFQUFFLE9BQTBEO1FBRTNGLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUVELElBQUksQ0FBbUMsSUFBYyxFQUFFLE9BQStCO1FBRXJGLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBSSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDcEMsQ0FBQztJQUVELE9BQU8sQ0FBZSxHQUFXLEVBQUUsT0FBK0I7UUFFakUsSUFBSSxhQUF1QixDQUFDO1FBQzVCLElBQUksWUFBZSxDQUFDO1FBRXBCLGFBQWE7UUFDYixPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVyQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXJCLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBVyxHQUFHLEVBQUUsT0FBTyxDQUFDO2FBQzFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBRWxCLGFBQWEsR0FBRyxRQUFRLENBQUM7WUFFekIsUUFBUSxPQUFPLENBQUMsSUFBSSxFQUNwQjtnQkFDQyx1QkFBMkI7Z0JBQzNCLEtBQUssTUFBTTtvQkFDVixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDdkIsdUJBQTJCO2dCQUMzQixLQUFLLE1BQU07b0JBQ1YsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUE7Z0JBQ3ZCLCtCQUErQjtnQkFDL0IsS0FBSyxVQUFVLENBQUM7Z0JBQ2hCO29CQUNDLE9BQU8sUUFBUSxDQUFBO2FBQ2hCO1lBRUQsT0FBTyxRQUFRLENBQUM7UUFDakIsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLENBQUMsT0FBVSxFQUFFLEVBQUU7WUFFcEIsWUFBWSxHQUFHLE9BQU8sQ0FBQztZQUV2QixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXJCLElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUNoRDtnQkFDQyxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUE7YUFDbEQ7WUFFRCxPQUFPLE9BQU8sQ0FBQTtRQUNmLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBR2hCLEdBQUcsQ0FBQyxVQUFVLEdBQUcsYUFBYSxDQUFBO1lBQzlCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFBO1lBQzVCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFBO1lBRWYsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzVCLENBQUMsQ0FBdUIsQ0FBQTtJQUMxQixDQUFDO0NBQ0QsQ0FBQTtBQWhGWSxhQUFhO0lBRHpCLE9BQU8sRUFBRTs7R0FDRyxhQUFhLENBZ0Z6QjtTQWhGWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF9mZXRjaCBmcm9tICdjcm9zcy1mZXRjaCdcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCdcbmltcG9ydCBMZXRzV3JhcCwgeyBJTGV0c1dyYXBPcHRpb25zIH0gZnJvbSAnLi9jb3JlJztcbmltcG9ydCB7IEJpbmRBbGwgfSBmcm9tICdsb2Rhc2gtZGVjb3JhdG9ycy9iaW5kQWxsJ1xuXG5leHBvcnQgaW50ZXJmYWNlIElGZXRjaFxue1xuXHRyZXF1ZXN0OiB0eXBlb2YgX2ZldGNoXG59XG5cbmV4cG9ydCBjb25zdCBlbnVtIEVudW1SZXNwb25zZVR5cGVcbntcblx0cmVzcG9uc2UgPSAncmVzcG9uc2UnLFxuXHRqc29uID0gJ2pzb24nLFxuXHR0ZXh0ID0gJ3RleHQnLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElMZXRzV3JhcEZldGNoT3B0aW9uczxUIGV4dGVuZHMgRW51bVJlc3BvbnNlVHlwZSB8IHN0cmluZyA9IEVudW1SZXNwb25zZVR5cGUucmVzcG9uc2UgfCBFbnVtUmVzcG9uc2VUeXBlLnRleHQgfCBFbnVtUmVzcG9uc2VUeXBlLmpzb24gfCBzdHJpbmc+IGV4dGVuZHMgT21pdDxJTGV0c1dyYXBPcHRpb25zPFJlcXVlc3RJbml0LCBSZXNwb25zZT4sICdodHRwJyB8ICd0eXBlJz5cbntcblx0LyoqXG5cdCAqIHJlc3BvbnNlIHR5cGUsIGNhbiBiZSBcImpzb25cIiwgXCJ0ZXh0XCIgb3IgXCJyZXNwb25zZVwiXG5cdCAqL1xuXHR0eXBlPzogVCxcblxuXHRodHRwPzogSUZldGNoO1xufVxuXG5AQmluZEFsbCgpXG5leHBvcnQgY2xhc3MgTGV0c1dyYXBGZXRjaCBleHRlbmRzIExldHNXcmFwPFJlcXVlc3RJbml0LCBSZXNwb25zZSwgSUZldGNoPlxue1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zPzogSUxldHNXcmFwRmV0Y2hPcHRpb25zKVxuXHR7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0dGhpcy5kZWZhdWx0T3B0aW9ucy50eXBlID0gdGhpcy5kZWZhdWx0T3B0aW9ucy50eXBlIHx8IEVudW1SZXNwb25zZVR5cGUuanNvblxuXG5cdFx0dGhpcy4kaHR0cCA9IHRoaXMuJGh0dHAgfHwge1xuXHRcdFx0cmVxdWVzdDogX2ZldGNoLFxuXHRcdH1cblx0fVxuXG5cdHJldHJ5ID0gdGhpcy5zZXRSZXRyeTtcblx0cmV0cnlXYWl0ID0gdGhpcy5zZXRSZXRyeVdhaXQ7XG5cblx0c2luZ2xlPFQgPSBSZXNwb25zZT4odXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBJTGV0c1dyYXBGZXRjaE9wdGlvbnM8RW51bVJlc3BvbnNlVHlwZSB8IHN0cmluZz4pOiBCbHVlYmlyZDxUPlxuXHR7XG5cdFx0cmV0dXJuIHN1cGVyLnNpbmdsZSh1cmwsIG9wdGlvbnMpXG5cdH1cblxuXHRtYW55PFQgZXh0ZW5kcyB1bmtub3duW10gPSBSZXNwb25zZVtdPih1cmxzOiBzdHJpbmdbXSwgb3B0aW9ucz86IElMZXRzV3JhcEZldGNoT3B0aW9ucyk6IEJsdWViaXJkPFQ+XG5cdHtcblx0XHRyZXR1cm4gc3VwZXIubWFueTxUPih1cmxzLCBvcHRpb25zKVxuXHR9XG5cblx0cmVxdWVzdDxUID0gUmVzcG9uc2U+KHVybDogc3RyaW5nLCBvcHRpb25zPzogSUxldHNXcmFwRmV0Y2hPcHRpb25zKTogQmx1ZWJpcmQ8VD5cblx0e1xuXHRcdGxldCBzYXZlZFJlc3BvbnNlOiBSZXNwb25zZTtcblx0XHRsZXQgc2F2ZWRDb250ZW50OiBUO1xuXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdG9wdGlvbnMgPSB0aGlzLm1lcmdlT3B0aW9ucyhvcHRpb25zKTtcblxuXHRcdGNvbnNvbGUuZGlyKG9wdGlvbnMpO1xuXG5cdFx0cmV0dXJuIHN1cGVyLnJlcXVlc3Q8UmVzcG9uc2U+KHVybCwgb3B0aW9ucylcblx0XHRcdC50aGVuKChyZXNwb25zZSkgPT5cblx0XHRcdHtcblx0XHRcdFx0c2F2ZWRSZXNwb25zZSA9IHJlc3BvbnNlO1xuXG5cdFx0XHRcdHN3aXRjaCAob3B0aW9ucy50eXBlKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y2FzZSBFbnVtUmVzcG9uc2VUeXBlLnRleHQ6XG5cdFx0XHRcdFx0Y2FzZSAndGV4dCc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UudGV4dCgpXG5cdFx0XHRcdFx0Y2FzZSBFbnVtUmVzcG9uc2VUeXBlLmpzb246XG5cdFx0XHRcdFx0Y2FzZSAnanNvbic6XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpXG5cdFx0XHRcdFx0Y2FzZSBFbnVtUmVzcG9uc2VUeXBlLnJlc3BvbnNlOlxuXHRcdFx0XHRcdGNhc2UgJ3Jlc3BvbnNlJzpcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2U7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oKGNvbnRlbnQ6IFQpID0+XG5cdFx0XHR7XG5cdFx0XHRcdHNhdmVkQ29udGVudCA9IGNvbnRlbnQ7XG5cblx0XHRcdFx0Y29uc29sZS5kaXIoY29udGVudCk7XG5cblx0XHRcdFx0aWYgKHNhdmVkUmVzcG9uc2UgJiYgc2F2ZWRSZXNwb25zZS5zdGF0dXMgPj0gNDAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBSZXNwb25zZSBzdGF0dXMgaW5kaWNhdGVzIGVycm9yYClcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBjb250ZW50XG5cdFx0XHR9KS5jYXRjaCgoZXJyKSA9PlxuXHRcdFx0e1xuXG5cdFx0XHRcdGVyci5fcmVzcG9uc2VfID0gc2F2ZWRSZXNwb25zZVxuXHRcdFx0XHRlcnIuX2NvbnRlbnRfID0gc2F2ZWRDb250ZW50XG5cdFx0XHRcdGVyci5fdXJsXyA9IHVybFxuXG5cdFx0XHRcdHJldHVybiBCbHVlYmlyZC5yZWplY3QoZXJyKVxuXHRcdFx0fSkgYXMgYW55IGFzIEJsdWViaXJkPFQ+XG5cdH1cbn1cbiJdfQ==