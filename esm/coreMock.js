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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZU1vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY29yZU1vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0EsT0FBTyxRQUFRLE1BQU0sVUFBVSxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQTtBQUNuRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sUUFBUSxDQUFBO0FBS3RDLElBQWEsWUFBWSxHQUF6QixNQUFhLFlBQVk7SUFPeEIsWUFBbUIsTUFBeUI7UUFBekIsV0FBTSxHQUFOLE1BQU0sQ0FBbUI7UUFMNUMsaUJBQVksR0FBd0IsRUFBRSxDQUFBO1FBQ3RDLGVBQVUsR0FBVSxFQUFFLENBQUE7UUFDdEIsWUFBTyxHQUFhLEVBQUUsQ0FBQTtRQUN0QixtQkFBYyxHQUFHLElBQUksQ0FBQTtJQUtyQixDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQU87UUFFbEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDaEMsQ0FBQztJQUVELGdCQUFnQixDQUFJLFFBQXVCLEVBQUUsT0FBVTtRQUV0RCxNQUFNLGFBQWEsR0FBRyxJQUFJLGFBQWEsQ0FBQyxRQUFlLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFFakUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7SUFDdEMsQ0FBQztJQUVELEtBQUs7UUFFSixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQTtRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQTtRQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQTtRQUVqQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBRUQsSUFBSTtRQUVILE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtJQUNwQixDQUFDO0lBRUQsT0FBTztRQUVOLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUM3QyxDQUFDO0lBRUQsVUFBVTtRQUVULE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsYUFBYSxDQUFDLElBQWE7UUFFMUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUE7SUFDM0IsQ0FBQztJQUVELE1BQU0sQ0FBSSxHQUFXLEVBQUUsR0FBUztRQUUvQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUV6QixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFDeEI7WUFDQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFJLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQTtTQUN0QztRQUVELE9BQU8sSUFBSSxRQUFRLENBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFFMUMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUV4QyxJQUFJLFFBQVEsWUFBWSxLQUFLLEVBQzdCO2dCQUNDLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO2FBQ3ZCO1lBRUQsT0FBTyxDQUFDLFFBQW9CLENBQUMsQ0FBQTtRQUM5QixDQUFDLENBQUMsQ0FBQTtJQUNILENBQUM7SUFFRCxJQUFJLENBQXNCLElBQWMsRUFBRSxHQUFTO1FBRWxELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUN4QjtZQUNDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUM3QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFJLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQTtTQUNyQztRQUVELE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBZ0IsQ0FBQTtJQUMvRSxDQUFDO0NBQ0QsQ0FBQTtBQXZGWSxZQUFZO0lBRHhCLE9BQU8sRUFBRTs7R0FDRyxZQUFZLENBdUZ4QjtTQXZGWSxZQUFZO0FBeUZ6QixlQUFlLFlBQVksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMZXRzV3JhcCwgeyBJTGV0c1dyYXBPcHRpb25zIH0gZnJvbSAnLi9jb3JlJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBCaW5kQWxsIH0gZnJvbSAnbG9kYXNoLWRlY29yYXRvcnMvYmluZEFsbCdcbmltcG9ydCB7IFJlc3BvbnNlRXJyb3IgfSBmcm9tICcuL3V0aWwnXG5cbnR5cGUgSU1vY2tSZXNwb25zZSA9IFBhcnRpYWw8UmVzcG9uc2U+XG5cbkBCaW5kQWxsKClcbmV4cG9ydCBjbGFzcyBMZXRzV3JhcE1vY2tcbntcblx0cmVxUmVzcG9uc2VzOiAodW5rbm93biB8IEVycm9yKVtdID0gW11cblx0cmVxT3B0aW9uczogYW55W10gPSBbXVxuXHRyZXFVcmxzOiBzdHJpbmdbXSA9IFtdXG5cdG1vY2tpbmdFbmFibGVkID0gdHJ1ZVxuXG5cdGNvbnN0cnVjdG9yKHB1YmxpYyB0YXJnZXQ6IFBhcnRpYWw8TGV0c1dyYXA+KVxuXHR7XG5cblx0fVxuXG5cdGFkZFJlc3BvbnNlKGNvbnRlbnQpXG5cdHtcblx0XHR0aGlzLnJlcVJlc3BvbnNlcy5wdXNoKGNvbnRlbnQpXG5cdH1cblxuXHRhZGRSZXNwb25zZUVycm9yPFQ+KHJlc3BvbnNlOiBJTW9ja1Jlc3BvbnNlLCBjb250ZW50OiBUKVxuXHR7XG5cdFx0Y29uc3QgcmVzcG9uc2VFcnJvciA9IG5ldyBSZXNwb25zZUVycm9yKHJlc3BvbnNlIGFzIGFueSwgY29udGVudClcblxuXHRcdHRoaXMucmVxUmVzcG9uc2VzLnB1c2gocmVzcG9uc2VFcnJvcilcblx0fVxuXG5cdHJlc2V0KClcblx0e1xuXHRcdHRoaXMucmVxUmVzcG9uc2VzID0gW11cblx0XHR0aGlzLnJlcU9wdGlvbnMgPSBbXVxuXHRcdHRoaXMucmVxVXJscyA9IFtdXG5cblx0XHR0aGlzLnRhcmdldC5zZXRSZXRyeSgoKSA9PiBmYWxzZSlcblx0fVxuXG5cdHVybHMoKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMucmVxVXJsc1xuXHR9XG5cblx0bGFzdFVybCgpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5yZXFVcmxzW3RoaXMucmVxVXJscy5sZW5ndGggLSAxXVxuXHR9XG5cblx0bGFzdE9wdGlvbigpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5yZXFPcHRpb25zW3RoaXMucmVxT3B0aW9ucy5sZW5ndGggLSAxXVxuXHR9XG5cblx0ZW5hYmxlTW9ja2luZyhib29sOiBib29sZWFuKVxuXHR7XG5cdFx0dGhpcy5tb2NraW5nRW5hYmxlZCA9IGJvb2xcblx0fVxuXG5cdHNpbmdsZTxUPih1cmw6IHN0cmluZywgb3B0PzogYW55KVxuXHR7XG5cdFx0dGhpcy5yZXFVcmxzLnB1c2godXJsKVxuXHRcdHRoaXMucmVxT3B0aW9ucy5wdXNoKG9wdClcblxuXHRcdGlmICghdGhpcy5tb2NraW5nRW5hYmxlZClcblx0XHR7XG5cdFx0XHRyZXR1cm4gdGhpcy50YXJnZXQuc2luZ2xlPFQ+KHVybCwgb3B0KVxuXHRcdH1cblxuXHRcdHJldHVybiBuZXcgQmx1ZWJpcmQ8VD4oKHJlc29sdmUsIHJlamVjdCkgPT5cblx0XHR7XG5cdFx0XHRsZXQgcmVzcG9uc2UgPSB0aGlzLnJlcVJlc3BvbnNlcy5zaGlmdCgpXG5cblx0XHRcdGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gcmVqZWN0KHJlc3BvbnNlKVxuXHRcdFx0fVxuXG5cdFx0XHRyZXNvbHZlKHJlc3BvbnNlIGFzIGFueSBhcyBUKVxuXHRcdH0pXG5cdH1cblxuXHRtYW55PFQgZXh0ZW5kcyB1bmtub3duW10+KHVybHM6IHN0cmluZ1tdLCBvcHQ/OiBhbnkpOiBCbHVlYmlyZDxUPlxuXHR7XG5cdFx0aWYgKCF0aGlzLm1vY2tpbmdFbmFibGVkKVxuXHRcdHtcblx0XHRcdHRoaXMucmVxVXJscyA9IHRoaXMucmVxVXJscy5jb25jYXQodXJscylcblx0XHRcdHRoaXMucmVxT3B0aW9ucyA9IHRoaXMucmVxT3B0aW9ucy5jb25jYXQob3B0KVxuXHRcdFx0cmV0dXJuIHRoaXMudGFyZ2V0Lm1hbnk8VD4odXJscywgb3B0KVxuXHRcdH1cblxuXHRcdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKHVybHMpLm1hcCh1cmwgPT4gdGhpcy5zaW5nbGUodXJsLCBvcHQpKSBhcyBCbHVlYmlyZDxUPlxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExldHNXcmFwTW9ja1xuIl19