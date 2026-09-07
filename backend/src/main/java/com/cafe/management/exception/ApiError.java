package com.cafe.management.exception;

import java.time.LocalDateTime;
import java.util.List;

public class ApiError {
    private int status;
    private String error;
    private String message;
    private String path;
    private List<String> details;
    private LocalDateTime timestamp;

    public ApiError() {}

    public ApiError(int status, String error, String message, String path, List<String> details, LocalDateTime timestamp) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.details = details;
        this.timestamp = timestamp;
    }

    public static ApiErrorBuilder builder() {
        return new ApiErrorBuilder();
    }

    public static class ApiErrorBuilder {
        private int status;
        private String error;
        private String message;
        private String path;
        private List<String> details;
        private LocalDateTime timestamp;

        public ApiErrorBuilder status(int status) { this.status = status; return this; }
        public ApiErrorBuilder error(String error) { this.error = error; return this; }
        public ApiErrorBuilder message(String message) { this.message = message; return this; }
        public ApiErrorBuilder path(String path) { this.path = path; return this; }
        public ApiErrorBuilder details(List<String> details) { this.details = details; return this; }
        public ApiErrorBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public ApiError build() {
            return new ApiError(status, error, message, path, details, timestamp);
        }
    }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public List<String> getDetails() { return details; }
    public void setDetails(List<String> details) { this.details = details; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
