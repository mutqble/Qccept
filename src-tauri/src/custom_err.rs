use thiserror::Error;

#[derive(Error, Debug)]
#[allow(dead_code)]
pub enum CustomErr {
    #[error(transparent)]
    Error(#[from] std::io::Error),
    #[error(transparent)]
    ParseIntError(#[from] std::num::ParseIntError),
    #[error(transparent)]
    ReqwestError(#[from] reqwest::Error),
    #[error(transparent)]
    SerdeJsonError(#[from] serde_json::Error),
    #[error(transparent)]
    InvalidHeaderValue(#[from] reqwest::header::InvalidHeaderValue),
    #[error("Process Not Found")]
    ProcessNotFound,
}
