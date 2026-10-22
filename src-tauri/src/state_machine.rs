use serde::{Deserialize, Serialize};
use std::time::{Duration, Instant};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum DockState {
    Hidden,
    Preview,
    Opening,
    Open,
    Closing,
}

pub struct DockStateMachine {
    current_state: DockState,
    dwell_start: Option<Instant>,
    close_trigger: Option<Instant>,
    dwell_duration: Duration,
    close_delay: Duration,
    is_user_interacting: bool,
}

impl DockStateMachine {
    pub fn new(dwell_ms: u64, close_delay_ms: u64) -> Self {
        Self {
            current_state: DockState::Hidden,
            dwell_start: None,
            close_trigger: None,
            dwell_duration: Duration::from_millis(dwell_ms),
            close_delay: Duration::from_millis(close_delay_ms),
            is_user_interacting: false,
        }
    }

    pub fn current_state(&self) -> DockState {
        self.current_state
    }

    pub fn set_interacting(&mut self, interacting: bool) {
        self.is_user_interacting = interacting;
        if interacting {
            self.close_trigger = None;
        }
    }

    pub fn on_cursor_in_edge(&mut self) -> Option<DockState> {
        match self.current_state {
            DockState::Hidden => {
                if let Some(start) = self.dwell_start {
                    if start.elapsed() >= self.dwell_duration {
                        self.current_state = DockState::Opening;
                        self.dwell_start = None;
                        return Some(self.current_state);
                    }
                } else {
                    self.dwell_start = Some(Instant::now());
                    self.current_state = DockState::Preview;
                    return Some(self.current_state);
                }
                None
            }
            DockState::Preview => {
                if let Some(start) = self.dwell_start {
                    if start.elapsed() >= self.dwell_duration {
                        self.current_state = DockState::Opening;
                        self.dwell_start = None;
                        return Some(self.current_state);
                    }
                }
                None
            }
            DockState::Closing => {
                // User came back while closing, reopen
                self.current_state = DockState::Open;
                self.close_trigger = None;
                Some(self.current_state)
            }
            DockState::Open | DockState::Opening => {
                // Cancel any pending close
                self.close_trigger = None;
                None
            }
        }
    }

    pub fn on_cursor_outside(&mut self) -> Option<DockState> {
        match self.current_state {
            DockState::Preview => {
                // Cancel preview if cursor left before dwell finished
                self.dwell_start = None;
                self.current_state = DockState::Hidden;
                Some(self.current_state)
            }
            DockState::Open => {
                if self.is_user_interacting {
                    return None;
                }
                if let Some(leave_time) = self.close_trigger {
                    if leave_time.elapsed() >= self.close_delay {
                        self.current_state = DockState::Closing;
                        self.close_trigger = None;
                        return Some(self.current_state);
                    }
                } else {
                    self.close_trigger = Some(Instant::now());
                }
                None
            }
            _ => {
                self.dwell_start = None;
                None
            }
        }
    }

    pub fn transition_to(&mut self, next: DockState) {
        self.current_state = next;
        if next == DockState::Open || next == DockState::Hidden {
            self.dwell_start = None;
            self.close_trigger = None;
        }
    }

    pub fn toggle(&mut self) -> DockState {
        match self.current_state {
            DockState::Hidden | DockState::Preview | DockState::Closing => {
                self.current_state = DockState::Opening;
            }
            DockState::Open | DockState::Opening => {
                self.current_state = DockState::Closing;
            }
        }
        self.dwell_start = None;
        self.close_trigger = None;
        self.current_state
    }
}
