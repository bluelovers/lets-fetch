var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import Bluebird from 'bluebird';
import { BindAll } from 'lodash-decorators/bindAll';
import { ResponseError } from './util';
let LetsWrapMock = class LetsWrapMock {
    constructor(target) {
        this.target = target;
        this.reqResponses = [];
        this.reqOptions = [];
        this.reqUrls = [];
        this.mockingEnabled = true;
    }
    addResponse(content) {
        this.reqResponses.push(content);
    }
    addResponseError(response, content) {
        const responseError = new ResponseError(response, content);
        this.reqResponses.push(responseError);
    }
    reset() {
        this.reqResponses = [];
        this.reqOptions = [];
        this.reqUrls = [];
        this.target.setRetry(() => false);
    }
    urls() {
        return this.reqUrls;
    }
    lastUrl() {
        return this.reqUrls[this.reqUrls.length - 1];
    }
    lastOption() {
        return this.reqOptions[this.reqOptions.length - 1];
    }
    enableMocking(bool) {
        this.mockingEnabled = bool;
    }
    single(url, opt) {
        this.reqUrls.push(url);
        this.reqOptions.push(opt);
        if (!this.mockingEnabled) {
            return this.target.single(url, opt);
        }
        return new Bluebird((resolve, reject) => {
            let response = this.reqResponses.shift();
            if (response instanceof Error) {
                return reject(response);
            }
            resolve(response);
        });
    }
    many(urls, opt) {
        if (!this.mockingEnabled) {
            this.reqUrls = this.reqUrls.concat(urls);
            this.reqOptions = this.reqOptions.concat(opt);
            return this.target.many(urls, opt);
        }
        return Bluebird.resolve(urls).map(url => this.single(url, opt));
    }
};
LetsWrapMock = __decorate([
    BindAll(),
    __metadata("design:paramtypes", [Object])
], LetsWrapMock);
export { LetsWrapMock };
export default LetsWrapMock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBLE9BQU8sUUFBUSxNQUFNLFVBQVUsQ0FBQztBQUNoQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sMkJBQTJCLENBQUE7QUFDbkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUt0QyxJQUFhLFlBQVksR0FBekIsTUFBYSxZQUFZO0lBT3hCLFlBQW1CLE1BQVM7UUFBVCxXQUFNLEdBQU4sTUFBTSxDQUFHO1FBTDVCLGlCQUFZLEdBQWtDLEVBQUUsQ0FBQTtRQUNoRCxlQUFVLEdBQVEsRUFBRSxDQUFBO1FBQ3BCLFlBQU8sR0FBYSxFQUFFLENBQUE7UUFDdEIsbUJBQWMsR0FBRyxJQUFJLENBQUE7SUFLckIsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFPO1FBRWxCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ2hDLENBQUM7SUFFRCxnQkFBZ0IsQ0FBSSxRQUFXLEVBQUUsT0FBVTtRQUUxQyxNQUFNLGFBQWEsR0FBRyxJQUFJLGFBQWEsQ0FBQyxRQUFlLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFFakUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7SUFDdEMsQ0FBQztJQUVELEtBQUs7UUFFSixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQTtRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQTtRQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQTtRQUVqQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBRUQsSUFBSTtRQUVILE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtJQUNwQixDQUFDO0lBRUQsT0FBTztRQUVOLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUM3QyxDQUFDO0lBRUQsVUFBVTtRQUVULE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsYUFBYSxDQUFDLElBQWE7UUFFMUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUE7SUFDM0IsQ0FBQztJQUVELE1BQU0sQ0FBSSxHQUFXLEVBQUUsR0FBUztRQUUvQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUV6QixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFDeEI7WUFDQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFJLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQTtTQUN0QztRQUVELE9BQU8sSUFBSSxRQUFRLENBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFFMUMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUV4QyxJQUFJLFFBQVEsWUFBWSxLQUFLLEVBQzdCO2dCQUNDLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO2FBQ3ZCO1lBRUQsT0FBTyxDQUFDLFFBQW9CLENBQUMsQ0FBQTtRQUM5QixDQUFDLENBQUMsQ0FBQTtJQUNILENBQUM7SUFFRCxJQUFJLENBQXNCLElBQWMsRUFBRSxHQUFTO1FBRWxELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUN4QjtZQUNDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUM3QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFJLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQTtTQUNyQztRQUVELE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBZ0IsQ0FBQTtJQUMvRSxDQUFDO0NBQ0QsQ0FBQTtBQXZGWSxZQUFZO0lBRHhCLE9BQU8sRUFBRTs7R0FDRyxZQUFZLENBdUZ4QjtTQXZGWSxZQUFZO0FBeUZ6QixlQUFlLFlBQVksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMZXRzV3JhcCwgeyBJTGV0c1dyYXBPcHRpb25zQ29yZSwgSVVucGFja0h0dHBSZXF1ZXN0T3B0aW9ucywgSVVucGFja1JldHVyblR5cGVIdHRwUmVxdWVzdCB9IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IEJpbmRBbGwgfSBmcm9tICdsb2Rhc2gtZGVjb3JhdG9ycy9iaW5kQWxsJ1xuaW1wb3J0IHsgUmVzcG9uc2VFcnJvciB9IGZyb20gJy4vdXRpbCdcblxudHlwZSBJTW9ja1Jlc3BvbnNlID0gUGFydGlhbDxSZXNwb25zZT5cblxuQEJpbmRBbGwoKVxuZXhwb3J0IGNsYXNzIExldHNXcmFwTW9jazxUIGV4dGVuZHMgUGFydGlhbDxMZXRzV3JhcDxhbnksIGFueT4+LCBSID0gSVVucGFja1JldHVyblR5cGVIdHRwUmVxdWVzdDxUW1wiJGh0dHBcIl0+IHwgUGFydGlhbDxSZXNwb25zZT4gfCB1bmtub3duLCBPID0gSVVucGFja0h0dHBSZXF1ZXN0T3B0aW9uczxUW1wiJGh0dHBcIl0+IHwgdW5rbm93bj5cbntcblx0cmVxUmVzcG9uc2VzOiAoUiB8IEVycm9yIHwgUmVzcG9uc2VFcnJvcilbXSA9IFtdXG5cdHJlcU9wdGlvbnM6IE9bXSA9IFtdXG5cdHJlcVVybHM6IHN0cmluZ1tdID0gW11cblx0bW9ja2luZ0VuYWJsZWQgPSB0cnVlXG5cblx0Y29uc3RydWN0b3IocHVibGljIHRhcmdldDogVClcblx0e1xuXG5cdH1cblxuXHRhZGRSZXNwb25zZShjb250ZW50KVxuXHR7XG5cdFx0dGhpcy5yZXFSZXNwb25zZXMucHVzaChjb250ZW50KVxuXHR9XG5cblx0YWRkUmVzcG9uc2VFcnJvcjxUPihyZXNwb25zZTogUiwgY29udGVudDogVClcblx0e1xuXHRcdGNvbnN0IHJlc3BvbnNlRXJyb3IgPSBuZXcgUmVzcG9uc2VFcnJvcihyZXNwb25zZSBhcyBhbnksIGNvbnRlbnQpXG5cblx0XHR0aGlzLnJlcVJlc3BvbnNlcy5wdXNoKHJlc3BvbnNlRXJyb3IpXG5cdH1cblxuXHRyZXNldCgpXG5cdHtcblx0XHR0aGlzLnJlcVJlc3BvbnNlcyA9IFtdXG5cdFx0dGhpcy5yZXFPcHRpb25zID0gW11cblx0XHR0aGlzLnJlcVVybHMgPSBbXVxuXG5cdFx0dGhpcy50YXJnZXQuc2V0UmV0cnkoKCkgPT4gZmFsc2UpXG5cdH1cblxuXHR1cmxzKClcblx0e1xuXHRcdHJldHVybiB0aGlzLnJlcVVybHNcblx0fVxuXG5cdGxhc3RVcmwoKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMucmVxVXJsc1t0aGlzLnJlcVVybHMubGVuZ3RoIC0gMV1cblx0fVxuXG5cdGxhc3RPcHRpb24oKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMucmVxT3B0aW9uc1t0aGlzLnJlcU9wdGlvbnMubGVuZ3RoIC0gMV1cblx0fVxuXG5cdGVuYWJsZU1vY2tpbmcoYm9vbDogYm9vbGVhbilcblx0e1xuXHRcdHRoaXMubW9ja2luZ0VuYWJsZWQgPSBib29sXG5cdH1cblxuXHRzaW5nbGU8VD4odXJsOiBzdHJpbmcsIG9wdD86IGFueSlcblx0e1xuXHRcdHRoaXMucmVxVXJscy5wdXNoKHVybClcblx0XHR0aGlzLnJlcU9wdGlvbnMucHVzaChvcHQpXG5cblx0XHRpZiAoIXRoaXMubW9ja2luZ0VuYWJsZWQpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHRoaXMudGFyZ2V0LnNpbmdsZTxUPih1cmwsIG9wdClcblx0XHR9XG5cblx0XHRyZXR1cm4gbmV3IEJsdWViaXJkPFQ+KChyZXNvbHZlLCByZWplY3QpID0+XG5cdFx0e1xuXHRcdFx0bGV0IHJlc3BvbnNlID0gdGhpcy5yZXFSZXNwb25zZXMuc2hpZnQoKVxuXG5cdFx0XHRpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvcilcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHJlamVjdChyZXNwb25zZSlcblx0XHRcdH1cblxuXHRcdFx0cmVzb2x2ZShyZXNwb25zZSBhcyBhbnkgYXMgVClcblx0XHR9KVxuXHR9XG5cblx0bWFueTxUIGV4dGVuZHMgdW5rbm93bltdPih1cmxzOiBzdHJpbmdbXSwgb3B0PzogYW55KTogQmx1ZWJpcmQ8VD5cblx0e1xuXHRcdGlmICghdGhpcy5tb2NraW5nRW5hYmxlZClcblx0XHR7XG5cdFx0XHR0aGlzLnJlcVVybHMgPSB0aGlzLnJlcVVybHMuY29uY2F0KHVybHMpXG5cdFx0XHR0aGlzLnJlcU9wdGlvbnMgPSB0aGlzLnJlcU9wdGlvbnMuY29uY2F0KG9wdClcblx0XHRcdHJldHVybiB0aGlzLnRhcmdldC5tYW55PFQ+KHVybHMsIG9wdClcblx0XHR9XG5cblx0XHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZSh1cmxzKS5tYXAodXJsID0+IHRoaXMuc2luZ2xlKHVybCwgb3B0KSkgYXMgQmx1ZWJpcmQ8VD5cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBMZXRzV3JhcE1vY2tcbiJdfQ==