/**
 * Created by user on 2019/6/5.
 */
import LetsWrap, { SymbolRequest, ILetsWrapOptions, IHttpRequest } from '../../index';
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios';
import { ILetsWrapFetchOptions } from '../fetch';
import AxiosClass from 'axios/lib/core/Axios';
import Bluebird from 'bluebird'
import { BindAll } from 'lodash-decorators';

export type IHttpRequestAxios<O3 extends AxiosRequestConfig = AxiosRequestConfig, R3 extends AxiosResponse = AxiosResponse, T3 extends AxiosInstance = AxiosInstance> = IHttpRequest<O3, R3, T3>

@BindAll()
export class LetsWrapAxios<O4 extends AxiosRequestConfig, R4 extends AxiosResponse, T4 extends AxiosInstance> extends LetsWrap<IHttpRequestAxios<O4, R4, T4>, O4>
{
	constructor(options?: ILetsWrapOptions<IHttpRequestAxios<O4, R4, T4>, O4>)
	{
		super(options as any);

		this.$http = this.defaultHttp(this.options)
	}

	defaultHttp(options?: ILetsWrapOptions<IHttpRequestAxios<O4, R4, T4>, O4>): IHttpRequest<O4, R4, T4>
	{
		return toRequestLike(this.createAxios(options));
	}

	createAxios(options?: ILetsWrapOptions<IHttpRequestAxios<O4, R4, T4>, O4>): T4
	{
		options = options || {} as any;

		if (isAxios<T4>(options.$http))
		{
			Object.assign(options.$http.defaults, options.$http.defaults, options.requestOptions);

			return options.$http
		}

		return Axios.create(options.requestOptions) as T4
	}

	requestOption(options: ILetsWrapOptions<IHttpRequestAxios<O4, R4, T4>, O4>, url?: string)
	{
		let ro = super.requestOption(options, url);

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
	return (axios instanceof AxiosClass)
}

export function toRequestLike<O3 extends AxiosRequestConfig, R3 extends AxiosResponse, T3 extends AxiosInstance>(axios: T3): IHttpRequest<O3, R3, T3>
{
	return LetsWrap.toRequestLike<O3, R3, T3>(axios, axios)
}

export default LetsWrapAxios

