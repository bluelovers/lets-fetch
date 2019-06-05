import { LetsWrapFetch, ILetsWrapFetchOptions } from './fetch';
import Bluebird from 'bluebird'

import { LetsWrapMock } from './coreMock';
import fetch from './index'

let oo = new LetsWrapMock(fetch)

export default oo;
