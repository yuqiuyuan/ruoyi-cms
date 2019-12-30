/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50722
Source Host           : 127.0.0.1:3306
Source Database       : ry_plus

Target Server Type    : MYSQL
Target Server Version : 50722
File Encoding         : 65001

Date: 2019-12-30 23:36:27
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for cms_article_template
-- ----------------------------
DROP TABLE IF EXISTS `cms_article_template`;
CREATE TABLE `cms_article_template` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) DEFAULT NULL COMMENT '文章模板名称',
  `tags` varchar(255) DEFAULT NULL COMMENT '标签',
  `user_id` varchar(50) DEFAULT NULL COMMENT '用户ID',
  `user_name` varchar(50) DEFAULT NULL COMMENT '用户名称',
  `content` text COMMENT '内容',
  `share_type` varchar(50) DEFAULT NULL COMMENT '共享类型',
  `weight` int(11) DEFAULT NULL COMMENT '权重',
  `hot_falg` smallint(6) DEFAULT NULL COMMENT '最热',
  `new_flag` smallint(6) DEFAULT NULL COMMENT '最新',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `audit` smallint(6) DEFAULT NULL COMMENT '审核标志',
  `audit_time` datetime DEFAULT NULL COMMENT '审核时间',
  `audit_by` varchar(50) DEFAULT NULL COMMENT '审核人',
  `audit_name` varchar(50) DEFAULT NULL COMMENT '审核人名称',
  `audit_reason` varchar(255) DEFAULT NULL COMMENT '原因',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
