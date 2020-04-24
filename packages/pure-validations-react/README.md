# pure-validations-react
React extensions for pure-validations.

## installation
```javascript
npm install @totalsoft/pure-validations-react
```

## info
The library provides two hooks:
 - useValidation: usage without dirty fields info
 - useDirtyFieldValidation: usage with dirty fields info

## useValidation hook
```jsx
const validator = shape({
  name: required,
  details: concatFailure(
    atLeastOne,
    unique(x => x.detailId),
    items(
      shape({
        detailId: required,
        formula: required,
      }),
    ),
  ),
});

const SomeComponent = props => {
  const [model, setModel] = useState({});
  const [validation, validate] = useValidation(validator);

  const handleSave = () => {
    if (!validate(model)) {
      return;
    }

    actions.save(model);
  };

  return (
    <>
      <TextField
        value={model.name}
        error={!isValid(validation.name)}
        helperText={getErrors(validation.name)}
      />
      <DetailsComp validation={validation.details} />
    </>
  );
};
```


## useDirtyFieldValidation hook
```jsx
const validator = shape({
  name: required,
  surname: required,
  details: concatFailure(
    atLeastOne,
    unique(x => x.detailId),
    items(
      shape({
        detailId: required,
        formula: required,
      }),
    ),
  ),
});

const SomeComponent = props => {
  const [model, setModel] = useState({});
  const [dirtyInfo, setDirtyInfo] = useState(di.create);
  const [validation, validate] = useDirtyFieldValidation(validator, dirtyInfo);

  const handleNameChange = useCallback(
    event => {
      setDirtyInfo(di.update('name', true, dirtyInfo));
      setModel({ ...model, name: event.target.value });
    },
    [model, dirtyInfo],
  );

  const handleSurnameChange = useCallback(
    event => {
      setDirtyInfo(di.update('surname', true, dirtyInfo));
      setModel({ ...model, surname: event.target.value });
    },
    [model, dirtyInfo],
  );

  useEffect(() => {
    validate(model, dirtyInfo);
  }, [model, dirtyInfo]);

  const handleSave = () => {
    if (!validate(model)) {
      return;
    }

    actions.save(model);
  };

  return (
    <>
      <TextField
        value={model.name}
        error={!isValid(validation.name)}
        helperText={getErrors(validation.name)}
      />
      <TextField
        value={model.surname}
        error={!isValid(validation.surname)}
        helperText={getErrors(validation.surname)}
      />
      <DetailsComp validation={validation.details} />
    </>
  );
};
```
