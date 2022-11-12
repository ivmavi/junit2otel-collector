const github = require("@actions/github");
const script = require("./script");
const core = require("@actions/core");
const debug = core.debug;

const run = async () => {
  const octokit = github.getOctokit(core.getInput("token"));
  report = {
    github: octokit,
    owner: core.getInput("owner"),
    repo: core.getInput("repo"),
    workflowRunId: core.getInput("workflowRunId"),
    reportName: core.getInput("owner"),
  };
  await script.downloadReport(report);
};

run();
