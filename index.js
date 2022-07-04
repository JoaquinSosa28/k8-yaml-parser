const args = process.argv.slice(2);
const filePath = args[0];
const unwantedFields = args.slice(1).length
  ? args.slice(1)
  : [
      ["metadata", "annotations", "deployment.kubernetes.io/revision"],
      ["metadata", "annotations", "kubectl.kubernetes.io/last-applied-configuration"],
      "metadata.creationTimestamp",
      "metadata.generation",
      "metadata.resourceVersion",
      "metadata.uid",
      "spec.template.spec.schedulerName",
      "spec.template.metadata.creationTimestamp",
      "status",
    ];

const fs = require("fs");
const path = require("path");
const YAML = require("js-yaml");
const _ = require("lodash");

const OUTPUT_FOLDER = "output";

function main() {
  const jsonFile = YAML.load(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(jsonFile))
    return console.error("Please make sure the JSON file provided is a valid array");

  const fileName = path.parse(filePath).name;

  !fs.existsSync(`${OUTPUT_FOLDER}/${fileName}`) &&
    fs.mkdirSync(`${OUTPUT_FOLDER}/${fileName}`, { recursive: true });

  jsonFile.forEach((e, i) => {
    for (const field of unwantedFields) _.unset(e, field);
    fs.writeFileSync(`output/${fileName}/${fileName}-${i}.yaml`, YAML.dump(e));
  });
}

main();
