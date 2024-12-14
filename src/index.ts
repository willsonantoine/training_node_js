import express  from "express";
import { SERVER_PORT } from "./utils/constant";
import Router from "./routes/routes";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json({}))
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb', extended: true}));

app.use("/api",Router); 

app.listen(SERVER_PORT, () => {
  console.log(`server is running on port ${SERVER_PORT}`);
});
