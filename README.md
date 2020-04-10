# jsbb
##### JavaScript building blocks for a better, safer, side-effect-free world.

*"Sometimes, the elegant implementation is just a function. Not a method. Not a class. Not a framework. Just a function."*

## The blocks
  - [`zion`](./packages/zion#readme)
  - [`pure-validations`](./packages/pure-validations#readme)
  - [`pure-validations-react`](./packages/pure-validations-react#readme)
  - [`rules-algebra`](./packages/rules-algebra#readme)
  - [`rules-algebra-react`](./packages/rules-algebra-react#readme)
  - [`change-tracking`](./packages/change-tracking#readme)
  - [`change-tracking-react`](./packages/change-tracking-react#readme)

## Bootstrap
```javascript
yarn install
lerna bootstrap
```

## Build
```javascript
lerna exec -- yarn build
```

## Test
```javascript
jest
```

## Publish
```javascript
lerna publish --contents build patch
lerna publish --contents build minor
lerna publish --contents build major
``` 