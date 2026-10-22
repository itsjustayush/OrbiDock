use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClipboardData {
    pub content: String,
    pub content_type: String, // "text" | "code" | "url" | "json"
    pub length: usize,
    pub timestamp: u64,
}

pub fn analyze_content(text: &str) -> String {
    let trimmed = text.trim();
    if trimmed.starts_with("http://") || trimmed.starts_with("https://") {
        "url".to_string()
    } else if (trimmed.starts_with('{') && trimmed.ends_with('}'))
        || (trimmed.starts_with('[') && trimmed.ends_with(']'))
    {
        if serde_json::from_str::<serde_json::Value>(trimmed).is_ok() {
            "json".to_string()
        } else {
            "code".to_string()
        }
    } else if trimmed.contains("function ")
        || trimmed.contains("const ")
        || trimmed.contains("let ")
        || trimmed.contains("class ")
        || trimmed.contains("import ")
        || trimmed.contains("def ")
        || trimmed.contains("fn ")
        || trimmed.contains("return ")
        || trimmed.contains("public static void")
    {
        "code".to_string()
    } else {
        "text".to_string()
    }
}
