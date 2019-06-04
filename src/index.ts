import _fetch from 'cross-fetch'
import Bluebird from 'bluebird'

export type Resolvable<R> = R | PromiseLike<R>;

export const enum EnumResponseType
{
	response = 'response',
	json = 'json',
	text = 'text',
}

/**
 * You can pass `single` and `many` an optional `options` parameter.
 * The available options with their corresponding defaults are:
 */
export interface IOptions<T extends EnumResponseType = EnumResponseType> extends RequestInit
{
	/**
	 * response type, can be "json", "text" or "response"
	 */
	type?: T,

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
}

export class ResponseError<T = unknown> extends Error
{
	/**
	 * response is the last response object (so you can e.g. access err.response.status)
	 */
	response: Response;
	/**
	 * content is the parsed body of the response, if available
	 * @param {string} message
	 */
	content: T;

	constructor(response: Response, content: T, message?: string)
	{
		super((message != null) ? message : 'Status ' + response.status)

		this.response = response
		this.content = content
	}
}

const defaultOptions: IOptions = {
	type: EnumResponseType.json,
	method: 'GET',
	headers: {},
	body: undefined,
}

let internalRetry = <T extends Error>(tries: number, err: T): Resolvable<boolean> => false
let internalRetryWait = (tries: number): Resolvable<number> => 0

export const fetch = _fetch;

/**
 * Set a custom decider function that decides to retry
 * based on the number of tries and the previous error
 */
export function retry(decider: <T extends Error>(tries: number, err: T) => Resolvable<boolean>)
{
	internalRetry = decider
}

/**
 * Set a custom function that sets how long we should
 * sleep between each failed request
 */
export function retryWait(callback: (tries: number) => Resolvable<number>)
{
	internalRetryWait = callback
}

/**
 * Request a single url
 */
export function single<T>(url: string, options: IOptions = {}): Bluebird<T>
{
	let tries = 1

	// Execute the request and retry if there are errors (and the
	// retry decider decided that we should try our luck again)
	const callRequest = () => request<T>(url, options).catch(async (err) =>
	{
		if (await internalRetry(++tries, err))
		{
			return wait(callRequest, internalRetryWait(tries))
		}

		throw err
	})

	return callRequest()
}

/**
 * Send a request using the underlying fetch API
 */
export function request<T>(url: string, options: IOptions<EnumResponseType.json>): Bluebird<T>
/**
 * Send a request using the underlying fetch API
 */
export function request<T extends string>(url: string, options: IOptions<EnumResponseType.text>): Bluebird<T>
/**
 * Send a request using the underlying fetch API
 */
export function request<T extends Response>(url: string, options: IOptions<EnumResponseType.response>): Bluebird<T>
/**
 * Send a request using the underlying fetch API
 */
export function request<T>(url: string, options: IOptions): Bluebird<T>
/**
 * Send a request using the underlying fetch API
 */
export function request<T extends Response>(url: string, options?: IOptions): Bluebird<T>
/**
 * Send a request using the underlying fetch API
 */
export function request<T>(url: string, options: IOptions): Bluebird<T>
{
	options = Object.assign({}, defaultOptions, options)
	let savedContent
	let savedResponse

	return new Bluebird((resolve, reject) =>
	{
		fetch(url, options)
			.then(handleResponse)
			.then(handleBody)
			.catch(handleError)

		function handleResponse(response: Response)
		{
			// Save the response for checking the status later
			savedResponse = response

			// Decode the response body
			switch (options.type)
			{
				case EnumResponseType.text:
					return response.text()
				case EnumResponseType.json:
					return response.json()
				case EnumResponseType.response:
				default:
					return response
			}
		}

		function handleBody(content)
		{
			// Bubble an error if the response status is not okay
			if (savedResponse && savedResponse.status >= 400)
			{
				savedContent = content
				throw new Error(`Response status indicates error`)
			}

			// All is well!
			resolve(content)
		}

		function handleError(err: Error | ResponseError)
		{
			// Overwrite potential decoding errors when the actual problem was the response
			if (savedResponse && savedResponse.status >= 400)
			{
				err = new ResponseError(savedResponse, savedContent)
			}
			else
			{
				err = new ResponseError(savedResponse, savedContent, err.message)
			}

			reject(err)
		}
	})
}

/**
 * Request multiple pages
 */
export function many<T extends unknown[]>(urls: string[], options: IOptions = {}): Bluebird<T>
{
	let { waitTime } = options;

	return Bluebird
		.resolve(urls)
		[waitTime ? 'mapSeries' as any as 'map' : 'map'](async (url) =>
	{
		return single(url, options).tap(() => Bluebird.delay(waitTime))
	}) as Bluebird<T>
		;
}

/**
 * Wait a specific time before executing a callback
 */
function wait<T>(callback: () => Resolvable<T>, ms: Resolvable<number>)
{
	return Bluebird
		.resolve(ms)
		.tap(ms => Bluebird.delay(ms))
		.then(() => callback())
		;
}
