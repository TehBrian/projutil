import { FileFragment, FragmentData, FragmentOptions } from "../fragment.ts";

export class Checkstyle extends FileFragment {
  constructor() {
    super("checkstyle", "A checkstyle.", "checkstyle");
  }

  trace(options: FragmentOptions, _data: FragmentData): Promise<void> {
    this.copyFiles(options.directory);
    return Promise.resolve();
  }
}

export class Editorconfig extends FileFragment {
  constructor() {
    super("editorconfig", "An editorconfig.", "editorconfig");
  }

  trace(options: FragmentOptions, _data: FragmentData): Promise<void> {
    this.copyFiles(options.directory);
    return Promise.resolve();
  }
}

export class JavaCIWorkflow extends FileFragment {
  constructor() {
    super("java_ci_workflow", "A CI workflow for Java projects.", "java_ci_workflow");
  }

  trace(options: FragmentOptions, _data: FragmentData): Promise<void> {
    this.copyFiles(options.directory);
    return Promise.resolve();
  }
}

export class JavaLibCIWorkflow extends FileFragment {
  constructor() {
    super("java_lib_ci_workflow", "A CI workflow for Java libraries.", "java_lib_ci_workflow");
  }

  trace(options: FragmentOptions, _data: FragmentData): Promise<void> {
    this.copyFiles(options.directory);
    return Promise.resolve();
  }
}

export class JavaGitignore extends FileFragment {
  constructor() {
    super("java_gitignore", "A gitignore for Java.", "java_gitignore");
  }

  trace(options: FragmentOptions, _data: FragmentData): Promise<void> {
    this.copyFiles(options.directory);
    return Promise.resolve();
  }
}
