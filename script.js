const fs = require("fs");
const os = require("os");
const path = require("path");
const core = require("@actions/core");
const debug = core.debug;
const setOutput = core.setOutput;
const setFailed = core.setFailed;
const sep = path.sep;

const downloadReport = async ({
  github,
  owner,
  repo,
  workflowRunId,
  reportName,
}) => {
  try {
    debug(
      "Download artifacts - " +
        "owner: " +
        owner +
        ", repo: " +
        repo +
        ", workflowRunId: " +
        workflowRunId +
        ", reportName: " +
        reportName
    );

    var artifacts = await github.rest.actions.listWorkflowRunArtifacts({
      owner: owner,
      repo: repo,
      run_id: workflowRunId,
    });

    debug("Artifacts: " + artifacts);

    const [matchArtifact] = artifacts.data.artifacts.filter((artifact) => {
      debug("Artifact Name: " + artifact.name + " VS " + reportName);
      return artifact.name == reportName;
    });

    if (matchArtifact) {
      debug("Match Artifact: " + matchArtifact);
      // javascript get first element of an array safely
      // https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
      var download = await github.rest.actions.downloadArtifact({
        owner: owner,
        repo: repo,
        artifact_id: matchArtifact.id,
        archive_format: "zip",
      });

      directory = fs.mkdtempSync(path.join(os.tmpdir(), "junit-reports-"));
      debug("Temp directory : " + directory);
      var storedFile = path.join(directory, "junit-report.zip");
      debug("Storing file " + storedFile);
      fs.writeFileSync(storedFile, Buffer.from(download.data));
      setOutput("tempdir", directory);
      setOutput("report-file", storedFile);
    }
  } catch (error) {
    debug(error);
    setFailed(error.message);
  }
};

exports.downloadReport = downloadReport;
