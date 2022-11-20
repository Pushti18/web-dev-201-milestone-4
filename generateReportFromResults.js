let fs = require("fs");

let feedback = (passed, results) => {
  const assertionResults = results["assertionResults"]
    .map((item) => {
      let status = item["status"];
      let title = item["title"];
      let statusSymbol = status == "passed" ? "✓" : "✗";
      return `${statusSymbol} ${title}`;
    })
    .join("\n\n");

  let errorMessage = results["message"];

  const feedback = assertionResults + "\n\n" + errorMessage;

  return feedback;
};

const report = (data) => {
  console.log(data);
  let reportFile = "./report.json";
  fs.writeFileSync(reportFile, JSON.stringify(data));
};

const readfile = async (filePath) => {
  try {
    const data = await fs.promises.readfile(filePath, "utf8");
    return data;
  } catch (err) {
    console.log("File not found | Grading Skipped");
  }
};

readfile("results.json").then((data) => {
  if (data) {
    let results = JSON.parse(data);
    const passed = results["testResults"][0]["status"] == "passed";
    let feedback = feedback(passed, results["testResults"][0]);
    report({
      version: 0,
      grade: passed ? "accept" : "reject",
      status: passed ? "success" : "failure",
      feedback: feedback,
      report: feedback,
    });
  } else {
    report({
      version: 0,
      grade: "skip",
      status: "failure",
      feedback:
        "We are unable to test your submission - something about it was too different from what we were expecting. Please check the instructions for this task and try again. If you have seen this message more than once, please reach out to Pupilfirst team for support.",
      report: "Unable to generate report due to missing results.json.",
    });
  }
});
