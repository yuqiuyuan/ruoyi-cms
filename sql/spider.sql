#字典

INSERT INTO `sys_dict_type` (`dict_id`, `dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('111', '爬虫任务状态', 'spider_mission_status', '0', 'admin', '2019-11-11 14:22:40', '', NULL, NULL);
INSERT INTO `sys_dict_type` (`dict_id`, `dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('112', '爬虫退出方式', 'spider_exit_way', '0', 'admin', '2019-11-11 15:01:27', '', NULL, NULL);
INSERT INTO `sys_dict_type` (`dict_id`, `dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('113', '爬虫内容提取类型', 'spider_extract_type', '0', 'admin', '2019-11-12 10:13:40', '', NULL, NULL);
INSERT INTO `sys_dict_type` (`dict_id`, `dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('114', '爬虫值处理规则', 'field_value_process_type', '0', 'admin', '2019-11-14 17:01:07', '', NULL, '爬虫字段值处理规则');

INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('140', '1', '待执行', 'wait', 'spider_mission_status', NULL, 'info', 'Y', '0', 'admin', '2019-11-11 14:23:39', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('141', '2', '执行中', 'running', 'spider_mission_status', NULL, 'success', 'N', '0', 'admin', '2019-11-11 14:24:20', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('142', '3', '完成', 'done', 'spider_mission_status', NULL, 'primary', 'N', '0', 'admin', '2019-11-11 14:25:16', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('143', '4', '错误', 'error', 'spider_mission_status', NULL, 'danger', 'N', '0', 'admin', '2019-11-11 14:26:29', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('144', '1', '默认', 'DEFAULT', 'spider_exit_way', NULL, 'default', 'Y', '0', 'admin', '2019-11-11 15:02:25', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('145', '2', '持续时间', 'DURATION', 'spider_exit_way', NULL, 'primary', 'N', '0', 'admin', '2019-11-11 15:04:01', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('146', '3', '链接计数', 'URL_COUNT', 'spider_exit_way', NULL, 'success', 'N', '0', 'admin', '2019-11-11 15:05:06', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('147', '1', 'Xpath', 'xpath', 'spider_extract_type', NULL, 'primary', 'Y', '0', 'admin', '2019-11-12 10:14:26', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('148', '2', 'Css', 'css', 'spider_extract_type', NULL, 'success', 'N', '0', 'admin', '2019-11-12 10:14:42', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('149', '3', '常量', 'constant', 'spider_extract_type', NULL, 'warning', 'N', '0', 'admin', '2019-11-12 10:15:07', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('150', '1', '替换', 'replace', 'field_value_process_type', NULL, 'primary', 'Y', '0', 'admin', '2019-11-14 17:01:32', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('151', '2', '截取之前', 'substrbefore', 'field_value_process_type', NULL, 'success', 'N', '0', 'admin', '2019-11-14 17:01:54', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('152', '3', '截取之后', 'substrafter', 'field_value_process_type', NULL, 'info', 'N', '0', 'admin', '2019-11-14 17:02:17', '', NULL, NULL);

CREATE TABLE `spider_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '爬虫配置ID',
  `spider_code` varchar(50) DEFAULT NULL COMMENT '爬虫编码',
  `spider_name` varchar(50) DEFAULT NULL COMMENT '爬虫名称',
  `entry_urls` text COMMENT '入口地址',
  `target_regex` varchar(255) DEFAULT NULL COMMENT '目标URL正则',
  `cascade` smallint(6) DEFAULT '0' COMMENT '1:级联发现url  0:只从入口页面发现url',
  `table_name` varchar(50) DEFAULT NULL COMMENT '存储的表名',
  `domain` varchar(255) DEFAULT NULL COMMENT '网站根域名',
  `charset` varchar(50) DEFAULT 'utf8' COMMENT '字符集',
  `sleep_time` int(11) DEFAULT '1000' COMMENT '睡眠时间(ms)',
  `retry_times` smallint(6) DEFAULT '1' COMMENT '重试次数',
  `thread_count` smallint(255) DEFAULT '1' COMMENT '线程数量',
  `use_proxy` smallint(6) DEFAULT '0' COMMENT '使用代理',
  `show_log` smallint(6) DEFAULT '1' COMMENT '打印日志',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of spider_config
-- ----------------------------
INSERT INTO `spider_config` VALUES ('1', 'csdn', 'csdn博客文章爬虫', 'https://blog.csdn.net/', 'https://blog.csdn.net/\\w+/article/details/\\d+', '0', null, 'blog.csdn.net', 'utf8', '1000', '2', '1', '0', '1');
INSERT INTO `spider_config` VALUES ('2', 'oschina', '开源中国博客文章爬虫配置', 'https://my.oschina.net/\r\n', 'https://my.oschina.net/.*/blog/[0-9]{1,10}', '0', null, 'oschina.net', 'utf8', '1000', '2', '1', '0', '1');
INSERT INTO `spider_config` VALUES ('3', 'cnblogs', 'cnblogs爬虫', 'https://www.cnblogs.com', 'https://www.cnblogs.com/\\w+/p/\\d+.html', '0', null, 'www.cnblogs.com', 'utf8', '1000', '2', '1', '1', '0');
INSERT INTO `spider_config` VALUES ('4', 'duoguyu', '多骨鱼站点爬虫', 'http://old.duoguyu.com/', 'http://old.duoguyu.com/\\w+/\\d+.html', '1', 'cms_article', 'old.duoguyu.com', 'utf8', '1000', '2', '1', '0', '1');

CREATE TABLE `spider_field` (
  `field_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '字段ID',
  `config_id` int(11) DEFAULT NULL COMMENT '爬虫配置ID',
  `field` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '字段',
  `field_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '字段名称',
  `extract_type` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '提取类型',
  `extract_by` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '提取规则',
  `constant_value` text CHARACTER SET utf8 COLLATE utf8_unicode_ci COMMENT '常量值',
  `extract_index` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '0' COMMENT '元素的索引',
  `process_rule_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '处理规则',
  `extract_attr_flag` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '0' COMMENT '是否是根据元素取值',
  `extract_attr` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '根据哪个元素取值',
  PRIMARY KEY (`field_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of spider_field
-- ----------------------------
INSERT INTO `spider_field` VALUES ('1', '2', 'title', '标题', 'constant', '1', '2', '3', '4', '5', '6');
INSERT INTO `spider_field` VALUES ('2', '1', 'test', 'test', 'constant', null, '123', '0', null, '0', null);
INSERT INTO `spider_field` VALUES ('3', '2', '3', '3', 'css', '3', null, '3', null, '0', null);
INSERT INTO `spider_field` VALUES ('4', '2', '22', '3', 'css', '4', null, '6', null, '1', '8');
INSERT INTO `spider_field` VALUES ('5', '2', '4', '4', 'xpath', '44', null, '0', null, '0', null);
INSERT INTO `spider_field` VALUES ('6', '1', 'title', '标题', 'css', 'h1.title-article', null, '0', null, '0', null);
INSERT INTO `spider_field` VALUES ('7', '1', 'time', '时间', 'css', 'div.artical_tag span.time', null, '0', null, '0', null);
INSERT INTO `spider_field` VALUES ('8', '1', 'content', '内容', 'css', '#article_content', null, '0', null, '0', null);
INSERT INTO `spider_field` VALUES ('10', '4', 'title', '标题', 'css', '.textGrid .textBox h1', null, '0', null, '0', null);
INSERT INTO `spider_field` VALUES ('11', '4', 'content', '文章正文', 'css', '.articleContent  .articleDetail', null, '0', null, '0', null);
INSERT INTO `spider_field` VALUES ('12', '4', 'cover_image', '封面图片', 'css', '.fullPitch.list.detail', null, '0', null, '1', 'style');
INSERT INTO `spider_field` VALUES ('13', '4', 'channelSiteInfo', '频道来源信息', 'css', '.copyInfo .mt10 p', null, '1', null, '0', null);
INSERT INTO `spider_field` VALUES ('14', '4', 'copyInfo', '来源', 'css', '.copyInfo', null, '0', null, '0', null);
INSERT INTO `spider_field` VALUES ('15', '4', 'authorInfo', '作者信息', 'css', '.moreInfo', null, '0', null, '0', null);
INSERT INTO `spider_field` VALUES ('16', '4', 'title', '标题', 'css', '.leftGrid > div > div.articleContent > div.articleImg > div.textBox > h1', null, '0', null, '0', null);
INSERT INTO `spider_field` VALUES ('17', '4', 'cover_image', '封面图片', 'css', '.articleImg div.img', null, '0', null, '1', 'style');
INSERT INTO `spider_field` VALUES ('18', '4', 'tag', '标签', 'css', '.footerInfo a.iconSpan', null, '0,1,2,3,4,5', null, '0', null);
INSERT INTO `spider_field` VALUES ('19', '4', 'extra1', '源站点名称', 'css', '.copyInfo > div > p:nth-child(1) > a', null, '0', null, '1', 'data-site-name');
INSERT INTO `spider_field` VALUES ('20', '4', 'extra2', '源站链接', 'css', '.copyInfo > div > p:nth-child(1) > a', null, '0', null, '1', 'data-href');
INSERT INTO `spider_field` VALUES ('21', '4', 'author', '作者', 'css', '/html/body/div[2]/div[2]/div/div/span[1]/html()', null, '0', null, '0', null);
INSERT INTO `spider_field` VALUES ('22', '4', 'author', '作者', 'css', '.moreInfo span', null, '0', null, '0', null);
INSERT INTO `spider_field` VALUES ('23', '4', 'articleModel', '文章模型', 'constant', null, 'duoguyu', '0', null, '0', null);

CREATE TABLE `spider_filed_rule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `field_id` varchar(50) DEFAULT NULL COMMENT '字段ID',
  `process_type` varchar(50) DEFAULT NULL COMMENT '数据处理规则',
  `replaceReg` text COMMENT '替换正则',
  `replacement` varchar(255) DEFAULT NULL COMMENT '替换内容',
  `substr_target` varchar(50) DEFAULT NULL COMMENT '截取字符串目标',
  `sort` int(11) DEFAULT NULL COMMENT '排序',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of spider_filed_rule
-- ----------------------------
INSERT INTO `spider_filed_rule` VALUES ('3', '11', 'replace', '<img src=\"/', '<img src=\"http://old.duoguyu.com/', null, '1');
INSERT INTO `spider_filed_rule` VALUES ('4', '12', 'replace', 'background:url(/', 'background:url(http://old.duoguyu.com/', null, '1');
INSERT INTO `spider_filed_rule` VALUES ('5', '12', 'substrafter', null, null, '(', '2');
INSERT INTO `spider_filed_rule` VALUES ('6', '12', 'substrbefore', null, null, ')', '3');
INSERT INTO `spider_filed_rule` VALUES ('7', '13', 'replace', '?form=duoguyu.com', null, null, '2');
INSERT INTO `spider_filed_rule` VALUES ('8', '13', 'replace', 'class=\"channelSite jumpHref\">\\[ 查看原文 \\]', 'id=\"channelSite\" class=\"iconChannelSite jumpHref\">', null, '1');
INSERT INTO `spider_filed_rule` VALUES ('9', '14', 'replace', '?form=duoguyu.com', null, null, '1');
INSERT INTO `spider_filed_rule` VALUES ('10', '20', 'replace', '?form=duoguyu.com', null, null, '1');
INSERT INTO `spider_filed_rule` VALUES ('11', '17', 'replace', 'background:url(/', 'background:url(http://old.duoguyu.com/', null, '1');
INSERT INTO `spider_filed_rule` VALUES ('12', '17', 'substrafter', null, null, '(', '2');
INSERT INTO `spider_filed_rule` VALUES ('13', '17', 'substrbefore', null, null, ')', '3');

CREATE TABLE `spider_mission` (
  `mission_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '爬虫任务ID',
  `mission_name` varchar(50) DEFAULT NULL COMMENT '任务名称',
  `spider_config_id` int(11) DEFAULT NULL COMMENT '爬虫配置ID',
  `entry_urls` text COMMENT '入口地址',
  `status` varchar(50) DEFAULT NULL COMMENT '任务状态',
  `start_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `time_cost` mediumtext COMMENT '爬取时间(单位秒)',
  `exit_way` varchar(50) DEFAULT NULL COMMENT '退出方式。DEFAULT，DURATION，URL_COUNT。',
  `exit_way_count` int(11) DEFAULT NULL COMMENT '退出方式值',
  `success_num` int(11) DEFAULT NULL COMMENT '爬取数量',
  `cookie_str` text,
  `header_str` text,
  `dept_id` varchar(255) DEFAULT NULL COMMENT '部门ID',
  `user_id` varchar(255) DEFAULT NULL COMMENT '用户ID',
  `create_by` varchar(50) DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`mission_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of spider_mission
-- ----------------------------
INSERT INTO `spider_mission` VALUES ('2', '爬取某用户csdn博客文章', '1', 'https://blog.csdn.net/u010870518/article/details/73476964', 'done', '2019-11-18 10:41:39', '2019-11-18 10:41:39', '1', 'DURATION', '30', '5', '', '', '103', '1', null, '2019-11-18 10:41:39');
INSERT INTO `spider_mission` VALUES ('3', 'cnblogs', '3', 'https://www.cnblogs.com/aobing', 'done', '2019-11-13 15:26:05', '2019-11-13 15:26:12', '6', 'DEFAULT', '3', '5', null, null, '103', '1', '若依', '2019-11-13 10:52:25');
INSERT INTO `spider_mission` VALUES ('4', 'test', '3', 'https://www.cnblogs.com,https://www.cnblogs.com/dasdf,https://www.cnblogs.com/d344', 'done', '2019-11-14 13:56:59', '2019-11-14 13:56:59', '5', 'DEFAULT', '3', '3', '111', '222=33\r\n44=55\r\n222=33\r\n44=55\r\n222=33\r\n44=55\r\n222=33\r\n44=55\r\n222=33\r\n44=55\r\n222=33\r\n44=55', '103', '1', '若依', '2019-11-14 13:56:59');
INSERT INTO `spider_mission` VALUES ('5', '多骨鱼旧站', '4', 'http://old.duoguyu.com/', 'done', '2019-11-19 11:23:19', '2019-11-19 11:23:48', '28', 'URL_COUNT', '10', '10', '', '', '103', '1', '若依', '2019-11-19 11:19:46');

