# bolsheviks
Manager for workers of Cronjob via REST

This is based on express, as for now, it only get the cronjob from crontab, but the ability to modify it will come soon.

### Requirement
* Use express
* Have something on crontab
* Node 8 and above (bleeding edge #lit)
* `npm install bolsheviks`

### How to use
```js
const express = require("express");
const Bolsheviks = require("bolsheviks");

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
```
