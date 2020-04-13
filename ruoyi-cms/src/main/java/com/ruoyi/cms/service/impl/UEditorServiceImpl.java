package com.ruoyi.cms.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.ruoyi.cms.service.IUEditorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

/**
 * UEditorServiceImpl
 *
 * @author drebander
 * @since 2020-04-12 4:07 PM
 **/
@Slf4j
@Service
public class UEditorServiceImpl implements IUEditorService {


    @Value("${cms.oss.endpoint}")
    private String endpoint;


    @Value("${cms.oss.accessKeyId}")
    private String accessKeyId;

    @Value("${cms.oss.accessKeySecret}")
    private String accessKeySecret;

    @Value("${cms.oss.bucketName}")
    private String bucketName;

    @Value("${cms.oss.objectName}")
    private String objectName;

    @Override
    public String loadConfig() {
        Resource resource = new ClassPathResource("/static/ajax/libs/ueditor/1.4.3/jsp/config.json");
        try {
            File file = resource.getFile();
            BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
            StringBuilder buffer = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                buffer.append(line);
            }
            return JSON.parseObject(buffer.toString()).toString();
        } catch (FileNotFoundException e) {
            log.error("未找到UEditor的config配置文件~!", e);
        } catch (IOException e) {
            log.error("加载UEditor的config IO 异常~!", e);
        }
        return null;
    }

    @Override
    public String saveFile(MultipartFile upFile) {
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        // 上传Byte数组。
        byte[] content;
        try {
            content = upFile.getBytes();
            ossClient.putObject(bucketName, objectName + File.separator + upFile.getOriginalFilename(), new ByteArrayInputStream(content));
            // 关闭OSSClient。
            final String url = String.format("https://%s.%s/%s%s%s", bucketName, endpoint, objectName, File.separator, upFile.getOriginalFilename());
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("url", url);
            jsonObject.put("size", upFile.getSize());
            jsonObject.put("title", upFile.getName());
            jsonObject.put("type", upFile.getContentType());
            jsonObject.put("original", upFile.getOriginalFilename());
            jsonObject.put("state", "SUCCESS");
            return jsonObject.toJSONString();
        } catch (IOException e) {
            log.error("OSS upload file occur IO exception ~!", e);
        } finally {
            ossClient.shutdown();
        }
        return null;
    }


}
