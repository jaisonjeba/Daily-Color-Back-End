import express from "express";
import { auth } from "../auth.js";
import { getAllColors, getColor } from "../services/colors.service.js";
import { client } from "../index.js";
import { ObjectId } from "mongodb";
const router = express.Router();

router.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

router.get("/colors", auth, async (req, res) => {
  try {
    const colors = await getAllColors();
    res.status(200).send(colors);
  } catch (e) {
    res.status(401).send({ message: err });
  }
});

router.get("/:mood/:tone", auth, async function (req, res) {
  const { mood, tone } = req.params;
  try {
    if (!mood && !tone) {
      res.status(401).send("please select mood and tone");
    }
    const data = await getColor(mood, tone);
    res.status(200).send(data);
  } catch (err) {
    res.status(401).send({ message: err });
  }
});

router.get("/:id", auth, async function (request, response) {
  const { id } = request.params;
  try {
    const user = await client
      .db("b42wd2")
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    user
      ? response.status(200).send(user)
      : response.status(404).send({ message: "user not found" });
  } catch (err) {
    res.status(401).send({ message: err });
  }
});

router.put("/:id", async function (request, response) {
  const { id } = request.params;
  let count = 0;

  const color = await client
    .db("b42wd2")
    .collection("colors")
    .findOne({ _id: new ObjectId(id) });

  if (color.count) {
    count = color.count;
  }
  const updated = {
    count: count + 1,
  };
  const update_count = await client
    .db("b42wd2")
    .collection("colors")
    .updateOne({ _id: new ObjectId(id) }, { $set: updated });
  response.send({ message: "like added" });
});

router.get("/search/color/:name", auth, async function (req, res) {
  try {
    const { a, b, name } = req.params;
    const result = await client
      .db("b42wd2")
      .collection("colors")
      .find({ name: new RegExp(name, "i") })
      .toArray();
    res.status(200).send(result);
  } catch (err) {
    res.status(401).send(err);
  }
});

// router.post("/post", async function (request, response) {
//   const data = request.body;
//   console.log(request.body);
//   const result = await client
//     .db("b42wd2")
//     .collection("colors")
//     .insertMany(data);

//   response.status(200).send({ message: "inserted successfully" });
// });

export default router;
