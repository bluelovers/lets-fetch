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
    requestOption(options) {
        let ro = super.requestOption(options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWRhcHRlci9mZXRjaC9mZXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0sYUFBYSxDQUFBO0FBQ2hDLE9BQU8sUUFBUSxNQUFNLFVBQVUsQ0FBQTtBQUMvQixPQUFPLFFBQW9ELE1BQU0sT0FBTyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQTtBQU9uRCxNQUFNLENBQU4sSUFBa0IsZ0JBS2pCO0FBTEQsV0FBa0IsZ0JBQWdCO0lBRWpDLHlDQUFxQixDQUFBO0lBQ3JCLGlDQUFhLENBQUE7SUFDYixpQ0FBYSxDQUFBO0FBQ2QsQ0FBQyxFQUxpQixnQkFBZ0IsS0FBaEIsZ0JBQWdCLFFBS2pDO0FBYUQsSUFBYSxhQUFhLEdBQTFCLE1BQWEsYUFBYyxTQUFRLFFBQXVDO0lBRXpFLFlBQVksT0FBK0I7UUFFMUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWYsYUFBYTtRQUNiLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxxQkFBeUIsQ0FBQztRQUU3RSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUk7WUFDMUIsT0FBTyxFQUFFLE1BQU07U0FDZixDQUFBO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUMvQjtZQUNDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtTQUNsQztJQUNGLENBQUM7SUFFRCxNQUFNLENBQWUsR0FBVyxFQUFFLE9BQTBEO1FBRTNGLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUVELElBQUksQ0FBbUMsSUFBYyxFQUFFLE9BQStCO1FBRXJGLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBSSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDcEMsQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUE4QjtRQUUzQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXRDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO2FBQ3JCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFHbkIsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUNqQjtnQkFDQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ1Y7UUFFRixDQUFDLENBQUMsQ0FDRjtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ1gsQ0FBQztJQUVELE9BQU8sQ0FBZSxHQUFXLEVBQUUsT0FBK0I7UUFFakUsSUFBSSxhQUF1QixDQUFDO1FBQzVCLElBQUksWUFBZSxDQUFDO1FBRXBCLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXJDLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBVyxHQUFHLEVBQUUsT0FBTyxDQUFDO2FBQzFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBRWxCLGFBQWEsR0FBRyxRQUFRLENBQUM7WUFFekIsUUFBUSxPQUFPLENBQUMsSUFBSSxFQUNwQjtnQkFDQyx1QkFBMkI7Z0JBQzNCLEtBQUssTUFBTTtvQkFDVixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDdkIsdUJBQTJCO2dCQUMzQixLQUFLLE1BQU07b0JBQ1YsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUE7Z0JBQ3ZCLCtCQUErQjtnQkFDL0IsS0FBSyxVQUFVLENBQUM7Z0JBQ2hCO29CQUNDLE9BQU8sUUFBUSxDQUFBO2FBQ2hCO1lBRUQsT0FBTyxRQUFRLENBQUM7UUFDakIsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLENBQUMsT0FBVSxFQUFFLEVBQUU7WUFFcEIsWUFBWSxHQUFHLE9BQU8sQ0FBQztZQUV2QixJQUFJLGFBQWEsSUFBSSxhQUFhLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFDaEQ7Z0JBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFBO2FBQ2xEO1lBRUQsT0FBTyxPQUFPLENBQUE7UUFDZixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUVsQixJQUFJLEdBQUcsR0FBZ0IsS0FBSyxDQUFDO1lBRTdCLElBQUksQ0FBQyxDQUFDLEdBQUcsWUFBWSxLQUFLLENBQUMsSUFBSSxhQUFhLElBQUksYUFBYSxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQzNFO2dCQUNDLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxVQUFVLGFBQWEsQ0FBQyxNQUFNLEtBQUssS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO2dCQUU1RSxhQUFhO2dCQUNiLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO2FBQ2pCO1lBRUQsR0FBRyxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUE7WUFDOUIsR0FBRyxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUE7WUFDNUIsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUE7WUFFZixPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDNUIsQ0FBQyxDQUF1QixDQUFBO0lBQzFCLENBQUM7Q0FDRCxDQUFBO0FBekdZLGFBQWE7SUFEekIsT0FBTyxFQUFFOztHQUNHLGFBQWEsQ0F5R3pCO1NBekdZLGFBQWE7QUEyRzFCLGVBQWUsYUFBYSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWlnbm9yZVxuaW1wb3J0IF9mZXRjaCBmcm9tICdjcm9zcy1mZXRjaCdcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCdcbmltcG9ydCBMZXRzV3JhcCwgeyBJTGV0c1dyYXBPcHRpb25zQ29yZSwgSUxldHNXcmFwT3B0aW9ucyB9IGZyb20gJy4uLy4uJztcbmltcG9ydCB7IEJpbmRBbGwgfSBmcm9tICdsb2Rhc2gtZGVjb3JhdG9ycy9iaW5kQWxsJ1xuXG5leHBvcnQgaW50ZXJmYWNlIElGZXRjaFxue1xuXHRyZXF1ZXN0OiB0eXBlb2YgX2ZldGNoXG59XG5cbmV4cG9ydCBjb25zdCBlbnVtIEVudW1SZXNwb25zZVR5cGVcbntcblx0cmVzcG9uc2UgPSAncmVzcG9uc2UnLFxuXHRqc29uID0gJ2pzb24nLFxuXHR0ZXh0ID0gJ3RleHQnLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElMZXRzV3JhcEZldGNoT3B0aW9uczxUID0gRW51bVJlc3BvbnNlVHlwZS5yZXNwb25zZSB8IEVudW1SZXNwb25zZVR5cGUudGV4dCB8IEVudW1SZXNwb25zZVR5cGUuanNvbiB8IHN0cmluZyB8ICd0ZXh0JyB8ICdqc29uJyB8ICdyZXNwb25zZSc+IGV4dGVuZHMgSUxldHNXcmFwT3B0aW9uczxJRmV0Y2gsIFJlcXVlc3RJbml0Plxue1xuXHQvKipcblx0ICogcmVzcG9uc2UgdHlwZSwgY2FuIGJlIFwianNvblwiLCBcInRleHRcIiBvciBcInJlc3BvbnNlXCJcblx0ICovXG5cdHR5cGU/OiBULFxuXG5cdGh0dHA/OiBJRmV0Y2g7XG59XG5cbkBCaW5kQWxsKClcbmV4cG9ydCBjbGFzcyBMZXRzV3JhcEZldGNoIGV4dGVuZHMgTGV0c1dyYXA8SUZldGNoLCBJTGV0c1dyYXBGZXRjaE9wdGlvbnM+XG57XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBJTGV0c1dyYXBGZXRjaE9wdGlvbnMpXG5cdHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHR0aGlzLmRlZmF1bHRPcHRpb25zLnR5cGUgPSB0aGlzLmRlZmF1bHRPcHRpb25zLnR5cGUgfHwgRW51bVJlc3BvbnNlVHlwZS5qc29uO1xuXG5cdFx0dGhpcy4kaHR0cCA9IHRoaXMuJGh0dHAgfHwge1xuXHRcdFx0cmVxdWVzdDogX2ZldGNoLFxuXHRcdH1cblxuXHRcdGlmICghdGhpcy5kZWZhdWx0T3B0aW9ucy5tZXRob2QpXG5cdFx0e1xuXHRcdFx0dGhpcy5kZWZhdWx0T3B0aW9ucy5tZXRob2QgPSAnR0VUJ1xuXHRcdH1cblx0fVxuXG5cdHNpbmdsZTxUID0gUmVzcG9uc2U+KHVybDogc3RyaW5nLCBvcHRpb25zPzogSUxldHNXcmFwRmV0Y2hPcHRpb25zPEVudW1SZXNwb25zZVR5cGUgfCBzdHJpbmc+KTogQmx1ZWJpcmQ8VD5cblx0e1xuXHRcdHJldHVybiBzdXBlci5zaW5nbGUodXJsLCBvcHRpb25zKVxuXHR9XG5cblx0bWFueTxUIGV4dGVuZHMgdW5rbm93bltdID0gUmVzcG9uc2VbXT4odXJsczogc3RyaW5nW10sIG9wdGlvbnM/OiBJTGV0c1dyYXBGZXRjaE9wdGlvbnMpOiBCbHVlYmlyZDxUPlxuXHR7XG5cdFx0cmV0dXJuIHN1cGVyLm1hbnk8VD4odXJscywgb3B0aW9ucylcblx0fVxuXG5cdHJlcXVlc3RPcHRpb24ob3B0aW9uczogSUxldHNXcmFwRmV0Y2hPcHRpb25zKVxuXHR7XG5cdFx0bGV0IHJvID0gc3VwZXIucmVxdWVzdE9wdGlvbihvcHRpb25zKTtcblxuXHRcdE9iamVjdC5lbnRyaWVzKG9wdGlvbnMpXG5cdFx0XHQuZm9yRWFjaCgoW2ssIHZdKSA9PlxuXHRcdFx0e1xuXG5cdFx0XHRcdGlmIChyb1trXSA9PSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cm9ba10gPSB2O1xuXHRcdFx0XHR9XG5cblx0XHRcdH0pXG5cdFx0O1xuXG5cdFx0cmV0dXJuIHJvO1xuXHR9XG5cblx0cmVxdWVzdDxUID0gUmVzcG9uc2U+KHVybDogc3RyaW5nLCBvcHRpb25zPzogSUxldHNXcmFwRmV0Y2hPcHRpb25zKTogQmx1ZWJpcmQ8VD5cblx0e1xuXHRcdGxldCBzYXZlZFJlc3BvbnNlOiBSZXNwb25zZTtcblx0XHRsZXQgc2F2ZWRDb250ZW50OiBUO1xuXG5cdFx0b3B0aW9ucyA9IHRoaXMubWVyZ2VPcHRpb25zKG9wdGlvbnMpO1xuXG5cdFx0cmV0dXJuIHN1cGVyLnJlcXVlc3Q8UmVzcG9uc2U+KHVybCwgb3B0aW9ucylcblx0XHRcdC50aGVuKChyZXNwb25zZSkgPT5cblx0XHRcdHtcblx0XHRcdFx0c2F2ZWRSZXNwb25zZSA9IHJlc3BvbnNlO1xuXG5cdFx0XHRcdHN3aXRjaCAob3B0aW9ucy50eXBlKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y2FzZSBFbnVtUmVzcG9uc2VUeXBlLnRleHQ6XG5cdFx0XHRcdFx0Y2FzZSAndGV4dCc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UudGV4dCgpXG5cdFx0XHRcdFx0Y2FzZSBFbnVtUmVzcG9uc2VUeXBlLmpzb246XG5cdFx0XHRcdFx0Y2FzZSAnanNvbic6XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpXG5cdFx0XHRcdFx0Y2FzZSBFbnVtUmVzcG9uc2VUeXBlLnJlc3BvbnNlOlxuXHRcdFx0XHRcdGNhc2UgJ3Jlc3BvbnNlJzpcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2U7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oKGNvbnRlbnQ6IFQpID0+XG5cdFx0XHR7XG5cdFx0XHRcdHNhdmVkQ29udGVudCA9IGNvbnRlbnQ7XG5cblx0XHRcdFx0aWYgKHNhdmVkUmVzcG9uc2UgJiYgc2F2ZWRSZXNwb25zZS5zdGF0dXMgPj0gNDAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBSZXNwb25zZSBzdGF0dXMgaW5kaWNhdGVzIGVycm9yYClcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBjb250ZW50XG5cdFx0XHR9KS5jYXRjaCgoZXJyb3IpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGxldCBlcnI6IEVycm9yICYgYW55ID0gZXJyb3I7XG5cblx0XHRcdFx0aWYgKCEoZXJyIGluc3RhbmNlb2YgRXJyb3IpICYmIHNhdmVkUmVzcG9uc2UgJiYgc2F2ZWRSZXNwb25zZS5zdGF0dXMgPj0gNDAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZXJyID0gbmV3IEVycm9yKGBTdGF0dXMgJHtzYXZlZFJlc3BvbnNlLnN0YXR1c306ICR7ZXJyb3IgJiYgZXJyb3IubWVzc2FnZX1gKVxuXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdGVyci5fb2xkXyA9IGVycm9yXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlcnIuX3Jlc3BvbnNlXyA9IHNhdmVkUmVzcG9uc2Vcblx0XHRcdFx0ZXJyLl9jb250ZW50XyA9IHNhdmVkQ29udGVudFxuXHRcdFx0XHRlcnIuX3VybF8gPSB1cmxcblxuXHRcdFx0XHRyZXR1cm4gQmx1ZWJpcmQucmVqZWN0KGVycilcblx0XHRcdH0pIGFzIGFueSBhcyBCbHVlYmlyZDxUPlxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExldHNXcmFwRmV0Y2hcbiJdfQ==