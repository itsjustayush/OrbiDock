pub mod clipboard_service;
pub mod commands;
pub mod cursor_edge;
pub mod metrics;
pub mod state_machine;

use std::sync::{Arc, Mutex};
use sysinfo::System;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_autostart::ManagerExt;
use tauri_plugin_global_shortcut::ShortcutState;

use crate::commands::AppState;
use crate::cursor_edge::{start_edge_detector, MonitorInfo};
use crate::metrics::start_metrics_service;
use crate::state_machine::DockStateMachine;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let state_machine = Arc::new(Mutex::new(DockStateMachine::new(120, 400)));
    let system = Arc::new(Mutex::new(System::new_all()));

    let sm_clone = state_machine.clone();
    let sys_clone = system.clone();

    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--minimized"]),
        ))
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_shortcut("Ctrl+Space")
                .unwrap()
                .with_handler(move |app, shortcut, event| {
                    if shortcut.matches(tauri_plugin_global_shortcut::Modifiers::CONTROL, tauri_plugin_global_shortcut::Code::Space)
                        && event.state() == ShortcutState::Pressed
                    {
                        if let Some(state) = app.try_state::<AppState>() {
                            let mut sm = state.state_machine.lock().unwrap();
                            let next = sm.toggle();
                            drop(sm);

                            let mon = MonitorInfo {
                                left: 0,
                                top: 0,
                                width: 1920,
                                height: 1080,
                            };
                            cursor_edge::handle_state_transition(app, next, &mon);
                        }
                    }
                })
                .build(),
        )
        .manage(AppState {
            state_machine: sm_clone,
            system: sys_clone,
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_dock_state,
            commands::set_dock_state,
            commands::toggle_dock,
            commands::set_user_interacting,
            commands::get_system_metrics,
            commands::get_clipboard_data,
            commands::set_autostart_enabled,
            commands::is_autostart_enabled,
            commands::process_ai_command
        ])
        .setup(move |app| {
            // Auto-enable autolaunch on Windows startup by default
            let autostart = app.autolaunch();
            let _ = autostart.enable();

            // Setup System Tray
            let show_i = MenuItem::with_id(app, "toggle", "Toggle Orbidock (Ctrl+Space)", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "Quit Orbidock", true, None::<&str>)?;
            let tray_menu = Menu::with_items(app, &[&show_i, &quit_i])?;

            TrayIconBuilder::new()
                .menu(&tray_menu)
                .tooltip("Orbidock - Windows Dynamic Island")
                .on_menu_event(move |app, event| match event.id.as_ref() {
                    "toggle" => {
                        if let Some(state) = app.try_state::<AppState>() {
                            let mut sm = state.state_machine.lock().unwrap();
                            let next = sm.toggle();
                            drop(sm);
                            let mon = MonitorInfo {
                                left: 0,
                                top: 0,
                                width: 1920,
                                height: 1080,
                            };
                            cursor_edge::handle_state_transition(app, next, &mon);
                        }
                    }
                    "quit" => {
                        std::process::exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(state) = app.try_state::<AppState>() {
                            let mut sm = state.state_machine.lock().unwrap();
                            let next = sm.toggle();
                            drop(sm);
                            let mon = MonitorInfo {
                                left: 0,
                                top: 0,
                                width: 1920,
                                height: 1080,
                            };
                            cursor_edge::handle_state_transition(app, next, &mon);
                        }
                    }
                })
                .build(app)?;

            // Configure main window properties
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_always_on_top(true);
                let _ = window.set_skip_taskbar(true);
                let _ = window.set_decorations(false);
                let _ = window.set_ignore_cursor_events(true); // Click-through when hidden!
                let _ = window.show();
            }

            // Start background edge detector & metrics collector
            start_edge_detector(app.handle().clone(), state_machine);
            start_metrics_service(app.handle().clone(), system);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Orbidock");
}
