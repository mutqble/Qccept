import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";
import toast, { Toaster } from "solid-toast";

async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function update() {
    const update = await check();
    if (update) {
        console.log(
            `새로운 버전 ${update.version}이(가) 발견됐습니다.`,
        );

        let promise = update.downloadAndInstall;
        toast.promise(promise(), {
            loading: `${update.version} 다운로드 중...`,
            success: "업데이트 완료! 잠시 후 재시작됩니다.",
            error: "업데이트 실패",
        }, { position: "top-center" });

        await delay(3000);
        await relaunch();
    }
}