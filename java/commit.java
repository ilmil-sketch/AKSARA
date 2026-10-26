package com.aksara.model;

public class Commit {
    private String timestamp;
    private String titleVersion;
    private String content;
    private String message;

    public Commit() {
    }

    public Commit(String timestamp, String titleVersion, String content, String message) {
        this.timestamp = timestamp;
        this.titleVersion = titleVersion;
        this.content = content;
        this.message = message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getTitleVersion() {
        return titleVersion;
    }

    public void setTitleVersion(String titleVersion) {
        this.titleVersion = titleVersion;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}