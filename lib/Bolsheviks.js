const Crontab = require("crontab");
const express = require("express");
const messages = require("./messages");

class Bolsheviks {

  constructor(opts = {}) {
    this.opts = opts;
    this.messages = messages;
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
    this.setup.delete();
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
      },

      delete: () => {
        this.router.delete(this.postPath, this.deleteHandler());
        this.router.delete(this.postPath + "/:id" , this.deleteHandler());
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

      const {command, cron, comment} = req.body;
      let message;

      if (!command || !cron) {
        message = this.messages.invalidBodyPost(req.body);
        res.set(400);
        res.send(message);
        return;
      }

      const job = this.crontab.create(command, cron, comment);

      if (job === null) {
        res.set(500);
        message = this.messages.internalServer(req.body);
        res.send(message);
        return;
      }

      this.crontab.save((err, crontab) => {

        if(err) {
          res.set(500);
          message = this.messages.internalServer(req.body);
          res.send(message);
          return;
        }

        message = this.messages.successCreate(req.body, job);
        res.send(message);
      });
    }

  }

  deleteHandler() {

    this.check();

    return (req, res) => {

      const jobs = this.crontab.jobs();

      let {id} = req.params;
      let {position, command, comment} = req.body;

      let index = id || req.body.id || position;
      let job = index >= 0 ? jobs[index] : null;

      let message;

      if (job) {
        const cronjob = job.toString();
        this.crontab.remove(job);
        message = this.messages.successDelete(req.body, cronjob);
      }

      if (command && comment) {
        this.crontab.remove(Object.assign({}, {command}, {comment}));
        message = this.messages.successDelete(req.body, Object.assign({}, {command}, {comment}));
      }

      if (!job && index > jobs.length-1) {
        message = this.messages.noJobFound(index, jobs.length);
        res.send(message);
        return;
      }

      if (!job && (!command || !comment)) {
        message = this.messages.invalidBodyDelete(req.body);
        res.send(message);
        return;
      }

      this.crontab.save((err, crontab) => {

        if(err) {
          res.set(500);
          message = this.messages.internalServer(req.body);
          res.send(message);
          return;
        }

        res.send(message);
      });

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
