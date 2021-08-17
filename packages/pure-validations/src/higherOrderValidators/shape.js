import { map } from "ramda"
import field from "./field"
import concatFailure from "./concatFailure"


export default function shape(validatorObj) {
  return Object.entries(validatorObj)
    |> map(([k, v]) => field(k, v))
    |> concatFailure
}
