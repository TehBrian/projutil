import prompts from "npm:prompts@2.4.2";
import { replaceTokensMap } from "../util/files.ts";
import { onCancel } from "../index.ts";
import {
  FileFragment,
  Fragment,
  FragmentOptions,
  registeredFragments,
} from "./fragment.ts";

export class Licenses extends Fragment {
  constructor() {
    super("licenses", "A list of licenses.");
  }

  async prompt(_options: FragmentOptions): Promise<{ licenseType: string }> {
    const questions = [
      {
        type: "select",
        name: "licenseType",
        message: "License Type",
        choices: [{ title: "MIT", value: "MIT" }],
      },
    ];

    return await prompts(questions, { onCancel });
  }

  async trace(
    options: FragmentOptions,
    data: { licenseType: string },
  ): Promise<void> {
    if (data.licenseType === "MIT") {
      await registeredFragments.get("mit_license")!.traceWithPrompt(options);
    }
  }
}

export class MitLicense extends FileFragment {
  constructor() {
    super("mit_license", "The MIT license.", "mit_license");
  }

  async prompt(_options: FragmentOptions): Promise<{ licenseHolder: string }> {
    const questions = [
      {
        type: "text",
        name: "licenseHolder",
        message: "License Holder",
      },
    ];

    return await prompts(questions, { onCancel });
  }

  trace(
    options: FragmentOptions,
    data: { licenseHolder: string },
  ): Promise<void> {
    this.copyFiles(options.directory);

    replaceTokensMap(
      options.directory,
      new Map([
        ["LICENSE_YEAR", new Date().getFullYear().toString()],
        ["LICENSE_HOLDER", data.licenseHolder],
      ]),
    );

    return Promise.resolve();
  }
}
