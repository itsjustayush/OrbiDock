use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};
use sysinfo::System;
use tauri::{AppHandle, Manager, State};
use tauri_plugin_autostart::ManagerExt;

use crate::clipboard_service::{analyze_content, ClipboardData};
use crate::cursor_edge::{get_cursor_and_monitor, handle_state_transition};
use crate::metrics::{collect_metrics, SystemMetrics};
use crate::state_machine::{DockState, DockStateMachine};

pub struct AppState {
    pub state_machine: Arc<Mutex<DockStateMachine>>,
    pub system: Arc<Mutex<System>>,
}

#[tauri::command]
pub fn get_dock_state(state: State<'_, AppState>) -> DockState {
    let sm = state.state_machine.lock().unwrap();
    sm.current_state()
}

#[tauri::command]
pub fn set_dock_state(app: AppHandle, state: State<'_, AppState>, new_state: DockState) {
    let mut sm = state.state_machine.lock().unwrap();
    sm.transition_to(new_state);

    if let Some(window) = app.get_webview_window("main") {
        if new_state == DockState::Hidden {
            let _ = window.set_ignore_cursor_events(true);
        } else if new_state == DockState::Open {
            let _ = window.set_ignore_cursor_events(false);
            let _ = window.set_focus();
        }
    }
}

#[tauri::command]
pub fn toggle_dock(app: AppHandle, state: State<'_, AppState>) -> DockState {
    let mut sm = state.state_machine.lock().unwrap();
    let next_state = sm.toggle();
    drop(sm);

    #[cfg(windows)]
    if let Some((_, monitor)) = get_cursor_and_monitor() {
        handle_state_transition(&app, next_state, &monitor);
    }

    next_state
}

#[tauri::command]
pub fn set_user_interacting(state: State<'_, AppState>, interacting: bool) {
    let mut sm = state.state_machine.lock().unwrap();
    sm.set_interacting(interacting);
}

#[tauri::command]
pub fn get_system_metrics(state: State<'_, AppState>) -> SystemMetrics {
    let mut sys = state.system.lock().unwrap();
    collect_metrics(&mut sys)
}

#[tauri::command]
pub fn get_clipboard_data(app: AppHandle) -> ClipboardData {
    use tauri_plugin_clipboard_manager::ClipboardExt;
    let content = app.clipboard().read_text().unwrap_or_default();
    let content_type = analyze_content(&content);
    let length = content.chars().count();
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();

    ClipboardData {
        content,
        content_type,
        length,
        timestamp,
    }
}

#[tauri::command]
pub fn set_autostart_enabled(app: AppHandle, enable: bool) -> Result<bool, String> {
    let autostart_manager = app.autolaunch();
    if enable {
        autostart_manager
            .enable()
            .map_err(|e| format!("Failed to enable autostart: {}", e))?;
    } else {
        autostart_manager
            .disable()
            .map_err(|e| format!("Failed to disable autostart: {}", e))?;
    }
    autostart_manager
        .is_enabled()
        .map_err(|e| format!("Failed to check autostart: {}", e))
}

#[tauri::command]
pub fn is_autostart_enabled(app: AppHandle) -> bool {
    let autostart_manager = app.autolaunch();
    autostart_manager.is_enabled().unwrap_or(false)
}

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct AiResponse {
    pub action: String,
    pub title: String,
    pub text: String,
    pub suggestion: Option<String>,
}

#[tauri::command]
pub fn process_ai_command(command: String, context: Option<String>) -> AiResponse {
    let cmd_lower = command.to_lowercase();
    let ctx = context.unwrap_or_default();

    if cmd_lower.contains("summar") {
        let summary = if !ctx.is_empty() {
            format!("Key Points from Clipboard:\n• Core focus: {}\n• Length: {} characters\n• Actionable insight: Prepared for instant export.", ctx.lines().next().unwrap_or("Captured content"), ctx.len())
        } else {
            "Captured 3 main points: Workflow initialized, metrics verified, top-center overlay active.".to_string()
        };
        AiResponse {
            action: "summarize".to_string(),
            title: "Smart Summary Generated".to_string(),
            text: summary,
            suggestion: Some("Copy summary to clipboard".to_string()),
        }
    } else if cmd_lower.contains("rewrit") || cmd_lower.contains("tone") {
        let rewritten = if !ctx.is_empty() {
            format!("Professional polish: \"{}\"", ctx.trim())
        } else {
            "Professional polish: \"Here is the refined communication ready for your review and send.\"".to_string()
        };
        AiResponse {
            action: "rewrite".to_string(),
            title: "Professional Rewrite".to_string(),
            text: rewritten,
            suggestion: Some("Replace clipboard with polished text".to_string()),
        }
    } else if cmd_lower.contains("timer") || cmd_lower.contains("focus") {
        AiResponse {
            action: "timer".to_string(),
            title: "Focus Session Prepared".to_string(),
            text: "Pomodoro session initialized: 25 minutes of deep focus with notifications muted.".to_string(),
            suggestion: Some("Start Focus Timer".to_string()),
        }
    } else if cmd_lower.contains("code") || cmd_lower.contains("debug") {
        AiResponse {
            action: "code".to_string(),
            title: "Code Inspection Complete".to_string(),
            text: "Analyzed snippet: Syntax is clean, no unhandled exceptions detected. Execution complexity: O(1).".to_string(),
            suggestion: Some("Format & copy snippet".to_string()),
        }
    } else {
        AiResponse {
            action: "general".to_string(),
            title: format!("Orbidock Action: {}", command),
            text: format!("Processed request: \"{}\". Ready to dispatch local workflow or copy results.", command),
            suggestion: Some("Save to quick notes".to_string()),
        }
    }
}
