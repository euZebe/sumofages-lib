# sumofages - library

A library to sum ages of persons and get the date when this sum reaches the expected value.

## Quick start

* with yarn
```
yarn add sumofages-lib
```

* with npm
```
npm install --save sumofages-lib
```

## How to use it

```
import { getDateForAccruedAges, Participant } from 'sumofages-lib';

const participant1 = new Participant(moment([1981, 9, 22]), 'optional name');
const participant2 = new Participant(moment([1987, 0, 5]));

getDateForAccruedAges(100, participant1, participant2); // => moment([2034, 9, 22])

```

## Boilerplate

Initialized from [node-flowtype-boilerplate](https://github.com/jsynowiec/node-flowtype-boilerplate), a minimalistic 
boilerplate to jump-start a Node.js project in ES6 with Flow type checking.

## License
Released under MIT license. See the [LICENSE](https://github.com/jsynowiec/node-flowtype-boilerplate/blob/master/LICENSE) file.

