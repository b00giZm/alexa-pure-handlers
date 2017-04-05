# alexa-pure-handlers

[![](https://api.travis-ci.org/b00giZm/alexa-pure-handlers.svg?branch=master)](https://travis-ci.org/b00giZm/alexa-pure-handlers)

🌟🦄 Write pure handlers for the official [Node.js Alexa Skills Kit SDK](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs). 🦄🌟

One little flaw I found with the Alexa Skills Kit SDK for Node.js is, that it does encourage you to write handlers that are bound to an specific context and are therefore full of [side effects](https://en.wikipedia.org/wiki/Side_effect_(computer_science)). Side effects are bad, because they make your handlers less predictable and are much harder to test than [pure, functional](https://en.wikipedia.org/wiki/Pure_function) handlers.

Pure handlers are a good thing, because every dependency is provided explicitely through their arguments, and they can have a determined return value, which makes testing a breeze.

## Install

```bash
npm install --save alexa-pure-handlers
```

If you're hosting your skill on [AWS Lambda](https://aws.amazon.com/en/lambda/details/), please make sure to set your runtime to **Node.js 6.10**.

## Usage

Step 1: Write your pure intent handlers

```javascript
// inside handlers.js
const myIntentHandler = ({ attributes, t }) => {

  attributes.foo = 123;
  const emit = [':tell', t('MY_LOCALIZED_MESSAGE')]

  return { attributes, emit };
}

module.exports = { myIntentHandler };
```

Step 2: Wrap your handlers with `pure`

```javascript
const Alexa = require('alexa-sdk');
const pure = require('alexa-pure-handlers');
const { myIntentHandler } = require('./handlers');

exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context);

    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
  'MyIntent': pure(myIntentHandler) // This is where the 🌟🦄 happens
};
```

## Promises Support

Want to use [Promises/A+](https://promisesaplus.com/) with your pure handlers? We got you covered there, too!

```javascript
const myPromiseIntentHandler = ({ attributes, t }) => {
  return fetch('http://api.example.org/unicorns')
    .then(res => {
      attributes.unicorns = res.json();
      
      return {
        attributes,
        emit: [':tell', t('OMG_UNICORNS')]
      };
    })
    .catch(err => {
      return {
        emit: [':tell', t('THE_INTERWEBS_EXPLODED')]
      };
    })
  ;
};
```


## Maintainer

Pascal Cremer

* Email: <hello@codenugget.co>
* Twitter: [@b00gizm](https://twitter.com/b00gizm)
* Web: [http://codenugget.co](http://codenugget.co)

## License

> The MIT License (MIT)
>
> Copyright (c) 2017 Pascal Cremer
>
>Permission is hereby granted, free of charge, to any person obtaining a copy
>of this software and associated documentation files (the "Software"), to deal
>in the Software without restriction, including without limitation the rights
>to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
>copies of the Software, and to permit persons to whom the Software is
>furnished to do so, subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in all
>copies or substantial portions of the Software.
>
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
>IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
>FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
>AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
>LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
>OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
>SOFTWARE.
