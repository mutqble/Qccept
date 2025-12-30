use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchState {
    pub search_state: State,
}

#[derive(Deserialize, Serialize, TS)]
#[ts(export)]
pub enum State {
    Invalid,
    Found,
    Searching,
    Error,
}
