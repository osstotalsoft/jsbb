import { ensureReader } from "../predicates";

export default function readFrom(func) {
  return ensureReader(func);
}
