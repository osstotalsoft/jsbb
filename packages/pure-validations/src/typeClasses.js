import fl from 'fantasy-land'

export const Semigroup = {
    check: function (t) {
        return t[fl.concat] !== undefined
    }
}

export const Monoid = {
    check: function (t) {
        return t[fl.empty] !== undefined && Semigroup.check(t)
    }
}

export const Functor = {
    check: function (t) {
        return t[fl.map] !== undefined
    }
}

export const Apply = {
    check: function (t) {
        return t[fl.ap] !== undefined && Functor.check(t)
    }
}

export const Applicative = {
    check: function (t) {
        return t[fl.of] !== undefined && Apply.check(t)
    }
}

export const Chain = {
    check: function (t) {
        return t[fl.chain] !== undefined && Apply.check(t)
    }
}

export const Monad = {
    check: function (t) {
        return Applicative.check() && Chain.check(t)
    },

    derive: function (M) {
        return {
            [fl.map]: function (f) { return this[fl.chain](x => M[fl.of](f(x))) }, // Functor
            [fl.ap]: function(other) { return other[fl.chain](fn => this[fl.map](fn)) } // Applicative, Apply
        }
    }
}

export const Contravariant = {
    check: function (t) {
        return t[fl.contramap] !== undefined
    }
}