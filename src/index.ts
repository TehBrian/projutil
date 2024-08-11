import { blue, green, red } from "https://deno.land/std@0.153.0/fmt/colors.ts";
import { Command } from "npm:commander@10.0.0";
import { Fragment, registeredFragments, registerFragment } from "./fragment.ts";
import { Checkstyle, Editorconfig, JavaGitignore } from "./fragments/extras.ts";
import { Licenses, MitLicense } from "./fragments/licenses.ts";
import { JavaPaperLibrary, JavaPaperPlugin } from "./fragments/projects.ts";
import { injectCustomLogging } from "./logging.ts";

function registerDefaultFragments(): void {
  registerFragment(new JavaPaperPlugin());
  registerFragment(new JavaPaperLibrary());
  registerFragment(new Licenses());
  registerFragment(new MitLicense());
  registerFragment(new JavaGitignore());
  registerFragment(new Checkstyle());
  registerFragment(new Editorconfig());
}

registerDefaultFragments();
injectCustomLogging();

export const onCancel = () => {
  console.log(red("Looks like our time is getting cut short, my friend."));

  Deno.exit(0);
};

Deno.addSignalListener("SIGTERM", onCancel);

const program = new Command();
program.version("1.0.0");

program
  .command("trace <fragment...>")
  .description(
    "copy files from one or more fragments and replace/rename as needed",
  )
  .option(
    "-d, --directory <dir>",
    "specify project directory (defaults to current)",
  )
  .action(async function (fragment: string[], options: { directory: string }) {
    const directory: string = options.directory === undefined
      ? Deno.cwd()
      : options.directory;

    // verify that each fragment exists before tracing.
    const fragmentsToTrace: Fragment[] = [];
    for (const item of fragment) {
      const lowercaseItem = item.toLowerCase();
      const fragmentObject = registeredFragments.get(lowercaseItem);
      if (fragmentObject === undefined) {
        console.error(red(`The fragment ${lowercaseItem} doesn't exist.`));
        printAvailableFragments();
        return;
      }
      fragmentsToTrace.push(fragmentObject);
    }

    // prompt each fragment in order that user listed them.
    for (const fragmentObject of fragmentsToTrace) {
      await fragmentObject.traceWithPrompt({ directory });
      console.log(green(`Traced fragment ${fragmentObject.name}!`));
    }

    console.log(blue("All done :)"));
  });

program
  .command("fragments")
  .description("list the available fragments")
  .action(function () {
    printAvailableFragments();
  });

function printAvailableFragments() {
  console.log("The available fragments are:");
  for (const fragment of registeredFragments.values()) {
    console.log(blue(fragment.name) + " - " + green(fragment.description));
  }
}

program.parse(Deno.args);
