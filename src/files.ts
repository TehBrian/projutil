import { concatDir, dirStringToArray } from "./file-util.ts";

const __dirname = new URL(".", import.meta.url).pathname;
const asArray = dirStringToArray(__dirname);
asArray.pop();
export const fragmentsFolder: string = concatDir(asArray, "fragments");
