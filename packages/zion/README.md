# Zion
##### Fantasy Land compliant algebraic data types
<img src="fantasyland-logo.png" width="200" height="200" />

## General
Zion is a functional programming library inspired by [Haskell][] and [Fantasy Land][].

It provides [Haskell][]-like algebraic data-types and polymorphic functions against [Fantasy Land][] algebraic structures.

## Instalation & usage
```javascript
npm install @totalsoft/zion
```

```javascript
import List from "@totalsoft/zion/data/list";
import { $do } from "@totalsoft/zion";
```

## Algebraic data types
### Maybe
```haskell
data  Maybe a  =  Nothing | Just a
```
Instance of:
- [Setoid][]
- [Ord][]
- [Semigroup][]
- [Monoid][]
- [Functor][]
- [Apply][]
- [Applicative][]
- [Alt][]
- [Plus][]
- [Foldable][]
- [Traversable][]
- [Chain][]
- [ChainRec][]

### List
```haskell
data List a = Cons a (List a) | Nil
```
Instance of:
- [Setoid][]
- [Ord][]
- [Semigroup][]
- [Monoid][]
- [Functor][]
- [Apply][]
- [Applicative][]
- [Alt][]
- [Plus][]
- [Foldable][]
- [Traversable][]
- [Chain][]
- [Extend][]


### Map
```haskell
data Map k a
```
Instance of:
- [Setoid][]
- [Semigroup][]
- [Monoid][]
- [Functor][]
- [Foldable][]


### KeyValuePair
```haskell
data KeyValuePair k a
```
Instance of:
- [Functor][]


### Reader
```haskell
data Reader r a
```
Instance of:
- [Functor][]
- [Apply][]
- [Chain][]
- [Contravariant][]
- [Semigroup][]


### Step
```haskell
data Step b a
```
Instance of:
- [Setoid][]
- [Ord][]
- [Functor][]
- [Bifunctor][]


## Polymorphic functions
- contramap :: Contravariant f => (b -> a) -> f a -> f b

- fold :: Monoid m => (a -> m) -> [a] -> m

## Do notation
```javascript
const monadSum = (monadX, monadY) =>
      $do(function*() {
        const x = yield monadX;
        const y = yield monadY;
        return x + y;
      });

expect(monadSum(Just(5), Just(6))).toStrictEqual(Just(11));
expect(monadSum(Just(5), Nothing)).toStrictEqual(Nothing);
expect(monadSum(List.fromArray([1]), List.fromArray([2]))).toStrictEqual(List.fromArray([1+2]));
expect(monadSum(List.fromArray([1, 2]), List.fromArray([3]))).toStrictEqual(List.fromArray([1 + 3, 2 + 3]));
```




[Haskell]:                  https://www.haskell.org/
[Ramda]:                    http://ramdajs.com/
[Sanctuary]:                https://github.com/sanctuary-js/
[Fantasy Land]:             https://github.com/fantasyland/fantasy-land
[Setoid]:                   https://github.com/fantasyland/fantasy-land#setoid
[Ord]:                      https://github.com/fantasyland/fantasy-land#ord
[Semigroup]:                https://github.com/fantasyland/fantasy-land#semigroup
[Monoid]:                   https://github.com/fantasyland/fantasy-land#monoid
[Functor]:                  https://github.com/fantasyland/fantasy-land#functor
[Bifunctor]:                https://github.com/fantasyland/fantasy-land#bifunctor
[Apply]:                    https://github.com/fantasyland/fantasy-land#apply
[Applicative]:              https://github.com/fantasyland/fantasy-land#applicative
[Alt]:                      https://github.com/fantasyland/fantasy-land#alt
[Plus]:                     https://github.com/fantasyland/fantasy-land#plus
[Foldable]:                 https://github.com/fantasyland/fantasy-land#foldable
[Traversable]:              https://github.com/fantasyland/fantasy-land#traversable
[Chain]:                    https://github.com/fantasyland/fantasy-land#chain
[ChainRec]:                 https://github.com/fantasyland/fantasy-land#chainRec
[Extend]:                   https://github.com/fantasyland/fantasy-land#extend
[Contravariant]:            https://github.com/fantasyland/fantasy-land#contravariant
