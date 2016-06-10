package controllers;

import static java.util.stream.Collectors.*;

import java.io.*;
import java.util.*;

import models.dto.*;
import models.dto.util.*;

import org.apache.commons.io.*;

import play.*;
import play.mvc.*;

public class Application extends Controller {
    
    private static final Map<String, File> imageFileMap = new HashMap<String, File>();
    
    private static final String FILE_NAME_FORMAT = Play.applicationPath + "/tmp/%s";
    
    public static void index() {
        render();
    }
    
    public static void postImage(final String imgBase) {
        try {
            Logger.info(imgBase);
            final String base64Value = imgBase.replace("data:image/jpeg;base64,", "");
            final byte[] imageBytes = Base64.getDecoder().decode(base64Value);
            
            final File file = new File(currentFileName());
            try (FileOutputStream os = new FileOutputStream(file)) {
                IOUtils.write(imageBytes, os);
                setImage(request.remoteAddress, file);
            }
        }
        catch (final IOException e) {
            Logger.error(e, "エラー");
            renderJSON(PostImageDto.errors(e));
        }
        renderJSON(new PostImageDto());
    }
    
    public static void getImagesList() {
        renderJSON(new GetImageDto(getKeys()));
    }
    
    public static void getImage(final String client) {
        renderBinary(imageFileMap.get(client));
    }
    
    private static String currentFileName() {
        final File folder = getClientFolder(request.remoteAddress);
        if (!folder.exists()) {
            folder.mkdirs();
        }
        return String.format(FILE_NAME_FORMAT,
                             request.remoteAddress + "/" + System.currentTimeMillis() + ".jpg");
    }
    
    private static File getClientFolder(final String address) {
        final String folerName = String.format(FILE_NAME_FORMAT, address);
        return new File(folerName);
    }
    
    private static synchronized void setImage(final String client, final File file) {
        if (imageFileMap.containsKey(client) && Config.isOldFileDelete()) {
            deleteFiles(client);
        }
        imageFileMap.put(client, file);
    }
    
    private static void deleteFiles(final String client) {
        final File file = imageFileMap.get(client);
        if (file == null) {
            return;
        }
        file.delete();
    }
    
    private static synchronized List<String> getKeys() {
        final List<String> list = imageFileMap.keySet().stream().collect(toList());
//                                              .filter((key) -> !StringUtils.equals(key,
//                                                                                   request.remoteAddress))
//                                              .collect(Collectors.toList());
        return list;
    }
}
