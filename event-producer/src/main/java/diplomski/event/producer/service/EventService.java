package diplomski.event.producer.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.dataformat.avro.AvroMapper;
import com.fasterxml.jackson.dataformat.avro.AvroSchema;
import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import com.opencsv.exceptions.CsvFieldAssignmentException;
import diplomski.event.producer.model.ClickstreamEvent;
import java.io.File;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Iterator;
import java.util.Random;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import org.springframework.util.concurrent.FailureCallback;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.SuccessCallback;

@Service
public class EventService {

    @Value("${kafka.clickstream.topic-name}")
    private String clickstreamTopicName;

    @Value("${kafka.event-send-max-interval:0}")
    private int maxSendInterval;

    @Autowired
    private KafkaTemplate<String, byte[]> kafkaTemplate;
    
    @Autowired
    private AvroMapper avroMapper;

    private static final Logger logger
            = LoggerFactory.getLogger(EventService.class);

    public void createClickstreamFromFile(String srcFile, String schemaFile) {
        try ( CSVReader csvReader = new CSVReader(new FileReader(srcFile))) {
            AvroSchema schema = null;
            try {
                schema = avroMapper.schemaFrom(new File(schemaFile));
            } catch (IOException e) {
                logger.error("Error reading Avro schema file");
                return;
            }
            CsvToBean<ClickstreamEvent> csvToBean
                    = new CsvToBeanBuilder(csvReader)
                            .withType(ClickstreamEvent.class).build();
            Iterator<ClickstreamEvent> clickEventIterator = csvToBean.iterator();
            logger.info("Starting to read clickstream data from file");
            Random rnd = new Random();
            while (clickEventIterator.hasNext()) {
                ClickstreamEvent clickEvent = clickEventIterator.next();
                try {
                    logger.info("Mapping record: " + clickEvent.toString());
                    clickEvent.setEventTime(
                        this.getISOString(clickEvent.getEventTime())
                    );
                    byte[] clickEventBytes = avroMapper.writer(schema)
                        .writeValueAsBytes(clickEvent);
                    this.sendEventToTopic(clickEvent, clickEventBytes);
                } catch (JsonProcessingException e) {
                    logger.error("Error mapping record. "
                            + "Skipping record: " + 
                            clickEvent.toString(), e);
                    continue;
                } catch (RuntimeException e) {
                    logger.error("Error formatting event time. Skipping event: "
                            + clickEvent.toString(), e);
                    continue;
                }
                if (maxSendInterval > 0) {
                    int delay = rnd.nextInt(maxSendInterval) + 1;
                    try {
                        Thread.sleep(delay * 1000);
                    } catch (InterruptedException e) {
                        logger.error("Thread interrupted.", e);
                        Thread.currentThread().interrupt();
                    }
                }
            }
        } catch (IOException e) {
            logger.error("Error creating clickstream from file", e);
        }
    }

    public void createNewFileFromExisting(String srcFile, String dstFile,
            int numRecords, int skipRecords) {
        try ( CSVReader csvReader = new CSVReader(new FileReader(srcFile));  CSVWriter csvWriter = new CSVWriter(new FileWriter(dstFile))) {
            CsvToBean<ClickstreamEvent> csvToBean
                    = new CsvToBeanBuilder(csvReader)
                            .withType(ClickstreamEvent.class).build();
            StatefulBeanToCsv<ClickstreamEvent> beanToCsv
                    = new StatefulBeanToCsvBuilder(csvWriter).build();
            Iterator<ClickstreamEvent> clickEventIterator = csvToBean.iterator();
            int count = 0;
            while (clickEventIterator.hasNext() && count < skipRecords) {
                ClickstreamEvent clickEvent = clickEventIterator.next();
                logger.info("Skipping record: " + clickEvent.toString());
                count++;
            }
            while (clickEventIterator.hasNext() && count < (skipRecords + numRecords)) {
                ClickstreamEvent clickEvent = clickEventIterator.next();
                beanToCsv.write(clickEvent);
                logger.info("Processed record: " + clickEvent.toString());
                count++;
            }
            logger.info("New file was created");
        } catch (FileNotFoundException e) {
            logger.error("File not found", e);
        } catch (CsvFieldAssignmentException e) {
            logger.error("Error writing records to csv file", e);
        } catch (IOException e) {
            logger.error("Error reading from csv file", e);
        }
    }

    public void sendEventToTopic(ClickstreamEvent event, byte[] eventBytes) {
        ListenableFuture<SendResult<String, byte[]>> future
                = kafkaTemplate.send(clickstreamTopicName, eventBytes);
        future.addCallback(new SuccessCallback<SendResult<String, byte[]>>() {
            @Override
            public void onSuccess(SendResult<String, byte[]> result) {
                logger.info(event.toString() + " sent to: "
                        + clickstreamTopicName);
            }
        }, new FailureCallback() {
            @Override
            public void onFailure(Throwable ex) {
                logger.error(event.toString() + " not sent to: "
                        + clickstreamTopicName, ex);
            }
        });
    }

    private String getISOString(String dateTime) {
        LocalDateTime localDateTime = LocalDateTime.parse(
                dateTime, 
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss zzz")
        );
        OffsetDateTime offsetDateTime = localDateTime.atOffset(ZoneOffset.UTC);
        return offsetDateTime.toString();
    }
}
