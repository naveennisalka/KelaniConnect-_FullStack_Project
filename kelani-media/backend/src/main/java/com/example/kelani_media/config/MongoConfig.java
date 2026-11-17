package com.example.kelani_media.config;

import com.mongodb.ConnectionString;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.mongodb.autoconfigure.MongoClientSettingsBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MongoConfig {

    private static final Logger log = LoggerFactory.getLogger(MongoConfig.class);

    @Value("${MONGODB_URI:${spring.data.mongodb.uri:mongodb://localhost:27017/kelaniMedia}}")
    private String connectionUri;

    @Value("${MONGODB_DATABASE:${spring.data.mongodb.database:kelaniMedia}}")
    private String defaultDatabase;

    @Bean
    public MongoClientSettingsBuilderCustomizer mongoClientCustomizer() {
        return builder -> {
            String resolvedUri = connectionUri;
            ConnectionString connectionString = new ConnectionString(connectionUri);
            if (connectionString.getDatabase() == null || connectionString.getDatabase().isBlank()) {
                if (resolvedUri.contains("?")) {
                    resolvedUri = resolvedUri.replace("?", defaultDatabase + "?");
                } else if (resolvedUri.endsWith("/")) {
                    resolvedUri = resolvedUri + defaultDatabase + "?retryWrites=true&w=majority";
                } else {
                    resolvedUri = resolvedUri + "/" + defaultDatabase + "?retryWrites=true&w=majority";
                }
            }

            String masked = resolvedUri.contains("@")
                    ? resolvedUri.substring(0, resolvedUri.indexOf("://") + 3) + "***:***@" + resolvedUri.substring(resolvedUri.lastIndexOf("@") + 1)
                    : resolvedUri;
            log.info("Configuring MongoClient with connection URI: {}", masked);
            builder.applyConnectionString(new ConnectionString(resolvedUri));
        };
    }
}
