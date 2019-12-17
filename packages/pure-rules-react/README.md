# pure-rules-react
React extensions for pure-rules.


## installation
```javascript
npm install '@totalsoft/pure-rules-react'
```

## info
The library provides three hooks:
 - useRulesEngine: applies the rule engine by updating a value at the given property path
 - useRulesEngineProfunctor: applies the rule by changing the
 - useDirtyInfo: usage with dirty fields info

## useRulesEngineProfunctor hook
```jsx
const rules = shape({
  fullName: computed(doc => doc.firstName + doc.lastName)
});

const SomeComponent = props => {
  const [person, dirtyInfo, reset] = useRulesEngineProfunctor(rules, {});
  return (
    <>
      {getValue(person.fullName)}
      <TextField
            value={getValue(person.firstName)}
            onChange={onTextBoxChange(setValue(person.firstName))}
      />
      <TextField
            value={getValue(person.lastName)}
            onChange={onTextBoxChange(setValue(person.lastName))}
      />
      <DetailsComp person={person.details} />
    </>
  );
};
```
