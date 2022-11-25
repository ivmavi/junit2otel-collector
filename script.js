const fs = require("fs");
const os = require("os");
const path = require("path");
const core = require("@actions/core");
const debug = core.debug;
const setOutput = core.setOutput;
const github = require("@actions/github");

/**
 * Check if the token has the required permissions.
 * @param {string} token token to check.
 * @returns True if the token has all required permissions.
 */
const checkToken = async (token, require) => {
  const octokit = github.getOctokit(token);
  const response = await octokit.request("/user");
  const scopes = response.headers["x-oauth-scopes"].split(/,\s+/);
  var ret = false;
  if (require.every((v) => scopes.includes(v))) {
    debug(`Token has all required scopes: ${require}`);
    ret = true;
  } else {
    debug(`The GitHub Token has no scopes enabled`);
  }
  return ret;
};

/**
 * Convert an object to a JSON string.
 * @param {object} obj object to convert.
 * @returns The JSON string.
 */
const objTojson = (obj) => {
  return JSON.stringify(obj, null, null);
};

/**
 * Search for a report in the artifacts of a workflow run.
 * @param {Object} report
 * @param {Object} report.github GitHub client.
 * @param {string} report.owner Owner of the repository.
 * @param {string} report.repo Repository name.
 * @param {string} report.run_id Workflow run id.
 * @param {string} report.reportName Name of the report.
 * @returns The artifact that matches the report name.
 */
const search = async (report) => {
  debug(
    `Download artifacts - owner: ${report.owner}, repo: ${report.repo}, workflowRunId: ${report.workflowRunId}, reportName: ${report.reportName}`
  );
  var artifacts = await report.github.rest.actions
    .listWorkflowRunArtifacts({
      owner: report.owner,
      repo: report.repo,
      run_id: report.workflowRunId,
    })
    .catch(debug);

  var [matchArtifact] = artifacts.data.artifacts.filter((artifact) => {
    debug(`Artifact Name: ${artifact.name} -> ${report.reportName}`);
    return artifact.name == report.reportName;
  });
  return matchArtifact;
};

/**
 * Save data to a temporary fiel in a temporary directory.
 * @param {string} data
 * @returns The path to the temporary directory and the name of the temporary file.
 */
const save = (data) => {
  var directory = fs.mkdtempSync(path.join(os.tmpdir(), "junit-reports-"));
  debug(`Temp directory : ${directory}`);
  var storedFile = path.join(directory, "junit-report.zip");
  debug(`Storing file ${storedFile}`);
  fs.writeFileSync(storedFile, Buffer.from(data));
  return { directory, storedFile };
};

/**
 * Download a report from the artifacts of a workflow run.
 * @param {Object} report
 * @param {Object} report.github GitHub client.
 * @param {string} report.owner Owner of the repository.
 * @param {string} report.repo Repository name.
 * @param {string} report.run_id Workflow run id.
 * @param {string} report.reportName Name of the report.
 */
const download = async ({ github, owner, repo, workflowRunId, reportName }) => {
  var matchArtifact = await search({
    github: github,
    owner: owner,
    repo: repo,
    workflowRunId: workflowRunId,
    reportName: reportName,
  });

  if (matchArtifact) {
    debug(`Match Artifact: ${objTojson(matchArtifact)}`);
    // javascript get first element of an array safely
    // https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
    var download = await github.rest.actions
      .downloadArtifact({
        owner: owner,
        repo: repo,
        artifact_id: matchArtifact.id,
        archive_format: "zip",
      })
      .catch(debug);

    var { directory, storedFile } = save(download.data);
    setOutput("tempdir", directory);
    setOutput("report-file", storedFile);
    return { directory, storedFile };
  }
};

exports.download = download;
exports.checkToken = checkToken;
