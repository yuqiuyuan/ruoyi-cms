package com.ruoyi.cms.util;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.ruoyi.common.config.Global;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.poi.util.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageOutputStream;

import java.awt.image.BufferedImage;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
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
            BufferedImage image = renderer.renderImageWithDPI(0, 0.5f);
            ByteArrayOutputStream imageOutputStream = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", imageOutputStream);
            return imageOutputStream.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * pdf 首页转换成图片 字节数组形式输出
     *
     * @param content pdf bytes
     * @return img bytes
     */
    public static int getPages(byte[] content) {
        InputStream input = new ByteArrayInputStream(content);
        PDDocument doc;
        try {
            doc = PDDocument.load(input);
            return doc.getPages().getCount();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                input.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return 0;
    }

    public static byte[] pdf2imgFromBytes(byte[] content, int i) {
        InputStream input = new ByteArrayInputStream(content);
        PDDocument doc = null;
        try {
            doc = PDDocument.load(input);
            PDFRenderer renderer = new PDFRenderer(doc);
            BufferedImage image = renderer.renderImage(i, 2.5f);
            ByteArrayOutputStream imageOutputStream = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", imageOutputStream);
            return imageOutputStream.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (doc != null) {
                try {
                    doc.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }


    public static byte[] getPdfBytes(String url) throws IOException {
        URL urlConet = new URL(URLEncoder.encode(url));
        HttpURLConnection con = (HttpURLConnection) urlConet.openConnection();
        con.setRequestMethod("GET");
        con.setConnectTimeout(4 * 100000);
        InputStream inStream = con.getInputStream();    //通过输入流获取图片数据
        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        byte[] buffer = new byte[2048];
        int len = 0;
        while ((len = inStream.read(buffer)) != -1) {
            outStream.write(buffer, 0, len);
        }
        inStream.close();
        byte[] data = outStream.toByteArray();
        return data;
    }


    public static byte[] ossContent(InputStream is) throws IOException {
        ByteArrayOutputStream byteStream = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int ch;
        while ((ch = is.read(buffer)) != -1) {
            byteStream.write(buffer, 0, ch);
        }
        byte data[] = byteStream.toByteArray();
        byteStream.close();
        return data;
    }
}
