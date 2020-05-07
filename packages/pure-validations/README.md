# pure-validations
Lightweight validation library using just simple functional composition.

## Philosophy
Composition means you have a category of objects, and some means of combining those objects, in such way that you get other objects from the same category, that you can further combine.

Throughout the process of composition, you start with some simple primitive validators, compose those using some combinators or higher order validators and you get some prety powerful validation pipelines.
```javascript
    const validator =
      shape({
        firstName: required,
        lastName: [required, maxLength(50)] |> stopOnFirstFailure,
        userAgreement: fromRoot(root => required |> when(root.gdprRequired)),
        contactInfo: shape({
          email: email,
          address: required
        }),
        languages: required |> english,
        education: [atLeastOne, unique(x => x.id), required |> items] |> concatFailure,
        experience: fromModel(experience => shape({ javaScript: greaterThan(experience.minimumExperience) }))
      }) |> logTo(console);
```

## Installation
```javascript
npm install @totalsoft/pure-validations
```

## Usage
```javascript
import { required, email, concatFailure, validate, isValid, getErrors } from '@totalsoft/pure-validations';

const goodEmail = "someEmail@something.com"
const validator = [required, email] |> stopOnFirstFailure
const validation = goodEmail |> validate(validator)
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
    )
});
```

#### fromParent
Useful when you need the parent model in the composition process.

```javascript
shape({
    personalInfo:
        shape({
            age: fromParent(parent => greaterThan(parent.minimumAllowedAge))
        })
    )
});
```

#### fromRoot
Useful when you need the root model in the composition process.

```javascript
shape({
    personalInfo:
        shape({
            age: fromRoot(root => greaterThan(root.personalInfo.minimumAllowedAge))
        })
    )
});
```

#### logTo
```javascript
const v = [atLeastOne, unique("id"), required |> items] |> concatFailure |> logTo(console);
```

### Error message translations
The library uses [i18next](https://github.com/i18next/i18next) to translate error messages. 

#### Generic messages
The default messages for the built-in validators can be customized by providing translations for the following keys:

*Obs:* Keep the placeholders in your transated messages - eg. {{min}}, {{max}} or {{selector}}

| Validator  | Translation Key                   | Default message                                  |
| ---------- | ---------------                   | ----------                                       | 
| required   | Validations.Generic.Mandatory     | The value is mandatory                           | 
| atLeastOne | Validations.Generic.AtLeastOne    | There should be at least one item                |
| matches    | Validations.Generic.Regex         | The value has an invalid format                  |
| email      | Validations.Generic.Email         | The value is not a valid email address           |
| between    | Validations.Generic.OutOfRange    | The value must be between {{min}} and {{max}}    |
| greaterThan| Validations.Generic.Greater       | The value must be greater than {{min}}           |
| lessThan   | Validations.Generic.Less          | The value must be less than {{max}}              |
| minLength  | Validations.Generic.MaxCharacters | The length must be less than {{max}}             |
| maxLength  | Validations.Generic.MinCharacters | The length must be greater than {{min}}          |
| unique     | Validations.Generic.Unique        | The value of {{selector}} must be unique         |

#### Individual messages
To specify a custom error message to your validator by using the **errorMesage** HoV.

The argument of "errorMessage" can be a i18next translation key.

*Usage example:*
```javascript
const personValidator = required |> errorMessage('Validation.PersonNotSelected');
```

