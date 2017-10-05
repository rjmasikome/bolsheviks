# bolsheviks
Manager for workers of Cronjob via REST

This is based on express. It will get the cronjob, add a new one or delete it. Disclaimer: This is just hoby hack, responsibility of the risks held by the user who use this.

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

### CURL example
* `POST`
```
curl -X POST -H 'Content-Type: application/json' -d '{"command": "ls -la", "cron": "0 7 * * *"}' http://localhost:8080/workers
```

* `DELETE`
```
curl -X DELETE http://localhost:8080/workers/1
```
