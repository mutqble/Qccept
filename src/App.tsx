import {
   createEffect,
   createResource,
   createSignal,
   onCleanup,
} from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { Gamepad2, Monitor, Zap } from "lucide-solid";
import { Switch as ArkSwitch } from "@ark-ui/solid/switch";
import "./App.css";
import { getVersion } from "@tauri-apps/api/app";
import {
   headerStyle,
   logo,
   versionTag,
   versionText,
} from "./styles/header.css";
import {
   boltIcon,
   boltIconActive,
   colorGray,
   colorYellow,
   mainContainer,
   mainText,
   subText,
   textContainer,
} from "./styles/main.css";
import { center, dotGreen, dotRed, footerStyle } from "./styles/footer.css";
import { switchControl, switchRoot, switchThumb } from "./styles/switch.css";
import { State } from "./State";

function App() {
   const [lockfileData, setLockfileData] = createSignal<string>();
   const [version] = createResource(getVersion);
   const [isStarting, setIsStarting] = createSignal<boolean>(false);
   const [isClientRunning, setIsClientRunning] = createSignal<boolean>(false);

   async function getClientLockfile() {
      try {
         setLockfileData(await invoke("get_lockfile_data"));
         setIsClientRunning(true);
      } catch (e) {
         console.log(e);
         setIsClientRunning(false);
      }
   }

   createEffect(() => {
      let clientInterval: NodeJS.Timeout;

      if (!isClientRunning()) {
         clientInterval = setInterval(() => {
            getClientLockfile();
         }, 5000);
      }

      onCleanup(() => {
         if (clientInterval) {
            clearInterval(clientInterval);
         }
      });
   });

   createEffect(() => {
      let interval: NodeJS.Timeout;
      const isStartingVal: boolean = isStarting();
      const isClientRunningVal: boolean = isClientRunning();

      if (isStartingVal && isClientRunningVal) {
         interval = setInterval(async () => {
            const data = lockfileData();
            if (data) {
               const state = await getSearchState(data);
               if (state) {
                  console.log(state);
                  if (state === "Found") {
                     await matchmakingAccept(data);
                  }
               }
            }
         }, 2000);
      }

      onCleanup(() => {
         if (interval) {
            clearInterval(interval);
         }
      });
   });

   async function getSearchState(lockfileData: string): Promise<State | null> {
      try {
         return await invoke("search_state", {
            lockfileData,
         });
      } catch (e) {
         console.log(e);
         setIsClientRunning(false);
         return null;
      }
   }

   async function matchmakingAccept(
      lockfileData: string,
   ): Promise<void | null> {
      try {
         return await invoke("matchmaking_accept", { lockfileData });
      } catch (e) {
         console.log(e);
         setIsClientRunning(false);
         return null;
      }
   }

   return (
      <div class="container">
         <header class={headerStyle}>
            <div class={logo}>
               <Gamepad2 size={20} color="#FD9A00" />
               <span>Qccept</span>
            </div>
            <div class={versionTag}>
               <span class={versionText}>v{version()}</span>
            </div>
         </header>
         <main class={mainContainer}>
            <div class={isStarting() ? boltIconActive : boltIcon}>
               <Zap size={48} />
            </div>
            <div class={textContainer}>
               <p
                  class={`${mainText} ${isStarting() ? colorYellow : colorGray}`}
               >
                  {isStarting()
                     ? "자동 수락 활성화됨"
                     : "앱이 활성화 상태가 아닙니다"}
               </p>
               <p class={subText}>
                  {isStarting()
                     ? "매칭을 자동으로 수락합니다"
                     : "스위치를 켜서 자동 수락을 시작하세요"}
               </p>
            </div>
            <ArkSwitch.Root
               checked={isStarting()}
               onCheckedChange={(e) => setIsStarting(e.checked)}
               class={switchRoot}
            >
               <ArkSwitch.Control class={switchControl}>
                  <ArkSwitch.Thumb class={switchThumb} />
               </ArkSwitch.Control>
               <ArkSwitch.HiddenInput />
            </ArkSwitch.Root>
         </main>
         <footer class={footerStyle}>
            <div class={center}>
               <Monitor size={14} />
               <span>LoL Client</span>
            </div>
            <div class={center}>
               <span class={isClientRunning() ? dotGreen : dotRed}>●</span>
               <span>
                  {isClientRunning()
                     ? "클라이언트 감지됨"
                     : "클라이언트를 실행해주세요"}
               </span>
            </div>
         </footer>
      </div>
   );
}

export default App;
