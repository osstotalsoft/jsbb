# rules-algebra
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
        person: shape({
            fullName: computed(person => `${person.surname} ${person.name}`) |> when(propertiesChanged(person => [person.name, person.surname])),
        })
    }) |> logTo(console)
```

## Installation
```javascript
npm install @totalsoft/rules-algebra
```

## Usage
```javascript
import { applyRule, minimumValue, maximumValue, chainRules } from '@totalsoft/rules-algebra';

const percent = -1
const rule = [minimumValue(0), maximumValue(100)] |> chainRules
const newPercent = percent |> applyRule(rule)
```

## Concepts

### Rules
A rule is just a function that takes in a value and returns another value according to the rule logic.
```javascript
const abs = Rule(x => x >= 0 ? x : -x)
```

The library provides some out of the box primitive rules that you can use in the composition process.

#### constant
A rule that returns the spciffied value regardless of the model
```javascript
const rule = constant(5)
```
#### computed
A rule that returns a value computed based on the "document" in scope and its previous value.

The computation function has 3 arguments:
* document - can be the model passed when applying the rule, or a nested object if the [scope](#scope) modifier is used
* previous document (optional) - can be previous model passed when applying the rule, or a nested object if the [scope](#scope) modifier is used
* property value (optional) - the current property value if the rule is for a property in a [shape](#shape); otherwise the same as document


```javascript
const fullNameRule = computed(doc => doc.firstName + " " + doc.lastName);

const resetValueRule = computed((doc, prevDoc, propValue) => prevDoc.enabled && !doc.enabled ? 0 : propValue);

```
 
 #### min
A rule that returns the minimum of two properties or values
```javascript
const rule1 = min(doc => doc.percent, doc => doc.maxPercent)
const rule2 = min(doc => doc.percent, 100)
```
 
#### max
A rule that returns the maximum of two properties or values
```javascript
const rule1 = max(doc => doc.percent, doc => doc.minPercent)
const rule2 = max(doc => doc.percent, 0)
```

 #### minimumValue
A rule that returns the minimum between the current value and the argument
```javascript
const percentRule = minimumValue(0)
```
#### maximumValue
A rule that returns the maximum between the current value and the argument
```javascript
const percentRule = maximumValue(100)
```

#### sum
A rule that returns the sum between two prperties or values
```javascript
const rule = sum(doc => doc.amount, doc => doc.taxes)
```

#### sprintf
A rule that returns a string produced according to the provided format
```javascript
const rule = sprintf('{{name}} {{surname}}')
```



### Higher order rules 
A HoR is just a function that takes rules as inputs and returns rules.

The library provides the following HoR's:
#### chainRules
Used to reduce a list of rules. It applies all rules by chaining outputs to inputs.

```javascript
const rule = [computed(loan => loan.advance * 100 / loan.aquisitionPrice), maximumValue(100)] |> chainRules
```

#### when
Used to create a conditional rule by providing a predicate or condition and a rule.  
For details on predicates see the [predicates](#predicates) section

```javascript
const rule = when(doc => doc.isValueComputed, computed(doc => doc.amount * doc.percent));
```

#### ifThenElse
Used to create a conditional rule by providing a predicate or condition, a rule for the "true" branch and another for the "false" branch.

For details on predicates see the [predicates](#predicates) section

```javascript
const rule = ifThenElse(doc => doc.isNewVersion, constant(2), constant(0));
```

#### until
Used to create a rule that repeats the provided rule until the condition is true.  
For details on predicates see the [predicates](#predicates) section

```javascript
const rule = Rule(x => x * x) |> until(x => x >= 100)
```

#### field
Used to apply a rule for just a field of the model.

```javascript
const percent = field("percent");
const rule = maximumValue(100) |> percent
```
#### shape
Used to compose complex rules from field rules. 
The "shape" higher order rule implicitly scopes the fieds the current object. All the field rule computations will be relative to the current object. To access the root or other nesting levels use the [scope](#scope) higher order rule for fields.

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
Note: The "fromModel" higher order rule does not work with "propertyChanged" conditions. In this case use [scope](#scope) higher order rule instead.

```javascript
const rule = 
    shape({
        personalInfo: fromModel(model =>
            shape({
                age: minimumValue(model.minimumAllowedAge)
            })
        )
    });
