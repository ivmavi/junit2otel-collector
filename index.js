const github = require("@actions/github");
const script = require("./script");
const core = require("@actions/core");

const run = async () => {
  try {
    const octokit = github.getOctokit(core.getInput("token"));
    var report = {
      github: octokit,
      owner: core.getInput("owner"),
      repo: core.getInput("repo"),
      workflowRunId: core.getInput("workflowRunId"),
      reportName: core.getInput("owner"),
    };
    await script.downloadReport(report);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
