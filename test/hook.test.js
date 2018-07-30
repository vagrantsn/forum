const Hook = require('../hooks/hook')

describe('Hook', () => {
  let TestHook

  beforeEach(() => {
    TestHook = new Hook('mockEvent')
  })

  it('subscribes callbacks', () => {
    TestHook.subscribe(jest.fn())
    TestHook.subscribe(jest.fn())

    expect(TestHook.getSubscriptions()).toHaveLength(2)
  })

  it('calls subscribed callbacks', () => {
    let fn = jest.fn()

    TestHook.subscribe(fn)
    TestHook.broadcast()

    expect(fn).toHaveBeenCalled()
  })

  it('calls subscribed callbacks ordered by priority', () => {
    let finishLine = 0

    let first = () => (finishLine === 0 ? (finishLine = 'first') : false)
    let second = () => (finishLine === 0 ? (finishLine = 'second') : false)

    TestHook.subscribe(first).priority(0)
    TestHook.subscribe(second).priority(1)

    TestHook.broadcast()

    expect(finishLine).toBe('first')
  })

  it('prevents from running due to validation', () => {
    TestHook.validateRequest = () => false

    const fn = jest.fn()
    TestHook.subscribe(fn)

    TestHook.process()

    expect(fn).toHaveBeenCalledTimes(0)
  })
})
