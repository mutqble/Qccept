import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";
import toast from "solid-toast";

export async function update() {
    const update = await check();
    if (update) {
        console.log(
            `새로운 버전 ${update.version}이(가) 발견됐습니다.`,
        );

        const promise = update.downloadAndInstall();

        toast.promise(promise, {
            loading: `${update.version} 다운로드 중...`,
            success: "업데이트 완료! 잠시 후 재시작됩니다.",
            error: "업데이트 실패",
        }, { position: "top-center" });

        await relaunch();
    }
}