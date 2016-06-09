package models.dto;

import java.util.*;

public class GetImageDto extends AbstractDto {
    
    public List<String> accessorList;
    
    public GetImageDto(final List<String> accessorList) {
        super();
        this.accessorList = accessorList;
    }
    
    public static GetImageDto errors(final Throwable e) {
        final GetImageDto dto = new GetImageDto(Collections.EMPTY_LIST);
        dto.result = false;
        dto.errorMessage = e.getMessage();
        return dto;
    }
}
