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
const bluebird_1 = __importDefault(require("bluebird"));
const bindAll_1 = require("lodash-decorators/bindAll");
const util_1 = require("./util");
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
        const responseError = new util_1.ResponseError(response, content);
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
        return new bluebird_1.default((resolve, reject) => {
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
        return bluebird_1.default.resolve(urls).map(url => this.single(url, opt));
    }
};
LetsWrapMock = __decorate([
    bindAll_1.BindAll(),
    __metadata("design:paramtypes", [Object])
], LetsWrapMock);
exports.LetsWrapMock = LetsWrapMock;
exports.default = LetsWrapMock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZU1vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY29yZU1vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFDQSx3REFBZ0M7QUFDaEMsdURBQW1EO0FBQ25ELGlDQUFzQztBQUt0QyxJQUFhLFlBQVksR0FBekIsTUFBYSxZQUFZO0lBT3hCLFlBQW1CLE1BQXlCO1FBQXpCLFdBQU0sR0FBTixNQUFNLENBQW1CO1FBTDVDLGlCQUFZLEdBQXdCLEVBQUUsQ0FBQTtRQUN0QyxlQUFVLEdBQVUsRUFBRSxDQUFBO1FBQ3RCLFlBQU8sR0FBYSxFQUFFLENBQUE7UUFDdEIsbUJBQWMsR0FBRyxJQUFJLENBQUE7SUFLckIsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFPO1FBRWxCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ2hDLENBQUM7SUFFRCxnQkFBZ0IsQ0FBSSxRQUF1QixFQUFFLE9BQVU7UUFFdEQsTUFBTSxhQUFhLEdBQUcsSUFBSSxvQkFBYSxDQUFDLFFBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUVqRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUN0QyxDQUFDO0lBRUQsS0FBSztRQUVKLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFBO1FBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFBO1FBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFBO1FBRWpCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFFRCxJQUFJO1FBRUgsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBO0lBQ3BCLENBQUM7SUFFRCxPQUFPO1FBRU4sT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQzdDLENBQUM7SUFFRCxVQUFVO1FBRVQsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxhQUFhLENBQUMsSUFBYTtRQUUxQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQTtJQUMzQixDQUFDO0lBRUQsTUFBTSxDQUFJLEdBQVcsRUFBRSxHQUFTO1FBRS9CLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3RCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBRXpCLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUN4QjtZQUNDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUksR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1NBQ3RDO1FBRUQsT0FBTyxJQUFJLGtCQUFRLENBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFFMUMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUV4QyxJQUFJLFFBQVEsWUFBWSxLQUFLLEVBQzdCO2dCQUNDLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO2FBQ3ZCO1lBRUQsT0FBTyxDQUFDLFFBQW9CLENBQUMsQ0FBQTtRQUM5QixDQUFDLENBQUMsQ0FBQTtJQUNILENBQUM7SUFFRCxJQUFJLENBQXNCLElBQWMsRUFBRSxHQUFTO1FBRWxELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUN4QjtZQUNDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUM3QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFJLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQTtTQUNyQztRQUVELE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQWdCLENBQUE7SUFDL0UsQ0FBQztDQUNELENBQUE7QUF2RlksWUFBWTtJQUR4QixpQkFBTyxFQUFFOztHQUNHLFlBQVksQ0F1RnhCO0FBdkZZLG9DQUFZO0FBeUZ6QixrQkFBZSxZQUFZLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGV0c1dyYXAsIHsgSUxldHNXcmFwT3B0aW9ucyB9IGZyb20gJy4vY29yZSc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgQmluZEFsbCB9IGZyb20gJ2xvZGFzaC1kZWNvcmF0b3JzL2JpbmRBbGwnXG5pbXBvcnQgeyBSZXNwb25zZUVycm9yIH0gZnJvbSAnLi91dGlsJ1xuXG50eXBlIElNb2NrUmVzcG9uc2UgPSBQYXJ0aWFsPFJlc3BvbnNlPlxuXG5AQmluZEFsbCgpXG5leHBvcnQgY2xhc3MgTGV0c1dyYXBNb2NrXG57XG5cdHJlcVJlc3BvbnNlczogKHVua25vd24gfCBFcnJvcilbXSA9IFtdXG5cdHJlcU9wdGlvbnM6IGFueVtdID0gW11cblx0cmVxVXJsczogc3RyaW5nW10gPSBbXVxuXHRtb2NraW5nRW5hYmxlZCA9IHRydWVcblxuXHRjb25zdHJ1Y3RvcihwdWJsaWMgdGFyZ2V0OiBQYXJ0aWFsPExldHNXcmFwPilcblx0e1xuXG5cdH1cblxuXHRhZGRSZXNwb25zZShjb250ZW50KVxuXHR7XG5cdFx0dGhpcy5yZXFSZXNwb25zZXMucHVzaChjb250ZW50KVxuXHR9XG5cblx0YWRkUmVzcG9uc2VFcnJvcjxUPihyZXNwb25zZTogSU1vY2tSZXNwb25zZSwgY29udGVudDogVClcblx0e1xuXHRcdGNvbnN0IHJlc3BvbnNlRXJyb3IgPSBuZXcgUmVzcG9uc2VFcnJvcihyZXNwb25zZSBhcyBhbnksIGNvbnRlbnQpXG5cblx0XHR0aGlzLnJlcVJlc3BvbnNlcy5wdXNoKHJlc3BvbnNlRXJyb3IpXG5cdH1cblxuXHRyZXNldCgpXG5cdHtcblx0XHR0aGlzLnJlcVJlc3BvbnNlcyA9IFtdXG5cdFx0dGhpcy5yZXFPcHRpb25zID0gW11cblx0XHR0aGlzLnJlcVVybHMgPSBbXVxuXG5cdFx0dGhpcy50YXJnZXQuc2V0UmV0cnkoKCkgPT4gZmFsc2UpXG5cdH1cblxuXHR1cmxzKClcblx0e1xuXHRcdHJldHVybiB0aGlzLnJlcVVybHNcblx0fVxuXG5cdGxhc3RVcmwoKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMucmVxVXJsc1t0aGlzLnJlcVVybHMubGVuZ3RoIC0gMV1cblx0fVxuXG5cdGxhc3RPcHRpb24oKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMucmVxT3B0aW9uc1t0aGlzLnJlcU9wdGlvbnMubGVuZ3RoIC0gMV1cblx0fVxuXG5cdGVuYWJsZU1vY2tpbmcoYm9vbDogYm9vbGVhbilcblx0e1xuXHRcdHRoaXMubW9ja2luZ0VuYWJsZWQgPSBib29sXG5cdH1cblxuXHRzaW5nbGU8VD4odXJsOiBzdHJpbmcsIG9wdD86IGFueSlcblx0e1xuXHRcdHRoaXMucmVxVXJscy5wdXNoKHVybClcblx0XHR0aGlzLnJlcU9wdGlvbnMucHVzaChvcHQpXG5cblx0XHRpZiAoIXRoaXMubW9ja2luZ0VuYWJsZWQpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHRoaXMudGFyZ2V0LnNpbmdsZTxUPih1cmwsIG9wdClcblx0XHR9XG5cblx0XHRyZXR1cm4gbmV3IEJsdWViaXJkPFQ+KChyZXNvbHZlLCByZWplY3QpID0+XG5cdFx0e1xuXHRcdFx0bGV0IHJlc3BvbnNlID0gdGhpcy5yZXFSZXNwb25zZXMuc2hpZnQoKVxuXG5cdFx0XHRpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvcilcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHJlamVjdChyZXNwb25zZSlcblx0XHRcdH1cblxuXHRcdFx0cmVzb2x2ZShyZXNwb25zZSBhcyBhbnkgYXMgVClcblx0XHR9KVxuXHR9XG5cblx0bWFueTxUIGV4dGVuZHMgdW5rbm93bltdPih1cmxzOiBzdHJpbmdbXSwgb3B0PzogYW55KTogQmx1ZWJpcmQ8VD5cblx0e1xuXHRcdGlmICghdGhpcy5tb2NraW5nRW5hYmxlZClcblx0XHR7XG5cdFx0XHR0aGlzLnJlcVVybHMgPSB0aGlzLnJlcVVybHMuY29uY2F0KHVybHMpXG5cdFx0XHR0aGlzLnJlcU9wdGlvbnMgPSB0aGlzLnJlcU9wdGlvbnMuY29uY2F0KG9wdClcblx0XHRcdHJldHVybiB0aGlzLnRhcmdldC5tYW55PFQ+KHVybHMsIG9wdClcblx0XHR9XG5cblx0XHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZSh1cmxzKS5tYXAodXJsID0+IHRoaXMuc2luZ2xlKHVybCwgb3B0KSkgYXMgQmx1ZWJpcmQ8VD5cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBMZXRzV3JhcE1vY2tcbiJdfQ==