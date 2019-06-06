/**
 * Created by user on 2019/6/5.
 */
import LetsWrap, { SymbolRequest, ILetsWrapOptions, IHttpRequest } from '../../index';
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse as _AxiosResponse, AxiosPromise } from 'axios';
import { ILetsWrapFetchOptions } from '../fetch';
import AxiosClass from 'axios/lib/core/Axios';
import Bluebird from 'bluebird'
import { BindAll } from 'lodash-decorators';

export type IHttpRequestAxios<O3 extends AxiosRequestConfig = AxiosRequestConfig, R3 extends AxiosResponse = AxiosResponse, T3 extends AxiosInstance = AxiosInstance> = IHttpRequest<O3, R3, T3>

export type IHttpRequestAxiosOptions<O3 extends AxiosRequestConfig = AxiosRequestConfig, R3 extends AxiosResponse = AxiosResponse, T3 extends AxiosInstance = AxiosInstance> = ILetsWrapOptions<IHttpRequestAxios<O3, R3, T3>, O3>

export interface IAxiosResponseClientRequest extends Record<symbol | string, any>
{
	res?: {
		responseUrl?: string,
		redirects?: string[],
		headers?: HeadersInit,
		rawHeaders?: string[],
	},
	path?: string,
	method?: string,
	finished?: boolean,
}

export interface AxiosResponse<T = any> extends Omit<_AxiosResponse<T>, 'request' | 'headers'>
{
	headers: HeadersInit,
	request?: IAxiosResponseClientRequest;
}

export { AxiosResponse as IAxiosResponse }

@BindAll()
export class LetsWrapAxios<O4 extends AxiosRequestConfig, R4 extends AxiosResponse, T4 extends AxiosInstance> extends LetsWrap<IHttpRequestAxios<O4, R4, T4>, O4>
{
	constructor(options?: IHttpRequestAxiosOptions<O4, R4, T4>)
	{
		super(options as any);

		this.$http = this.defaultHttp(this.options)
	}

	defaultHttp(options?: IHttpRequestAxiosOptions<O4, R4, T4>): IHttpRequest<O4, R4, T4>
	{
		return toRequestLike(this.createAxios(options));
	}

	createAxios(options?: IHttpRequestAxiosOptions<O4, R4, T4>): T4
	{
		options = options || {} as any;

		if (isAxios<T4>(options.$http))
		{
			Object.assign(options.$http.defaults, options.$http.defaults, options.requestOptions);

			return options.$http
		}

		return Axios.create(options.requestOptions) as T4
	}

	requestOptions(options: IHttpRequestAxiosOptions<O4, R4, T4>, url?: string)
	{
		let ro = super.requestOptions(options, url);

		Object.entries(options)
			.forEach(([k, v]) =>
			{

				if (ro[k] == null)
				{
					ro[k] = v;
				}

			})
		;

		return ro;
	}
}

export function isAxios<T4 extends AxiosInstance = AxiosInstance>(axios): axios is T4
{
	return axios && (axios instanceof AxiosClass)
}

export function toRequestLike<O3 extends AxiosRequestConfig, R3 extends AxiosResponse, T3 extends AxiosInstance>(axios: T3): IHttpRequest<O3, R3, T3>
{
	return LetsWrap.toRequestLike<O3, R3, T3>(axios, axios)
}

export default LetsWrapAxios

