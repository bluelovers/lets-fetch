"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = __importStar(require("./index"));
const index_1 = require("./index");
const bluebird_1 = __importDefault(require("bluebird"));
let reqResponses = [];
let reqOptions = [];
let reqUrls = [];
let mockingEnabled = true;
function addResponse(content) {
    reqResponses.push(content);
}
exports.addResponse = addResponse;
function addResponseError(response, content) {
    const responseError = new index_1.ResponseError(response, content);
    reqResponses.push(responseError);
}
exports.addResponseError = addResponseError;
function reset() {
    reqResponses = [];
    reqOptions = [];
    reqUrls = [];
    fetch.retry(() => false);
}
exports.reset = reset;
function urls() {
    return reqUrls;
}
exports.urls = urls;
function options() {
    return reqOptions;
}
exports.options = options;
function lastUrl() {
    return reqUrls[reqUrls.length - 1];
}
exports.lastUrl = lastUrl;
function lastOption() {
    return reqOptions[reqOptions.length - 1];
}
exports.lastOption = lastOption;
function enableMocking(bool) {
    mockingEnabled = bool;
}
exports.enableMocking = enableMocking;
function single(url, opt) {
    reqUrls.push(url);
    reqOptions.push(opt);
    if (!mockingEnabled) {
        return fetch.single(url, opt);
    }
    return new bluebird_1.default((resolve, reject) => {
        let response = reqResponses.shift();
        if (response instanceof Error) {
            return reject(response);
        }
        resolve(response);
    });
}
exports.single = single;
function many(urls, opt) {
    if (!mockingEnabled) {
        reqUrls = reqUrls.concat(urls);
        reqOptions = reqOptions.concat(opt);
        return fetch.many(urls, opt);
    }
    return bluebird_1.default.resolve(urls).map(url => single(url, opt));
}
exports.many = many;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLCtDQUFnQztBQUNoQyxtQ0FBd0M7QUFDeEMsd0RBQStCO0FBRy9CLElBQUksWUFBWSxHQUFzQyxFQUFFLENBQUE7QUFDeEQsSUFBSSxVQUFVLEdBQWUsRUFBRSxDQUFBO0FBQy9CLElBQUksT0FBTyxHQUFhLEVBQUUsQ0FBQTtBQUMxQixJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUE7QUFJekIsU0FBZ0IsV0FBVyxDQUFDLE9BQU87SUFFbEMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUMzQixDQUFDO0FBSEQsa0NBR0M7QUFFRCxTQUFnQixnQkFBZ0IsQ0FBSSxRQUF1QixFQUFFLE9BQVU7SUFFdEUsTUFBTSxhQUFhLEdBQUcsSUFBSSxxQkFBYSxDQUFDLFFBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUVqRSxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2pDLENBQUM7QUFMRCw0Q0FLQztBQUVELFNBQWdCLEtBQUs7SUFFcEIsWUFBWSxHQUFHLEVBQUUsQ0FBQTtJQUNqQixVQUFVLEdBQUcsRUFBRSxDQUFBO0lBQ2YsT0FBTyxHQUFHLEVBQUUsQ0FBQTtJQUNaLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDekIsQ0FBQztBQU5ELHNCQU1DO0FBRUQsU0FBZ0IsSUFBSTtJQUVuQixPQUFPLE9BQU8sQ0FBQTtBQUNmLENBQUM7QUFIRCxvQkFHQztBQUVELFNBQWdCLE9BQU87SUFFdEIsT0FBTyxVQUFVLENBQUE7QUFDbEIsQ0FBQztBQUhELDBCQUdDO0FBRUQsU0FBZ0IsT0FBTztJQUV0QixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFBO0FBQ25DLENBQUM7QUFIRCwwQkFHQztBQUVELFNBQWdCLFVBQVU7SUFFekIsT0FBTyxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUN6QyxDQUFDO0FBSEQsZ0NBR0M7QUFFRCxTQUFnQixhQUFhLENBQUMsSUFBYTtJQUUxQyxjQUFjLEdBQUcsSUFBSSxDQUFBO0FBQ3RCLENBQUM7QUFIRCxzQ0FHQztBQUVELFNBQWdCLE1BQU0sQ0FBSSxHQUFXLEVBQUUsR0FBYztJQUVwRCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2pCLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7SUFFcEIsSUFBSSxDQUFDLGNBQWMsRUFDbkI7UUFDQyxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUksR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0tBQ2hDO0lBRUQsT0FBTyxJQUFJLGtCQUFRLENBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFFMUMsSUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFBO1FBRW5DLElBQUksUUFBUSxZQUFZLEtBQUssRUFDN0I7WUFDQyxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUN2QjtRQUVELE9BQU8sQ0FBQyxRQUFvQixDQUFDLENBQUE7SUFDOUIsQ0FBQyxDQUFDLENBQUE7QUFDSCxDQUFDO0FBckJELHdCQXFCQztBQUVELFNBQWdCLElBQUksQ0FBc0IsSUFBYyxFQUFFLEdBQWM7SUFFdkUsSUFBSSxDQUFDLGNBQWMsRUFDbkI7UUFDQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUM5QixVQUFVLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNuQyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUksSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0tBQy9CO0lBRUQsT0FBTyxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFnQixDQUFBO0FBQzFFLENBQUM7QUFWRCxvQkFVQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZldGNoIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgeyBSZXNwb25zZUVycm9yIH0gZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnXG5pbXBvcnQgeyBJT3B0aW9ucyB9IGZyb20gJy4vaW5kZXgnO1xuXG5sZXQgcmVxUmVzcG9uc2VzOiAoSU1vY2tSZXNwb25zZSB8IFJlc3BvbnNlRXJyb3IpW10gPSBbXVxubGV0IHJlcU9wdGlvbnM6IElPcHRpb25zW10gPSBbXVxubGV0IHJlcVVybHM6IHN0cmluZ1tdID0gW11cbmxldCBtb2NraW5nRW5hYmxlZCA9IHRydWVcblxudHlwZSBJTW9ja1Jlc3BvbnNlID0gUGFydGlhbDxSZXNwb25zZT5cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFJlc3BvbnNlKGNvbnRlbnQpXG57XG5cdHJlcVJlc3BvbnNlcy5wdXNoKGNvbnRlbnQpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRSZXNwb25zZUVycm9yPFQ+KHJlc3BvbnNlOiBJTW9ja1Jlc3BvbnNlLCBjb250ZW50OiBUKVxue1xuXHRjb25zdCByZXNwb25zZUVycm9yID0gbmV3IFJlc3BvbnNlRXJyb3IocmVzcG9uc2UgYXMgYW55LCBjb250ZW50KVxuXG5cdHJlcVJlc3BvbnNlcy5wdXNoKHJlc3BvbnNlRXJyb3IpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldCgpXG57XG5cdHJlcVJlc3BvbnNlcyA9IFtdXG5cdHJlcU9wdGlvbnMgPSBbXVxuXHRyZXFVcmxzID0gW11cblx0ZmV0Y2gucmV0cnkoKCkgPT4gZmFsc2UpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cmxzKClcbntcblx0cmV0dXJuIHJlcVVybHNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wdGlvbnMoKVxue1xuXHRyZXR1cm4gcmVxT3B0aW9uc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGFzdFVybCgpXG57XG5cdHJldHVybiByZXFVcmxzW3JlcVVybHMubGVuZ3RoIC0gMV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhc3RPcHRpb24oKVxue1xuXHRyZXR1cm4gcmVxT3B0aW9uc1tyZXFPcHRpb25zLmxlbmd0aCAtIDFdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmFibGVNb2NraW5nKGJvb2w6IGJvb2xlYW4pXG57XG5cdG1vY2tpbmdFbmFibGVkID0gYm9vbFxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2luZ2xlPFQ+KHVybDogc3RyaW5nLCBvcHQ/OiBJT3B0aW9ucylcbntcblx0cmVxVXJscy5wdXNoKHVybClcblx0cmVxT3B0aW9ucy5wdXNoKG9wdClcblxuXHRpZiAoIW1vY2tpbmdFbmFibGVkKVxuXHR7XG5cdFx0cmV0dXJuIGZldGNoLnNpbmdsZTxUPih1cmwsIG9wdClcblx0fVxuXG5cdHJldHVybiBuZXcgQmx1ZWJpcmQ8VD4oKHJlc29sdmUsIHJlamVjdCkgPT5cblx0e1xuXHRcdGxldCByZXNwb25zZSA9IHJlcVJlc3BvbnNlcy5zaGlmdCgpXG5cblx0XHRpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvcilcblx0XHR7XG5cdFx0XHRyZXR1cm4gcmVqZWN0KHJlc3BvbnNlKVxuXHRcdH1cblxuXHRcdHJlc29sdmUocmVzcG9uc2UgYXMgYW55IGFzIFQpXG5cdH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYW55PFQgZXh0ZW5kcyB1bmtub3duW10+KHVybHM6IHN0cmluZ1tdLCBvcHQ/OiBJT3B0aW9ucyk6IEJsdWViaXJkPFQ+XG57XG5cdGlmICghbW9ja2luZ0VuYWJsZWQpXG5cdHtcblx0XHRyZXFVcmxzID0gcmVxVXJscy5jb25jYXQodXJscylcblx0XHRyZXFPcHRpb25zID0gcmVxT3B0aW9ucy5jb25jYXQob3B0KVxuXHRcdHJldHVybiBmZXRjaC5tYW55PFQ+KHVybHMsIG9wdClcblx0fVxuXG5cdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKHVybHMpLm1hcCh1cmwgPT4gc2luZ2xlKHVybCwgb3B0KSkgYXMgQmx1ZWJpcmQ8VD5cbn1cbiJdfQ==