package diplomski.event.producer.config;

import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaAdmin;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaTopicConfig {

    @Value("${kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${kafka.clickstream.topic-name}")
    private String clickstreamTopicName;

    @Bean
    public KafkaAdmin kafkaAdmin() {
        Map<String, Object> kafkaAdminConfig = new HashMap<>();
        kafkaAdminConfig.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        return new KafkaAdmin(kafkaAdminConfig);
    }

    @Bean
    public NewTopic eventTopic() {
        return new NewTopic(clickstreamTopicName, 1, (short) 1);
    }
}
