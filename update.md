## 更新日志
## 2019年12月30日
1. admin模块新增系统事件功能

## 2019年12月29日
1. 后台首页页面可配置选择（可在sys_config表中配置admin.index.type项来指定编辑器可选项有index和index_topMenu）；index_topMenu页面是今天新增的一级菜单在顶部显示。

![输入图片说明](https://images.gitee.com/uploads/images/2019/1229/171832_04f9f4b7_528854.jpeg "2.jpg")

sys_config表:
INSERT INTO `sys_config` (`config_id`, `config_name`, `config_key`, `config_value`, `config_type`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('17', '后台首页', 'admin.index.type', 'index_topMenu', 'Y', 'admin', '2018-03-16 11:33:00', 'admin', '2019-10-10 13:41:12', '后台首页类型。可选的index/index_topMenu');

## 2019年12月28日
1. 文章管理增加markdown文本编辑器支持（可在sys_config表中配置editor.type项来指定编辑器可选项有editormd和ueditor）

![输入图片说明](https://images.gitee.com/uploads/images/2019/1228/140012_6a7f9677_528854.jpeg "markdown.jpg")

sys_config表:
INSERT INTO `sys_config` (`config_id`, `config_name`, `config_key`, `config_value`, `config_type`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('16', '编辑器类型', 'editor.type', 'editormd', 'Y', 'admin', '2018-03-16 11:33:00', 'admin', '2019-10-10 13:41:12', '默认为空 可选有editormd/ueditor');

## 2019年12月25日
1. 新增登陆页面配置功能
2. 新增登录页管理功能

![输入图片说明](https://images.gitee.com/uploads/images/2019/1225/133117_8a40e33f_528854.jpeg "process.jpg")
可在sys_config表中配置login.page项来指定登录页面

sys_config表:
INSERT INTO `sys_config` (`config_id`, `config_name`, `config_key`, `config_value`, `config_type`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('15', '登录页面', 'login.page', 'process', 'Y', 'admin', '2018-03-16 11:33:00', 'admin', '2019-10-10 13:41:12', '默认为空 可选有process/');

cms_login_page表:
CREATE TABLE `cms_login_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL COMMENT '登录主题名称',
  `code` varchar(50) DEFAULT NULL COMMENT '页面代码',
  `cover_img` varchar(255) DEFAULT NULL COMMENT '封面图片',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `create_by` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


INSERT INTO `cms_login_page` VALUES ('1', '默认', 'default', '/images/loginPage/default.jpg', '2019-12-24 10:54:32', 'ry');
INSERT INTO `cms_login_page` VALUES ('2', 'process', 'process', '/images/loginPage/process.jpg', '2019-12-24 10:54:32', 'ry');
## 2019年12月23日
1. 更新：文章新增和编辑页面增加栏目选择项

![输入图片说明](https://images.gitee.com/uploads/images/2019/1223/081455_947bcf30_528854.jpeg "1.jpg")
![输入图片说明](https://images.gitee.com/uploads/images/2019/1223/081510_cff21afd_528854.jpeg "2.jpg")

2. 完善ruoyi-oss模块功能
![输入图片说明](https://images.gitee.com/uploads/images/2019/1223/140718_717c64ba_528854.jpeg "1.jpg")

 **sys_config表sql:** 
INSERT INTO `sys_config` (`config_id`, `config_name`, `config_key`, `config_value`, `config_type`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('4', 'oss存储配置', 'sys.oss.cloudStorage', '{\"type\":1,\"qiniuDomain\":\"http://832s18.s3-cn-south-1.qiniucs.com\",\"qiniuPrefix\":\"upload\",\"qiniuAccessKey\":\"RmWBeMWWW5L_8hVtzqHjRBLnN1GrrldgxvL1SUdT\",\"qiniuSecretKey\":\"qFasmo516ADBxCKA2lwOzphx5FCXlYKa3GNXKuS6\",\"qiniuBucketName\":\"media\",\"aliyunDomain\":\"\",\"aliyunPrefix\":\"\",\"aliyunEndPoint\":\"\",\"aliyunAccessKeyId\":\"\",\"aliyunAccessKeySecret\":\"\",\"aliyunBucketName\":\"\",\"qcloudDomain\":\"\",\"qcloudPrefix\":\"\",\"qcloudSecretId\":\"\",\"qcloudSecretKey\":\"\",\"qcloudBucketName\":\"\",\"qcloudRegion\":\"\"}', 'Y', 'admin', '2018-03-16 11:33:00', 'ry', '2019-10-10 13:41:12', 'oss存储配置(七牛，阿里，腾讯三选一)');
 **sys_menu表sql:** 
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `url`, `target`, `menu_type`, `visible`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('2005', 'OSS文件管理', '1', '10', '/system/oss', 'menuItem', 'C', '0', 'system:oss:view', '#', 'admin', '2018-11-16 13:59:45', 'admin', '2019-12-23 14:03:43', '');

## 2019年12月22日

1. 新增websocket模块
2. pblog博客主题新增在线人数展示
3. 后台新增消息群发页面

![输入图片说明](https://images.gitee.com/uploads/images/2019/1222/192113_c6f37838_528854.jpeg "1.jpg")
![输入图片说明](https://images.gitee.com/uploads/images/2019/1222/192202_43f42552_528854.jpeg "2.jpg")

菜单sql:

INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `url`, `target`, `menu_type`, `visible`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('3097', '消息群发', '3', '4', '/notice', 'menuItem', 'C', '0', 'notice', '#', 'admin', '2019-12-22 15:17:46', '', NULL, '');


## 2019年12月21日

1. 优化:新增切换博客主题模板功能。
2. 新增：博客主题管理功能。

菜单sql:
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `url`, `target`, `menu_type`, `visible`, `perms`, `icon`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('3096', '博客主题', '2025', '1', '/cms/blogTheme', 'menuItem', 'C', '0', 'cms:blogTheme:view', '#', 'admin', '2019-12-21 08:50:08', '', NULL, '');

CREATE TABLE `blog_theme` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL COMMENT '主题名称',
  `code` varchar(50) DEFAULT NULL COMMENT '主题代码',
  `cover_img` varchar(255) DEFAULT NULL COMMENT '封面图片',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `create_by` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

INSERT INTO `blog_theme` VALUES ('1', 'Avatar响应式博客模版主题', 'avatar', '/images/cover/1561132050443308.jpg', '2019-12-21 08:55:00', 'ry');
INSERT INTO `blog_theme` VALUES ('2', '葡萄资讯模板主题，葡萄内容管理系统模板主题', 'pnews', '/images/cover/201903051436106979.jpg', '2019-12-21 08:55:31', 'ry');
INSERT INTO `blog_theme` VALUES ('3', '“pblog”个性博客模版主题，PT-CMS模版主题，免费下载', 'pblog', '/images/cover/pblog.jpg', '2019-12-21 08:55:58', 'ry');
