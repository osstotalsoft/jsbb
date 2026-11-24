# change-tracking-react
React extensions for the "change-tracking" library.


## installation
```javascript
npm install @totalsoft/change-tracking-react
```

## info
The library provides three hooks:
- **useChangeTrackingState** - provides a stateful model with change tracking
- **useChangeTrackingLens** - provides a stateful model with change tracking using a profunctor lens
- **useDirtyInfo** - keeps track of modified properties of an external model
 

## useChangeTrackingState hook
React hook for change tracking a model.

It Returns a stateful model,  stateful dirty info object, a function that sets the model or property value and a function that resets the change tracking.

Usage example:

```jsx
import { useChangeTrackingState } from "@totalsoft/change-tracking-react";
import { isPropertyDirty } from "@totalsoft/change-tracking"

const SomeComponent = props => {
  const [person, dirtyInfo, setPerson] = useChangeTrackingState({});
  
  const handleChange = useCallback(
    propPath => event => {
      let newPerson = setInnerProp(person, propPath, event.target.value)
      setPerson(newPerson);
    }, [person]
  );

  return (
    <>
      FirstName dirty: {isPropertyDirty("firstName", dirtyInfo)}
      <TextField
            value={person.firstName}
            onChange={handleChange("firstName")}
      />
      LastName dirty: {isPropertyDirty("lastName", dirtyInfo)}
      <TextField
            value={person.lastName}
            onChange={handleChange("lastName")}
      />
      <ChildComponent details={person.details} onChange={handleChange} />
    </>
  );
};
```
Note: The `reset` function clears the dirty info object. If an object is passed as parameter, the model is set to that object, otherwise the current model is kept unchanged. It could also receive an updater function which takes the pending state and compute the next state from it. Pass `{ keepDirtyInfo: true }` as the second parameter to set the model without touching the dirty info (see [useChangeTrackingLens](#setting-the-model-without-touching-the-dirty-info)); prefer the updater form then, so that the merge is applied to the pending model and does not overwrite the user's latest edits:

```jsx
reset(prev => ({ ...prev, status: liveStatus }), { keepDirtyInfo: true });
```

## useChangeTrackingLens hook
Provides a stateful model with change tracking using a profunctor lens.

It returns a stateful model, stateful dirty info object, and a function that resets the change tracking.

Usage example:

```jsx
import { useChangeTrackingLens, get, set } from "@totalsoft/change-tracking-react";
import { isPropertyDirty } from "@totalsoft/change-tracking"

const onTextBoxChange = onPropertyChange => event => onPropertyChange(event.target.value)

const SomeComponent = props => {
  const [personLens, dirtyInfo, reset] = useChangeTrackingLens({});

  return (
    <>
      FirstName dirty: {isPropertyDirty("firstName", dirtyInfo)}
      <TextField
            value={personLens.firstName |> get}
            onChange={personLens.firstName |> set |> onTextBoxChange}
      />
      LastName dirty: {isPropertyDirty("lastName", dirtyInfo)}
      <TextField
            value={personLens.lastName |> get}
            onChange={personLens.lastName |> set |> onTextBoxChange}
      />
      <ChildComponent detailsLens={personLens.details} />
    </>
  );
};
```

Note: The `reset` function clears the dirty info object. If an object is passed as parameter, the model is set to that object, otherwise the current model is kept unchanged. It could also receive an updater function which takes the pending state and compute the next state from it.

### Setting the model without touching the dirty info
`reset` accepts an optional second parameter `{ keepDirtyInfo: true }`. With it, `reset` only sets the model (from a value or an updater function) and keeps the dirty info as it is: no property is marked dirty and the dirty flags of the user's unsaved edits are not cleared. This is useful for merging server-side changes (e.g. a status pushed by a subscription) into a model the user is editing, without making the form dirty.

```jsx
const [tenantLens, dirtyInfo, reset] = useChangeTrackingLens(tenant);

useEffect(() => {
  reset(prev => ({ ...prev, status: liveStatus }), { keepDirtyInfo: true });
}, [liveStatus, reset]);
```

Notes:
- The dirty flags are not recomputed: a property that was already dirty stays dirty (even if the new value equals the original one), and a clean property stays clean.
- Later edits made through the lens are tracked as usual, relative to the model that includes the merged values.
- Dirty flags of array items are kept by index, so use it for values that do not reorder, insert or remove items of an array the user has edited.

[Read more about lens operations](../react-state-lens/src/lensProxy/README.md)

## useDirtyInfo hook

A react hook for field change tracking. 

It returns a stateful dirty info object, a function that sets the property path as dirty and a function that resets the dirty info state. 

Usage example:

```jsx
import { useDirtyInfo } from "@totalsoft/change-tracking-react";
import { isPropertyDirty } from "@totalsoft/change-tracking"

const SomeComponent = props => {
  const [person, setPerson] = useState({});
  const [dirtyInfo, setDirtyInfoPath] = useDirtyInfo();

  const handleChange = useCallback(
    propPath => event => {
      setDirtyInfoPath(propPath);
      setModel({ ...person, [propPath]: event.target.value });
    }, [person]
  );

  return (
    <>
      FirstName dirty: {isPropertyDirty("firstName", dirtyInfo)}
      <TextField
            value={person.firstName}
            onChange={handleChange("firstName")}
      />
      LastName dirty: {isPropertyDirty("lastName", dirtyInfo)}
      <TextField
            value={person.lastName}
            onChange={handleChange("lastName")}
      />
      <ChildComponent details={person.details} onChange={handleChange} />
    </>
  );
};
```

Note: The `reset` function clears the dirty info object. If an object is passed as parameter, the model is set to that object, otherwise the current model is kept unchanged.
