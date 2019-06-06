var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by user on 2019/6/5.
 */
import LetsWrap from '../../index';
import Axios from 'axios';
import AxiosClass from 'axios/lib/core/Axios';
import { BindAll } from 'lodash-decorators';
let LetsWrapAxios = class LetsWrapAxios extends LetsWrap {
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
        return Axios.create(options.requestOptions);
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
    BindAll(),
    __metadata("design:paramtypes", [Object])
], LetsWrapAxios);
export { LetsWrapAxios };
export function isAxios(axios) {
    return (axios instanceof AxiosClass);
}
export function toRequestLike(axios) {
    return LetsWrap.toRequestLike(axios, axios);
}
export default LetsWrapAxios;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXhpb3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWRhcHRlci9heGlvcy9heGlvcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILE9BQU8sUUFBMkQsTUFBTSxhQUFhLENBQUM7QUFDdEYsT0FBTyxLQUF5RSxNQUFNLE9BQU8sQ0FBQztBQUU5RixPQUFPLFVBQVUsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFLNUMsSUFBYSxhQUFhLEdBQTFCLE1BQWEsYUFBaUcsU0FBUSxRQUEyQztJQUVoSyxZQUFZLE9BQTZEO1FBRXhFLEtBQUssQ0FBQyxPQUFjLENBQUMsQ0FBQztRQUV0QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQzVDLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBNkQ7UUFFeEUsT0FBTyxhQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxXQUFXLENBQUMsT0FBNkQ7UUFFeEUsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFTLENBQUM7UUFFL0IsSUFBSSxPQUFPLENBQUssT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUM5QjtZQUNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRXRGLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQTtTQUNwQjtRQUVELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFPLENBQUE7SUFDbEQsQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUE0RCxFQUFFLEdBQVk7UUFFdkYsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFM0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7YUFDckIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUduQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQ2pCO2dCQUNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDVjtRQUVGLENBQUMsQ0FBQyxDQUNGO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDWCxDQUFDO0NBQ0QsQ0FBQTtBQTlDWSxhQUFhO0lBRHpCLE9BQU8sRUFBRTs7R0FDRyxhQUFhLENBOEN6QjtTQTlDWSxhQUFhO0FBZ0QxQixNQUFNLFVBQVUsT0FBTyxDQUEyQyxLQUFLO0lBRXRFLE9BQU8sQ0FBQyxLQUFLLFlBQVksVUFBVSxDQUFDLENBQUE7QUFDckMsQ0FBQztBQUVELE1BQU0sVUFBVSxhQUFhLENBQW9GLEtBQVM7SUFFekgsT0FBTyxRQUFRLENBQUMsYUFBYSxDQUFhLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUN4RCxDQUFDO0FBRUQsZUFBZSxhQUFhLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDE5LzYvNS5cbiAqL1xuaW1wb3J0IExldHNXcmFwLCB7IFN5bWJvbFJlcXVlc3QsIElMZXRzV3JhcE9wdGlvbnMsIElIdHRwUmVxdWVzdCB9IGZyb20gJy4uLy4uL2luZGV4JztcbmltcG9ydCBBeGlvcywgeyBBeGlvc0luc3RhbmNlLCBBeGlvc1JlcXVlc3RDb25maWcsIEF4aW9zUmVzcG9uc2UsIEF4aW9zUHJvbWlzZSB9IGZyb20gJ2F4aW9zJztcbmltcG9ydCB7IElMZXRzV3JhcEZldGNoT3B0aW9ucyB9IGZyb20gJy4uL2ZldGNoJztcbmltcG9ydCBBeGlvc0NsYXNzIGZyb20gJ2F4aW9zL2xpYi9jb3JlL0F4aW9zJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCdcbmltcG9ydCB7IEJpbmRBbGwgfSBmcm9tICdsb2Rhc2gtZGVjb3JhdG9ycyc7XG5cbmV4cG9ydCB0eXBlIElIdHRwUmVxdWVzdEF4aW9zPE8zIGV4dGVuZHMgQXhpb3NSZXF1ZXN0Q29uZmlnID0gQXhpb3NSZXF1ZXN0Q29uZmlnLCBSMyBleHRlbmRzIEF4aW9zUmVzcG9uc2UgPSBBeGlvc1Jlc3BvbnNlLCBUMyBleHRlbmRzIEF4aW9zSW5zdGFuY2UgPSBBeGlvc0luc3RhbmNlPiA9IElIdHRwUmVxdWVzdDxPMywgUjMsIFQzPlxuXG5AQmluZEFsbCgpXG5leHBvcnQgY2xhc3MgTGV0c1dyYXBBeGlvczxPNCBleHRlbmRzIEF4aW9zUmVxdWVzdENvbmZpZywgUjQgZXh0ZW5kcyBBeGlvc1Jlc3BvbnNlLCBUNCBleHRlbmRzIEF4aW9zSW5zdGFuY2U+IGV4dGVuZHMgTGV0c1dyYXA8SUh0dHBSZXF1ZXN0QXhpb3M8TzQsIFI0LCBUND4sIE80Plxue1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zPzogSUxldHNXcmFwT3B0aW9uczxJSHR0cFJlcXVlc3RBeGlvczxPNCwgUjQsIFQ0PiwgTzQ+KVxuXHR7XG5cdFx0c3VwZXIob3B0aW9ucyBhcyBhbnkpO1xuXG5cdFx0dGhpcy4kaHR0cCA9IHRoaXMuZGVmYXVsdEh0dHAodGhpcy5vcHRpb25zKVxuXHR9XG5cblx0ZGVmYXVsdEh0dHAob3B0aW9ucz86IElMZXRzV3JhcE9wdGlvbnM8SUh0dHBSZXF1ZXN0QXhpb3M8TzQsIFI0LCBUND4sIE80Pik6IElIdHRwUmVxdWVzdDxPNCwgUjQsIFQ0PlxuXHR7XG5cdFx0cmV0dXJuIHRvUmVxdWVzdExpa2UodGhpcy5jcmVhdGVBeGlvcyhvcHRpb25zKSk7XG5cdH1cblxuXHRjcmVhdGVBeGlvcyhvcHRpb25zPzogSUxldHNXcmFwT3B0aW9uczxJSHR0cFJlcXVlc3RBeGlvczxPNCwgUjQsIFQ0PiwgTzQ+KTogVDRcblx0e1xuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9IGFzIGFueTtcblxuXHRcdGlmIChpc0F4aW9zPFQ0PihvcHRpb25zLiRodHRwKSlcblx0XHR7XG5cdFx0XHRPYmplY3QuYXNzaWduKG9wdGlvbnMuJGh0dHAuZGVmYXVsdHMsIG9wdGlvbnMuJGh0dHAuZGVmYXVsdHMsIG9wdGlvbnMucmVxdWVzdE9wdGlvbnMpO1xuXG5cdFx0XHRyZXR1cm4gb3B0aW9ucy4kaHR0cFxuXHRcdH1cblxuXHRcdHJldHVybiBBeGlvcy5jcmVhdGUob3B0aW9ucy5yZXF1ZXN0T3B0aW9ucykgYXMgVDRcblx0fVxuXG5cdHJlcXVlc3RPcHRpb24ob3B0aW9uczogSUxldHNXcmFwT3B0aW9uczxJSHR0cFJlcXVlc3RBeGlvczxPNCwgUjQsIFQ0PiwgTzQ+LCB1cmw/OiBzdHJpbmcpXG5cdHtcblx0XHRsZXQgcm8gPSBzdXBlci5yZXF1ZXN0T3B0aW9uKG9wdGlvbnMsIHVybCk7XG5cblx0XHRPYmplY3QuZW50cmllcyhvcHRpb25zKVxuXHRcdFx0LmZvckVhY2goKFtrLCB2XSkgPT5cblx0XHRcdHtcblxuXHRcdFx0XHRpZiAocm9ba10gPT0gbnVsbClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJvW2tdID0gdjtcblx0XHRcdFx0fVxuXG5cdFx0XHR9KVxuXHRcdDtcblxuXHRcdHJldHVybiBybztcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBeGlvczxUNCBleHRlbmRzIEF4aW9zSW5zdGFuY2UgPSBBeGlvc0luc3RhbmNlPihheGlvcyk6IGF4aW9zIGlzIFQ0XG57XG5cdHJldHVybiAoYXhpb3MgaW5zdGFuY2VvZiBBeGlvc0NsYXNzKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9SZXF1ZXN0TGlrZTxPMyBleHRlbmRzIEF4aW9zUmVxdWVzdENvbmZpZywgUjMgZXh0ZW5kcyBBeGlvc1Jlc3BvbnNlLCBUMyBleHRlbmRzIEF4aW9zSW5zdGFuY2U+KGF4aW9zOiBUMyk6IElIdHRwUmVxdWVzdDxPMywgUjMsIFQzPlxue1xuXHRyZXR1cm4gTGV0c1dyYXAudG9SZXF1ZXN0TGlrZTxPMywgUjMsIFQzPihheGlvcywgYXhpb3MpXG59XG5cbmV4cG9ydCBkZWZhdWx0IExldHNXcmFwQXhpb3NcblxuIl19