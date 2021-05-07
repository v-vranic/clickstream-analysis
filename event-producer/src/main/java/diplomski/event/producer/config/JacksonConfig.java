package diplomski.event.producer.config;

import com.fasterxml.jackson.dataformat.avro.AvroMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {
    
    @Bean 
    public AvroMapper avroMapper() {
        return new AvroMapper();
    }
}
