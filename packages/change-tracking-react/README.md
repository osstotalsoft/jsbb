# change-tracking-react
React extensions for the "change-tracking" library.


## installation
```javascript
npm install '@totalsoft/change-tracking-react'
```

## info
The library provides two hooks:
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
## useChangeTrackingLens hook
Provides a stateful model with change tracking using a profunctor lens.

It returns a stateful model, stateful dirty info object, and a function that resets the change tracking.

Usage example:

```jsx
import { useChangeTrackingLens, getValue, setValue } from "@totalsoft/change-tracking-react";
import { isPropertyDirty } from "@totalsoft/change-tracking"

const onTextBoxChange = onPropertyChange => event => onPropertyChange(event.target.value)

const SomeComponent = props => {
  const [personLens, dirtyInfo, reset] = useChangeTrackingLens({});

  return (
    <>
      FirstName dirty: {isPropertyDirty("firstName", dirtyInfo)}
      <TextField
            value={getValue(personLens.firstName)}
            onChange={onTextBoxChange(setValue(personLens.firstName))}
      />
      LastName dirty: {isPropertyDirty("lastName", dirtyInfo)}
      <TextField
            value={getValue(personLens.lastName)}
            onChange={onTextBoxChange(setValue(personLens.lastName))}
      />
      <ChildComponent detailsLens={personLens.details} />
    </>
  );
};
```

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
