const path = require('path');
const fs = require('fs');
import { parse } from 'yaml';

export const getEnv = () => {
  return process.env.RUNNING_ENV;
};

export const getConfig = () => {
  let env = getEnv();
  if (!env) env = 'prod';
  const envYamlPath = path.join(process.cwd(), `./src/config/.${env}.yaml`);
  const envYamlFile = fs.readFileSync(envYamlPath, 'utf-8');
  const config = parse(envYamlFile);
  return config;
};
