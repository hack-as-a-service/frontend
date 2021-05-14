# Welcome to Area 51 - AKA the `tests` folder

First of all, _beware of the bombs around here_. Got that? OK, let's move on.

We divide our testing in 2 categories, end-to-end & unit tests

- **End-to-end** testing is meant to test a page as a whole, mimicking user interaction with it. We use [TestCafe](https://testcafe.io) for that. They dwell in the `e2e` folder and can be invoked by `yarn test:e2e`. You'll need some form of Chrome on your PATH, or just make a PR and we'll run the tests for you.
- ~~**Unit testing** tests each component in an isolated manner, trying to cover as many edge cases as possible. We use [Jest](https://jestjs.io) & [Enzyme](https://enzymejs.github.io/enzyme/) for them. They reside in the `unit` folder & can be run by `yarn test:unit`. If you want coverage, run `yarn test:unit-with-coverage`. You can find the coverage data in the `tests/coverage` folder.~~ Unit tests are like super broken last time we tried to implement some, but if you can help us implement them, please open a PR request!

Have fun writing tests, and getting that coverage as near to 100% as we can!
_~cfanoulis_
