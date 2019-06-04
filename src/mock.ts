import * as fetch from './index'
import { ResponseError } from './index';
import Bluebird from 'bluebird'
import { IOptions } from './index';

let reqResponses: (IMockResponse | ResponseError)[] = []
let reqOptions: IOptions[] = []
let reqUrls: string[] = []
let mockingEnabled = true

type IMockResponse = Partial<Response>

export function addResponse(content)
{
	reqResponses.push(content)
}

export function addResponseError<T>(response: IMockResponse, content: T)
{
	const responseError = new ResponseError(response as any, content)

	reqResponses.push(responseError)
}

export function reset()
{
	reqResponses = []
	reqOptions = []
	reqUrls = []
	fetch.retry(() => false)
}

export function urls()
{
	return reqUrls
}

export function options()
{
	return reqOptions
}

export function lastUrl()
{
	return reqUrls[reqUrls.length - 1]
}

export function lastOption()
{
	return reqOptions[reqOptions.length - 1]
}

export function enableMocking(bool: boolean)
{
	mockingEnabled = bool
}

export function single<T>(url: string, opt?: IOptions)
{
	reqUrls.push(url)
	reqOptions.push(opt)

	if (!mockingEnabled)
	{
		return fetch.single<T>(url, opt)
	}

	return new Bluebird<T>((resolve, reject) =>
	{
		let response = reqResponses.shift()

		if (response instanceof Error)
		{
			return reject(response)
		}

		resolve(response as any as T)
	})
}

export function many<T extends unknown[]>(urls: string[], opt?: IOptions): Bluebird<T>
{
	if (!mockingEnabled)
	{
		reqUrls = reqUrls.concat(urls)
		reqOptions = reqOptions.concat(opt)
		return fetch.many<T>(urls, opt)
	}

	return Bluebird.resolve(urls).map(url => single(url, opt)) as Bluebird<T>
}
