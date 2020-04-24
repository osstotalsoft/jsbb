# rules-algebra-react
React extensions for rules-algebra.


## installation
```javascript
npm install @totalsoft/rules-algebra-react
```

## info
The library provides three hooks:
 - **useRules** - applies the rule engine after updating a value at the given property path
 - **useRulesLens** - applies the rule engine after updating the model through a profunctor lens 
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

## useRulesLens hook
React hook that applies the business rules and keeps track of user modified values (dirty field info).
* Arguments:
  1. The rules object (see rules-algebra library)
  2. The initial value of the model
  3. Settings (optional)
  4. Dependencies (optional)
* Return values:
  1. A stateful profunctor lens with the rule application result
  2. A dirty info object  
  3. A function that resets the rule engine state. It receives an optional new model.

```jsx
import { useRulesLens, set, get } from "@totalsoft/rules-algebra-react";

const rules = shape({
  fullName: computed(doc => doc.firstName + doc.lastName)
});

const SomeComponent = props => {
  const [person, dirtyInfo, reset] = useRulesLens(rules, {});
  return (
    <>
      Full name: {person.fullName |> get}
      <TextField
            value={person.firstName |> get}
            onChange={person.firstName |> set |> onTextBoxChange}
      />
      <TextField
            value={person.lastName |> get}
            onChange={person.lastName |> set |> onTextBoxChange}
      />
      <DetailsComp personDetails={person.details} />
    </>
  );
};
```
[Read more about lens operations](../change-tracking-react/src/lensProxy/README.md)