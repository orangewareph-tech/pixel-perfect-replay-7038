import type { MusicId } from "@/lib/christmas-music";
import type { VideoDuration } from "@/lib/video-duration";
import type { MessageDraft } from "@/lib/christmas-message";

export type CreationDraft = { photo: string; template: string; music: MusicId; duration: VideoDuration; volume: number; loopMusic: boolean; christmasMessage?: MessageDraft };

// IndexedDB accommodates a 10 MB photo without putting private photo data in URLs.
async function draftStore(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest) {
  return new Promise<unknown>((resolve, reject) => {
    const request = indexedDB.open("magicph-creation", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("draft");
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("draft", mode);
      const operation = action(transaction.objectStore("draft"));
      transaction.oncomplete = () => { resolve(operation.result); db.close(); };
      transaction.onerror = () => { reject(transaction.error); db.close(); };
    };
  });
}
export async function saveCreationDraft(draft: CreationDraft) { await draftStore("readwrite", (store) => store.put(draft, "auth-return")); }
export async function takeCreationDraft() {
  const draft = await draftStore("readonly", (store) => store.get("auth-return")) as CreationDraft | undefined;
  if (draft) await draftStore("readwrite", (store) => store.delete("auth-return"));
  return draft;
}