use reqwest::{header, Response};
use serde::{Deserialize, Serialize};
use std::{fs::read_to_string, path::PathBuf};
use sysinfo::System;
use tauri::http::HeaderMap;

use crate::{custom_err::CustomErr, util::RiotSecret};

#[derive(Serialize, Deserialize, Debug)]
pub struct ClientLockFile {
    pub port: u16,
    pub token: String,
}

pub struct CustomRequest {
    lockfile_data: ClientLockFile,
    request_url: String,
    method: reqwest::Method,
}

impl CustomRequest {
    pub fn new(data: String, method: reqwest::Method) -> Result<Self, CustomErr> {
        let lockfile_data: ClientLockFile = serde_json::from_str(&data)?;
        let port = lockfile_data.port.to_owned();
        Ok(Self {
            lockfile_data,
            request_url: format!("https://127.0.0.1:{}", port),
            method,
        })
    }
    pub async fn request(self, path: &str) -> Result<Response, CustomErr> {
        let client = reqwest::Client::builder()
            .danger_accept_invalid_certs(true)
            .build()?;

        let req = client
            .request(self.method, self.request_url + path)
            .headers(custom_header(self.lockfile_data.token)?)
            .send()
            .await?;
        Ok(req)
    }
}

fn custom_header(secret: String) -> Result<HeaderMap, reqwest::header::InvalidHeaderValue> {
    let mut headers = HeaderMap::new();
    let auth_value = format!("Basic {}", secret.to_riot_secret());
    headers.insert(header::AUTHORIZATION, auth_value.parse()?);
    headers.insert(header::CONTENT_TYPE, "application/json".parse()?);
    Ok(headers)
}

pub async fn get(data: String, path: &str) -> Result<String, CustomErr> {
    //TODO: Json -> Struct
    let custom_req = CustomRequest::new(data, reqwest::Method::GET)?;
    let req = custom_req.request(path).await?;

    req.text().await.map_err(|err| err.into())
}

pub async fn post(data: String, path: &str) -> Result<(), CustomErr> {
    let custom_req = CustomRequest::new(data, reqwest::Method::POST)?;
    let req = custom_req.request(path).await?;

    match req.text().await {
        Ok(_) => Ok(()),
        Err(e) => Err(e.into()),
    }
}

pub fn get_client_path() -> Result<PathBuf, CustomErr> {
    let process = System::new_all();
    let client_process = process
        .processes_by_exact_name("LeagueClientUx.exe".as_ref())
        .next();

    match client_process {
        Some(c) => Ok(c.cwd().unwrap().to_owned()),
        None => Err(CustomErr::ProcessNotFound),
    }
}

pub fn get_lockfile(path: PathBuf) -> Result<String, CustomErr> {
    let lockfile_path = path.join("lockfile");
    let contents = read_to_string(&lockfile_path)?;
    let items = contents.split(":").collect::<Vec<&str>>();

    let lockfile_data = ClientLockFile {
        port: items[2].parse::<u16>()?,
        token: items[3].to_string(),
    };

    serde_json::to_string(&lockfile_data).map_err(|err| err.into())
}
