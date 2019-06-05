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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esd0RBQWdDO0FBQ2hDLHVEQUFtRDtBQUNuRCxpQ0FBc0M7QUFLdEMsSUFBYSxZQUFZLEdBQXpCLE1BQWEsWUFBWTtJQU94QixZQUFtQixNQUFTO1FBQVQsV0FBTSxHQUFOLE1BQU0sQ0FBRztRQUw1QixpQkFBWSxHQUFrQyxFQUFFLENBQUE7UUFDaEQsZUFBVSxHQUFRLEVBQUUsQ0FBQTtRQUNwQixZQUFPLEdBQWEsRUFBRSxDQUFBO1FBQ3RCLG1CQUFjLEdBQUcsSUFBSSxDQUFBO0lBS3JCLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBTztRQUVsQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNoQyxDQUFDO0lBRUQsZ0JBQWdCLENBQUksUUFBVyxFQUFFLE9BQVU7UUFFMUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxvQkFBYSxDQUFDLFFBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUVqRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUN0QyxDQUFDO0lBRUQsS0FBSztRQUVKLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFBO1FBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFBO1FBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFBO1FBRWpCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFFRCxJQUFJO1FBRUgsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBO0lBQ3BCLENBQUM7SUFFRCxPQUFPO1FBRU4sT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQzdDLENBQUM7SUFFRCxVQUFVO1FBRVQsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxhQUFhLENBQUMsSUFBYTtRQUUxQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQTtJQUMzQixDQUFDO0lBRUQsTUFBTSxDQUFJLEdBQVcsRUFBRSxHQUFTO1FBRS9CLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3RCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBRXpCLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUN4QjtZQUNDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUksR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1NBQ3RDO1FBRUQsT0FBTyxJQUFJLGtCQUFRLENBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFFMUMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUV4QyxJQUFJLFFBQVEsWUFBWSxLQUFLLEVBQzdCO2dCQUNDLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO2FBQ3ZCO1lBRUQsT0FBTyxDQUFDLFFBQW9CLENBQUMsQ0FBQTtRQUM5QixDQUFDLENBQUMsQ0FBQTtJQUNILENBQUM7SUFFRCxJQUFJLENBQXNCLElBQWMsRUFBRSxHQUFTO1FBRWxELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUN4QjtZQUNDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUM3QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFJLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQTtTQUNyQztRQUVELE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQWdCLENBQUE7SUFDL0UsQ0FBQztDQUNELENBQUE7QUF2RlksWUFBWTtJQUR4QixpQkFBTyxFQUFFOztHQUNHLFlBQVksQ0F1RnhCO0FBdkZZLG9DQUFZO0FBeUZ6QixrQkFBZSxZQUFZLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGV0c1dyYXAsIHsgSUxldHNXcmFwT3B0aW9uc0NvcmUsIElVbnBhY2tIdHRwUmVxdWVzdE9wdGlvbnMsIElVbnBhY2tSZXR1cm5UeXBlSHR0cFJlcXVlc3QgfSBmcm9tICcuL2luZGV4JztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBCaW5kQWxsIH0gZnJvbSAnbG9kYXNoLWRlY29yYXRvcnMvYmluZEFsbCdcbmltcG9ydCB7IFJlc3BvbnNlRXJyb3IgfSBmcm9tICcuL3V0aWwnXG5cbnR5cGUgSU1vY2tSZXNwb25zZSA9IFBhcnRpYWw8UmVzcG9uc2U+XG5cbkBCaW5kQWxsKClcbmV4cG9ydCBjbGFzcyBMZXRzV3JhcE1vY2s8VCBleHRlbmRzIFBhcnRpYWw8TGV0c1dyYXA8YW55LCBhbnk+PiwgUiA9IElVbnBhY2tSZXR1cm5UeXBlSHR0cFJlcXVlc3Q8VFtcIiRodHRwXCJdPiB8IFBhcnRpYWw8UmVzcG9uc2U+IHwgdW5rbm93biwgTyA9IElVbnBhY2tIdHRwUmVxdWVzdE9wdGlvbnM8VFtcIiRodHRwXCJdPiB8IHVua25vd24+XG57XG5cdHJlcVJlc3BvbnNlczogKFIgfCBFcnJvciB8IFJlc3BvbnNlRXJyb3IpW10gPSBbXVxuXHRyZXFPcHRpb25zOiBPW10gPSBbXVxuXHRyZXFVcmxzOiBzdHJpbmdbXSA9IFtdXG5cdG1vY2tpbmdFbmFibGVkID0gdHJ1ZVxuXG5cdGNvbnN0cnVjdG9yKHB1YmxpYyB0YXJnZXQ6IFQpXG5cdHtcblxuXHR9XG5cblx0YWRkUmVzcG9uc2UoY29udGVudClcblx0e1xuXHRcdHRoaXMucmVxUmVzcG9uc2VzLnB1c2goY29udGVudClcblx0fVxuXG5cdGFkZFJlc3BvbnNlRXJyb3I8VD4ocmVzcG9uc2U6IFIsIGNvbnRlbnQ6IFQpXG5cdHtcblx0XHRjb25zdCByZXNwb25zZUVycm9yID0gbmV3IFJlc3BvbnNlRXJyb3IocmVzcG9uc2UgYXMgYW55LCBjb250ZW50KVxuXG5cdFx0dGhpcy5yZXFSZXNwb25zZXMucHVzaChyZXNwb25zZUVycm9yKVxuXHR9XG5cblx0cmVzZXQoKVxuXHR7XG5cdFx0dGhpcy5yZXFSZXNwb25zZXMgPSBbXVxuXHRcdHRoaXMucmVxT3B0aW9ucyA9IFtdXG5cdFx0dGhpcy5yZXFVcmxzID0gW11cblxuXHRcdHRoaXMudGFyZ2V0LnNldFJldHJ5KCgpID0+IGZhbHNlKVxuXHR9XG5cblx0dXJscygpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5yZXFVcmxzXG5cdH1cblxuXHRsYXN0VXJsKClcblx0e1xuXHRcdHJldHVybiB0aGlzLnJlcVVybHNbdGhpcy5yZXFVcmxzLmxlbmd0aCAtIDFdXG5cdH1cblxuXHRsYXN0T3B0aW9uKClcblx0e1xuXHRcdHJldHVybiB0aGlzLnJlcU9wdGlvbnNbdGhpcy5yZXFPcHRpb25zLmxlbmd0aCAtIDFdXG5cdH1cblxuXHRlbmFibGVNb2NraW5nKGJvb2w6IGJvb2xlYW4pXG5cdHtcblx0XHR0aGlzLm1vY2tpbmdFbmFibGVkID0gYm9vbFxuXHR9XG5cblx0c2luZ2xlPFQ+KHVybDogc3RyaW5nLCBvcHQ/OiBhbnkpXG5cdHtcblx0XHR0aGlzLnJlcVVybHMucHVzaCh1cmwpXG5cdFx0dGhpcy5yZXFPcHRpb25zLnB1c2gob3B0KVxuXG5cdFx0aWYgKCF0aGlzLm1vY2tpbmdFbmFibGVkKVxuXHRcdHtcblx0XHRcdHJldHVybiB0aGlzLnRhcmdldC5zaW5nbGU8VD4odXJsLCBvcHQpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG5ldyBCbHVlYmlyZDxUPigocmVzb2x2ZSwgcmVqZWN0KSA9PlxuXHRcdHtcblx0XHRcdGxldCByZXNwb25zZSA9IHRoaXMucmVxUmVzcG9uc2VzLnNoaWZ0KClcblxuXHRcdFx0aWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiByZWplY3QocmVzcG9uc2UpXG5cdFx0XHR9XG5cblx0XHRcdHJlc29sdmUocmVzcG9uc2UgYXMgYW55IGFzIFQpXG5cdFx0fSlcblx0fVxuXG5cdG1hbnk8VCBleHRlbmRzIHVua25vd25bXT4odXJsczogc3RyaW5nW10sIG9wdD86IGFueSk6IEJsdWViaXJkPFQ+XG5cdHtcblx0XHRpZiAoIXRoaXMubW9ja2luZ0VuYWJsZWQpXG5cdFx0e1xuXHRcdFx0dGhpcy5yZXFVcmxzID0gdGhpcy5yZXFVcmxzLmNvbmNhdCh1cmxzKVxuXHRcdFx0dGhpcy5yZXFPcHRpb25zID0gdGhpcy5yZXFPcHRpb25zLmNvbmNhdChvcHQpXG5cdFx0XHRyZXR1cm4gdGhpcy50YXJnZXQubWFueTxUPih1cmxzLCBvcHQpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIEJsdWViaXJkLnJlc29sdmUodXJscykubWFwKHVybCA9PiB0aGlzLnNpbmdsZSh1cmwsIG9wdCkpIGFzIEJsdWViaXJkPFQ+XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGV0c1dyYXBNb2NrXG4iXX0=