package com.ruoyi.cms.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 文章管理对象 cms_article
 *
 * @author wujiyue
 * @date 2019-10-28
 */

@EqualsAndHashCode(callSuper = true)
@Data
public class Article extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 主键，文章ID
     */
    private String id;

    /**
     * 作者
     */
    @Excel(name = "作者")
    private String yhid;

    /**
     * 推荐到哪个专区。比如：头条、精选、最新、热门、评论最多等
     */
    @Excel(name = "推荐到哪个专区。比如：头条、精选、最新、热门、评论最多等")
    private String articleRegion;

    /**
     * 原文作者
     */
    @Excel(name = "原文作者")
    private String author;

    /**
     * 发布时间
     */
    @Excel(name = "发布时间")
    private String publishTime;

    /**
     * 文章标题
     */
    @Excel(name = "文章标题")
    private String title;

    /**
     * 关键词
     */
    @Excel(name = "关键词")
    private String keywords;

    /**
     * 摘要
     */
    @Excel(name = "摘要")
    private String description;

    /**
     * 封面图片
     */
    @Excel(name = "封面图片")
    private String coverImage;

    /**
     * 文章模型
     */
    @Excel(name = "文章模型")
    private String articleModel;

    /**
     * 转载标志
     */
    @Excel(name = "转载标志")
    private Integer copyFlag;

    /**
     * pdf标志
     */
    @Excel(name = "pdf标志")
    private Integer pdfFlag;

    /**
     * 频道栏目ID
     */
    @Excel(name = "频道栏目ID")
    private String categoryId;

    /**
     * 个人分类，多个用逗号分隔
     */
    @Excel(name = "个人分类，多个用逗号分隔")
    private String personalCategory;

    /**
     * 原始链接
     */
    @Excel(name = "原始链接")
    private String link;

    /**
     * 静态化后url
     */
    @Excel(name = "静态化后url")
    private String staticUrl;

    /**
     * 标签
     */
    @Excel(name = "标签")
    private String tags;

    /**
     * 点击数
     */
    @Excel(name = "点击数")
    private Long hit;

    /**
     * 回复数
     */
    @Excel(name = "回复数")
    private Long replyNum;

    /**
     * 点赞数
     */
    @Excel(name = "点赞数")
    private Long upVote;

    /**
     * 差评数
     */
    @Excel(name = "差评数")
    private Long downVote;

    /**
     * 热点标志
     */
    @Excel(name = "热点标志")
    private Integer hotFlag;

    /**
     * 页数
     */
    @Excel(name = "页数")
    private Integer pageSize;

    /**
     * 新增标志
     */
    @Excel(name = "新增标志")
    private Integer newFlag;

    /**
     * 是否开启评论
     */
    @Excel(name = "是否开启评论")
    private String commentFlag;

    /**
     * 置顶标志
     */
    @Excel(name = "置顶标志")
    private Integer topFlag;

    /**
     * 收藏数
     */
    @Excel(name = "收藏数")
    private Long favourite;

    /**
     * 趴取任务的ID
     */
    @Excel(name = "趴取任务的ID")
    private String missionId;

    /**
     * 生成静态页面的模板(cms_template表中的name)
     */
    @Excel(name = "生成静态页面的模板(cms_template表中的name)")
    private String templateName;

    /**
     * 状态标志
     */
    @Excel(name = "状态标志")
    private Integer available;

    /**
     * 删除标志
     */
    @Excel(name = "删除标志")
    private Integer deleted;

    /**
     * 附加字段1
     */
    @Excel(name = "附加字段1")
    private String extra1;

    /**
     * 附加字段2
     */
    @Excel(name = "附加字段2")
    private String extra2;

    /**
     * 附加字段3
     */
    @Excel(name = "附加字段3")
    private String extra3;

    /**
     * 文章内容
     */
    private String content;

    /**
     * 文章markdown源码
     */
    private String contentMarkdownSource;

    /**
     * 扩展字段。标签名称
     */
    private String tagsName;
    /**
     * 栏目分类
     */
    private Category category;
    /**
     * 扩展字段
     */
    private List<Tags> tagList;
    /**
     * 扩展字段，存放一个标签id
     */
    private String tag;
    /**
     * 扩展字段
     */
    private String extraName;

    /**
     * 前端上传的文档地址对象
     */
    private MultipartFile docUrl;
    /**
     * 前端上传的封面地址对象
     */
    private MultipartFile coverImageUrl;

}
