package diplomski.event.producer.task;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import diplomski.event.producer.service.EventService;
import org.springframework.boot.CommandLineRunner;

@Component
public class EventProducerRunner implements CommandLineRunner {

    private static final Logger logger
            = LoggerFactory.getLogger(EventProducerRunner.class);

    @Value("${file1}")
    private String file1;

    @Value("${file2}")
    private String file2;
    
    @Value("${clickstreamEvent.avro.schema}")
    private String clickstreamEventSchema;

    @Value("${file2.numRecords}")
    private int numRecords;
    
    @Value("${file2.skipRecords:0}")
    private int skipRecords;
    
    @Autowired
    private EventService eventService;

    @Override
    public void run(String... args) {
         eventService.createClickstreamFromFile(file1, clickstreamEventSchema);
        // eventService.createNewFileFromExisting(file1, file2, numRecords, skipRecords);
    }
}
