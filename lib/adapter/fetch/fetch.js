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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWRhcHRlci9mZXRjaC9mZXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLGFBQWE7QUFDYiw4REFBZ0M7QUFDaEMsd0RBQStCO0FBQy9CLDhDQUF5RTtBQUN6RSx1REFBbUQ7QUFPbkQsSUFBa0IsZ0JBS2pCO0FBTEQsV0FBa0IsZ0JBQWdCO0lBRWpDLHlDQUFxQixDQUFBO0lBQ3JCLGlDQUFhLENBQUE7SUFDYixpQ0FBYSxDQUFBO0FBQ2QsQ0FBQyxFQUxpQixnQkFBZ0IsR0FBaEIsd0JBQWdCLEtBQWhCLHdCQUFnQixRQUtqQztBQWFELElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWMsU0FBUSxXQUF1QztJQUV6RSxZQUFZLE9BQStCO1FBRTFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVmLGFBQWE7UUFDYixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUkscUJBQXlCLENBQUM7UUFFN0UsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJO1lBQzFCLE9BQU8sRUFBRSxxQkFBTTtTQUNmLENBQUE7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQy9CO1lBQ0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO1NBQ2xDO0lBQ0YsQ0FBQztJQUVELE1BQU0sQ0FBZSxHQUFXLEVBQUUsT0FBMEQ7UUFFM0YsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBRUQsSUFBSSxDQUFtQyxJQUFjLEVBQUUsT0FBK0I7UUFFckYsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFJLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUNwQyxDQUFDO0lBRUQsYUFBYSxDQUFDLE9BQThCO1FBRTNDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFdEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7YUFDckIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUduQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQ2pCO2dCQUNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDVjtRQUVGLENBQUMsQ0FBQyxDQUNGO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDWCxDQUFDO0lBRUQsT0FBTyxDQUFlLEdBQVcsRUFBRSxPQUErQjtRQUVqRSxJQUFJLGFBQXVCLENBQUM7UUFDNUIsSUFBSSxZQUFlLENBQUM7UUFFcEIsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckMsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFXLEdBQUcsRUFBRSxPQUFPLENBQUM7YUFDMUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFFbEIsYUFBYSxHQUFHLFFBQVEsQ0FBQztZQUV6QixRQUFRLE9BQU8sQ0FBQyxJQUFJLEVBQ3BCO2dCQUNDLHVCQUEyQjtnQkFDM0IsS0FBSyxNQUFNO29CQUNWLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFBO2dCQUN2Qix1QkFBMkI7Z0JBQzNCLEtBQUssTUFBTTtvQkFDVixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDdkIsK0JBQStCO2dCQUMvQixLQUFLLFVBQVUsQ0FBQztnQkFDaEI7b0JBQ0MsT0FBTyxRQUFRLENBQUE7YUFDaEI7WUFFRCxPQUFPLFFBQVEsQ0FBQztRQUNqQixDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsQ0FBQyxPQUFVLEVBQUUsRUFBRTtZQUVwQixZQUFZLEdBQUcsT0FBTyxDQUFDO1lBRXZCLElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUNoRDtnQkFDQyxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUE7YUFDbEQ7WUFFRCxPQUFPLE9BQU8sQ0FBQTtRQUNmLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBRWxCLElBQUksR0FBRyxHQUFnQixLQUFLLENBQUM7WUFFN0IsSUFBSSxDQUFDLENBQUMsR0FBRyxZQUFZLEtBQUssQ0FBQyxJQUFJLGFBQWEsSUFBSSxhQUFhLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFDM0U7Z0JBQ0MsR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsYUFBYSxDQUFDLE1BQU0sS0FBSyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7Z0JBRTVFLGFBQWE7Z0JBQ2IsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7YUFDakI7WUFFRCxHQUFHLENBQUMsVUFBVSxHQUFHLGFBQWEsQ0FBQTtZQUM5QixHQUFHLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQTtZQUM1QixHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQTtZQUVmLE9BQU8sa0JBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDNUIsQ0FBQyxDQUF1QixDQUFBO0lBQzFCLENBQUM7Q0FDRCxDQUFBO0FBekdZLGFBQWE7SUFEekIsaUJBQU8sRUFBRTs7R0FDRyxhQUFhLENBeUd6QjtBQXpHWSxzQ0FBYTtBQTJHMUIsa0JBQWUsYUFBYSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWlnbm9yZVxuaW1wb3J0IF9mZXRjaCBmcm9tICdjcm9zcy1mZXRjaCdcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCdcbmltcG9ydCBMZXRzV3JhcCwgeyBJTGV0c1dyYXBPcHRpb25zQ29yZSwgSUxldHNXcmFwT3B0aW9ucyB9IGZyb20gJy4uLy4uJztcbmltcG9ydCB7IEJpbmRBbGwgfSBmcm9tICdsb2Rhc2gtZGVjb3JhdG9ycy9iaW5kQWxsJ1xuXG5leHBvcnQgaW50ZXJmYWNlIElGZXRjaFxue1xuXHRyZXF1ZXN0OiB0eXBlb2YgX2ZldGNoXG59XG5cbmV4cG9ydCBjb25zdCBlbnVtIEVudW1SZXNwb25zZVR5cGVcbntcblx0cmVzcG9uc2UgPSAncmVzcG9uc2UnLFxuXHRqc29uID0gJ2pzb24nLFxuXHR0ZXh0ID0gJ3RleHQnLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElMZXRzV3JhcEZldGNoT3B0aW9uczxUID0gRW51bVJlc3BvbnNlVHlwZS5yZXNwb25zZSB8IEVudW1SZXNwb25zZVR5cGUudGV4dCB8IEVudW1SZXNwb25zZVR5cGUuanNvbiB8IHN0cmluZyB8ICd0ZXh0JyB8ICdqc29uJyB8ICdyZXNwb25zZSc+IGV4dGVuZHMgSUxldHNXcmFwT3B0aW9uczxJRmV0Y2gsIFJlcXVlc3RJbml0Plxue1xuXHQvKipcblx0ICogcmVzcG9uc2UgdHlwZSwgY2FuIGJlIFwianNvblwiLCBcInRleHRcIiBvciBcInJlc3BvbnNlXCJcblx0ICovXG5cdHR5cGU/OiBULFxuXG5cdGh0dHA/OiBJRmV0Y2g7XG59XG5cbkBCaW5kQWxsKClcbmV4cG9ydCBjbGFzcyBMZXRzV3JhcEZldGNoIGV4dGVuZHMgTGV0c1dyYXA8SUZldGNoLCBJTGV0c1dyYXBGZXRjaE9wdGlvbnM+XG57XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBJTGV0c1dyYXBGZXRjaE9wdGlvbnMpXG5cdHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHR0aGlzLmRlZmF1bHRPcHRpb25zLnR5cGUgPSB0aGlzLmRlZmF1bHRPcHRpb25zLnR5cGUgfHwgRW51bVJlc3BvbnNlVHlwZS5qc29uO1xuXG5cdFx0dGhpcy4kaHR0cCA9IHRoaXMuJGh0dHAgfHwge1xuXHRcdFx0cmVxdWVzdDogX2ZldGNoLFxuXHRcdH1cblxuXHRcdGlmICghdGhpcy5kZWZhdWx0T3B0aW9ucy5tZXRob2QpXG5cdFx0e1xuXHRcdFx0dGhpcy5kZWZhdWx0T3B0aW9ucy5tZXRob2QgPSAnR0VUJ1xuXHRcdH1cblx0fVxuXG5cdHNpbmdsZTxUID0gUmVzcG9uc2U+KHVybDogc3RyaW5nLCBvcHRpb25zPzogSUxldHNXcmFwRmV0Y2hPcHRpb25zPEVudW1SZXNwb25zZVR5cGUgfCBzdHJpbmc+KTogQmx1ZWJpcmQ8VD5cblx0e1xuXHRcdHJldHVybiBzdXBlci5zaW5nbGUodXJsLCBvcHRpb25zKVxuXHR9XG5cblx0bWFueTxUIGV4dGVuZHMgdW5rbm93bltdID0gUmVzcG9uc2VbXT4odXJsczogc3RyaW5nW10sIG9wdGlvbnM/OiBJTGV0c1dyYXBGZXRjaE9wdGlvbnMpOiBCbHVlYmlyZDxUPlxuXHR7XG5cdFx0cmV0dXJuIHN1cGVyLm1hbnk8VD4odXJscywgb3B0aW9ucylcblx0fVxuXG5cdHJlcXVlc3RPcHRpb24ob3B0aW9uczogSUxldHNXcmFwRmV0Y2hPcHRpb25zKVxuXHR7XG5cdFx0bGV0IHJvID0gc3VwZXIucmVxdWVzdE9wdGlvbihvcHRpb25zKTtcblxuXHRcdE9iamVjdC5lbnRyaWVzKG9wdGlvbnMpXG5cdFx0XHQuZm9yRWFjaCgoW2ssIHZdKSA9PlxuXHRcdFx0e1xuXG5cdFx0XHRcdGlmIChyb1trXSA9PSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cm9ba10gPSB2O1xuXHRcdFx0XHR9XG5cblx0XHRcdH0pXG5cdFx0O1xuXG5cdFx0cmV0dXJuIHJvO1xuXHR9XG5cblx0cmVxdWVzdDxUID0gUmVzcG9uc2U+KHVybDogc3RyaW5nLCBvcHRpb25zPzogSUxldHNXcmFwRmV0Y2hPcHRpb25zKTogQmx1ZWJpcmQ8VD5cblx0e1xuXHRcdGxldCBzYXZlZFJlc3BvbnNlOiBSZXNwb25zZTtcblx0XHRsZXQgc2F2ZWRDb250ZW50OiBUO1xuXG5cdFx0b3B0aW9ucyA9IHRoaXMubWVyZ2VPcHRpb25zKG9wdGlvbnMpO1xuXG5cdFx0cmV0dXJuIHN1cGVyLnJlcXVlc3Q8UmVzcG9uc2U+KHVybCwgb3B0aW9ucylcblx0XHRcdC50aGVuKChyZXNwb25zZSkgPT5cblx0XHRcdHtcblx0XHRcdFx0c2F2ZWRSZXNwb25zZSA9IHJlc3BvbnNlO1xuXG5cdFx0XHRcdHN3aXRjaCAob3B0aW9ucy50eXBlKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y2FzZSBFbnVtUmVzcG9uc2VUeXBlLnRleHQ6XG5cdFx0XHRcdFx0Y2FzZSAndGV4dCc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UudGV4dCgpXG5cdFx0XHRcdFx0Y2FzZSBFbnVtUmVzcG9uc2VUeXBlLmpzb246XG5cdFx0XHRcdFx0Y2FzZSAnanNvbic6XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpXG5cdFx0XHRcdFx0Y2FzZSBFbnVtUmVzcG9uc2VUeXBlLnJlc3BvbnNlOlxuXHRcdFx0XHRcdGNhc2UgJ3Jlc3BvbnNlJzpcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2U7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oKGNvbnRlbnQ6IFQpID0+XG5cdFx0XHR7XG5cdFx0XHRcdHNhdmVkQ29udGVudCA9IGNvbnRlbnQ7XG5cblx0XHRcdFx0aWYgKHNhdmVkUmVzcG9uc2UgJiYgc2F2ZWRSZXNwb25zZS5zdGF0dXMgPj0gNDAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBSZXNwb25zZSBzdGF0dXMgaW5kaWNhdGVzIGVycm9yYClcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBjb250ZW50XG5cdFx0XHR9KS5jYXRjaCgoZXJyb3IpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGxldCBlcnI6IEVycm9yICYgYW55ID0gZXJyb3I7XG5cblx0XHRcdFx0aWYgKCEoZXJyIGluc3RhbmNlb2YgRXJyb3IpICYmIHNhdmVkUmVzcG9uc2UgJiYgc2F2ZWRSZXNwb25zZS5zdGF0dXMgPj0gNDAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZXJyID0gbmV3IEVycm9yKGBTdGF0dXMgJHtzYXZlZFJlc3BvbnNlLnN0YXR1c306ICR7ZXJyb3IgJiYgZXJyb3IubWVzc2FnZX1gKVxuXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdGVyci5fb2xkXyA9IGVycm9yXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlcnIuX3Jlc3BvbnNlXyA9IHNhdmVkUmVzcG9uc2Vcblx0XHRcdFx0ZXJyLl9jb250ZW50XyA9IHNhdmVkQ29udGVudFxuXHRcdFx0XHRlcnIuX3VybF8gPSB1cmxcblxuXHRcdFx0XHRyZXR1cm4gQmx1ZWJpcmQucmVqZWN0KGVycilcblx0XHRcdH0pIGFzIGFueSBhcyBCbHVlYmlyZDxUPlxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExldHNXcmFwRmV0Y2hcbiJdfQ==