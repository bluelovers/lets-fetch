import { Resolvable, resolveCall, wait } from './util';
import Bluebird from 'bluebird';
import { BindAll } from 'lodash-decorators/bindAll'

export interface IRetryFn
{
	<T extends Error>(tries: number, err?: T): Resolvable<boolean>
}

export interface IRetryWaitFn
{
	(tries: number): Resolvable<number>
}

export interface IHttpRequest<O, R>
{
	request(url: string, options?: O): PromiseLike<R>
}

export interface ILetsWrapOptions<O, R>
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

	requestOptions?: Partial<O>,

	internalRetry?: IRetryFn,
	internalRetryWait?: IRetryWaitFn,

	http?: IHttpRequest<O, R>
}

const _internalRetry: IRetryFn = () => false;
const _internalRetryWait: IRetryWaitFn = (tries) => 0;

@BindAll()
export class LetsWrap<O = {}, R = Response, H = IHttpRequest<O, R>>
{
	public $http: H;

	constructor(protected defaultOptions: ILetsWrapOptions<O, R> = {})
	{
		this.setDefault({})
	}

	setDefault(options: ILetsWrapOptions<O, R>)
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
	request<T = R>(url: string, options?: ILetsWrapOptions<O, R>): Bluebird<T>
	{
		return Bluebird
			.resolve(this.mergeOptions(options))
			.then((options) =>
			{
				return (this.$http as any as IHttpRequest<O, R>).request(url, options.requestOptions as any)
			}) as any as Bluebird<T>
			;
	}

	/**
	 * Request a single url
	 */
	single<T = R>(url: string, options?: ILetsWrapOptions<O, R>): Bluebird<T>
	{
		let tries = 1;

		return Bluebird
			.resolve(this.mergeOptions(options))
			.then((options) =>
			{
				const { internalRetry, internalRetryWait } = options;

				const callRequest = () =>
				{
					return this.request(url, options)
						.catch(async (err) =>
						{

							if (await internalRetry(++tries, err))
							{
								return wait(callRequest, internalRetryWait(tries))
							}

							return Bluebird.reject(err)
						})
				};

				return callRequest()
			}) as any as Bluebird<T>
			;
	}

	many<T extends unknown[] = R[]>(urls: string[], options: ILetsWrapOptions<O, R> = {}): Bluebird<T>
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
					return this.single(url, options).tap(() => Bluebird.delay(waitTime))

				}) as any as Bluebird<T>
					;
			})
			;
	}

	mergeOptions(options: ILetsWrapOptions<O, R>): ILetsWrapOptions<O, R>
	{
		let defaultOptions = this.options;
		options = options || {};

		let requestOptions = Object.assign({}, defaultOptions.requestOptions, options.requestOptions) as O;

		return Object.assign({} as ILetsWrapOptions<O, R>, defaultOptions, options, {
			requestOptions,
		});
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

	get options(): ILetsWrapOptions<O, R>
	{
		return {
			...this.defaultOptions,
			// @ts-ignore
			http: this.$http,
		}
	}

	clone<H2 = H, R2 = R, O2 = O>(options: ILetsWrapOptions<O | O2, R | R2> = {}): LetsWrap<O2, R2, H2>
	{
		return new LetsWrap(this.mergeOptions(options as any) as any)
	}
}

export default LetsWrap