```

#### fromParent
Useful when you need the parent model in the composition process.
Note: The "fromParent" higher order rule does not work with [propertyChanged](#propertyChanged) conditions. In this case use [scope](#scope) higher order rule instead.

```javascript
const rule = 
    shape({
        personalInfo: shape({
            age: fromParent(parent => minimumValue(parent.minimumAllowedAge))
        })
    });
```

#### fromRoot
Useful when you need the root model in the composition process.
Note: The "fromParent" higher order rule does not work with [propertyChanged](#propertyChanged) conditions. In this case use [scope](#scope) higher order rule instead.

```javascript
const rule = 
    shape({
        personalInfo: shape({
            age: fromRoot(root => minimumValue(root.minimumAllowedAge))
        })
    });
```

#### scope
Creates a scope over the given rule where the document is substituted by the specified value. 
It can be used together with **"root"** and **"parent"** modifiers.  
* *Note 1*: The [shape](#shape) rule is implicitly scoped to the current object. There is no need to specify **" |> scope |> parent "** for fields.  
* *Note 2*: You can chain multiple "parent" modifiers to go up the hierarchy. eg: **|> scope |> parent |> parent**

```javascript
const rule = 
    shape({
        loan: shape({
            advance: computed(root => root.loan.amount * root.advancePercent) 
                |> when(propertiesChanged(root => [root.loan.amount, root.advancePercent])) 
                |> scope |> root
        })     
    });
```

#### logTo
Logs the rule application process to the speficfied logger.
```javascript
const rule = [minimumValue(0), maximumValue(100)] |> chainRules |> logTo(console);
```


### Predicates
A predicate is a condition that can be expressed in relation to the current document in scope. 
Predicates can be used in conjuction with conditional higher order rules such as [when](#when) and [ifThenElse](#ifThenElse)

```javascript
const fullNameRule = computed(person => `${person.surname} ${person.name}`) |> when(propertiesChanged(person => [person.name, person.surname]))
```
#### equals
Checks if the selected values are equal:
```javascript
const predicate1 = equals(doc => doc.property1, doc => doc.property2);
```

#### isNumber
Checks if the selected property is a number:
```javascript
const predicate = isNumber(doc => doc.age);
```

#### propertyChanged
Checks if the selected property in the current models differs from the same property in the previous model.
```javascript
const predicate = propertyChanged(doc => doc.property);
```

#### propertiesChanged
Checks if the selected properties in the current models differ from the same properties in the previous model.
```javascript
const predicate = propertiesChanged(doc => [doc.property1, doc.property2]);
```

### Predicate combinators

#### not
Negates the selected value:
It also works as a higher order predicate to negate other predicates
```javascript
const predicate1 = not(doc => doc.isEnabled);
const predicate2 = not(equals(doc => doc.field1, doc => doc.field2));
```

#### all
Checks if all the selected values are true.
It also works as a higher order predicate if used with other primitive predicates.
```javascript
const predicate1 = all(doc => doc.isEnabled, doc => doc.isValid);
const predicate2 = [doc => doc.isEnabled, doc => doc.isValid] |> all;
const predicate2 = [equals(doc => doc.field1, doc => doc.field2), equals(doc => doc.field3, doc => doc.field4)] |> all;
```

#### any
Checks if any of the selected values are true.
It also works as a higher order predicate if used with other primitive predicates.
```javascript
const predicate1 = any(doc => doc.isEnabled, doc => doc.isValid);
const predicate2 = [doc => doc.isEnabled, doc => doc.isValid] |> any;
const predicate2 = [propertyChanged(doc => doc.property1), propertyChanged(doc => doc.property)] |> any;
```
