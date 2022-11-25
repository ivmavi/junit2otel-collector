const github = require("@actions/github");
const script = require("./script");
const core = require("@actions/core");

test("downloadReport", async () => {
  const { GITHUB_TOKEN } = process.env;

  const octokit = github.getOctokit(GITHUB_TOKEN);
  var owner = "ivmavi";
  var repo = "junit2otel-collector";
  var workflow_id = ".github/workflows/test.yml";
  var reportName = "test-results.xml";

  const runs = await octokit.rest.actions.listWorkflowRuns({
    owner,
    repo,
    workflow_id,
  });

  var workflowRunId = runs.data.workflow_runs[0].id;

  var report = {
    github: octokit,
    core: core,
    owner,
    repo,
    workflowRunId,
    reportName,
  };

  core.setOutput("owner", owner);
  core.setOutput("repo", repo);
  core.setOutput("workflowRunId", workflowRunId);
  core.setOutput("reportName", reportName);

  await script.downloadReport(report);
});
