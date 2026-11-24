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
```shell
npm set //registry.npmjs.org/:_authToken=<your-granular-token>
yarn lerna publish patch --contents build -- --no-verify-access
```
OR
```shell
yarn lerna publish minor --contents build -- --no-verify-access
```
OR
```shell
yarn lerna publish major --contents build -- --no-verify-access
``` 

`--contents build` is required: each package is published from its `build` folder (the package root has no `index.js` and `build` is git-ignored).

If the publish fails after the version commit and tag were pushed, publish the versions that are not on npm yet:
```shell
yarn lerna publish from-package --contents build -- --no-verify-access
```

## License
JSBB is licensed under the [MIT](LICENSE) license.

## Contributing
When using Visual Studio Code please use the extension [`Licenser`](https://marketplace.visualstudio.com/items?itemName=ymotongpoo.licenser) for applying the license header in files.
