import express from "express";
import { MongoClient } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import * as dotenv from "dotenv";
import colorRouter from "./router/color.router.js";
import userRouter from "./router/user.router.js";

dotenv.config();
const app = express();

// setup cloudinary config
cloudinary.config({
  cloud_name: "db4gqoi70",
  api_key: "343157882624786",
  api_secret: "4eQNtoRnseak6lYanZL2XZOJO0I",
});

const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;
export const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");

app.use(express.json());
app.use(cors());

app.use("/", colorRouter);
app.use("/", userRouter);

app.post("/upload-image", async (req, res) => {
  const selectedFile = req.body.selectedFile;
  console.log(selectedFile);

  try {
    // await client.connect();

    // const db = client.db("b42wd2");
    // const images = db.collection("images");

    // upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(selectedFile);
    console.log(uploadResult);

    // save image metadata to MongoDB
    // const imageDoc = {
    //   public_id: uploadResult.public_id,
    //   secure_url: uploadResult.secure_url,
    //   created_at: new Date(),
    // add any other fields you want to store here
    // };
    // await images.insertOne(imageDoc);

    console.log("Image uploaded and metadata saved to MongoDB!");
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
