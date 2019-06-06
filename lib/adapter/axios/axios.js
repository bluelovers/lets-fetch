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
/**
 * Created by user on 2019/6/5.
 */
const index_1 = __importDefault(require("../../index"));
const axios_1 = __importDefault(require("axios"));
const Axios_1 = __importDefault(require("axios/lib/core/Axios"));
const lodash_decorators_1 = require("lodash-decorators");
let LetsWrapAxios = class LetsWrapAxios extends index_1.default {
    constructor(options) {
        super(options);
        this.$http = this.defaultHttp(this.options);
    }
    defaultHttp(options) {
        return toRequestLike(this.createAxios(options));
    }
    createAxios(options) {
        options = options || {};
        if (isAxios(options.$http)) {
            Object.assign(options.$http.defaults, options.$http.defaults, options.requestOptions);
            return options.$http;
        }
        return axios_1.default.create(options.requestOptions);
    }
    requestOption(options, url) {
        let ro = super.requestOption(options, url);
        Object.entries(options)
            .forEach(([k, v]) => {
            if (ro[k] == null) {
                ro[k] = v;
            }
        });
        return ro;
    }
};
LetsWrapAxios = __decorate([
    lodash_decorators_1.BindAll(),
    __metadata("design:paramtypes", [Object])
], LetsWrapAxios);
exports.LetsWrapAxios = LetsWrapAxios;
function isAxios(axios) {
    return (axios instanceof Axios_1.default);
}
exports.isAxios = isAxios;
function toRequestLike(axios) {
    return index_1.default.toRequestLike(axios, axios);
}
exports.toRequestLike = toRequestLike;
exports.default = LetsWrapAxios;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXhpb3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWRhcHRlci9heGlvcy9heGlvcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsd0RBQXNGO0FBQ3RGLGtEQUE4RjtBQUU5RixpRUFBOEM7QUFFOUMseURBQTRDO0FBSzVDLElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWlHLFNBQVEsZUFBMkM7SUFFaEssWUFBWSxPQUE2RDtRQUV4RSxLQUFLLENBQUMsT0FBYyxDQUFDLENBQUM7UUFFdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUM1QyxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQTZEO1FBRXhFLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQTZEO1FBRXhFLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBUyxDQUFDO1FBRS9CLElBQUksT0FBTyxDQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFDOUI7WUFDQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUV0RixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUE7U0FDcEI7UUFFRCxPQUFPLGVBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBTyxDQUFBO0lBQ2xELENBQUM7SUFFRCxhQUFhLENBQUMsT0FBNEQsRUFBRSxHQUFZO1FBRXZGLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRTNDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO2FBQ3JCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFHbkIsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUNqQjtnQkFDQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ1Y7UUFFRixDQUFDLENBQUMsQ0FDRjtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ1gsQ0FBQztDQUNELENBQUE7QUE5Q1ksYUFBYTtJQUR6QiwyQkFBTyxFQUFFOztHQUNHLGFBQWEsQ0E4Q3pCO0FBOUNZLHNDQUFhO0FBZ0QxQixTQUFnQixPQUFPLENBQTJDLEtBQUs7SUFFdEUsT0FBTyxDQUFDLEtBQUssWUFBWSxlQUFVLENBQUMsQ0FBQTtBQUNyQyxDQUFDO0FBSEQsMEJBR0M7QUFFRCxTQUFnQixhQUFhLENBQW9GLEtBQVM7SUFFekgsT0FBTyxlQUFRLENBQUMsYUFBYSxDQUFhLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUN4RCxDQUFDO0FBSEQsc0NBR0M7QUFFRCxrQkFBZSxhQUFhLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDE5LzYvNS5cbiAqL1xuaW1wb3J0IExldHNXcmFwLCB7IFN5bWJvbFJlcXVlc3QsIElMZXRzV3JhcE9wdGlvbnMsIElIdHRwUmVxdWVzdCB9IGZyb20gJy4uLy4uL2luZGV4JztcbmltcG9ydCBBeGlvcywgeyBBeGlvc0luc3RhbmNlLCBBeGlvc1JlcXVlc3RDb25maWcsIEF4aW9zUmVzcG9uc2UsIEF4aW9zUHJvbWlzZSB9IGZyb20gJ2F4aW9zJztcbmltcG9ydCB7IElMZXRzV3JhcEZldGNoT3B0aW9ucyB9IGZyb20gJy4uL2ZldGNoJztcbmltcG9ydCBBeGlvc0NsYXNzIGZyb20gJ2F4aW9zL2xpYi9jb3JlL0F4aW9zJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCdcbmltcG9ydCB7IEJpbmRBbGwgfSBmcm9tICdsb2Rhc2gtZGVjb3JhdG9ycyc7XG5cbmV4cG9ydCB0eXBlIElIdHRwUmVxdWVzdEF4aW9zPE8zIGV4dGVuZHMgQXhpb3NSZXF1ZXN0Q29uZmlnID0gQXhpb3NSZXF1ZXN0Q29uZmlnLCBSMyBleHRlbmRzIEF4aW9zUmVzcG9uc2UgPSBBeGlvc1Jlc3BvbnNlLCBUMyBleHRlbmRzIEF4aW9zSW5zdGFuY2UgPSBBeGlvc0luc3RhbmNlPiA9IElIdHRwUmVxdWVzdDxPMywgUjMsIFQzPlxuXG5AQmluZEFsbCgpXG5leHBvcnQgY2xhc3MgTGV0c1dyYXBBeGlvczxPNCBleHRlbmRzIEF4aW9zUmVxdWVzdENvbmZpZywgUjQgZXh0ZW5kcyBBeGlvc1Jlc3BvbnNlLCBUNCBleHRlbmRzIEF4aW9zSW5zdGFuY2U+IGV4dGVuZHMgTGV0c1dyYXA8SUh0dHBSZXF1ZXN0QXhpb3M8TzQsIFI0LCBUND4sIE80Plxue1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zPzogSUxldHNXcmFwT3B0aW9uczxJSHR0cFJlcXVlc3RBeGlvczxPNCwgUjQsIFQ0PiwgTzQ+KVxuXHR7XG5cdFx0c3VwZXIob3B0aW9ucyBhcyBhbnkpO1xuXG5cdFx0dGhpcy4kaHR0cCA9IHRoaXMuZGVmYXVsdEh0dHAodGhpcy5vcHRpb25zKVxuXHR9XG5cblx0ZGVmYXVsdEh0dHAob3B0aW9ucz86IElMZXRzV3JhcE9wdGlvbnM8SUh0dHBSZXF1ZXN0QXhpb3M8TzQsIFI0LCBUND4sIE80Pik6IElIdHRwUmVxdWVzdDxPNCwgUjQsIFQ0PlxuXHR7XG5cdFx0cmV0dXJuIHRvUmVxdWVzdExpa2UodGhpcy5jcmVhdGVBeGlvcyhvcHRpb25zKSk7XG5cdH1cblxuXHRjcmVhdGVBeGlvcyhvcHRpb25zPzogSUxldHNXcmFwT3B0aW9uczxJSHR0cFJlcXVlc3RBeGlvczxPNCwgUjQsIFQ0PiwgTzQ+KTogVDRcblx0e1xuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9IGFzIGFueTtcblxuXHRcdGlmIChpc0F4aW9zPFQ0PihvcHRpb25zLiRodHRwKSlcblx0XHR7XG5cdFx0XHRPYmplY3QuYXNzaWduKG9wdGlvbnMuJGh0dHAuZGVmYXVsdHMsIG9wdGlvbnMuJGh0dHAuZGVmYXVsdHMsIG9wdGlvbnMucmVxdWVzdE9wdGlvbnMpO1xuXG5cdFx0XHRyZXR1cm4gb3B0aW9ucy4kaHR0cFxuXHRcdH1cblxuXHRcdHJldHVybiBBeGlvcy5jcmVhdGUob3B0aW9ucy5yZXF1ZXN0T3B0aW9ucykgYXMgVDRcblx0fVxuXG5cdHJlcXVlc3RPcHRpb24ob3B0aW9uczogSUxldHNXcmFwT3B0aW9uczxJSHR0cFJlcXVlc3RBeGlvczxPNCwgUjQsIFQ0PiwgTzQ+LCB1cmw/OiBzdHJpbmcpXG5cdHtcblx0XHRsZXQgcm8gPSBzdXBlci5yZXF1ZXN0T3B0aW9uKG9wdGlvbnMsIHVybCk7XG5cblx0XHRPYmplY3QuZW50cmllcyhvcHRpb25zKVxuXHRcdFx0LmZvckVhY2goKFtrLCB2XSkgPT5cblx0XHRcdHtcblxuXHRcdFx0XHRpZiAocm9ba10gPT0gbnVsbClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJvW2tdID0gdjtcblx0XHRcdFx0fVxuXG5cdFx0XHR9KVxuXHRcdDtcblxuXHRcdHJldHVybiBybztcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBeGlvczxUNCBleHRlbmRzIEF4aW9zSW5zdGFuY2UgPSBBeGlvc0luc3RhbmNlPihheGlvcyk6IGF4aW9zIGlzIFQ0XG57XG5cdHJldHVybiAoYXhpb3MgaW5zdGFuY2VvZiBBeGlvc0NsYXNzKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9SZXF1ZXN0TGlrZTxPMyBleHRlbmRzIEF4aW9zUmVxdWVzdENvbmZpZywgUjMgZXh0ZW5kcyBBeGlvc1Jlc3BvbnNlLCBUMyBleHRlbmRzIEF4aW9zSW5zdGFuY2U+KGF4aW9zOiBUMyk6IElIdHRwUmVxdWVzdDxPMywgUjMsIFQzPlxue1xuXHRyZXR1cm4gTGV0c1dyYXAudG9SZXF1ZXN0TGlrZTxPMywgUjMsIFQzPihheGlvcywgYXhpb3MpXG59XG5cbmV4cG9ydCBkZWZhdWx0IExldHNXcmFwQXhpb3NcblxuIl19