package models.dto;

public class PostImageDto extends AbstractDto {
    
    public PostImageDto() {
        super();
    }
    
    public static PostImageDto errors(final Throwable e) {
        final PostImageDto dto = new PostImageDto();
        dto.result = false;
        dto.errorMessage = e.getMessage();
        return dto;
    }
}
