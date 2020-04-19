package com.ruoyi.cms.util;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.ruoyi.common.config.Global;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

/**
 * pdf 操作工具类
 *
 * @author drebander
 * @since dander
 */
@Component
@Slf4j
public class PdfHelper {


    @Value("${cms.oss.endpoint}")
    private static String endpoint;

    @Value("${cms.oss.accessKeyId}")
    private static String accessKeyId;

    @Value("${cms.oss.accessKeySecret}")
    private static String accessKeySecret;

    @Value("${cms.oss.bucketName}")
    private static String bucketName;

    @Value("${cms.oss.objectName}")
    private static String objectName;


    /**
     * pdf 首页转换成图片 字节数组形式输出
     *
     * @param content pdf bytes
     * @return img bytes
     */
    public static byte[] pdf2imgFromBytes(byte[] content) {
        InputStream input = new ByteArrayInputStream(content);
        PDDocument doc;
        try {
            doc = PDDocument.load(input);
            PDFRenderer renderer = new PDFRenderer(doc);
            BufferedImage image = renderer.renderImage(0, 1.25f);
            ByteArrayOutputStream imageOutputStream = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", imageOutputStream);
            return imageOutputStream.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

}
