use base64::{prelude::BASE64_STANDARD, Engine};

pub trait RiotSecret {
    fn to_riot_secret(&self) -> String;
}

impl RiotSecret for str {
    fn to_riot_secret(&self) -> String {
        let riot_format = format!("riot:{}", self);
        let encode_ascii = riot_format.trim_ascii();
        let encode_base64 = BASE64_STANDARD.encode(encode_ascii);
        encode_base64.to_owned()
    }
}