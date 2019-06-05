import LetsWrap, { ILetsWrapOptionsCore, IUnpackHttpRequestOptions, IUnpackReturnTypeHttpRequest } from './core';
import Bluebird from 'bluebird';
import { BindAll } from 'lodash-decorators/bindAll'
import { ResponseError } from './util'

type IMockResponse = Partial<Response>

@BindAll()
export class LetsWrapMock<T extends Partial<LetsWrap<any, any>>, R = IUnpackReturnTypeHttpRequest<T["$http"]> | unknown, O = IUnpackHttpRequestOptions<T["$http"]> | unknown>
{
	reqResponses: (R | Error | ResponseError)[] = []
	reqOptions: O[] = []
	reqUrls: string[] = []
	mockingEnabled = true

	constructor(public target: T)
	{

	}

	addResponse(content)
	{
		this.reqResponses.push(content)
	}

	addResponseError<T>(response: R, content: T)
	{
		const responseError = new ResponseError(response as any, content)

		this.reqResponses.push(responseError)
	}

	reset()
	{
		this.reqResponses = []
		this.reqOptions = []
		this.reqUrls = []

		this.target.setRetry(() => false)
	}

	urls()
	{
		return this.reqUrls
	}

	lastUrl()
	{
		return this.reqUrls[this.reqUrls.length - 1]
	}

	lastOption()
	{
		return this.reqOptions[this.reqOptions.length - 1]
	}

	enableMocking(bool: boolean)
	{
		this.mockingEnabled = bool
	}

	single<T>(url: string, opt?: any)
	{
		this.reqUrls.push(url)
		this.reqOptions.push(opt)

		if (!this.mockingEnabled)
		{
			return this.target.single<T>(url, opt)
		}

		return new Bluebird<T>((resolve, reject) =>
		{
			let response = this.reqResponses.shift()

			if (response instanceof Error)
			{
				return reject(response)
			}

			resolve(response as any as T)
		})
	}

	many<T extends unknown[]>(urls: string[], opt?: any): Bluebird<T>
	{
		if (!this.mockingEnabled)
		{
			this.reqUrls = this.reqUrls.concat(urls)
			this.reqOptions = this.reqOptions.concat(opt)
			return this.target.many<T>(urls, opt)
		}

		return Bluebird.resolve(urls).map(url => this.single(url, opt)) as Bluebird<T>
	}
}

export default LetsWrapMock
