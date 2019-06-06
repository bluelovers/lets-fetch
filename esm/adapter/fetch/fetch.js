var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// @ts-ignore
import _fetch from 'cross-fetch';
import Bluebird from 'bluebird';
import LetsWrap from '../..';
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
        // @ts-ignore
        this.defaultOptions.type = this.defaultOptions.type || "json" /* json */;
        this.$http = this.$http || {
            request: _fetch,
        };
        if (!this.defaultOptions.method) {
            this.defaultOptions.method = 'GET';
        }
    }
    single(url, options) {
        return super.single(url, options);
    }
    many(urls, options) {
        return super.many(urls, options);
    }
    requestOptions(options) {
        let ro = super.requestOptions(options);
        Object.entries(options)
            .forEach(([k, v]) => {
            if (ro[k] == null) {
                ro[k] = v;
            }
        });
        return ro;
    }
    request(url, options) {
        let savedResponse;
        let savedContent;
        options = this.mergeOptions(options);
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
            if (savedResponse && savedResponse.status >= 400) {
                throw new Error(`Response status indicates error`);
            }
            return content;
        }).catch((error) => {
            let err = error;
            if (!(err instanceof Error) && savedResponse && savedResponse.status >= 400) {
                err = new Error(`Status ${savedResponse.status}: ${error && error.message}`);
                // @ts-ignore
                err._old_ = error;
            }
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
export default LetsWrapFetch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWRhcHRlci9mZXRjaC9mZXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0sYUFBYSxDQUFBO0FBQ2hDLE9BQU8sUUFBUSxNQUFNLFVBQVUsQ0FBQTtBQUMvQixPQUFPLFFBQW9ELE1BQU0sT0FBTyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQTtBQU9uRCxNQUFNLENBQU4sSUFBa0IsZ0JBS2pCO0FBTEQsV0FBa0IsZ0JBQWdCO0lBRWpDLHlDQUFxQixDQUFBO0lBQ3JCLGlDQUFhLENBQUE7SUFDYixpQ0FBYSxDQUFBO0FBQ2QsQ0FBQyxFQUxpQixnQkFBZ0IsS0FBaEIsZ0JBQWdCLFFBS2pDO0FBYUQsSUFBYSxhQUFhLEdBQTFCLE1BQWEsYUFBYyxTQUFRLFFBQXVDO0lBRXpFLFlBQVksT0FBK0I7UUFFMUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWYsYUFBYTtRQUNiLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxxQkFBeUIsQ0FBQztRQUU3RSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUk7WUFDMUIsT0FBTyxFQUFFLE1BQU07U0FDZixDQUFBO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUMvQjtZQUNDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtTQUNsQztJQUNGLENBQUM7SUFFRCxNQUFNLENBQWUsR0FBVyxFQUFFLE9BQTBEO1FBRTNGLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUVELElBQUksQ0FBbUMsSUFBYyxFQUFFLE9BQStCO1FBRXJGLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBSSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDcEMsQ0FBQztJQUVELGNBQWMsQ0FBQyxPQUE4QjtRQUU1QyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXZDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO2FBQ3JCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFHbkIsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUNqQjtnQkFDQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ1Y7UUFFRixDQUFDLENBQUMsQ0FDRjtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ1gsQ0FBQztJQUVELE9BQU8sQ0FBZSxHQUFXLEVBQUUsT0FBK0I7UUFFakUsSUFBSSxhQUF1QixDQUFDO1FBQzVCLElBQUksWUFBZSxDQUFDO1FBRXBCLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXJDLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBVyxHQUFHLEVBQUUsT0FBTyxDQUFDO2FBQzFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBRWxCLGFBQWEsR0FBRyxRQUFRLENBQUM7WUFFekIsUUFBUSxPQUFPLENBQUMsSUFBSSxFQUNwQjtnQkFDQyx1QkFBMkI7Z0JBQzNCLEtBQUssTUFBTTtvQkFDVixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDdkIsdUJBQTJCO2dCQUMzQixLQUFLLE1BQU07b0JBQ1YsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUE7Z0JBQ3ZCLCtCQUErQjtnQkFDL0IsS0FBSyxVQUFVLENBQUM7Z0JBQ2hCO29CQUNDLE9BQU8sUUFBUSxDQUFBO2FBQ2hCO1lBRUQsT0FBTyxRQUFRLENBQUM7UUFDakIsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLENBQUMsT0FBVSxFQUFFLEVBQUU7WUFFcEIsWUFBWSxHQUFHLE9BQU8sQ0FBQztZQUV2QixJQUFJLGFBQWEsSUFBSSxhQUFhLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFDaEQ7Z0JBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFBO2FBQ2xEO1lBRUQsT0FBTyxPQUFPLENBQUE7UUFDZixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUVsQixJQUFJLEdBQUcsR0FBZ0IsS0FBSyxDQUFDO1lBRTdCLElBQUksQ0FBQyxDQUFDLEdBQUcsWUFBWSxLQUFLLENBQUMsSUFBSSxhQUFhLElBQUksYUFBYSxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQzNFO2dCQUNDLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxVQUFVLGFBQWEsQ0FBQyxNQUFNLEtBQUssS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO2dCQUU1RSxhQUFhO2dCQUNiLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO2FBQ2pCO1lBRUQsR0FBRyxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUE7WUFDOUIsR0FBRyxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUE7WUFDNUIsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUE7WUFFZixPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDNUIsQ0FBQyxDQUF1QixDQUFBO0lBQzFCLENBQUM7Q0FDRCxDQUFBO0FBekdZLGFBQWE7SUFEekIsT0FBTyxFQUFFOztHQUNHLGFBQWEsQ0F5R3pCO1NBekdZLGFBQWE7QUEyRzFCLGVBQWUsYUFBYSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWlnbm9yZVxuaW1wb3J0IF9mZXRjaCBmcm9tICdjcm9zcy1mZXRjaCdcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCdcbmltcG9ydCBMZXRzV3JhcCwgeyBJTGV0c1dyYXBPcHRpb25zQ29yZSwgSUxldHNXcmFwT3B0aW9ucyB9IGZyb20gJy4uLy4uJztcbmltcG9ydCB7IEJpbmRBbGwgfSBmcm9tICdsb2Rhc2gtZGVjb3JhdG9ycy9iaW5kQWxsJ1xuXG5leHBvcnQgaW50ZXJmYWNlIElGZXRjaFxue1xuXHRyZXF1ZXN0OiB0eXBlb2YgX2ZldGNoXG59XG5cbmV4cG9ydCBjb25zdCBlbnVtIEVudW1SZXNwb25zZVR5cGVcbntcblx0cmVzcG9uc2UgPSAncmVzcG9uc2UnLFxuXHRqc29uID0gJ2pzb24nLFxuXHR0ZXh0ID0gJ3RleHQnLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElMZXRzV3JhcEZldGNoT3B0aW9uczxUID0gRW51bVJlc3BvbnNlVHlwZS5yZXNwb25zZSB8IEVudW1SZXNwb25zZVR5cGUudGV4dCB8IEVudW1SZXNwb25zZVR5cGUuanNvbiB8IHN0cmluZyB8ICd0ZXh0JyB8ICdqc29uJyB8ICdyZXNwb25zZSc+IGV4dGVuZHMgSUxldHNXcmFwT3B0aW9uczxJRmV0Y2gsIFJlcXVlc3RJbml0Plxue1xuXHQvKipcblx0ICogcmVzcG9uc2UgdHlwZSwgY2FuIGJlIFwianNvblwiLCBcInRleHRcIiBvciBcInJlc3BvbnNlXCJcblx0ICovXG5cdHR5cGU/OiBULFxuXG5cdGh0dHA/OiBJRmV0Y2g7XG59XG5cbkBCaW5kQWxsKClcbmV4cG9ydCBjbGFzcyBMZXRzV3JhcEZldGNoIGV4dGVuZHMgTGV0c1dyYXA8SUZldGNoLCBJTGV0c1dyYXBGZXRjaE9wdGlvbnM+XG57XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBJTGV0c1dyYXBGZXRjaE9wdGlvbnMpXG5cdHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHR0aGlzLmRlZmF1bHRPcHRpb25zLnR5cGUgPSB0aGlzLmRlZmF1bHRPcHRpb25zLnR5cGUgfHwgRW51bVJlc3BvbnNlVHlwZS5qc29uO1xuXG5cdFx0dGhpcy4kaHR0cCA9IHRoaXMuJGh0dHAgfHwge1xuXHRcdFx0cmVxdWVzdDogX2ZldGNoLFxuXHRcdH1cblxuXHRcdGlmICghdGhpcy5kZWZhdWx0T3B0aW9ucy5tZXRob2QpXG5cdFx0e1xuXHRcdFx0dGhpcy5kZWZhdWx0T3B0aW9ucy5tZXRob2QgPSAnR0VUJ1xuXHRcdH1cblx0fVxuXG5cdHNpbmdsZTxUID0gUmVzcG9uc2U+KHVybDogc3RyaW5nLCBvcHRpb25zPzogSUxldHNXcmFwRmV0Y2hPcHRpb25zPEVudW1SZXNwb25zZVR5cGUgfCBzdHJpbmc+KTogQmx1ZWJpcmQ8VD5cblx0e1xuXHRcdHJldHVybiBzdXBlci5zaW5nbGUodXJsLCBvcHRpb25zKVxuXHR9XG5cblx0bWFueTxUIGV4dGVuZHMgdW5rbm93bltdID0gUmVzcG9uc2VbXT4odXJsczogc3RyaW5nW10sIG9wdGlvbnM/OiBJTGV0c1dyYXBGZXRjaE9wdGlvbnMpOiBCbHVlYmlyZDxUPlxuXHR7XG5cdFx0cmV0dXJuIHN1cGVyLm1hbnk8VD4odXJscywgb3B0aW9ucylcblx0fVxuXG5cdHJlcXVlc3RPcHRpb25zKG9wdGlvbnM6IElMZXRzV3JhcEZldGNoT3B0aW9ucylcblx0e1xuXHRcdGxldCBybyA9IHN1cGVyLnJlcXVlc3RPcHRpb25zKG9wdGlvbnMpO1xuXG5cdFx0T2JqZWN0LmVudHJpZXMob3B0aW9ucylcblx0XHRcdC5mb3JFYWNoKChbaywgdl0pID0+XG5cdFx0XHR7XG5cblx0XHRcdFx0aWYgKHJvW2tdID09IG51bGwpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyb1trXSA9IHY7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSlcblx0XHQ7XG5cblx0XHRyZXR1cm4gcm87XG5cdH1cblxuXHRyZXF1ZXN0PFQgPSBSZXNwb25zZT4odXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBJTGV0c1dyYXBGZXRjaE9wdGlvbnMpOiBCbHVlYmlyZDxUPlxuXHR7XG5cdFx0bGV0IHNhdmVkUmVzcG9uc2U6IFJlc3BvbnNlO1xuXHRcdGxldCBzYXZlZENvbnRlbnQ6IFQ7XG5cblx0XHRvcHRpb25zID0gdGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucyk7XG5cblx0XHRyZXR1cm4gc3VwZXIucmVxdWVzdDxSZXNwb25zZT4odXJsLCBvcHRpb25zKVxuXHRcdFx0LnRoZW4oKHJlc3BvbnNlKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRzYXZlZFJlc3BvbnNlID0gcmVzcG9uc2U7XG5cblx0XHRcdFx0c3dpdGNoIChvcHRpb25zLnR5cGUpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjYXNlIEVudW1SZXNwb25zZVR5cGUudGV4dDpcblx0XHRcdFx0XHRjYXNlICd0ZXh0Jzpcblx0XHRcdFx0XHRcdHJldHVybiByZXNwb25zZS50ZXh0KClcblx0XHRcdFx0XHRjYXNlIEVudW1SZXNwb25zZVR5cGUuanNvbjpcblx0XHRcdFx0XHRjYXNlICdqc29uJzpcblx0XHRcdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKClcblx0XHRcdFx0XHRjYXNlIEVudW1SZXNwb25zZVR5cGUucmVzcG9uc2U6XG5cdFx0XHRcdFx0Y2FzZSAncmVzcG9uc2UnOlxuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2Vcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiByZXNwb25zZTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbigoY29udGVudDogVCkgPT5cblx0XHRcdHtcblx0XHRcdFx0c2F2ZWRDb250ZW50ID0gY29udGVudDtcblxuXHRcdFx0XHRpZiAoc2F2ZWRSZXNwb25zZSAmJiBzYXZlZFJlc3BvbnNlLnN0YXR1cyA+PSA0MDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFJlc3BvbnNlIHN0YXR1cyBpbmRpY2F0ZXMgZXJyb3JgKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGNvbnRlbnRcblx0XHRcdH0pLmNhdGNoKChlcnJvcikgPT5cblx0XHRcdHtcblx0XHRcdFx0bGV0IGVycjogRXJyb3IgJiBhbnkgPSBlcnJvcjtcblxuXHRcdFx0XHRpZiAoIShlcnIgaW5zdGFuY2VvZiBFcnJvcikgJiYgc2F2ZWRSZXNwb25zZSAmJiBzYXZlZFJlc3BvbnNlLnN0YXR1cyA+PSA0MDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRlcnIgPSBuZXcgRXJyb3IoYFN0YXR1cyAke3NhdmVkUmVzcG9uc2Uuc3RhdHVzfTogJHtlcnJvciAmJiBlcnJvci5tZXNzYWdlfWApXG5cblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0ZXJyLl9vbGRfID0gZXJyb3Jcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVyci5fcmVzcG9uc2VfID0gc2F2ZWRSZXNwb25zZVxuXHRcdFx0XHRlcnIuX2NvbnRlbnRfID0gc2F2ZWRDb250ZW50XG5cdFx0XHRcdGVyci5fdXJsXyA9IHVybFxuXG5cdFx0XHRcdHJldHVybiBCbHVlYmlyZC5yZWplY3QoZXJyKVxuXHRcdFx0fSkgYXMgYW55IGFzIEJsdWViaXJkPFQ+XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGV0c1dyYXBGZXRjaFxuIl19