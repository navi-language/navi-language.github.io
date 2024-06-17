import { coreModules, stdlibModules } from "../src/doc-json";
import { generatePaths } from "../src/paths";

export default generatePaths("stdlib", { ...coreModules, ...stdlibModules });
