package models.dto.util;

import org.apache.commons.lang3.*;

import play.*;

public class Config {
    
    private static final String OLD_FILE_DELETE = "old.file.delete";
    
    public static boolean isOldFileDelete() {
        return StringUtils.equals("1", oldFileDelete());
    }
    
    private static String oldFileDelete() {
        return Play.configuration.getProperty(OLD_FILE_DELETE, "1");
    }
}
