/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50722
Source Host           : localhost:3306
Source Database       : ry_plus

Target Server Type    : MYSQL
Target Server Version : 50722
File Encoding         : 65001

Date: 2019-12-21 11:42:40
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for blog_theme
-- ----------------------------
DROP TABLE IF EXISTS `blog_theme`;
CREATE TABLE `blog_theme` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL COMMENT '主题名称',
  `code` varchar(50) DEFAULT NULL COMMENT '主题代码',
  `cover_img` varchar(255) DEFAULT NULL COMMENT '封面图片',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `create_by` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of blog_theme
-- ----------------------------
INSERT INTO `blog_theme` VALUES ('1', 'Avatar响应式博客模版主题', 'avatar', '/images/cover/1561132050443308.jpg', '2019-12-21 08:55:00', 'ry');
INSERT INTO `blog_theme` VALUES ('2', '葡萄资讯模板主题，葡萄内容管理系统模板主题', 'pnews', '/images/cover/201903051436106979.jpg', '2019-12-21 08:55:31', 'ry');
INSERT INTO `blog_theme` VALUES ('3', '“pblog”个性博客模版主题，PT-CMS模版主题，免费下载', 'pblog', '/images/cover/pblog.jpg', '2019-12-21 08:55:58', 'ry');
