import { ensurePredicate } from "../predicates";

export default function readFrom(func) {
  return ensurePredicate(func);
}
