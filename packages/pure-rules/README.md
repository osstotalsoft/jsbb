# pure-rules
Lightweight business rules library using just simple functional composition.

## Philosophy
Composition means you have a category of objects, and some means of combining those objects, in such way that you get other objects from the same category, that you can further combine.

Throughout the process of composition, you start with some simple primitive rules, compose those using some combinators or higher order rules and you get some prety powerful business rules pipelines.
```javascript
    const rule = shape({
        advance: maximumValue(loan => loan.aquisitionPrice),
        advancePercent: [computed(loan => loan.advance * 100 / loan.aquisitionPrice), maximumValue(100)] |> chainRules,
        approved: constant(false) |> when(
            [
                propertyChanged(loan => loan.advance),
                propertyChanged(loan => loan.interestRate)
            ] |> any),
        person: scope(shape({
            fullName: computed(person => `${person.surname} ${person.name}`) |> when(propertiesChanged(person => [person.name, person.surname])),
        }))
    }) |> logTo(console)
```

## Installation
```javascript
npm install '@totalsoft/pure-rules'
```

## Usage
```javascript
import { applyRule, minimumValue, maximumValue, chainRules } from '@totalsoft/pure-rules';

const percent = -1
const rule = [minimumValue(0), maximumValue(100)] |> chainRules
const newPercent = percent |> applyRule(rule)
```

## Concepts

### Rules
A rule is just a function that takes in a value and returns another value according to the rule logic.
```javascript
const integer = Rule(x => Number.isInteger(x))
```

The library provides some out of the box primitive rules that you can use in the composition process.
 - constant
 - computed
 - min
 - max
 - sum
 - minimumValue
 - maximumValue

### Higher order rules
A HoR is just a function that takes rules as inputs and returns rules.

The library provides the following HoR's:
#### chainRules
Used to reduce a list of rules. It applies all rules by chaining outputs to inputs.

```javascript
const r = computed(loan => loan.advance * 100 / loan.aquisitionPrice), maximumValue(100)] |> chainRules
```

#### when
Used to create a conditional rule by providing a predicate or condition and a rule.

```javascript
const r = when(doc => doc.isValueComputed, computed(doc => doc.amount * doc.percent));
```

#### ifThenElse
Used to create a conditional rule by providing a predicate or condition, a rule for the "true" branch and another for the "false" branch.

```javascript
const r = ifThenElse(doc => doc.isNewVersion, constant(2), constant(0));
```
#### field
Used to apply a rule for just a field of the model.

```javascript
const percent = field("percent");
const parent = maximumValue(100) |> percent
```
#### shape
Used to compose complex rules from field rules.

```javascript
const rule = shape({
    percent: maximumValue(100),
    amount: minimumValue(0)
})
```

#### items
Takes an item rule and produces applies it for each item in the provided collection.

```javascript
const rule = minimumValue(0) |> items;
```

#### fromModel
Useful when you need the model in the composition process.

```javascript
shape({
    personalInfo: fromModel(model =>
        shape({
            age: minimumValue(model.minimumAllowedAge)
        })
    )
});
```

#### scope
Creates a scope over the given rule where the document is substituted by the current value.

```javascript
shape({
    loan: scope(
        shape({
            advance: computed(loan => loan.amount * loan.advancePercent) |> when(propertiesChanged(loan => [loan.amount, loan.advancePercent]))
        })
    )
});
```

#### logTo
Logs the rule application process to the speficfied logger.
```javascript
const v = [atLeastOne, unique("id"), required |> items] |> concatFailure |> logTo(console);
```


