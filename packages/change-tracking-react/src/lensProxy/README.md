# lens-proxy
Yet another solution for react state management based on profunctor algebra.

### Profunctors and lenses

In profunctor optics a lens is like a focus within a data-structure that you can view or set, abstracting away the data-structure details. The key benefit of lens is composition. Lens compose easily.
Another way to think about lens is just a pair of getter + setter.

```js
const SomeComponent = props => {
  const [model, setModel] = useState(initialModel);
}
```
Our profunctor (lens-ish) is a wrapper around the result of useState hook: [model:TModel, setModel: TModel -> unit] which obeys the profunctor algebraic structure.

The main advantage of representing the state as a profunctor is that you can easily move the focus on fields and items by promap-ing.

### Fantasy land Profunctor

A value that implements the Profunctor specification must also implement the Functor specification.

1. `p['fantasy-land/promap'](a => a, b => b)` is equivalent to `p` (identity)
2. `p['fantasy-land/promap'](a => f(g(a)), b => h(i(b)))` is equivalent to `p['fantasy-land/promap'](f, i)['fantasy-land/promap'](g, h)` (composition)

<a name="promap-method"></a>

#### `fantasy-land/promap` method

```hs
fantasy-land/promap :: Profunctor p => p b c ~> (a -> b, c -> d) -> p a d
```

### React state profunctor (lens-ish)
```js
const SomeComponent = props => {
  const [modelLens] = useChangeTrackingState({a:1, b:2})
}
```

#### get
get is used to read the value from lens.
```js
const SomeComponent = props => {
  const [lens] = useChangeTrackingState(21)
  const value = lens |> get // 21
}
```

#### set
set is used to set the value of a lens.
```js
const SomeComponent = props => {
  const [lens] = useChangeTrackingState(21)
  (lens |> set)(value + 1) // sets the model to 22
}
```
#### over
over - sets the state of a lens using some updater fn.
```js
const SomeComponent = props => {
  const [lens] = useChangeTrackingState('John')
  over(lens)(x => x + ' Smith') // sets the model to {name:'John Smith', age:23}
}
```

#### usage with controlled components
```jsx
const [personlens] = useChangeTrackingState({name:'John', age:23})
<...>
<TextField
    value={personLens.name |> get}
    onChange={personLens.name |> set |> onTextBoxChange}
/>
```

#### promap
Maps both the getter and the setter of a lens.
```js
const SomeComponent = props => {
  const [lens] = useChangeTrackingState({a:1, b:2})
  const aLens = lens.promap(R.prop('a'), R.assoc('a'))
  console.log(aLens |> get) //1
  (aLens |> set)(0) // sets the model to {a:0, b:2}
}
```

#### lmap
Maps only the getter of a lens.
```js
const SomeComponent = props => {
  const [lens] = useChangeTrackingState(null)
  const lensOrDefault = modelLens.lmap(x=> x || "default")
  const value = lensOrDefault |> get //"default"
}
```

#### rmap
Maps only the setter of a lens.
```js
const SomeComponent = props => {
  const [lens] = useChangeTrackingState(1)
  const lensOrDefault = modelLens.rmap(x=> x || "default")
  set(lensOrDefault)(null) //sets the model to "default"
}
```

#### sequence
Sequence transforms a lens of array into an array of lenses.
```js
const SomeComponent = props => {
  const [lens] = useChangeTrackingState([1,2,3])
  const lenses = modelLens.sequence
  const firstItem = lenses[0] |> get //1
}
```

#### sintax sugar

By using es6 proxy we were able to provide field and array indexer access just like with pojos.
```js
const SomeComponent = props => {
  const [lens] = useChangeTrackingState({name: 'John'})
  const nameLens = lens.name
  const name = nameLens |> get // John
}
```

```js
const SomeComponent = props => {
  const [lens] = useChangeTrackingState([1,2,3])
  const firstItemLens = lens[0]
  const firstItem = firstItemLens |> get // 1
}
```





