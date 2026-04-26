import { spawn } from "child_process";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./services.json"));

for (const service of config.services) {
  const proc = spawn("node", [service.file], {
    stdio: "inherit"
  });

  console.log(`Started ${service.name}`);

  proc.on("exit", code => {
    console.log(`${service.name} exited with code ${code}`);
  });
}
