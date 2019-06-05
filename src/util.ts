import Bluebird from 'bluebird'

let _BluebirdCancelable: typeof Bluebird;

export function getBluebirdCancelable(): typeof Bluebird
{
	if (_BluebirdCancelable == null)
	{
		let p = Bluebird.getNewLibraryCopy();

		p.config({
			cancellation: true
		});

		_BluebirdCancelable = p
	}

	return _BluebirdCancelable;
}

export type Resolvable<R> = R | PromiseLike<R>;

export function delay<R>(ms: Resolvable<number>): Bluebird<number>
{
	return new Bluebird(async (resolve, reject) =>
	{
		ms = await ms;
		await Bluebird.delay(ms);
		resolve(ms);
	})
}

export function resolveCall<P extends any[], R>(fn: Resolvable<((...argv: P) => R)>, ...argArray: P): Bluebird<R>
{
	return Bluebird.resolve(fn)
		.then(fn =>
		{
			return fn(...argArray)
		})
		;
}

export function resolveTimeout<T>(value: PromiseLike<T>, timeout: number): Bluebird<T>
{
	let p = getBluebirdCancelable().resolve(value);

	return p
		.timeout(timeout, `operation timed out ${timeout}ms`)
		.tapCatch(function ()
		{
			return p.cancel();
		})
}

/**
 * Wait a specific time before executing a callback
 */
export function wait<T>(callback: Resolvable<() => Resolvable<T>>, ms: Resolvable<number>)
{
	return delay(ms).then(() => {
		return resolveCall(callback)
	})
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
