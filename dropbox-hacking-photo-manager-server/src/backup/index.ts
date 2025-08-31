export { backupToDropbox } from "./backupToDropbox.js";
export { backupToLocalTarFile } from "./backupToLocalTarFile.js";

export type BackupConfig = {
  readonly localPaths: Record<string, string>;
};

export const backupConfig = (backupConfig: BackupConfig): BackupConfig =>
  backupConfig;
