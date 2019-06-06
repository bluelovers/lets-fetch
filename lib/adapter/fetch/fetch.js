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
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const bluebird_1 = __importDefault(require("bluebird"));
const __1 = __importDefault(require("../.."));
const bindAll_1 = require("lodash-decorators/bindAll");
var EnumResponseType;
(function (EnumResponseType) {
    EnumResponseType["response"] = "response";
    EnumResponseType["json"] = "json";
    EnumResponseType["text"] = "text";
})(EnumResponseType = exports.EnumResponseType || (exports.EnumResponseType = {}));
let LetsWrapFetch = class LetsWrapFetch extends __1.default {
    constructor(options) {
        super(options);
        // @ts-ignore
        this.defaultOptions.type = this.defaultOptions.type || "json" /* json */;
        this.$http = this.$http || {
            request: cross_fetch_1.default,
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
            return bluebird_1.default.reject(err);
        });
    }
};
LetsWrapFetch = __decorate([
    bindAll_1.BindAll(),
    __metadata("design:paramtypes", [Object])
], LetsWrapFetch);
exports.LetsWrapFetch = LetsWrapFetch;
exports.default = LetsWrapFetch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWRhcHRlci9mZXRjaC9mZXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLGFBQWE7QUFDYiw4REFBZ0M7QUFDaEMsd0RBQStCO0FBQy9CLDhDQUF5RTtBQUN6RSx1REFBbUQ7QUFPbkQsSUFBa0IsZ0JBS2pCO0FBTEQsV0FBa0IsZ0JBQWdCO0lBRWpDLHlDQUFxQixDQUFBO0lBQ3JCLGlDQUFhLENBQUE7SUFDYixpQ0FBYSxDQUFBO0FBQ2QsQ0FBQyxFQUxpQixnQkFBZ0IsR0FBaEIsd0JBQWdCLEtBQWhCLHdCQUFnQixRQUtqQztBQWFELElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWMsU0FBUSxXQUF1QztJQUV6RSxZQUFZLE9BQStCO1FBRTFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVmLGFBQWE7UUFDYixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUkscUJBQXlCLENBQUM7UUFFN0UsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJO1lBQzFCLE9BQU8sRUFBRSxxQkFBTTtTQUNmLENBQUE7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQy9CO1lBQ0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO1NBQ2xDO0lBQ0YsQ0FBQztJQUVELE1BQU0sQ0FBZSxHQUFXLEVBQUUsT0FBMEQ7UUFFM0YsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBRUQsSUFBSSxDQUFtQyxJQUFjLEVBQUUsT0FBK0I7UUFFckYsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFJLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUNwQyxDQUFDO0lBRUQsY0FBYyxDQUFDLE9BQThCO1FBRTVDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFdkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7YUFDckIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUduQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQ2pCO2dCQUNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDVjtRQUVGLENBQUMsQ0FBQyxDQUNGO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDWCxDQUFDO0lBRUQsT0FBTyxDQUFlLEdBQVcsRUFBRSxPQUErQjtRQUVqRSxJQUFJLGFBQXVCLENBQUM7UUFDNUIsSUFBSSxZQUFlLENBQUM7UUFFcEIsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckMsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFXLEdBQUcsRUFBRSxPQUFPLENBQUM7YUFDMUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFFbEIsYUFBYSxHQUFHLFFBQVEsQ0FBQztZQUV6QixRQUFRLE9BQU8sQ0FBQyxJQUFJLEVBQ3BCO2dCQUNDLHVCQUEyQjtnQkFDM0IsS0FBSyxNQUFNO29CQUNWLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFBO2dCQUN2Qix1QkFBMkI7Z0JBQzNCLEtBQUssTUFBTTtvQkFDVixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDdkIsK0JBQStCO2dCQUMvQixLQUFLLFVBQVUsQ0FBQztnQkFDaEI7b0JBQ0MsT0FBTyxRQUFRLENBQUE7YUFDaEI7WUFFRCxPQUFPLFFBQVEsQ0FBQztRQUNqQixDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsQ0FBQyxPQUFVLEVBQUUsRUFBRTtZQUVwQixZQUFZLEdBQUcsT0FBTyxDQUFDO1lBRXZCLElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUNoRDtnQkFDQyxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUE7YUFDbEQ7WUFFRCxPQUFPLE9BQU8sQ0FBQTtRQUNmLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBRWxCLElBQUksR0FBRyxHQUFnQixLQUFLLENBQUM7WUFFN0IsSUFBSSxDQUFDLENBQUMsR0FBRyxZQUFZLEtBQUssQ0FBQyxJQUFJLGFBQWEsSUFBSSxhQUFhLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFDM0U7Z0JBQ0MsR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsYUFBYSxDQUFDLE1BQU0sS0FBSyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7Z0JBRTVFLGFBQWE7Z0JBQ2IsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7YUFDakI7WUFFRCxHQUFHLENBQUMsVUFBVSxHQUFHLGFBQWEsQ0FBQTtZQUM5QixHQUFHLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQTtZQUM1QixHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQTtZQUVmLE9BQU8sa0JBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDNUIsQ0FBQyxDQUF1QixDQUFBO0lBQzFCLENBQUM7Q0FDRCxDQUFBO0FBekdZLGFBQWE7SUFEekIsaUJBQU8sRUFBRTs7R0FDRyxhQUFhLENBeUd6QjtBQXpHWSxzQ0FBYTtBQTJHMUIsa0JBQWUsYUFBYSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWlnbm9yZVxuaW1wb3J0IF9mZXRjaCBmcm9tICdjcm9zcy1mZXRjaCdcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCdcbmltcG9ydCBMZXRzV3JhcCwgeyBJTGV0c1dyYXBPcHRpb25zQ29yZSwgSUxldHNXcmFwT3B0aW9ucyB9IGZyb20gJy4uLy4uJztcbmltcG9ydCB7IEJpbmRBbGwgfSBmcm9tICdsb2Rhc2gtZGVjb3JhdG9ycy9iaW5kQWxsJ1xuXG5leHBvcnQgaW50ZXJmYWNlIElGZXRjaFxue1xuXHRyZXF1ZXN0OiB0eXBlb2YgX2ZldGNoXG59XG5cbmV4cG9ydCBjb25zdCBlbnVtIEVudW1SZXNwb25zZVR5cGVcbntcblx0cmVzcG9uc2UgPSAncmVzcG9uc2UnLFxuXHRqc29uID0gJ2pzb24nLFxuXHR0ZXh0ID0gJ3RleHQnLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElMZXRzV3JhcEZldGNoT3B0aW9uczxUID0gRW51bVJlc3BvbnNlVHlwZS5yZXNwb25zZSB8IEVudW1SZXNwb25zZVR5cGUudGV4dCB8IEVudW1SZXNwb25zZVR5cGUuanNvbiB8IHN0cmluZyB8ICd0ZXh0JyB8ICdqc29uJyB8ICdyZXNwb25zZSc+IGV4dGVuZHMgSUxldHNXcmFwT3B0aW9uczxJRmV0Y2gsIFJlcXVlc3RJbml0Plxue1xuXHQvKipcblx0ICogcmVzcG9uc2UgdHlwZSwgY2FuIGJlIFwianNvblwiLCBcInRleHRcIiBvciBcInJlc3BvbnNlXCJcblx0ICovXG5cdHR5cGU/OiBULFxuXG5cdGh0dHA/OiBJRmV0Y2g7XG59XG5cbkBCaW5kQWxsKClcbmV4cG9ydCBjbGFzcyBMZXRzV3JhcEZldGNoIGV4dGVuZHMgTGV0c1dyYXA8SUZldGNoLCBJTGV0c1dyYXBGZXRjaE9wdGlvbnM+XG57XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBJTGV0c1dyYXBGZXRjaE9wdGlvbnMpXG5cdHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHR0aGlzLmRlZmF1bHRPcHRpb25zLnR5cGUgPSB0aGlzLmRlZmF1bHRPcHRpb25zLnR5cGUgfHwgRW51bVJlc3BvbnNlVHlwZS5qc29uO1xuXG5cdFx0dGhpcy4kaHR0cCA9IHRoaXMuJGh0dHAgfHwge1xuXHRcdFx0cmVxdWVzdDogX2ZldGNoLFxuXHRcdH1cblxuXHRcdGlmICghdGhpcy5kZWZhdWx0T3B0aW9ucy5tZXRob2QpXG5cdFx0e1xuXHRcdFx0dGhpcy5kZWZhdWx0T3B0aW9ucy5tZXRob2QgPSAnR0VUJ1xuXHRcdH1cblx0fVxuXG5cdHNpbmdsZTxUID0gUmVzcG9uc2U+KHVybDogc3RyaW5nLCBvcHRpb25zPzogSUxldHNXcmFwRmV0Y2hPcHRpb25zPEVudW1SZXNwb25zZVR5cGUgfCBzdHJpbmc+KTogQmx1ZWJpcmQ8VD5cblx0e1xuXHRcdHJldHVybiBzdXBlci5zaW5nbGUodXJsLCBvcHRpb25zKVxuXHR9XG5cblx0bWFueTxUIGV4dGVuZHMgdW5rbm93bltdID0gUmVzcG9uc2VbXT4odXJsczogc3RyaW5nW10sIG9wdGlvbnM/OiBJTGV0c1dyYXBGZXRjaE9wdGlvbnMpOiBCbHVlYmlyZDxUPlxuXHR7XG5cdFx0cmV0dXJuIHN1cGVyLm1hbnk8VD4odXJscywgb3B0aW9ucylcblx0fVxuXG5cdHJlcXVlc3RPcHRpb25zKG9wdGlvbnM6IElMZXRzV3JhcEZldGNoT3B0aW9ucylcblx0e1xuXHRcdGxldCBybyA9IHN1cGVyLnJlcXVlc3RPcHRpb25zKG9wdGlvbnMpO1xuXG5cdFx0T2JqZWN0LmVudHJpZXMob3B0aW9ucylcblx0XHRcdC5mb3JFYWNoKChbaywgdl0pID0+XG5cdFx0XHR7XG5cblx0XHRcdFx0aWYgKHJvW2tdID09IG51bGwpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyb1trXSA9IHY7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSlcblx0XHQ7XG5cblx0XHRyZXR1cm4gcm87XG5cdH1cblxuXHRyZXF1ZXN0PFQgPSBSZXNwb25zZT4odXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBJTGV0c1dyYXBGZXRjaE9wdGlvbnMpOiBCbHVlYmlyZDxUPlxuXHR7XG5cdFx0bGV0IHNhdmVkUmVzcG9uc2U6IFJlc3BvbnNlO1xuXHRcdGxldCBzYXZlZENvbnRlbnQ6IFQ7XG5cblx0XHRvcHRpb25zID0gdGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucyk7XG5cblx0XHRyZXR1cm4gc3VwZXIucmVxdWVzdDxSZXNwb25zZT4odXJsLCBvcHRpb25zKVxuXHRcdFx0LnRoZW4oKHJlc3BvbnNlKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRzYXZlZFJlc3BvbnNlID0gcmVzcG9uc2U7XG5cblx0XHRcdFx0c3dpdGNoIChvcHRpb25zLnR5cGUpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjYXNlIEVudW1SZXNwb25zZVR5cGUudGV4dDpcblx0XHRcdFx0XHRjYXNlICd0ZXh0Jzpcblx0XHRcdFx0XHRcdHJldHVybiByZXNwb25zZS50ZXh0KClcblx0XHRcdFx0XHRjYXNlIEVudW1SZXNwb25zZVR5cGUuanNvbjpcblx0XHRcdFx0XHRjYXNlICdqc29uJzpcblx0XHRcdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKClcblx0XHRcdFx0XHRjYXNlIEVudW1SZXNwb25zZVR5cGUucmVzcG9uc2U6XG5cdFx0XHRcdFx0Y2FzZSAncmVzcG9uc2UnOlxuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2Vcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiByZXNwb25zZTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbigoY29udGVudDogVCkgPT5cblx0XHRcdHtcblx0XHRcdFx0c2F2ZWRDb250ZW50ID0gY29udGVudDtcblxuXHRcdFx0XHRpZiAoc2F2ZWRSZXNwb25zZSAmJiBzYXZlZFJlc3BvbnNlLnN0YXR1cyA+PSA0MDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFJlc3BvbnNlIHN0YXR1cyBpbmRpY2F0ZXMgZXJyb3JgKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGNvbnRlbnRcblx0XHRcdH0pLmNhdGNoKChlcnJvcikgPT5cblx0XHRcdHtcblx0XHRcdFx0bGV0IGVycjogRXJyb3IgJiBhbnkgPSBlcnJvcjtcblxuXHRcdFx0XHRpZiAoIShlcnIgaW5zdGFuY2VvZiBFcnJvcikgJiYgc2F2ZWRSZXNwb25zZSAmJiBzYXZlZFJlc3BvbnNlLnN0YXR1cyA+PSA0MDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRlcnIgPSBuZXcgRXJyb3IoYFN0YXR1cyAke3NhdmVkUmVzcG9uc2Uuc3RhdHVzfTogJHtlcnJvciAmJiBlcnJvci5tZXNzYWdlfWApXG5cblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0ZXJyLl9vbGRfID0gZXJyb3Jcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVyci5fcmVzcG9uc2VfID0gc2F2ZWRSZXNwb25zZVxuXHRcdFx0XHRlcnIuX2NvbnRlbnRfID0gc2F2ZWRDb250ZW50XG5cdFx0XHRcdGVyci5fdXJsXyA9IHVybFxuXG5cdFx0XHRcdHJldHVybiBCbHVlYmlyZC5yZWplY3QoZXJyKVxuXHRcdFx0fSkgYXMgYW55IGFzIEJsdWViaXJkPFQ+XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGV0c1dyYXBGZXRjaFxuIl19