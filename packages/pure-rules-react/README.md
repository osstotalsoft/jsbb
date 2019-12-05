# pure-rules-react
React extensions for pure-rules.


## installation
```javascript
npm install '@totalsoft/pure-rules-react'
```

## info
The library provides three hooks:
 - useRulesEngine: usage without dirty fields info
 - useRulesEngineProfunctor: usage with dirty fields info
 - useDirtyInfo: usage with dirty fields info

## useRulesEngineProfunctor hook
```jsx
const validator = shape({
  fullName: computed(doc => doc.firstName + doc.lastName),
  
  ),
});

const SomeComponent = props => {
  const [prof, dirtyInfo, reset] = useRulesEngineProfunctor(rules, {});
  return (
    <>
      {getValue(prof.fullName)}
      <TextField
            value={getValue(prof.firstName)}
            onChange={onTextBoxChange(onChanged(prof.firstName))}
      />
   <TextField
            value={getValue(prof.lastName)}
            onChange={onTextBoxChange(onChanged(prof.lastName))}
      />
      <DetailsComp prof={prof.details} />
    </>
  );
};
```
