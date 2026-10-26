package com.aksara.controller;

import com.aksara.model.Poem;
import com.aksara.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AksaraApiController {

    // Database in-memory sederhana tanpa data default
    private final Map<String, User> userDatabase = new ConcurrentHashMap<>();

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody User request) {
        if (request.getUsername() == null || request.getUsername().length() < 3) {
            return ResponseEntity.badRequest().body("Username minimal 3 karakter.");
        }
        if (userDatabase.containsKey(request.getUsername().toLowerCase())) {
            return ResponseEntity.badRequest().body("Username sudah terdaftar.");
        }

        request.setUsername(request.getUsername().toLowerCase());
        request.setRepos(new HashMap<>());
        request.setTrash(new HashMap<>());
        userDatabase.put(request.getUsername(), request);
        return ResponseEntity.ok(request);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        String username = creds.get("username").toLowerCase();
        String password = creds.get("password");

        User user = userDatabase.get(username);
        if (user == null || !user.getPassword().equals(password)) {
            return ResponseEntity.status(401).body("Username atau kata sandi tidak cocok.");
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/users/{username}/poems")
    public ResponseEntity<?> getPoems(@PathVariable String username) {
        User user = userDatabase.get(username.toLowerCase());
        if (user == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user.getRepos());
    }

    @PostMapping("/users/{username}/poems")
    public ResponseEntity<?> addPoem(@PathVariable String username, @RequestBody Poem poem) {
        User user = userDatabase.get(username.toLowerCase());
        if (user == null)
            return ResponseEntity.notFound().build();
        user.getRepos().put(poem.getTitle(), poem);
        return ResponseEntity.ok(poem);
    }
}