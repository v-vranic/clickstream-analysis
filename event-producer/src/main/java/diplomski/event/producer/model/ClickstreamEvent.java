package diplomski.event.producer.model;

import com.opencsv.bean.CsvBindByName;

public class ClickstreamEvent {
    @CsvBindByName(column = "event_time")
    String eventTime;
    @CsvBindByName(column = "event_type")
    String eventType;
    @CsvBindByName(column = "product_id")
    long productId;
    @CsvBindByName(column = "category_id")
    long categoryId;
    @CsvBindByName(column = "category_code")
    String categoryCode;
    @CsvBindByName(column = "brand")
    String brand;
    @CsvBindByName(column = "price")
    double price;
    @CsvBindByName(column = "user_id")
    long userId;
    @CsvBindByName(column = "user_session")
    String userSession;

    public String getEventTime() {
        return eventTime;
    }

    public void setEventTime(String eventTime) {
        this.eventTime = eventTime;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public long getProductId() {
        return productId;
    }

    public void setProductId(long productId) {
        this.productId = productId;
    }

    public long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getUserSession() {
        return userSession;
    }

    public void setUserSession(String userSession) {
        this.userSession = userSession;
    }

    @Override
    public String toString() {
        return "ClickstreamEvent{" + "eventTime=" + eventTime + ", eventType=" 
                + eventType + ", productId=" + productId + ", categoryId=" 
                + categoryId + ", categoryCode=" + categoryCode + ", brand=" 
                + brand + ", price=" + price + ", userId=" + userId 
                + ", userSession=" + userSession + '}';
    }
}
