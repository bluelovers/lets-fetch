/* eslint-env jest */
import * as mock from '../src/mock'
import * as fetch from '../src/index';

// @ts-ignore
//mock.__set__('fetch', {
//  single: async () => 'Some Content',
//  many: async () => ['Some Content'],
//  retry: (cb) => cb()
//})

Object.assign(fetch, {
  single: async () => 'Some Content',
  many: async () => ['Some Content'],
  retry: (cb) => cb()
});

describe('mock', () => {
  it('can add a response', async () => {
    mock.addResponse({ foo: 'bar' })
    // @ts-ignore
    expect(await mock.single('some/url')).toEqual({ foo: 'bar' })
  })

  it('can add a failing response', async () => {
    mock.addResponseError({ status: 404 }, { foo: 'bar' })
    let error

    try {
      // @ts-ignore
      await mock.single('some/url')
    } catch (err) {
      error = err
    }

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toEqual('Status 404')
    expect(error.response).toEqual({ status: 404 })
    expect(error.content).toEqual({ foo: 'bar' })
  })

  it('can add multiple responses', async () => {
    mock.addResponse({ foo: 'bar' })
    mock.addResponse('string')
    // @ts-ignore
    expect(await mock.single('some/url')).toEqual({ foo: 'bar' })
    // @ts-ignore
    expect(await mock.single('some/url')).toEqual('string')
  })

  it('can use "many" for multiple responses', async () => {
    mock.addResponse({ foo: 'bar' })
    mock.addResponse('string')
    // @ts-ignore
    let x = await mock.many(['some/url', 'some/url'])
    expect(x).toEqual([{ foo: 'bar' }, 'string'])
  })

  it('can reset and get the request urls', async () => {
    mock.reset()
    mock.addResponse({ foo: 'bar' })

    // @ts-ignore
    await mock.single('some/url')
    expect(mock.urls()).toEqual(['some/url'])
    expect(mock.lastUrl()).toEqual('some/url')
  })

  it('can reset and get the request options', async () => {
    mock.reset()
    mock.addResponse({ foo: 'bar' })
    let options = { type: 'text', headers: { Authenticate: 'Token' } }

    await mock.single('some/url', options)
    expect(mock.options()).toEqual([options])
    expect(mock.lastOption()).toEqual(options)
  })

  it('can reset the responses', async () => {
    mock.addResponse({ foo: 'bar' })
    mock.reset()

    // @ts-ignore
    let x = await mock.single('some/url')
    expect(x).toEqual(undefined)
  })

  it('can enable the real module (single)', async () => {
    mock.reset()
    mock.addResponse({ foo: 'bar' })
    mock.enableMocking(false)

    // @ts-ignore
    let content = await mock.single('real/single/url')
    expect(content).toEqual('Some Content')
    expect(mock.lastUrl()).toEqual('real/single/url')
  })

  it('can enable the real module (many)', async () => {
    mock.reset()
    mock.addResponse({ foo: 'bar' })
    mock.enableMocking(false)

    // @ts-ignore
    let content = await mock.many('real/many/url')
    expect(content).toEqual(['Some Content'])
    expect(mock.lastUrl()).toEqual('real/many/url')
  })

  it('can disable the real module again', async () => {
    mock.reset()
    mock.enableMocking(false)
    mock.addResponse({ foo: 'bar' })
    mock.enableMocking(true)

    // @ts-ignore
    let x = await mock.single('some/url')
    expect(x).toEqual({ foo: 'bar' })
  })
})
