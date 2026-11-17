package com.example.kelani_media.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class DotenvLoader {

    private static final Logger log = LoggerFactory.getLogger(DotenvLoader.class);
    private static boolean loaded = false;

    public static synchronized void load() {
        if (loaded) {
            return;
        }

        Path workingDirectory = Paths.get("").toAbsolutePath();
        Path[] candidateDirs = new Path[]{
                workingDirectory.resolve("kelani-media").resolve("backend"),
                workingDirectory.resolve("backend"),
                workingDirectory
        };

        for (Path dir : candidateDirs) {
            if (!Files.isRegularFile(dir.resolve("pom.xml"))) {
                continue;
            }

            File envFile = dir.resolve(".env").toFile();
            if (envFile.exists() && envFile.isFile()) {
                try {
                    List<String> lines = Files.readAllLines(envFile.toPath(), StandardCharsets.UTF_8);
                    int count = 0;
                    for (String line : lines) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        if (eqIdx > 0) {
                            String key = line.substring(0, eqIdx).trim();
                            String value = line.substring(eqIdx + 1).trim();
                            if ((value.startsWith("\"") && value.endsWith("\"")) ||
                                (value.startsWith("'") && value.endsWith("'"))) {
                                value = value.substring(1, value.length() - 1);
                            }

                            System.setProperty(key, value);

                            switch (key) {
                                case "MONGODB_URI" -> {
                                    System.setProperty("spring.data.mongodb.uri", value);
                                }
                                case "MONGODB_DATABASE" ->
                                        System.setProperty("spring.data.mongodb.database", value);
                                case "SERVER_PORT" -> System.setProperty("server.port", value);
                                case "JWT_SECRET" -> System.setProperty("app.jwt.secret", value);
                                case "JWT_EXPIRATION" -> System.setProperty("app.jwt.expiration", value);
                                case "CORS_ALLOWED_ORIGINS" -> System.setProperty("app.cors.allowed-origins", value);
                            }
                            count++;
                        }
                    }

                    log.info("Loaded {} environment variables directly from: {}", count, envFile.getAbsolutePath());
                    loaded = true;
                    return;
                } catch (Exception e) {
                    log.warn("Failed to read .env from {}: {}", envFile.getAbsolutePath(), e.getMessage());
                }
            }
        }

        log.info("No .env file found in search paths.");
    }
}
