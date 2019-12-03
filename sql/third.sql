
#
INSERT INTO `sys_dict_type` (`dict_id`, `dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('109', '百度推送类型', 'baidu_push_type', '0', 'admin', '2019-10-12 17:55:24', 'admin', '2019-10-12 17:55:24', NULL);

INSERT INTO `sys_dict_type` (`dict_id`, `dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('100', '人工智能识别类型', 'ai_type', '0', 'admin', '2019-10-12 17:55:24', 'ry', '2019-10-28 20:05:34', NULL);

INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('100', '1', '人脸检测', 'faceDetect', 'ai_type', NULL, NULL, 'Y', '0', 'admin', '2019-10-12 17:57:10', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('101', '2', '植物识别', 'plant', 'ai_type', NULL, NULL, 'Y', '0', 'admin', '2019-10-12 17:57:25', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('102', '3', '银行卡识别', 'bankCard', 'ai_type', NULL, NULL, 'Y', '0', 'admin', '2019-10-12 17:57:37', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('103', '4', '身份证识别', 'idCard', 'ai_type', NULL, NULL, 'Y', '0', 'admin', '2019-10-12 17:57:48', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('104', '5', '车牌号识别', 'plate', 'ai_type', NULL, NULL, 'Y', '0', 'admin', '2019-10-12 17:58:01', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('105', '6', '驾驶证识别', 'driver', 'ai_type', NULL, NULL, 'Y', '0', 'admin', '2019-10-12 17:58:14', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('106', '7', '动物识别', 'animal', 'ai_type', NULL, NULL, 'Y', '0', 'admin', '2019-10-12 17:58:26', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('107', '8', '车型识别', 'car', 'ai_type', '', '', 'Y', '0', 'admin', '2019-10-12 17:58:43', 'admin', '2019-10-12 17:58:58', '');
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('108', '9', '菜品识别', 'dish', 'ai_type', NULL, NULL, 'Y', '0', 'admin', '2019-10-12 17:59:09', '', NULL, NULL);
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('109', '10', '通用文字识别', 'general_basic', 'ai_type', NULL, NULL, 'Y', '0', 'admin', '2019-10-12 17:59:21', '', NULL, NULL);

INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('135', '1', '推送', 'urls', 'baidu_push_type', '', 'primary', 'Y', '0', 'admin', '2018-03-16 11:33:00', 'ry', '2018-03-16 11:33:00', '待审核状态');
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('136', '2', '更新', 'update', 'baidu_push_type', '', 'info', 'N', '0', 'admin', '2018-03-16 11:33:00', 'ry', '2018-03-16 11:33:00', '待审核状态');
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('137', '3', '删除', 'del', 'baidu_push_type', '', 'danger', 'N', '0', 'admin', '2018-03-16 11:33:00', 'ry', '2018-03-16 11:33:00', '待审核状态');



CREATE TABLE `third_ai_his` (
  `id` varchar(50) NOT NULL COMMENT 'ID',
  `yhid` varchar(50) DEFAULT NULL COMMENT '用户ID',
  `yhmc` varchar(50) DEFAULT NULL COMMENT '用户名称',
  `ai_type` varchar(50) DEFAULT NULL COMMENT '类型',
  `type_name` varchar(50) DEFAULT NULL COMMENT '类型名称',
  `result` varchar(20) DEFAULT NULL COMMENT '结果1成功0失败',
  `error_msg` text COMMENT '错误信息',
  `json_result` text COMMENT '请求结果',
  `create_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '请求时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `third_sms_his` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `yhid` varchar(50) DEFAULT NULL COMMENT '用户ID',
  `yhmc` varchar(50) DEFAULT NULL COMMENT '用户名称',
  `carrieroperator` varchar(50) DEFAULT NULL COMMENT '运营商',
  `phone` varchar(45) DEFAULT NULL COMMENT '手机号',
  `content` varchar(500) DEFAULT NULL COMMENT '内容',
  `returncode` varchar(200) DEFAULT NULL COMMENT '返回码',
  `createTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
