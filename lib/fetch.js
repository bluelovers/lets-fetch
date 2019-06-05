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
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const bluebird_1 = __importDefault(require("bluebird"));
const core_1 = __importDefault(require("./core"));
const bindAll_1 = require("lodash-decorators/bindAll");
var EnumResponseType;
(function (EnumResponseType) {
    EnumResponseType["response"] = "response";
    EnumResponseType["json"] = "json";
    EnumResponseType["text"] = "text";
})(EnumResponseType = exports.EnumResponseType || (exports.EnumResponseType = {}));
let LetsWrapFetch = class LetsWrapFetch extends core_1.default {
    constructor(options) {
        super(options);
        this.retry = this.setRetry;
        this.retryWait = this.setRetryWait;
        // @ts-ignore
        this.defaultOptions.type = this.defaultOptions.type || "json" /* json */;
        this.$http = this.$http || {
            request: cross_fetch_1.default,
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
            return bluebird_1.default.reject(err);
        });
    }
};
LetsWrapFetch = __decorate([
    bindAll_1.BindAll(),
    __metadata("design:paramtypes", [Object])
], LetsWrapFetch);
exports.LetsWrapFetch = LetsWrapFetch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZmV0Y2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFBZ0M7QUFDaEMsd0RBQStCO0FBQy9CLGtEQUFvRDtBQUNwRCx1REFBbUQ7QUFPbkQsSUFBa0IsZ0JBS2pCO0FBTEQsV0FBa0IsZ0JBQWdCO0lBRWpDLHlDQUFxQixDQUFBO0lBQ3JCLGlDQUFhLENBQUE7SUFDYixpQ0FBYSxDQUFBO0FBQ2QsQ0FBQyxFQUxpQixnQkFBZ0IsR0FBaEIsd0JBQWdCLEtBQWhCLHdCQUFnQixRQUtqQztBQWFELElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWMsU0FBUSxjQUF1QztJQUV6RSxZQUFZLE9BQStCO1FBRTFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQVVoQixVQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN0QixjQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQVQ3QixhQUFhO1FBQ2IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLHFCQUF5QixDQUFBO1FBRTVFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSTtZQUMxQixPQUFPLEVBQUUscUJBQU07U0FDZixDQUFBO0lBQ0YsQ0FBQztJQUtELE1BQU0sQ0FBZSxHQUFXLEVBQUUsT0FBMEQ7UUFFM0YsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBRUQsSUFBSSxDQUFtQyxJQUFjLEVBQUUsT0FBK0I7UUFFckYsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFJLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUNwQyxDQUFDO0lBRUQsT0FBTyxDQUFlLEdBQVcsRUFBRSxPQUErQjtRQUVqRSxJQUFJLGFBQXVCLENBQUM7UUFDNUIsSUFBSSxZQUFlLENBQUM7UUFFcEIsYUFBYTtRQUNiLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXJDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckIsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFXLEdBQUcsRUFBRSxPQUFPLENBQUM7YUFDMUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFFbEIsYUFBYSxHQUFHLFFBQVEsQ0FBQztZQUV6QixRQUFRLE9BQU8sQ0FBQyxJQUFJLEVBQ3BCO2dCQUNDLHVCQUEyQjtnQkFDM0IsS0FBSyxNQUFNO29CQUNWLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFBO2dCQUN2Qix1QkFBMkI7Z0JBQzNCLEtBQUssTUFBTTtvQkFDVixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDdkIsK0JBQStCO2dCQUMvQixLQUFLLFVBQVUsQ0FBQztnQkFDaEI7b0JBQ0MsT0FBTyxRQUFRLENBQUE7YUFDaEI7WUFFRCxPQUFPLFFBQVEsQ0FBQztRQUNqQixDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsQ0FBQyxPQUFVLEVBQUUsRUFBRTtZQUVwQixZQUFZLEdBQUcsT0FBTyxDQUFDO1lBRXZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFckIsSUFBSSxhQUFhLElBQUksYUFBYSxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQ2hEO2dCQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQTthQUNsRDtZQUVELE9BQU8sT0FBTyxDQUFBO1FBQ2YsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFHaEIsR0FBRyxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUE7WUFDOUIsR0FBRyxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUE7WUFDNUIsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUE7WUFFZixPQUFPLGtCQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzVCLENBQUMsQ0FBdUIsQ0FBQTtJQUMxQixDQUFDO0NBQ0QsQ0FBQTtBQWhGWSxhQUFhO0lBRHpCLGlCQUFPLEVBQUU7O0dBQ0csYUFBYSxDQWdGekI7QUFoRlksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgX2ZldGNoIGZyb20gJ2Nyb3NzLWZldGNoJ1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJ1xuaW1wb3J0IExldHNXcmFwLCB7IElMZXRzV3JhcE9wdGlvbnMgfSBmcm9tICcuL2NvcmUnO1xuaW1wb3J0IHsgQmluZEFsbCB9IGZyb20gJ2xvZGFzaC1kZWNvcmF0b3JzL2JpbmRBbGwnXG5cbmV4cG9ydCBpbnRlcmZhY2UgSUZldGNoXG57XG5cdHJlcXVlc3Q6IHR5cGVvZiBfZmV0Y2hcbn1cblxuZXhwb3J0IGNvbnN0IGVudW0gRW51bVJlc3BvbnNlVHlwZVxue1xuXHRyZXNwb25zZSA9ICdyZXNwb25zZScsXG5cdGpzb24gPSAnanNvbicsXG5cdHRleHQgPSAndGV4dCcsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxldHNXcmFwRmV0Y2hPcHRpb25zPFQgZXh0ZW5kcyBFbnVtUmVzcG9uc2VUeXBlIHwgc3RyaW5nID0gRW51bVJlc3BvbnNlVHlwZS5yZXNwb25zZSB8IEVudW1SZXNwb25zZVR5cGUudGV4dCB8IEVudW1SZXNwb25zZVR5cGUuanNvbiB8IHN0cmluZz4gZXh0ZW5kcyBPbWl0PElMZXRzV3JhcE9wdGlvbnM8UmVxdWVzdEluaXQsIFJlc3BvbnNlPiwgJ2h0dHAnIHwgJ3R5cGUnPlxue1xuXHQvKipcblx0ICogcmVzcG9uc2UgdHlwZSwgY2FuIGJlIFwianNvblwiLCBcInRleHRcIiBvciBcInJlc3BvbnNlXCJcblx0ICovXG5cdHR5cGU/OiBULFxuXG5cdGh0dHA/OiBJRmV0Y2g7XG59XG5cbkBCaW5kQWxsKClcbmV4cG9ydCBjbGFzcyBMZXRzV3JhcEZldGNoIGV4dGVuZHMgTGV0c1dyYXA8UmVxdWVzdEluaXQsIFJlc3BvbnNlLCBJRmV0Y2g+XG57XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBJTGV0c1dyYXBGZXRjaE9wdGlvbnMpXG5cdHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHR0aGlzLmRlZmF1bHRPcHRpb25zLnR5cGUgPSB0aGlzLmRlZmF1bHRPcHRpb25zLnR5cGUgfHwgRW51bVJlc3BvbnNlVHlwZS5qc29uXG5cblx0XHR0aGlzLiRodHRwID0gdGhpcy4kaHR0cCB8fCB7XG5cdFx0XHRyZXF1ZXN0OiBfZmV0Y2gsXG5cdFx0fVxuXHR9XG5cblx0cmV0cnkgPSB0aGlzLnNldFJldHJ5O1xuXHRyZXRyeVdhaXQgPSB0aGlzLnNldFJldHJ5V2FpdDtcblxuXHRzaW5nbGU8VCA9IFJlc3BvbnNlPih1cmw6IHN0cmluZywgb3B0aW9ucz86IElMZXRzV3JhcEZldGNoT3B0aW9uczxFbnVtUmVzcG9uc2VUeXBlIHwgc3RyaW5nPik6IEJsdWViaXJkPFQ+XG5cdHtcblx0XHRyZXR1cm4gc3VwZXIuc2luZ2xlKHVybCwgb3B0aW9ucylcblx0fVxuXG5cdG1hbnk8VCBleHRlbmRzIHVua25vd25bXSA9IFJlc3BvbnNlW10+KHVybHM6IHN0cmluZ1tdLCBvcHRpb25zPzogSUxldHNXcmFwRmV0Y2hPcHRpb25zKTogQmx1ZWJpcmQ8VD5cblx0e1xuXHRcdHJldHVybiBzdXBlci5tYW55PFQ+KHVybHMsIG9wdGlvbnMpXG5cdH1cblxuXHRyZXF1ZXN0PFQgPSBSZXNwb25zZT4odXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBJTGV0c1dyYXBGZXRjaE9wdGlvbnMpOiBCbHVlYmlyZDxUPlxuXHR7XG5cdFx0bGV0IHNhdmVkUmVzcG9uc2U6IFJlc3BvbnNlO1xuXHRcdGxldCBzYXZlZENvbnRlbnQ6IFQ7XG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0b3B0aW9ucyA9IHRoaXMubWVyZ2VPcHRpb25zKG9wdGlvbnMpO1xuXG5cdFx0Y29uc29sZS5kaXIob3B0aW9ucyk7XG5cblx0XHRyZXR1cm4gc3VwZXIucmVxdWVzdDxSZXNwb25zZT4odXJsLCBvcHRpb25zKVxuXHRcdFx0LnRoZW4oKHJlc3BvbnNlKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRzYXZlZFJlc3BvbnNlID0gcmVzcG9uc2U7XG5cblx0XHRcdFx0c3dpdGNoIChvcHRpb25zLnR5cGUpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjYXNlIEVudW1SZXNwb25zZVR5cGUudGV4dDpcblx0XHRcdFx0XHRjYXNlICd0ZXh0Jzpcblx0XHRcdFx0XHRcdHJldHVybiByZXNwb25zZS50ZXh0KClcblx0XHRcdFx0XHRjYXNlIEVudW1SZXNwb25zZVR5cGUuanNvbjpcblx0XHRcdFx0XHRjYXNlICdqc29uJzpcblx0XHRcdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKClcblx0XHRcdFx0XHRjYXNlIEVudW1SZXNwb25zZVR5cGUucmVzcG9uc2U6XG5cdFx0XHRcdFx0Y2FzZSAncmVzcG9uc2UnOlxuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2Vcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiByZXNwb25zZTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbigoY29udGVudDogVCkgPT5cblx0XHRcdHtcblx0XHRcdFx0c2F2ZWRDb250ZW50ID0gY29udGVudDtcblxuXHRcdFx0XHRjb25zb2xlLmRpcihjb250ZW50KTtcblxuXHRcdFx0XHRpZiAoc2F2ZWRSZXNwb25zZSAmJiBzYXZlZFJlc3BvbnNlLnN0YXR1cyA+PSA0MDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFJlc3BvbnNlIHN0YXR1cyBpbmRpY2F0ZXMgZXJyb3JgKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGNvbnRlbnRcblx0XHRcdH0pLmNhdGNoKChlcnIpID0+XG5cdFx0XHR7XG5cblx0XHRcdFx0ZXJyLl9yZXNwb25zZV8gPSBzYXZlZFJlc3BvbnNlXG5cdFx0XHRcdGVyci5fY29udGVudF8gPSBzYXZlZENvbnRlbnRcblx0XHRcdFx0ZXJyLl91cmxfID0gdXJsXG5cblx0XHRcdFx0cmV0dXJuIEJsdWViaXJkLnJlamVjdChlcnIpXG5cdFx0XHR9KSBhcyBhbnkgYXMgQmx1ZWJpcmQ8VD5cblx0fVxufVxuIl19