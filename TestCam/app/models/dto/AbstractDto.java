package models.dto;

public abstract class AbstractDto {
    public boolean result;
    public String errorMessage;
    
    public AbstractDto() {
        this.result = true;
        this.errorMessage = "";
    }
    
}
