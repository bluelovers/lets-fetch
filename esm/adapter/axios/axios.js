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
    requestOptions(options, url) {
        let ro = super.requestOptions(options, url);
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
    return axios && (axios instanceof AxiosClass);
}
export function toRequestLike(axios) {
    return LetsWrap.toRequestLike(axios, axios);
}
export default LetsWrapAxios;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXhpb3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWRhcHRlci9heGlvcy9heGlvcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILE9BQU8sUUFBMkQsTUFBTSxhQUFhLENBQUM7QUFDdEYsT0FBTyxLQUEyRixNQUFNLE9BQU8sQ0FBQztBQUVoSCxPQUFPLFVBQVUsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUE0QjVDLElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWlHLFNBQVEsUUFBMkM7SUFFaEssWUFBWSxPQUE4QztRQUV6RCxLQUFLLENBQUMsT0FBYyxDQUFDLENBQUM7UUFFdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUM1QyxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQThDO1FBRXpELE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQThDO1FBRXpELE9BQU8sR0FBRyxPQUFPLElBQUksRUFBUyxDQUFDO1FBRS9CLElBQUksT0FBTyxDQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFDOUI7WUFDQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUV0RixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUE7U0FDcEI7UUFFRCxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBTyxDQUFBO0lBQ2xELENBQUM7SUFFRCxjQUFjLENBQUMsT0FBNkMsRUFBRSxHQUFZO1FBRXpFLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRTVDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO2FBQ3JCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFHbkIsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUNqQjtnQkFDQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ1Y7UUFFRixDQUFDLENBQUMsQ0FDRjtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ1gsQ0FBQztDQUNELENBQUE7QUE5Q1ksYUFBYTtJQUR6QixPQUFPLEVBQUU7O0dBQ0csYUFBYSxDQThDekI7U0E5Q1ksYUFBYTtBQWdEMUIsTUFBTSxVQUFVLE9BQU8sQ0FBMkMsS0FBSztJQUV0RSxPQUFPLEtBQUssSUFBSSxDQUFDLEtBQUssWUFBWSxVQUFVLENBQUMsQ0FBQTtBQUM5QyxDQUFDO0FBRUQsTUFBTSxVQUFVLGFBQWEsQ0FBb0YsS0FBUztJQUV6SCxPQUFPLFFBQVEsQ0FBQyxhQUFhLENBQWEsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQ3hELENBQUM7QUFFRCxlQUFlLGFBQWEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTkvNi81LlxuICovXG5pbXBvcnQgTGV0c1dyYXAsIHsgU3ltYm9sUmVxdWVzdCwgSUxldHNXcmFwT3B0aW9ucywgSUh0dHBSZXF1ZXN0IH0gZnJvbSAnLi4vLi4vaW5kZXgnO1xuaW1wb3J0IEF4aW9zLCB7IEF4aW9zSW5zdGFuY2UsIEF4aW9zUmVxdWVzdENvbmZpZywgQXhpb3NSZXNwb25zZSBhcyBfQXhpb3NSZXNwb25zZSwgQXhpb3NQcm9taXNlIH0gZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHsgSUxldHNXcmFwRmV0Y2hPcHRpb25zIH0gZnJvbSAnLi4vZmV0Y2gnO1xuaW1wb3J0IEF4aW9zQ2xhc3MgZnJvbSAnYXhpb3MvbGliL2NvcmUvQXhpb3MnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJ1xuaW1wb3J0IHsgQmluZEFsbCB9IGZyb20gJ2xvZGFzaC1kZWNvcmF0b3JzJztcblxuZXhwb3J0IHR5cGUgSUh0dHBSZXF1ZXN0QXhpb3M8TzMgZXh0ZW5kcyBBeGlvc1JlcXVlc3RDb25maWcgPSBBeGlvc1JlcXVlc3RDb25maWcsIFIzIGV4dGVuZHMgQXhpb3NSZXNwb25zZSA9IEF4aW9zUmVzcG9uc2UsIFQzIGV4dGVuZHMgQXhpb3NJbnN0YW5jZSA9IEF4aW9zSW5zdGFuY2U+ID0gSUh0dHBSZXF1ZXN0PE8zLCBSMywgVDM+XG5cbmV4cG9ydCB0eXBlIElIdHRwUmVxdWVzdEF4aW9zT3B0aW9uczxPMyBleHRlbmRzIEF4aW9zUmVxdWVzdENvbmZpZyA9IEF4aW9zUmVxdWVzdENvbmZpZywgUjMgZXh0ZW5kcyBBeGlvc1Jlc3BvbnNlID0gQXhpb3NSZXNwb25zZSwgVDMgZXh0ZW5kcyBBeGlvc0luc3RhbmNlID0gQXhpb3NJbnN0YW5jZT4gPSBJTGV0c1dyYXBPcHRpb25zPElIdHRwUmVxdWVzdEF4aW9zPE8zLCBSMywgVDM+LCBPMz5cblxuZXhwb3J0IGludGVyZmFjZSBJQXhpb3NSZXNwb25zZUNsaWVudFJlcXVlc3QgZXh0ZW5kcyBSZWNvcmQ8c3ltYm9sIHwgc3RyaW5nLCBhbnk+XG57XG5cdHJlcz86IHtcblx0XHRyZXNwb25zZVVybD86IHN0cmluZyxcblx0XHRyZWRpcmVjdHM/OiBzdHJpbmdbXSxcblx0XHRoZWFkZXJzPzogSGVhZGVyc0luaXQsXG5cdFx0cmF3SGVhZGVycz86IHN0cmluZ1tdLFxuXHR9LFxuXHRwYXRoPzogc3RyaW5nLFxuXHRtZXRob2Q/OiBzdHJpbmcsXG5cdGZpbmlzaGVkPzogYm9vbGVhbixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBeGlvc1Jlc3BvbnNlPFQgPSBhbnk+IGV4dGVuZHMgT21pdDxfQXhpb3NSZXNwb25zZTxUPiwgJ3JlcXVlc3QnIHwgJ2hlYWRlcnMnPlxue1xuXHRoZWFkZXJzOiBIZWFkZXJzSW5pdCxcblx0cmVxdWVzdD86IElBeGlvc1Jlc3BvbnNlQ2xpZW50UmVxdWVzdDtcbn1cblxuZXhwb3J0IHsgQXhpb3NSZXNwb25zZSBhcyBJQXhpb3NSZXNwb25zZSB9XG5cbkBCaW5kQWxsKClcbmV4cG9ydCBjbGFzcyBMZXRzV3JhcEF4aW9zPE80IGV4dGVuZHMgQXhpb3NSZXF1ZXN0Q29uZmlnLCBSNCBleHRlbmRzIEF4aW9zUmVzcG9uc2UsIFQ0IGV4dGVuZHMgQXhpb3NJbnN0YW5jZT4gZXh0ZW5kcyBMZXRzV3JhcDxJSHR0cFJlcXVlc3RBeGlvczxPNCwgUjQsIFQ0PiwgTzQ+XG57XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBJSHR0cFJlcXVlc3RBeGlvc09wdGlvbnM8TzQsIFI0LCBUND4pXG5cdHtcblx0XHRzdXBlcihvcHRpb25zIGFzIGFueSk7XG5cblx0XHR0aGlzLiRodHRwID0gdGhpcy5kZWZhdWx0SHR0cCh0aGlzLm9wdGlvbnMpXG5cdH1cblxuXHRkZWZhdWx0SHR0cChvcHRpb25zPzogSUh0dHBSZXF1ZXN0QXhpb3NPcHRpb25zPE80LCBSNCwgVDQ+KTogSUh0dHBSZXF1ZXN0PE80LCBSNCwgVDQ+XG5cdHtcblx0XHRyZXR1cm4gdG9SZXF1ZXN0TGlrZSh0aGlzLmNyZWF0ZUF4aW9zKG9wdGlvbnMpKTtcblx0fVxuXG5cdGNyZWF0ZUF4aW9zKG9wdGlvbnM/OiBJSHR0cFJlcXVlc3RBeGlvc09wdGlvbnM8TzQsIFI0LCBUND4pOiBUNFxuXHR7XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge30gYXMgYW55O1xuXG5cdFx0aWYgKGlzQXhpb3M8VDQ+KG9wdGlvbnMuJGh0dHApKVxuXHRcdHtcblx0XHRcdE9iamVjdC5hc3NpZ24ob3B0aW9ucy4kaHR0cC5kZWZhdWx0cywgb3B0aW9ucy4kaHR0cC5kZWZhdWx0cywgb3B0aW9ucy5yZXF1ZXN0T3B0aW9ucyk7XG5cblx0XHRcdHJldHVybiBvcHRpb25zLiRodHRwXG5cdFx0fVxuXG5cdFx0cmV0dXJuIEF4aW9zLmNyZWF0ZShvcHRpb25zLnJlcXVlc3RPcHRpb25zKSBhcyBUNFxuXHR9XG5cblx0cmVxdWVzdE9wdGlvbnMob3B0aW9uczogSUh0dHBSZXF1ZXN0QXhpb3NPcHRpb25zPE80LCBSNCwgVDQ+LCB1cmw/OiBzdHJpbmcpXG5cdHtcblx0XHRsZXQgcm8gPSBzdXBlci5yZXF1ZXN0T3B0aW9ucyhvcHRpb25zLCB1cmwpO1xuXG5cdFx0T2JqZWN0LmVudHJpZXMob3B0aW9ucylcblx0XHRcdC5mb3JFYWNoKChbaywgdl0pID0+XG5cdFx0XHR7XG5cblx0XHRcdFx0aWYgKHJvW2tdID09IG51bGwpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyb1trXSA9IHY7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSlcblx0XHQ7XG5cblx0XHRyZXR1cm4gcm87XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQXhpb3M8VDQgZXh0ZW5kcyBBeGlvc0luc3RhbmNlID0gQXhpb3NJbnN0YW5jZT4oYXhpb3MpOiBheGlvcyBpcyBUNFxue1xuXHRyZXR1cm4gYXhpb3MgJiYgKGF4aW9zIGluc3RhbmNlb2YgQXhpb3NDbGFzcylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvUmVxdWVzdExpa2U8TzMgZXh0ZW5kcyBBeGlvc1JlcXVlc3RDb25maWcsIFIzIGV4dGVuZHMgQXhpb3NSZXNwb25zZSwgVDMgZXh0ZW5kcyBBeGlvc0luc3RhbmNlPihheGlvczogVDMpOiBJSHR0cFJlcXVlc3Q8TzMsIFIzLCBUMz5cbntcblx0cmV0dXJuIExldHNXcmFwLnRvUmVxdWVzdExpa2U8TzMsIFIzLCBUMz4oYXhpb3MsIGF4aW9zKVxufVxuXG5leHBvcnQgZGVmYXVsdCBMZXRzV3JhcEF4aW9zXG5cbiJdfQ==