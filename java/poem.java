package com.aksara.model;

import java.util.List;

public class Poem {
    private String title;
    private List<String> tags;
    private List<Commit> commits;

    public Poem() {
    }

    public Poem(String title, List<String> tags, List<Commit> commits) {
        this.title = title;
        this.tags = tags;
        this.commits = commits;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<Commit> getCommits() {
        return commits;
    }

    public void setCommits(List<Commit> commits) {
        this.commits = commits;
    }
}