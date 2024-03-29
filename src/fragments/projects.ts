import * as path from "https://deno.land/std@0.180.0/path/mod.ts";

import prompts from "npm:prompts@2.4.2";
import {
  concatDir,
  moveFile,
  renameFolder,
  replaceTokensMap,
} from "../files.ts";
import {
  FileFragment,
  FragmentOptions,
  registeredFragments,
} from "../fragment.ts";
import { onCancel } from "../index.ts";
import * as Questions from "./questions.ts";

const packageToDirectory = (s: string) => s.replaceAll(/\./g, path.sep);

export class JavaPaperPlugin extends FileFragment {
  constructor() {
    super(
      "java_paper_plugin",
      "A Gradle Kotlin DSL project configured for Paper plugin development.",
      "java_paper_plugin",
    );
  }

  async prompt(_options: FragmentOptions): Promise<{
    projectName: string;
    projectGroup: string;
    projectVersion: string;
    projectDescription: string;
    projectAuthor: string;
    projectWebsite: string;
    license: boolean;
  }> {
    // TODO: using an uppercase vs lowercase to avoid naming conflict is cruddy.
    const questions = [
      Questions.projectName,
      Questions.projectGroup,
      Questions.projectVersion,
      Questions.projectDescription,
      Questions.projectAuthor,
      Questions.projectWebsite,
      Questions.license,
    ];

    return await prompts(questions, { onCancel });
  }

  async trace(
    options: FragmentOptions,
    data: {
      projectName: string;
      projectGroup: string;
      projectVersion: string;
      projectDescription: string;
      projectAuthor: string;
      projectWebsite: string;
      license: boolean;
    },
  ): Promise<void> {
    this.copyFiles(options.directory);

    const rootProjectName: string = data.projectName.toLowerCase();
    const projectPackage: string = data.projectGroup + "." + rootProjectName;

    replaceTokensMap(
      options.directory,
      new Map([
        ["ROOT_PROJECT_NAME", rootProjectName],
        ["PROJECT_NAME", data.projectName],
        ["PROJECT_GROUP", data.projectGroup],
        ["PROJECT_VERSION", data.projectVersion],
        ["PROJECT_DESCRIPTION", data.projectDescription],
        ["PROJECT_AUTHOR", data.projectAuthor],
        ["PROJECT_WEBSITE", data.projectWebsite],
        ["PROJECT_PACKAGE", projectPackage],
      ]),
    );

    const packageAsDirectory: string = packageToDirectory(projectPackage);
    const mainClassName: string = data.projectName + ".java";

    renameFolder(
      concatDir(options.directory, "src/main/java"),
      "#PROJECT_PACKAGE#",
      packageAsDirectory,
    );

    moveFile(
      concatDir(options.directory, "src/main/java", packageAsDirectory),
      "#PROJECT_NAME#.java",
      mainClassName,
    );

    await registeredFragments.get("editorconfig")!.traceWithPrompt(options);
    await registeredFragments.get("checkstyle")!.traceWithPrompt(options);
    await registeredFragments.get("java_gitignore")!.traceWithPrompt(options);

    if (data.license) {
      await registeredFragments.get("licenses")!.traceWithPrompt(options);
    }

    return Promise.resolve();
  }
}

export class JavaPaperLibrary extends FileFragment {
  constructor() {
    super(
      "java_paper_library",
      "A Gradle Kotlin DSL project configured to be a multi-module library.",
      "java_paper_library",
    );
  }

  async prompt(_options: FragmentOptions): Promise<{
    projectName: string;
    projectGroup: string;
    projectVersion: string;
    projectDescription: string;
    projectAuthor: string;
    projectGitRepo: string;
    projectWebsite: string;
    developerName: string;
    developerUrl: string;
    developerEmail: string;
    license: boolean;
  }> {
    const questions = [
      Questions.projectName,
      Questions.projectGroup,
      Questions.projectVersion,
      Questions.projectDescription,
      Questions.projectAuthor,
      {
        type: "text",
        name: "projectGitRepo",
        message: "Project Git Repo (e.g. GitHub)",
        initial: "https://github.com/",
      },
      {
        ...Questions.projectWebsite,
        initial: (prev: string) => prev,
      },
      {
        type: "text",
        name: "developerName",
        message: "Developer Name",
        initial: (_prev: string, values: { projectAuthor: string }): string =>
          values.projectAuthor,
      },
      {
        type: "text",
        name: "developerUrl",
        message: "Developer Url",
        initial: "https://",
      },
      {
        type: "text",
        name: "developerEmail",
        message: "Developer Email",
      },
      Questions.license,
    ];

    return await prompts(questions, { onCancel });
  }

  async trace(
    options: FragmentOptions,
    data: {
      projectName: string;
      projectGroup: string;
      projectVersion: string;
      projectDescription: string;
      projectAuthor: string;
      projectWebsite: string;
      projectGitRepo: string;
      developerName: string;
      developerUrl: string;
      developerEmail: string;
      license: boolean;
    },
  ): Promise<void> {
    this.copyFiles(options.directory);

    const rootProjectName: string = data.projectName.toLowerCase();
    const projectPackage: string = data.projectGroup + "." + rootProjectName;

    replaceTokensMap(
      options.directory,
      new Map([
        ["ROOT_PROJECT_NAME", rootProjectName],
        ["PROJECT_NAME", data.projectName],
        ["PROJECT_GROUP", data.projectGroup],
        ["PROJECT_VERSION", data.projectVersion],
        ["PROJECT_DESCRIPTION", data.projectDescription],
        ["PROJECT_AUTHOR", data.projectAuthor],
        ["PROJECT_WEBSITE", data.projectWebsite],
        ["PROJECT_GIT_REPO", data.projectGitRepo],
        ["PROJECT_PACKAGE", projectPackage],
        ["DEVELOPER_NAME", data.developerName],
        ["DEVELOPER_URL", data.developerUrl],
        ["DEVELOPER_EMAIL", data.developerEmail],
      ]),
    );

    const packageAsDirectory: string = packageToDirectory(projectPackage);

    renameFolder(
      concatDir(options.directory, "core/src/main/java"),
      "#PROJECT_PACKAGE#",
      packageAsDirectory,
    );

    renameFolder(
      concatDir(options.directory, "paper/src/main/java"),
      "#PROJECT_PACKAGE#",
      packageAsDirectory,
    );

    moveFile(
      concatDir(options.directory, "buildSrc/src/main/kotlin"),
      "#ROOT_PROJECT_NAME#.java-conventions.gradle.kts",
      rootProjectName + ".java-conventions.gradle.kts",
    );

    await registeredFragments.get("editorconfig")!.traceWithPrompt(options);
    await registeredFragments.get("checkstyle")!.traceWithPrompt(options);
    await registeredFragments.get("java_gitignore")!.traceWithPrompt(options);

    if (data.license) {
      await registeredFragments.get("licenses")!.traceWithPrompt(options);
    }

    return Promise.resolve();
  }
}
