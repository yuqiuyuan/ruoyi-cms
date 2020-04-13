package com.ruoyi.cms.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

/**
 * cms模块相关配置
 *
 * @author wujiyue
 */
@Component
@PropertySource(value = {"classpath:cms.properties"})
public class CmsConfig {

    public static String mailHost;

    public static String mailPort;

    /**
     * 邮件发送服务
     */
    public static String fromEmail;
    /**
     * 邮件发送服务
     */
    public static String fromEmailPwd;

    /**
     *
     */
    public static String endpoint;
    /**
     *
     */
    public static String accessKeyId;
    /**
     *
     */
    public static String accessKeySecret;
    /**
     *
     */
    public static String bucketName;
    /**
     *
     */
    public static String objectName;


    @Value("${cms.email.host}")
    public void setMailHost(String mailHost) {
        CmsConfig.mailHost = mailHost;
    }

    @Value("${cms.email.port}")
    public void setMailPort(String mailPort) {
        CmsConfig.mailPort = mailPort;
    }

    @Value("${cms.email.fromEmail}")
    public void setFromEmail(String fromEmail) {
        CmsConfig.fromEmail = fromEmail;
    }

    @Value("${cms.email.fromEmailPwd}")
    public void setFromEmailPwd(String fromEmailPwd) {
        CmsConfig.fromEmailPwd = fromEmailPwd;
    }

    @Value("${cms.oss.endpoint}")
    public static void setEndpoint(String endpoint) {
        CmsConfig.endpoint = endpoint;
    }

    @Value("${cms.oss.accessKeyId}")
    public static void setAccessKeyId(String accessKeyId) {
        CmsConfig.accessKeyId = accessKeyId;
    }

    @Value("${cms.oss.accessKeySecret}")
    public static void setAccessKeySecret(String accessKeySecret) {
        CmsConfig.accessKeySecret = accessKeySecret;
    }

    @Value("${cms.oss.bucketName}")
    public static void setBucketName(String bucketName) {
        CmsConfig.bucketName = bucketName;
    }

    @Value("${cms.oss.objectName}")
    public static void setObjectName(String objectName) {
        CmsConfig.objectName = objectName;
    }


    public static String getMailHost() {
        return mailHost;
    }


    public static String getMailPort() {
        return mailPort;
    }


    public static String getFromEmail() {
        return fromEmail;
    }

    public static String getFromEmailPwd() {
        return fromEmailPwd;
    }

    public static String getEndpoint() {
        return endpoint;
    }


    public static String getAccessKeyId() {
        return accessKeyId;
    }


    public static String getAccessKeySecret() {
        return accessKeySecret;
    }


    public static String getBucketName() {
        return bucketName;
    }


    public static String getObjectName() {
        return objectName;
    }


}
