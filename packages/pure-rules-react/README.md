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
```jsx
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
            value={getValue(person.firstName)}
            onChange={onTextBoxChange(onPropertyChange("firstName"))}
      />
      <TextField
            value={getValue(person.lastName)}
            onChange={onTextBoxChange(onPropertyChange("lastName"))}
      />

      <DetailsComp personDetails={person.details} onPropertyChange={onPropertyChange} />
    </>
  );
};
```

## useRulesEngineProfunctor hook
```jsx
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
```jsx

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
      Full name: {person.fullName}
      <TextField
            value={getValue(person.firstName)}
            onChange={handleChange("firstName")}
      />
      <TextField
            value={getValue(person.lastName)}
            onChange={handleChange("lastName")}
      />
    </>
  );
};
```
