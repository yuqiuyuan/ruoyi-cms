


INSERT INTO  `sys_config` (`config_id`, `config_name`, `config_key`, `config_value`, `config_type`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('4', 'oss�洢����', 'sys.oss.cloudStorage', '{\"type\":1,\"qiniuDomain\":\"http://832s18.s3-cn-south-1.qiniucs.com\",\"qiniuPrefix\":\"upload\",\"qiniuAccessKey\":\"RmWBeMWWW5L_8hVtzqHjRBLnN1GrrldgxvL1SUdT\",\"qiniuSecretKey\":\"qFasmo516ADBxCKA2lwOzphx5FCXlYKa3GNXKuS6\",\"qiniuBucketName\":\"media\",\"aliyunDomain\":\"\",\"aliyunPrefix\":\"\",\"aliyunEndPoint\":\"\",\"aliyunAccessKeyId\":\"\",\"aliyunAccessKeySecret\":\"\",\"aliyunBucketName\":\"\",\"qcloudDomain\":\"\",\"qcloudPrefix\":\"\",\"qcloudSecretId\":\"\",\"qcloudSecretKey\":\"\",\"qcloudBucketName\":\"\",\"qcloudRegion\":\"\"}', 'Y', 'admin', '2018-03-16 11:33:00', 'ry', '2019-10-10 13:41:12', 'oss�洢����(��ţ�������Ѷ��ѡһ)');

DROP TABLE IF EXISTS `sys_oss`;
CREATE TABLE `sys_oss` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(64) NOT NULL DEFAULT '' COMMENT '文件名',
  `file_suffix` varchar(10) NOT NULL DEFAULT '' COMMENT '文件后缀名',
  `url` varchar(200) NOT NULL COMMENT 'URL地址',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `create_by` varchar(64) NOT NULL DEFAULT '' COMMENT '上传人',
  `service` tinyint(2) NOT NULL DEFAULT '1' COMMENT '服务商',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COMMENT='文件上传';
