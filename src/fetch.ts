import _fetch from 'cross-fetch'
import Bluebird from 'bluebird'
import LetsWrap, { ILetsWrapOptionsCore, ILetsWrapOptions } from './core';
import { BindAll } from 'lodash-decorators/bindAll'

export interface IFetch
{
	request: typeof _fetch
}

export const enum EnumResponseType
{
	response = 'response',
	json = 'json',
	text = 'text',
}

export interface ILetsWrapFetchOptions<T = EnumResponseType.response | EnumResponseType.text | EnumResponseType.json | string> extends ILetsWrapOptions<IFetch>
{
	/**
	 * response type, can be "json", "text" or "response"
	 */
	type?: T,

	http?: IFetch;
}

@BindAll()
export class LetsWrapFetch extends LetsWrap<IFetch, ILetsWrapFetchOptions>
{
	constructor(options?: ILetsWrapFetchOptions)
	{
		super(options);

		// @ts-ignore
		this.defaultOptions.type = this.defaultOptions.type || EnumResponseType.json;

		this.$http = this.$http || {
			request: _fetch,
		}
	}

	single<T = Response>(url: string, options?: ILetsWrapFetchOptions<EnumResponseType | string>): Bluebird<T>
	{
		return super.single(url, options)
	}

	many<T extends unknown[] = Response[]>(urls: string[], options?: ILetsWrapFetchOptions): Bluebird<T>
	{
		return super.many<T>(urls, options)
	}

	request<T = Response>(url: string, options?: ILetsWrapFetchOptions): Bluebird<T>
	{
		let savedResponse: Response;
		let savedContent: T;

		options = this.mergeOptions(options);

		return super.request<Response>(url, options)
			.then((response) =>
			{
				savedResponse = response;

				switch (options.type)
				{
					case EnumResponseType.text:
					case 'text':
						return response.text()
					case EnumResponseType.json:
					case 'json':
						return response.json()
					case EnumResponseType.response:
					case 'response':
					default:
						return response
				}

				return response;
			})
			.then((content: T) =>
			{
				savedContent = content;

				if (savedResponse && savedResponse.status >= 400)
				{
					throw new Error(`Response status indicates error`)
				}

				return content
			}).catch((err) =>
			{
				err._response_ = savedResponse
				err._content_ = savedContent
				err._url_ = url

				return Bluebird.reject(err)
			}) as any as Bluebird<T>
	}
}

export default LetsWrapFetch
