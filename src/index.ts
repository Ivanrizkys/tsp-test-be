import { sendResponseSuccess } from "#/common/utils/send-response.ts";
import express from "express";
const app = express();
const port = process.env.PORT ?? "9000";

app.get("/", (req, res) => {
  sendResponseSuccess(res, null, {
    message: "Hello World",
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
