export const Semigroup = {
    check: function(t) {
        return t['fantasy-land/concat'] !== undefined
    }
}

export const Monoid = {
    check: function(t) {
        return t['fantasy-land/empty'] !== undefined && Semigroup.check(t) 
    }
}

export const Functor = {
    check: function(t) {
        return t['fantasy-land/map'] !== undefined 
    }
}

export const Apply = {
    check: function(t) {
        return t['fantasy-land/ap'] !== undefined && Functor.check(t) 
    }
}

export const Applicative = {
    check: function(t) {
        return t['fantasy-land/of'] !== undefined && Apply.check(t) 
    }
}

export const Chain = {
    check: function(t) {
        return t['fantasy-land/chain'] !== undefined && Apply.check(t) 
    }
}

export const Monad = {
    check: function(t) {
        return Applicative.check() && Chain.check(t) 
    }
}

export const Contravariant = {
    check: function(t) {
        return t['fantasy-land/contramap'] !== undefined 
    }
}