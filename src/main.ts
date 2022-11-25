import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

async function greet() {
    if (greetMsgEl && greetInputEl) {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        greetMsgEl.textContent = await invoke("greet", {
            name: greetInputEl.value,
        });
    }
}
await appWindow.onFocusChanged(async ({ payload: focused }) => {
    console.log("Focus changed, window is focused? " + focused);
    greet();
});

window.addEventListener("DOMContentLoaded", () => {
    greetInputEl = document.querySelector("#greet-input");
    greetMsgEl = document.querySelector("#greet-msg");
    document.querySelector("#greet-button")?.addEventListener("click", () => greet());
});
