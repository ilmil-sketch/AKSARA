package com.aksara.model;

import java.util.HashMap;
import java.util.Map;

public class User {
    private String username;
    private String password;
    private String name;
    private String bio;
    private String theme;
    private Map<String, Poem> repos = new HashMap<>();
    private Map<String, Poem> trash = new HashMap<>();

    public User() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public Map<String, Poem> getRepos() {
        return repos;
    }

    public void setRepos(Map<String, Poem> repos) {
        this.repos = repos;
    }

    public Map<String, Poem> getTrash() {
        return trash;
    }

    public void setTrash(Map<String, Poem> trash) {
        this.trash = trash;
    }
}