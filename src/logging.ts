// TODO: switch to a proper logging framework.

export const isDebugMode = false;

/**
 * Replaces `console.debug` to debug only if `isDebugMode` is true.
 */
export function injectCustomLogging(): void {
  console.debug = (message?, ...optionalParams): void => {
    if (isDebugMode) {
      console.log(message, optionalParams);
    }
  };
}
