package org.backend.taskpilot_ai.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoConfig {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Value("${spring.data.mongodb.database:taskpilot}")
    private String databaseName;

    @Bean
    @ConditionalOnMissingBean
    public MongoClient mongoClient() {
        System.out.println("🔗 Initializing MongoDB Client with URI: " + maskSensitiveUri(mongoUri));
        try {
            MongoClient client = MongoClients.create(mongoUri);
            System.out.println("✅ MongoClient created successfully");
            return client;
        } catch (Exception e) {
            System.err.println("❌ Failed to create MongoClient: " + e.getMessage());
            e.printStackTrace();
            // Don't fail fast - allow application to start and retry connection later
            System.err.println("⚠️  MongoDB connection will be retried on demand");
            return null;
        }
    }

    @Bean
    @ConditionalOnMissingBean
    public MongoTemplate mongoTemplate(MongoClient mongoClient) {
        if (mongoClient == null) {
            System.err.println("⚠️  MongoClient is null - MongoDB not available");
            return null;
        }
        try {
            MongoTemplate template = new MongoTemplate(mongoClient, databaseName);
            System.out.println("✅ MongoDB Template initialized successfully for database: " + databaseName);
            return template;
        } catch (Exception e) {
            System.err.println("❌ Failed to create MongoTemplate: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private String maskSensitiveUri(String uri) {
        if (uri == null) return "NOT_PROVIDED";
        // Mask password in logs
        return uri.replaceAll("(://[^:]+:)[^@]+(@)", "$1***$2");
    }
}


