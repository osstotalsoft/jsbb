# Zion
##### Fantasy Land compliant algebraic data types
<img src="fantasyland-logo.png" width="200" height="200" />

## General
Zion is a functional programming library inspired by [Haskell][] and [Fantasy Land][].

It provides [Haskell][]-like algebraic data-types and polymorphic functions against [Fantasy Land][] algebraic structures.

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






[Haskell]:                  https://www.haskell.org/
[Ramda]:                    http://ramdajs.com/
[Sanctuary]:                https://github.com/sanctuary-js/
[Fantasy Land]:             https://github.com/fantasyland/fantasy-land
[Setoid]:                   https://github.com/fantasyland/fantasy-land#setoid
[Ord]:                      https://github.com/fantasyland/fantasy-land#ord
[Semigroup]:                https://github.com/fantasyland/fantasy-land#semigroup
[Monoid]:                   https://github.com/fantasyland/fantasy-land#monoid
[Functor]:                  https://github.com/fantasyland/fantasy-land#functor
[Apply]:                    https://github.com/fantasyland/fantasy-land#apply
[Applicative]:              https://github.com/fantasyland/fantasy-land#applicative
[Alt]:                      https://github.com/fantasyland/fantasy-land#alt
[Plus]:                     https://github.com/fantasyland/fantasy-land#plus
[Foldable]:                 https://github.com/fantasyland/fantasy-land#foldable
[Traversable]:              https://github.com/fantasyland/fantasy-land#traversable
[Chain]:                    https://github.com/fantasyland/fantasy-land#chain
[ChainRec]:                 https://github.com/fantasyland/fantasy-land#chainRec
[Extend]:                 https://github.com/fantasyland/fantasy-land#extend
