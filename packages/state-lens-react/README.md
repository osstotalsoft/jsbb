# state-lens-react
React extensions for stateful profunctor lenses.


## installation
```javascript
npm install @totalsoft/state-lens-react
```

## info
The library provides one hook:
- **useStateLens** - provides a stateful profunctor lens over a model
 

## useStateLens hook
 Provides a stateful profunctor lens over the model.
 * Receives the initial model
 * Returns a stateful profunctor over the model.

Usage example:

```jsx
import { useStateLens, get, set } from "@totalsoft/state-lens-react";

const onTextBoxChange = onPropertyChange => event => onPropertyChange(event.target.value)

const SomeComponent = props => {
  const [personLens, dirtyInfo, reset] = useStateLens({});

  return (
    <>
      <TextField
            value={personLens.firstName |> get}
            onChange={personLens.firstName |> set |> onTextBoxChange}
      />
      <TextField
            value={personLens.lastName |> get}
            onChange={personLens.lastName |> set |> onTextBoxChange}
      />
      <ChildComponent detailsLens={personLens.details} />
    </>
  );
};
```

[Read more about lens operations](src/lensProxy/README.md)
