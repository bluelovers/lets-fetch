import { Resolvable, resolveCall, resolveTimeout, wait } from './util';
import Bluebird from 'bluebird';
import { BindAll } from 'lodash-decorators/bindAll'
import { ITSOverwrite } from 'ts-type'

export interface IHttpRequest<O = unknown, R = unknown>
{
	request(url: string, options?: O): PromiseLike<R>
}

export interface ILetsWrapOptionsCore<H extends IHttpRequest>
{
	/**
	 * wait time in between requests (only for "many")
	 * as soon as this is set, requests will be sent in series instead of parallel
	 */
	waitTime?: number,

	/**
	 * request/response timeout in ms, 0 to disable
	 * (!) only available in node.js environments
	 */
	timeout?: number,

	requestOptions?: Partial<IUnpackHttpRequestOptions<H>>,

	internalRetry?: IRetryFn,
	internalRetryWait?: IRetryWaitFn,

	http?: H
}

const _internalRetry: IRetryFn = () => false;
const _internalRetryWait: IRetryWaitFn = (tries) => 0;

@BindAll()
export class LetsWrap<H extends IHttpRequest, O = Record<string, unknown>>
{
	public $http: H;

	constructor(protected defaultOptions: ILetsWrapOptions<H, O> = {} as any)
	{
		this.setDefault({} as any)
	}

	setDefault(options?: ILetsWrapOptions<H, O>)
	{
		let defaultOptions = this.defaultOptions

		options = this.mergeOptions(options);

		options.requestOptions = Object.assign({}, options.requestOptions, defaultOptions.requestOptions);

		options.internalRetry = options.internalRetry || defaultOptions.internalRetry || _internalRetry;
		options.internalRetryWait = options.internalRetryWait || defaultOptions.internalRetryWait || _internalRetryWait;

		Object.assign(this.defaultOptions, options);

		// @ts-ignore
		this.$http = this.defaultOptions.http || this.$http;

		delete this.defaultOptions.http;
	}

	/**
	 * Send a request using the underlying fetch API
	 */
	request<T = IUnpackReturnTypeHttpRequest<H>>(url: string, options?: ILetsWrapOptions<H, O>): Bluebird<T>
	{
		return Bluebird
			.resolve(this.mergeOptions(options))
			.then((options) =>
			{
				return this.$http.request(url, this.requestOption(options))
			})
			.tap(v =>
			{
				/*
				console.dir({
					url,
					v,
				});
				 */
			}) as any as Bluebird<T>
			;
	}

	/**
	 * Request a single url
	 */
	single<T = IUnpackReturnTypeHttpRequest<H>>(url: string, options?: ILetsWrapOptions<H, O>): Bluebird<T>
	{
		let tries = 1;

		return Bluebird
			.resolve(this.mergeOptions(options))
			.then((options) =>
			{
				const { internalRetry, internalRetryWait } = options;
				let { timeout } = options;

				const callRequest = () =>
				{
					return this.request(url, options)
						.catch(async (err) =>
						{
							if (await internalRetry(++tries, err))
							{
								await Bluebird.delay(await internalRetryWait(tries))
								return callRequest()
							}

							return Bluebird.reject(err)
						})
				};

				if (timeout > 0)
				{
					return resolveTimeout(callRequest(), (timeout | 0) + 1)
				}

				return callRequest()
			}) as any as Bluebird<T>
			;
	}

	many<T extends unknown[] = IUnpackReturnTypeHttpRequest<H>[]>(urls: string[],
		options?: ILetsWrapOptions<H, O>,
	): Bluebird<T>
	{
		return Bluebird
			.resolve(this.mergeOptions(options))
			.then((options) =>
			{
				const { waitTime } = options;

				return Bluebird
					.resolve(urls)
					[waitTime ? 'mapSeries' as any as 'map' : 'map'](async (url) =>
				{
					return this.single(url, options).tap(() => Bluebird.delay(waitTime | 0))

				}) as any as Bluebird<T>
					;
			})
			;
	}

	mergeOptions(options: ILetsWrapOptions<H, O>): ILetsWrapOptions<H, O>
	{
		let defaultOptions = this.options;
		// @ts-ignore
		options = options || {};

		let requestOptions = Object.assign({}, defaultOptions.requestOptions, options.requestOptions) as O;

		return Object.assign({} as ILetsWrapOptions<H, O>, defaultOptions, options, {
			requestOptions,
		});
	}

	requestOption(options: ILetsWrapOptions<H, O>)
	{
		let ro = {
			...options.requestOptions,
		};

		// @ts-ignore
		if (ro.timeout == null && options.timeout)
		{
			// @ts-ignore
			ro.timeout = options.timeout
		}

		return ro;
	}

	/**
	 * Set a custom decider function that decides to retry
	 * based on the number of tries and the previous error
	 */
	setRetry(decider: IRetryFn)
	{
		this.defaultOptions.internalRetry = decider;

		return this;
	}

	/**
	 * Set a custom function that sets how long we should
	 * sleep between each failed request
	 */
	setRetryWait(callback: IRetryWaitFn)
	{
		this.defaultOptions.internalRetryWait = callback;

		return this;
	}

	get options(): ILetsWrapOptions<H, O>
	{
		return {
			...this.defaultOptions,
			// @ts-ignore
			http: this.$http,
		}
	}

	clone<H2 extends IHttpRequest = H, O2 = O>(options?: ILetsWrapOptions<H | H2, O | O2>): LetsWrap<H2, O2>
	{
		return new LetsWrap(this.mergeOptions(options as any) as any)
	}
}

export type ILetsWrapOptions<H extends IHttpRequest, O = Record<string, unknown>> = ILetsWrapOptionsCore<H> & O

export type IUnpackReturnTypeHttpRequest<H> =
	H extends IHttpRequest<any, infer R> ? (R extends Resolvable<infer U> ? U : R) : unknown

export type IUnpackHttpRequestOptions<H> =
	H extends IHttpRequest<infer R, any> ? R : unknown

export interface IRetryFn
{
	<T extends Error>(tries: number, err?: T): Resolvable<boolean>
}

export interface IRetryWaitFn
{
	(tries: number): Resolvable<number>
}

export default LetsWrap
