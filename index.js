const github = require("@actions/github");
const junitReport = require("./script");
const core = require("@actions/core");

const run = async () => {
  try {
    const TOKEN = core.getInput("token");
    const octokit = github.getOctokit(TOKEN);

    if (core.isDebug()) {
      junitReport.checkToken(TOKEN, ["workflow"]);
    }

    var report = {
      github: octokit,
      owner: core.getInput("owner"),
      repo: core.getInput("repo"),
      workflowRunId: core.getInput("workflowRunId"),
      reportName: core.getInput("owner"),
    };
    await junitReport.download(report);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
