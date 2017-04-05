var test = require('tape');
var sinon = require('sinon');
var pureHandler = require('./index');

test('it should return a function', assert => {
  const noop = () => {};

  assert.equals(typeof pureHandler(noop), 'function');

  assert.end();
});

test('it should bind this for values', assert => {
  const expected = 123;

  const handlerFunc = ({ foo }) => assert.equals(foo, expected);

  const obj = {
    foo: expected,
    handler: pureHandler(handlerFunc)
  }

  obj.handler();

  assert.end();
});

test('it should bind this for functions', assert => {
  const expected = 123;

  const handlerFunc = ({ func }) => assert.equals(func(), expected);

  const obj = {
    foo: expected,
    func: function() {
      return this.foo;
    },
    handler: pureHandler(handlerFunc)
  }

  obj.handler();

  assert.end();
});

test('it should expand bound attributes object when returned', assert => {
  const handlerFunc = () => ({
    attributes: {
      bar: 234
    }
  });

  const obj = {
    attributes: {
      foo: 123
    },
    handler: pureHandler(handlerFunc)
  }

  obj.handler();

  const expected = { foo: 123, bar: 234 };
  const actual = obj.attributes;

  assert.deepEqual(actual, expected);

  assert.end();
});

test('it should call emit when present in return value', assert => {
  const handlerFunc = () => ({
    emit: [':tell', 'Hello World']
  });

  const obj = {
    emit: sinon.spy(),
    handler: pureHandler(handlerFunc)
  };

  obj.handler();

  assert.true(obj.emit.calledWith(':tell', 'Hello World'));

  assert.end();
});

test('it should work with promises', assert => {
  const handlerFunc = () => Promise.resolve({
    emit: [':tell', 'Hello World']
  });

  const obj = {
    emit: sinon.spy(),
    handler: pureHandler(handlerFunc)
  };

  obj.handler().then(() => {
    assert.true(obj.emit.calledWith(':tell', 'Hello World'));

    assert.end();
  });
});
