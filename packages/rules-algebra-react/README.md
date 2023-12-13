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
Note: The `reset` function clears the dirty info object. If an object is passed as parameter, the model is set to that object, otherwise the current model is kept unchanged.


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
  const [personLens, dirtyInfo, reset] = useRulesLens(rules, {});
  return (
    <>
      Full name: {personLens.fullName |> get}
      <TextField
            value={personLens.firstName |> get}
            onChange={personLens.firstName |> set |> onTextBoxChange}
      />
      <TextField
            value={personLens.lastName |> get}
            onChange={personLens.lastName |> set |> onTextBoxChange}
      />
      <DetailsComp personDetailsLens={personLens.details} />
    </>
  );
};
```

Note: The `reset` function clears the dirty info object. If an object is passed as parameter, the model is set to that object, otherwise the current model is kept unchanged.

[Read more about lens operations](../react-state-lens/src/lensProxy/README.md)