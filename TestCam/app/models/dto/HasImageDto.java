package models.dto;

public class HasImageDto extends AbstractDto {
    
    public HasImageDto() {
        super();
    }
    
    public static HasImageDto errors() {
        final HasImageDto dto = new HasImageDto();
        dto.result = false;
        dto.errorMessage = "該当のイメージはありません。";
        return dto;
    }
    
    public static HasImageDto success() {
        return new HasImageDto();
    }
}
