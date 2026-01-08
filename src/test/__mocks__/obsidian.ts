export class Plugin {
  async loadData(): Promise<any> {
    return null;
  }

  async saveData(data: unknown): Promise<void> {
    // simuliert das Speichern ohne Fehler
    return;
  }
}
