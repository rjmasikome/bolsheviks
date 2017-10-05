const Crontab = require("crontab");
const express = require("express");

class Bolsheviks {

  constructor(opts = {}) {
    this.opts = opts;
    this.router = express.Router();

    this.path = this.opts.path || "/workers";
    this.getPath = this.opts.getPath || this.path;
    this.postPath = this.opts.postPath || this.path;

    this.setup = this.setup();
    this.start();

    return this.router;
  }

  async start() {
    this.crontab = await this.initCrontab();
    this.setup.get();
    this.setup.post();
  }

  work() {
    console.log("Bourgeois NOO!!! Proletariat Yes~");
    this.start();
  }

  setup() {

    if(!this.router) {
      console.log("Unable to initialize router, exiting...");
      process.exit();
    }

    return {

      get: () => {
        this.router.get(this.getPath, this.getHandler());
      },

      post: () => {
        this.router.post(this.postPath, this.postHandler());
      }
    }
  }

  getHandler() {

    this.check();

    return (req, res) => {
      const jobs = this.crontab.jobs();
      res.send(jobs.map(n => n.toString()));
    }
  }

  postHandler() {

    this.check();

    return (req, res) => {
      res.send({hello: "on construction"});
    }
  }

  check() {
    if(!this.crontab) {
      console.log("Unable to get crontab, exiting...");
      process.exit();
    }
  }

  initCrontab() {

    return new Promise((res, rej) => {

      Crontab.load((err, crontab) => {
          if (err) {
            rej(err);
          }
          res(crontab);
        })

      })
      .then(crontab => crontab)
      .catch(err => {
        console.log("Unable to run crontab");
      });

  }

}

module.exports = Bolsheviks;
