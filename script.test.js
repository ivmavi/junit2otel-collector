const github = require("@actions/github");
const script = require("./script");
const code = require('@actions/core');
const { coerce } = require("yargs");
const debug = code.debug;

test("downloadReport", async () => {
    const { GITHUB_TOKEN } = process.env;

    const octokit = github.getOctokit(GITHUB_TOKEN);
    owner = "ivmavi";
    repo = "tests-python";
    workflow_id = ".github/workflows/test.yml";
    reportName = "junit-test-results.xml";

    const runs = await octokit.rest.actions.listWorkflowRuns({
      owner,
      repo,
      workflow_id,
    });

    workflowRunId = runs.data.workflow_runs[0].id;;

    report = {
      github: octokit,
      owner,
      repo,
      workflowRunId,
      reportName,
    };

    core.setOutput('owner', owner);
    core.setOutput('repo', repo);
    core.setOutput('workflowRunId', workflowRunId);
    core.setOutput('reportName', reportName);

    await script.downloadReport(report);
});
