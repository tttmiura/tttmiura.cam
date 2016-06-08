package controllers;

import java.io.*;
import java.util.*;

import models.dto.*;

import org.apache.commons.io.*;

import play.*;
import play.mvc.*;

public class Application extends Controller {
    
    public static void index() {
        render();
    }
    
    public static void postImage(final String imgBase) {
        try {
            Logger.info(imgBase);
            final String base64Value = imgBase.replace("data:image/jpeg;base64,", "");
            final byte[] imageBytes = Base64.getDecoder().decode(base64Value);
            
            final String fileName = Play.applicationPath
                    + "/tmp/"
                    + System.currentTimeMillis()
                    + ".jpg";
            IOUtils.write(imageBytes, new FileOutputStream(new File(fileName)));
        }
        catch (final IOException e) {
            Logger.error(e, "エラー");
            renderJSON(PostImageDto.errors(e));
        }
        renderJSON(new PostImageDto());
    }
}
