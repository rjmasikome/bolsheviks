const express = require("express");
const Bolsheviks = require("../lib");

const app = new express();
const port = 8080;
const path = "/workers";
const worker = new Bolsheviks({path});

const router = express.Router();
router.use("/", (req, res) => {
  res.send(`Navigate to ${path}`);
})

app.use(worker);
app.use(router);
app.listen(port);
console.log(`Proletariat is listening to port ${port}, navigate to ${path}`);
