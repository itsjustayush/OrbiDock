use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager};

use crate::state_machine::{DockState, DockStateMachine};

#[cfg(windows)]
use windows::Win32::Foundation::POINT;
#[cfg(windows)]
use windows::Win32::Graphics::Gdi::{GetMonitorInfoW, MonitorFromPoint, MONITORINFO, MONITOR_DEFAULTTONEAREST};
#[cfg(windows)]
use windows::Win32::UI::WindowsAndMessaging::GetCursorPos;

pub struct MonitorInfo {
    pub left: i32,
    pub top: i32,
    pub width: i32,
    pub height: i32,
}

#[cfg(windows)]
pub fn get_cursor_and_monitor() -> Option<(POINT, MonitorInfo)> {
    unsafe {
        let mut pt = POINT { x: 0, y: 0 };
        if GetCursorPos(&mut pt).is_err() {
            return None;
        }

        let hmonitor = MonitorFromPoint(pt, MONITOR_DEFAULTTONEAREST);
        if hmonitor.is_invalid() {
            return None;
        }

        let mut mi = MONITORINFO {
            cbSize: std::mem::size_of::<MONITORINFO>() as u32,
            ..Default::default()
        };

        if GetMonitorInfoW(hmonitor, &mut mi).as_bool() {
            let left = mi.rcMonitor.left;
            let top = mi.rcMonitor.top;
            let width = mi.rcMonitor.right - mi.rcMonitor.left;
            let height = mi.rcMonitor.bottom - mi.rcMonitor.top;

            Some((
                pt,
                MonitorInfo {
                    left,
                    top,
                    width,
                    height,
                },
            ))
        } else {
            None
        }
    }
}

#[cfg(not(windows))]
pub fn get_cursor_and_monitor() -> Option<((i32, i32), MonitorInfo)> {
    None
}

pub fn start_edge_detector(app: AppHandle, state_machine: Arc<Mutex<DockStateMachine>>) {
    thread::spawn(move || {
        loop {
            thread::sleep(Duration::from_millis(50));

            #[cfg(windows)]
            if let Some((cursor, monitor)) = get_cursor_and_monitor() {
                // Top activation zone: within top 4 pixels of the active monitor
                let in_top_zone = cursor.y <= monitor.top + 4
                    && cursor.x >= monitor.left
                    && cursor.x <= monitor.left + monitor.width;

                let mut sm = state_machine.lock().unwrap();
                let next_state = if in_top_zone {
                    sm.on_cursor_in_edge()
                } else {
                    sm.on_cursor_outside()
                };

                if let Some(state) = next_state {
                    drop(sm); // Release lock before emitting and interacting with window
                    handle_state_transition(&app, state, &monitor);
                }
            }
        }
    });
}

pub fn handle_state_transition(app: &AppHandle, state: DockState, monitor: &MonitorInfo) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = app.emit("dock:state-changed", state);

        match state {
            DockState::Preview => {
                // Center window horizontally at the top of the monitor
                let win_width = 1120.0;
                let x = monitor.left as f64 + (monitor.width as f64 - win_width) / 2.0;
                let y = monitor.top as f64;
                let _ = window.set_position(tauri::Position::Physical(tauri::PhysicalPosition {
                    x: x as i32,
                    y: y as i32,
                }));
                let _ = window.show();
                let _ = window.set_ignore_cursor_events(false);
            }
            DockState::Opening | DockState::Open => {
                let _ = window.show();
                let _ = window.set_ignore_cursor_events(false);
                let _ = window.set_focus();
            }
            DockState::Hidden => {
                let _ = window.set_ignore_cursor_events(true);
            }
            DockState::Closing => {
                // Closing animation will run in frontend, then emit dock:closed to hide
            }
        }
    }
}
