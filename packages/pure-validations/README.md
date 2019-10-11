# pure-validations
Lightweight validation library using just simple functional composition.

## Philosophy
Composition means you have a category of objects, and some means of combining those objects, in such way that you get other objects from the same category, that you can further combine.

Throughout the process of composition, you start with some simple primitive validators, compose those using some combinators or higher order validators and you get some prety powerful validation pipelines.
```javascript
shape({
    contactInfo: shape({
        name: [required, maxLength(50)] |> stopOnFirstFailure,
        email: [required |> when(gdprAgreement), email] |> stopOnFirstFailure,
    }),
    personalInfo: fromModel(x =>
        shape({
            age: greaterThan(x.minimumAllowedAge)
        })
    ),
    assets: [atLeastOne, unique("id"), required |> items] |> concatFailure
}) |> logTo(console);
```

## Installation
```javascript
npm install '@totalsoft/pure-validations'
```

## Usage
```javascript
import { required, email, concatFailure, validate, isValid, getErrors } from '@totalsoft/pure-validations';

const goodEmail = "someEmail@something.com"
const validator = [required, email] |> stopOnFirstFailure
const validation = validate(validator, goodEmail)
const isValid = validation |> isValid
const errs = validation |> getErrors
```

## Concepts

### Validation data type
The validation data type is used to represent the result of the validation process.
It is a discriminated union type of either Success or Failure
```javascript
Validation = Success | Failure
```
If it is a successful validation there's no more information required but if it is a failure you have to provide more information regarding the failure.
```javascript
const success = Success
const failure = Failure(ValidationError("The value must be greater than 5."))
```

### Validators
A validator is just a function that takes in a value and returns a validation.
```javascript
const integer = Validator(x => Number.isInteger(x) ? Success : Failure(ValidationError('Not an integer!')))
```

The library provides some out of the box primitive validators that you can use in the composition process.
 - required
 - atLeastOne
 - email
 - matches
 - between
 - greaterThan
 - lessThan
 - minLength
 - maxLength
 - unique

### Higher order validators
A HoV is just a function that takes validators as inputs and returns validators.

The library provides the following HoV's:
#### concatFailure
Used to reduce a list of validators. It calls all validators and concatenate their failures.

```javascript
const v = [required, email] |> concatFailure
```
#### stopOnFirstFailure
Used to reduce a list of validators. It calls all the validators until it receives a failure.

```javascript
const v = [required, email] |> stopOnFirstFailure
```
#### when
Used to create a conditional validator by providing a predicate and a validator.

```javascript
const v = when(x=> x.nameMandatory, required |> field('name'));
```
#### field
Used to validate just a field of the model.

```javascript
const name = field('name')
const data = field('data')

const nameValidator = required |> name
const dataValidator = atleastOne |> data
```
#### shape
Used to compose a complex validator from field validators.

```javascript
const v = shape({
    name: required,
    email: email,
    contacts: [atLeastOneItem, unique('id')] |> concatFailure
})
```

#### items
Takes an item validator and produces a validator for each item in the provided collection.

```javascript
const v = required |> items;
```

#### fromModel
Useful when you need the model in the composition process.

```javascript
shape({
    personalInfo: fromModel(model =>
        shape({
            age: greaterThan(model.minimumAllowedAge)
        })
    ),
    assets: [atLeastOne, unique("id"), required |> items] |> concatFailure
});
```

#### logTo
```javascript
const v = [atLeastOne, unique("id"), required |> items] |> concatFailure |> logTo(console);
```


