import * as log from "npmlog";
import {
  GitError,
  MonorepoError,
  CommandOptionError,
  ExitError
} from "../models/errors";
import { debugOutput, lineBreak } from "./log";

export function errorsGlobalHandler(e: Error): void {
  lineBreak();
  log.silly(`error from`, e.constructor.name.replace(`Error`, ``));
  if (e instanceof GitError) {
    log.error(`git (${e.code})`, e.message);
  } else if (e instanceof MonorepoError) {
    log.error(`monorepo`, e.message);
  } else if (e instanceof CommandOptionError) {
    if (typeof e.optionName === `string`) {
      log.error(e.optionName, e.message);
    } else {
      log.error(``, e.message);
      log.error(`options`, e.optionName.join(`, `));
    }
  } else if (e instanceof ExitError) {
    throw e;
  } else {
    log.error(``, e.message);
  }

  lineBreak();
  if (e.stack) {
    debugOutput(e.stack);
  }
}
