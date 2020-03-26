# rules-algebra-react
React extensions for rules-algebra.


## installation
```javascript
npm install '@totalsoft/rules-algebra-react'
```

## info
The library provides three hooks:
 - **useRules** - applies the rule engine after updating a value at the given property path
 - **useRulesProfunctor** - applies the rule engine after updating the model through a profunctor lens 
 - **useDirtyInfo** - keeps track of modified properties of a model


## useRules hook
React hook that applies the business rules and keeps track of user modified values (dirty field info).
* Arguments:
  1. The rules object (see rules-algebra library)
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
import { useRules } from "@totalsoft/rules-algebra-react";

const rules = shape({
  fullName: computed(doc => doc.firstName + doc.lastName)
});

const SomeComponent = props => {
  const [person, dirtyInfo, updateProperty, reset] = useRules(rules, {});

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

## useRulesProfunctor hook
React hook that applies the business rules and keeps track of user modified values (dirty field info).
* Arguments:
  1. The rules object (see rules-algebra library)
  2. The initial value of the model
  3. Settings (optional)
  4. Dependencies (optional)
* Return values:
  1. A stateful profunctor with the rule application result
  2. A dirty info object  
  3. A function that resets the rule engine state.

```jsx
import { useRulesProfunctor, setValue, getValue } from "@totalsoft/rules-algebra-react";

const rules = shape({
  fullName: computed(doc => doc.firstName + doc.lastName)
});

const SomeComponent = props => {
  const [person, dirtyInfo, reset] = useRulesProfunctor(rules, {});
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
import { useDirtyInfo } from "@totalsoft/rules-algebra-react";
import * as di from "@totalsoft/rules-algebra-react/dirtyInfo"

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
