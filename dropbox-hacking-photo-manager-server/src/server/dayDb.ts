import { DayMetadata } from "dropbox-hacking-photo-manager-shared";
import * as fs from "fs";
import writeFile from "write-file-atomic";

export default class DayDb {
  constructor(public dir: string) {}

  public days(): Promise<DayMetadata[]> {
    return fs.promises.readFile(this.dayDbFile(), { encoding: "utf-8" }).then(
      (text) => JSON.parse(text) as DayMetadata[],
      (err: Error & { code: string }) => {
        if (err.code === "ENOENT") return [];

        throw err;
      },
    );
  }

  public async setDay(newMetadata: DayMetadata): Promise<void> {
    const days = await this.days();
    const newDays = days.filter((day) => day.date !== newMetadata.date);
    newDays.push(newMetadata);
    newDays.sort((a, b) => a.date.localeCompare(b.date));
    const content = JSON.stringify(newDays) + "\n";
    return await writeFile(this.dayDbFile(), content, "utf-8");
  }

  private dayDbFile(): string {
    return `${this.dir}/days.json`;
  }
}
