import fl from 'fantasy-land'

export const Semigroup = {
    check: function (t) {
        return t[fl.concat] !== undefined
    },

    laws: {
        associativity: isEquivalent => function (s1, s2, s3) { return isEquivalent((s1[fl.concat](s2))[fl.concat](s3), s1[fl.concat](s2[fl.concat](s3))) }
    }
}

export const Monoid = {
    check: function (t) {
        return t[fl.empty] !== undefined && Semigroup.check(t)
    },

    laws: {
        leftIdentity: isEquivalent => function (m) { return isEquivalent(m.constructor[fl.empty]()[fl.concat](m), m) },
        rightIdentity: isEquivalent => function (m) { return isEquivalent(m[fl.concat]()(m.constructor[fl.empty]), m) },
        ...Semigroup.laws
    }
}

export const Functor = {
    check: function (t) {
        return t[fl.map] !== undefined
    },
    laws: {
        identity: isEquivalent => function (u) { return isEquivalent(u[fl.map](x => x), u) },
        composition: isEquivalent => function (u, f, g) { return isEquivalent(u[fl.map](x => f(g(x))), u[fl.map](g)[fl.map](f)) },
    }
}

export const Apply = {
    check: function (t) {
        return t[fl.ap] !== undefined && Functor.check(t)
    },
    laws: {
        apComposition: isEquivalent => function (u, v, a) {
            return isEquivalent(v[fl.ap](u[fl.ap](a[fl.map](f => g => x => f(g(x))))), v[fl.ap](u)[fl.a](a))
        },
        ...Functor.laws
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

    derive: function () {
        return {
            [fl.map]: function (f) { return this[fl.chain](x => this.constructor[fl.of](f(x))) }, // Functor
            [fl.ap]: function (other) { return other[fl.chain](fn => this[fl.map](fn)) } // Applicative, Apply
        }
    }
}

export const Contravariant = {
    check: function (t) {
        return t[fl.contramap] !== undefined
    }
}
