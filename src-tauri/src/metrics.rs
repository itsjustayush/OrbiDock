use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use sysinfo::System;
use tauri::{AppHandle, Emitter};

#[cfg(windows)]
use windows::Win32::System::Power::{GetSystemPowerStatus, SYSTEM_POWER_STATUS};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemMetrics {
    pub cpu_usage: f32,
    pub memory_used_gb: f32,
    pub memory_total_gb: f32,
    pub memory_percent: f32,
    pub battery_percent: Option<u8>,
    pub is_charging: bool,
    pub is_ac_online: bool,
    pub uptime_secs: u64,
}

impl Default for SystemMetrics {
    fn default() -> Self {
        Self {
            cpu_usage: 12.5,
            memory_used_gb: 7.8,
            memory_total_gb: 16.0,
            memory_percent: 48.7,
            battery_percent: Some(85),
            is_charging: false,
            is_ac_online: true,
            uptime_secs: 14200,
        }
    }
}

pub fn get_battery_info() -> (Option<u8>, bool, bool) {
    #[cfg(windows)]
    unsafe {
        let mut status = SYSTEM_POWER_STATUS::default();
        if GetSystemPowerStatus(&mut status).is_ok() {
            let percent = if status.BatteryLifePercent <= 100 {
                Some(status.BatteryLifePercent)
            } else {
                None
            };
            let is_charging = (status.BatteryFlag & 8) != 0;
            let is_ac_online = status.ACLineStatus == 1;
            return (percent, is_charging, is_ac_online);
        }
    }
    (Some(88), false, true)
}

pub fn collect_metrics(sys: &mut System) -> SystemMetrics {
    sys.refresh_cpu_usage();
    sys.refresh_memory();

    let cpu_usage = sys.global_cpu_usage();
    let used_mem = sys.used_memory() as f32 / (1024.0 * 1024.0 * 1024.0);
    let total_mem = sys.total_memory() as f32 / (1024.0 * 1024.0 * 1024.0);
    let memory_percent = if total_mem > 0.0 {
        (used_mem / total_mem) * 100.0
    } else {
        0.0
    };

    let (battery_percent, is_charging, is_ac_online) = get_battery_info();
    let uptime = System::uptime();

    SystemMetrics {
        cpu_usage,
        memory_used_gb: (used_mem * 10.0).round() / 10.0,
        memory_total_gb: (total_mem * 10.0).round() / 10.0,
        memory_percent: (memory_percent * 10.0).round() / 10.0,
        battery_percent,
        is_charging,
        is_ac_online,
        uptime_secs: uptime,
    }
}

pub fn start_metrics_service(app: AppHandle, sys: Arc<Mutex<System>>) {
    thread::spawn(move || {
        loop {
            thread::sleep(Duration::from_millis(2000));
            let metrics = {
                let mut guard = sys.lock().unwrap();
                collect_metrics(&mut guard)
            };
            let _ = app.emit("dock:metrics-updated", &metrics);
        }
    });
}
