import { client } from "../index.js";
export function getAllColors() {
  return client.db("b42wd2").collection("colors").find({}).toArray();
}
export function getColor(mood, tone) {
  return client.db("b42wd2").collection(`${mood}`).findOne({ type: tone });
}
