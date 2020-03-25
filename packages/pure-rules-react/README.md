# pure-rules-react
React extensions for pure-rules.


## installation
```javascript
npm install '@totalsoft/pure-rules-react'
```

## info
The library provides three hooks:
 - useRulesEngine: applies the rule engine after updating a value at the given property path
 - useRulesEngineProfunctor: applies the rule engine after updating the model through a profunctor lens 
 - useDirtyInfo: keeps track of modified properties of a model


## useRulesEngine hook
React hook that applies the buisiness rules and keeps track of user modified values (dirty field info).
* Arguments:
  1. The rules object (see pure-rules library)
  2. The initial value of the model
  3. Settings (optional)
  4. Dependencies (optional)
* Return values:
  1. A stateful rule application result (changed model) 
  2. A dirty info object to track the model changes
  3. A function that sets a value for the given property path 
  4. A function that resets the rule engine state.

Usage example:

```jsx
import { useRulesEngine } from "@totalsoft/pure-rules-react";

const rules = shape({
  fullName: computed(doc => doc.firstName + doc.lastName)
});

const SomeComponent = props => {
  const [person, dirtyInfo, updateProperty, reset] = useRulesEngine(rules, {});

  const onPropertyChange = propPath => value => {
    updateProperty(propPath, value)
  };

  return (
    <>
     Full name: {person.fullName}
     <TextField
            value={person.firstName}
            onChange={onTextBoxChange(onPropertyChange("firstName"))}
      />
      <TextField
            value={person.lastName}
            onChange={onTextBoxChange(onPropertyChange("lastName"))}
      />

      <DetailsComp personDetails={person.details} onPropertyChange={onPropertyChange} />
    </>
  );
};
```

## useRulesEngineProfunctor hook
React hook that applies the buisiness rules and keeps track of user modified values (dirty field info).
* Arguments:
  1. The rules object (see pure-rules library)
  2. The initial value of the model
  3. Settings (optional)
  4. Dependencies (optional)
* Return values:
  1. A stateful profunctor with the rule application result
  2. A dirty info object  
  3. A function that resets the rule engine state.

```jsx
import { useRulesEngineProfunctor, setValue, getValue } from "@totalsoft/pure-rules-react";

const rules = shape({
  fullName: computed(doc => doc.firstName + doc.lastName)
});

const SomeComponent = props => {
  const [person, dirtyInfo, reset] = useRulesEngineProfunctor(rules, {});
  return (
    <>
      Full name: {getValue(person.fullName)}
      <TextField
            value={getValue(person.firstName)}
            onChange={onTextBoxChange(setValue(person.firstName))}
      />
      <TextField
            value={getValue(person.lastName)}
            onChange={onTextBoxChange(setValue(person.lastName))}
      />
      <DetailsComp personDetails={person.details} />
    </>
  );
};
```

## useDirtyInfo hook

A react hook for field change tracking. 

It returns a stateful dirty info object, a function that sets the property path as dirty and a function that resets the dirty info state. 

Usage example:

```jsx
import { useDirtyInfo } from "@totalsoft/pure-rules-react";
import * as di from "@totalsoft/pure-rules-react/dirtyInfo"

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
      FirstName dirty: {di.isPropertyDirty("firstName", dirtyInfo)}
      <TextField
            value={person.firstName}
            onChange={handleChange("firstName")}
      />
      LastName dirty: {di.isPropertyDirty("lastName", dirtyInfo)}
      <TextField
            value={person.lastName}
            onChange={handleChange("lastName")}
      />
    </>
  );
};
```
