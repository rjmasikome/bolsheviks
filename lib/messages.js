const invalidBodyPost = (body)  => {

  return {
    message: "Invalid body received",
    received: body,
    expected: {
      command: "COMMAND",
      cron: "CRON",
      comment: "COMMENT"
    },
    hint: "Change the request body similar to the format in the expected field"
  }
};

const invalidBodyDelete = (body)  => {

  return {
    message: "Invalid body received",
    received: body,
    expected: "id or command and comment in body, or id in the path parameter",
    hint: "Change the request body similar to the format in the expected field"
  }
};

const internalServer = (body) => {

  return {
    message: "Internal Server Error",
    received: body,
    hint: "Something wrong with the server, maybe too busy. In any case, contact admin."
  }
};

const noJobFound = (index, jobsLength) => {

  return {
    message: "No Job Found",
    receivedIndex: index,
    jobsLength: jobsLength,
    hint: "Use the correct array index for id"
  }
};

const successCreate = (body, job) => {

  return {
    message: "Cronjob created successfully",
    received: body,
    cronJob: job.toString() || job.render()
  }
}

const successDelete = (body, param) => {

  const cronJob = param instanceof Object ? {param} : param.toString();

  return {
    message: "Cronjob deleted successfully",
    received: body,
    cronJob: cronJob
  }
}

module.exports = {
  invalidBodyPost,
  invalidBodyDelete,
  noJobFound,
  internalServer,
  successCreate,
  successDelete
};
