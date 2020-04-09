# rules-algebra
Lightweight change tracking library for models including objects and arrays.

## Philosophy
```javascript
```

## Installation
```javascript
npm install '@totalsoft/change-tracking'
```

## Usage
```javascript
import { create, isPropertyDirty } from '@totalsoft/change-tracking';
let dirtyInfo = create()
dirtyInfo = update("person.name", true, dirtyInfo)
let isDirtyName = isPropertyDirty("person.name")
```

## Concepts

### Dirty Info
It is an object that mimics the structure of the tracked model and specifies the "dirty" status of the properties

The following methods are available to manipulate the DirtyInfo data:

#### create
Creates a new DirtyInfo object initialized with the value of the "isDirty" parameter.

If the parameter is not provided it is initialized with "false"
```javascript
let dirtyInfo1 = create()
let dirtyInfo2 = create(true)
```
#### update
Updates the given DirtyInfo object with the given value for the specified property path.

The path can be a dot delimited string or an array
```javascript
let dirtyInfo1 = update("person.name", true, dirtyInfo)
let dirtyInfo2 = update(["person","name"], false, dirtyInfo)
```
#### merge
Merges two DirtyInfo objects
```javascript
let dirtyInfo = merge(dirtyInfo1, dirtyInfo2)
```
#### isPropertyDirty
Checks if the specified property is dirty in the given DirtyInfo object
```javascript
let isDirtyName = isPropertyDirty("person.name", dirtyInfo)
```

#### isDirty
Returns the state of the DirtyInfo object (weather it is dirty or not)
```javascript
let isDirtyPerson = isDirty(dirtyInfo)
```

#### detectChanges
Creates a new DirtyInfo object based on the changes between the model and the previous model.

It also takes into account the previous dirtyInfo object if specified.
```javascript
let newDirtyInfo = detectChanges(model, prevModel, prevDirtyInfo)
```