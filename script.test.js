const github = require("@actions/github");
const junitReport = require("./script");
const core = require("@actions/core");
const { expect, test } = require("@jest/globals");
const fs = require("fs");
const path = require("path");

test("download", async () => {
  const { GITHUB_TOKEN } = process.env;
  const octokit = new github.getOctokit(GITHUB_TOKEN);
  var owner = "ivmavi";
  var repo = "junit2otel-collector";
  var workflow_id = ".github/workflows/test.yml";
  var reportName = "test-results.xml";

  const runs = await octokit.rest.actions
    .listWorkflowRuns({
      owner,
      repo,
      workflow_id,
    })
    .catch(core.debug);

  var workflowRunId = runs.data.workflow_runs[0].id;

  var report = {
    github: octokit,
    owner: owner,
    repo: repo,
    workflowRunId: workflowRunId,
    reportName: reportName,
  };

  core.debug("owner", owner);
  core.debug("repo", repo);
  core.debug("workflowRunId", workflowRunId);
  core.debug("reportName", reportName);

  var { directory, storedFile } = await junitReport.download(report);
  expect(fs.existsSync(path.join(directory, storedFile))).toBe(true);
});

test("checkToken", async () => {
  const { GITHUB_TOKEN } = process.env;
  expect(await junitReport.checkToken(GITHUB_TOKEN, ["workflow"])).toBe(true);
});
