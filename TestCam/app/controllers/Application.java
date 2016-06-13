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
    
    // ファイル保持用マップ
    private static final Map<String, File> imageFileMap = new HashMap<String, File>();
    
    // ファイル格納パス
    private static final String FILE_NAME_FORMAT = Play.applicationPath + "/tmp/%s";
    
    public static void index() {
        render();
    }
    
    // スナップショット情報の受取
    public static void postImage(final String imgBase) {
        try {
            Logger.info(imgBase);
            
            // 受け取った値のヘッダ部分を削除
            final String base64Value = imgBase.replace("data:image/jpeg;base64,", "");
            
            // Base64デコードを噛ましてバイト化
            final byte[] imageBytes = Base64.getDecoder().decode(base64Value);
            
            final File file = new File(currentFileName());
            
            try (FileOutputStream os = new FileOutputStream(file)) {
                // 受け取ったバイト値をファイル書き込み
                IOUtils.write(imageBytes, os);
                
                // ファイルをstaticに保持させた
                setImage(request.remoteAddress, file);
            }
        }
        catch (final IOException e) {
            Logger.error(e, "エラー");
            renderJSON(PostImageDto.errors(e));
        }
        renderJSON(new PostImageDto());
    }
    
    // staticに保持しているキーの一覧を返す
    public static void getImagesList() {
        renderJSON(new GetImageDto(getKeys()));
    }
    
    // staticに保持しているファイルの内容を返す
    public static void getImage(final String client) {
        renderBinary(imageFileMap.get(client));
    }
    
    // ファイル名を生成
    private static String currentFileName() {
        final File folder = getClientFolder(request.remoteAddress);
        if (!folder.exists()) {
            folder.mkdirs();
        }
        return String.format(FILE_NAME_FORMAT,
                             request.remoteAddress + "/" + System.currentTimeMillis() + ".jpg");
    }
    
    // ファイルを格納するフォルダの生成
    private static File getClientFolder(final String address) {
        final String folerName = String.format(FILE_NAME_FORMAT, address);
        return new File(folerName);
    }
    
    // ファイルをstatic領域に格納
    private static synchronized void setImage(final String client, final File file) {
        if (imageFileMap.containsKey(client) && Config.isOldFileDelete()) {
            deleteFiles(client);
        }
        imageFileMap.put(client, file);
    }
    
    // ファイルを削除
    private static void deleteFiles(final String client) {
        final File file = imageFileMap.get(client);
        if (file == null) {
            return;
        }
        file.delete();
    }
    
    // キー一覧の取得
    private static synchronized List<String> getKeys() {
        final List<String> list = imageFileMap.keySet().stream().collect(toList());
//                                              .filter((key) -> !StringUtils.equals(key,
//                                                                                   request.remoteAddress))
//                                              .collect(Collectors.toList());
        return list;
    }
}
