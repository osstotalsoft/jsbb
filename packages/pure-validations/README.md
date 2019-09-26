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
    assets: [unique("id"), required |> items] |> concatFailure
}) |> logTo(console);
```

## Installation and Usage
`npm install @totalsoft/pure-validations`

#### ES6

```javascript
import * as validations from 'pure-validations';
```
or...

```javascript
import { required, email } from 'pure-validations';
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
var success = Validation.Success();
var failure = Validation.Failure(["The value must be greater than 5."]);
```

### Validators
A validator is just a function that takes in a value and returns a validation.
```javascript
const isInteger = x => Number.isInteger(x) ? Validation.Success() : Validation.Failure(['Not an integer!']);
```

The library provides some out of the box primitive validators that you can use in the composition process.
 - required
 - email
 - matches
 - between
 - greaterThan
 - lessThan
 - minLength
 - maxLength
 - unique

### Higher order validators


