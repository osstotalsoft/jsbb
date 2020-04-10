# change-tracking
Lightweight change tracking library for models including objects and arrays.

## Installation
```javascript
npm install '@totalsoft/change-tracking'
```

## Usage
```javascript
import { create, update, isPropertyDirty } from '@totalsoft/change-tracking';

let dirtyInfo = create()
dirtyInfo = update("person.name", true, dirtyInfo)
let isDirtyName = isPropertyDirty("person.name")
```

## Concepts

### Dirty Info
It is an object that mimics the structure of the tracked model and specifies the "dirty" status of the properties

The following operations are available to manipulate the DirtyInfo data:

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

### Array items unique ids
Unique identifiers for object items in arrays are useful to keep track of array items in the following operations:
- Inserts
- Deletions
- Reordering

Change tracking of array items cannot be performed based on index alone. A unique identifier is essentintial
to determine if an item was changed or just moved in the array.

The following methods are available:
#### ensureArrayUIDs
Ensures unique identifiers for object items in the given array.

It returns the same array as the modeinputl but it attaches unique identifiers to items.
Only items of type "object" will have identifiers added.
```javascript
import { ensureArrayUIDs } from '@totalsoft/change-tracking'

let persons = [{name: "John", surname:"Doe"}, {name: "Bob", surname:"Smith"}]
let newPersons = ensureArrayUIDs(persons)
```

#### ensureArrayUIDsDeep
Ensures unique identifiers for object items in arrays. 

The received model can be an object that contains arrays in the nesting hierarchy

It returns the same object hierarcy as the model but it attaches unique identifiers to array items.
Only items of type "object" will have identifiers added.
```javascript
import { ensureArrayUIDsDeep } from '@totalsoft/change-tracking'

let model = { persons: [{name: "John", surname:"Doe"}, {name: "Bob", surname:"Smith"}] }
let newModel = ensureArrayUIDsDeep(model)
```

#### toUniqueIdMap
Transforms an array with object items that have uids to a map where uids are keys.

#### findMatchingItem
Gets the item with the same uid if it has one or the item at the same index otherwise.