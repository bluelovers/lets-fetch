import { LetsWrapFetch, ILetsWrapFetchOptions } from './fetch';
import Bluebird from 'bluebird'
import { EnumResponseType } from './fetch';

let oo = new LetsWrapFetch();

const { request, setRetry, setRetryWait, single, many, setDefault } = oo;

export { ILetsWrapFetchOptions, EnumResponseType }

export {
	request, single, many, setDefault
}

export {
	setRetry as retry,
	setRetryWait as retryWait,
	setRetry,
	setRetryWait,
}

export default oo;
