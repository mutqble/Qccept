use crate::client::{get, get_client_path, get_lockfile, post};
use crate::custom_err::CustomErr;
use crate::search_state::{SearchState, State};

mod client;
mod custom_err;
mod search_state;
mod util;

fn stringify(err: CustomErr) -> String {
    err.to_string()
}

#[tauri::command]
fn get_lockfile_data() -> Result<String, String> {
    let path = get_client_path().map_err(stringify)?;
    let lockfile_data = get_lockfile(path).map_err(stringify)?;

    Ok(lockfile_data)
}

#[tauri::command]
async fn search_state(lockfile_data: String) -> Result<State, String> {
    let req = get(
        lockfile_data,
        "/lol-lobby/v2/lobby/matchmaking/search-state",
    )
    .await
    .map_err(stringify)?;

    let deser: SearchState = serde_json::from_str(&req).map_err(|e| e.to_string())?;
    Ok(deser.search_state)
}

#[tauri::command]
async fn matchmaking_accept(lockfile_data: String) -> Result<(), String> {
    post(lockfile_data, "/lol-matchmaking/v1/ready-check/accept")
        .await
        .map_err(stringify)
}

//일단 혹시 모르니 남겨둠
#[tauri::command]
async fn lcu_get(lockfile_data: String, path: String) -> Result<String, String> {
    get(lockfile_data, &path).await.map_err(stringify)
}

#[tauri::command]
async fn lcu_post(lockfile_data: String, path: String) -> Result<(), String> {
    post(lockfile_data, &path).await.map_err(stringify)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            lcu_post,
            get_lockfile_data,
            lcu_get,
            search_state,
            matchmaking_accept
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
