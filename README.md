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
  - [`react-state-lens`](./packages/react-state-lens#readme)

## Bootstrap
```javascript
yarn install
yarn lerna bootstrap
```

## Build
```javascript
yarn lerna run build
```

## Lint typescript definitions
```javascript
yarn lerna run tslint
```

## Test
```javascript
yarn test
```

## Publish
```javascript
yarn lerna publish --contents build patch
yarn lerna publish --contents build minor
yarn lerna publish --contents build major
``` 

## License
NodeBB is licensed under the [MIT](LICENSE) license.

## Contributing
When using Visual Studio Code please use the extension [`Licenser`](https://marketplace.visualstudio.com/items?itemName=ymotongpoo.licenser) for applying the license header in files.
