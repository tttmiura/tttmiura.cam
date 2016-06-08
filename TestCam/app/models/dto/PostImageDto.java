package models.dto;

public class PostImageDto {
    public boolean result;
    public String errorMessage;
    
    public PostImageDto() {
        this.result = true;
        this.errorMessage = "";
    }
    
    public static PostImageDto errors(final Throwable e) {
        final PostImageDto dto = new PostImageDto();
        dto.result = false;
        dto.errorMessage = e.getMessage();
        return dto;
    }
}
