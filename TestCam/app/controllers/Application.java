package controllers;

import static java.util.stream.Collectors.*;

import java.io.*;
import java.util.*;

import models.dto.*;
import models.dto.util.*;

import org.apache.commons.io.*;
import org.apache.commons.lang3.*;
import org.joda.time.*;

import play.*;
import play.mvc.*;

public class Application extends Controller {
    
    // ファイル保持用マップ
    private static final Map<String, File> imageFileMap = new HashMap<String, File>();
    
    // ファイル格納パス
    private static final String FILE_NAME_FORMAT = Play.applicationPath + "/logs/image/%s";
    
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
                setImage(remoteAddr(), file);
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
    
    // キーを保持しているかどうかを返す
    public static void hasImage(final String client) {
        if (!imageFileMap.containsKey(client)) {
            renderJSON(HasImageDto.errors());
        }
        final File file = imageFileMap.get(client);
        final long time = System.currentTimeMillis() - file.lastModified();
        if (time > 300000) {
            deleteFiles(client);
            renderJSON(HasImageDto.errors());
        }
        renderJSON(HasImageDto.success());
    }
    
    // staticに保持しているファイルの内容を返す
    public static void getImage(final String client) {
        renderBinary(imageFileMap.get(client));
    }
    
    // ファイル名を生成
    private static String currentFileName() {
        final String remoteAddr = remoteAddr();
        final File clientDir = getClientDir(remoteAddr);
        if (!clientDir.exists()) {
            clientDir.mkdirs();
        }
        final DateTime now = DateTime.now();
        final File timeDir = getTimeDir(clientDir, now);
        if (!timeDir.exists()) {
            timeDir.mkdirs();
        }
        
        return timeDir.getAbsolutePath() + "/" + now.toString("HH_mm_ss") + ".jpg";
    }
    
    // 時間毎のディレクトリ作成
    private static File getTimeDir(final File parentDir, final DateTime now) {
        final String timeStr = now.toString("yyyyMMdd");
        return new File(parentDir.getAbsolutePath() + "/" + timeStr);
    }
    
    // ファイルを格納するディレクトリ作成
    private static File getClientDir(final String address) {
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
        if (!imageFileMap.containsKey(client)) {
            return;
        }
        
        final File file = imageFileMap.get(client);
        if (file == null) {
            return;
        }
        file.delete();
        imageFileMap.remove(client);
    }
    
    // キー一覧の取得
    private static synchronized List<String> getKeys() {
        final List<String> list = imageFileMap.keySet().stream().collect(toList());
//                                              .filter((key) -> !StringUtils.equals(key,
//                                                                                   request.remoteAddress))
//                                              .collect(Collectors.toList());
        return list;
    }
    
    private static String remoteAddr() {
        String key = request.remoteAddress;
        
        if (StringUtils.contains(key, ":")) {
            key = StringUtils.replace(key, ":", "");
        }
        return key;
    }
}
