import { pathToFileURL } from "url";
import { dirname, resolve as pathResolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = __dirname; // This should be the project root

export function resolve(specifier, context, nextResolve) {
  // Check if this is a path alias
  if (specifier.startsWith("#/")) {
    // Replace "#/" with "dist/src/"
    const resolvedPath = pathResolve(rootDir, "dist/src", specifier.substring(2));
    return {
      shortCircuit: true,
      url: pathToFileURL(resolvedPath).href,
    };
  }

  // Let Node.js handle all other specifiers
  return nextResolve(specifier);
}
