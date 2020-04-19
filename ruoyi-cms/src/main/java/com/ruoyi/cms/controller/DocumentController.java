package com.ruoyi.cms.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.ruoyi.cms.domain.Article;
import com.ruoyi.cms.domain.ArticleModel;
import com.ruoyi.cms.domain.Tags;
import com.ruoyi.cms.service.IArticleService;
import com.ruoyi.cms.service.ITagsService;
import com.ruoyi.cms.util.CmsConstants;
import com.ruoyi.cms.util.PdfHelper;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.config.Global;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.core.text.Convert;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.exception.BusinessException;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.common.utils.file.FileUploadUtils;
import com.ruoyi.common.utils.file.MimeTypeUtils;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.system.service.ISysConfigService;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 文章管理Controller
 *
 * @author wujiyue
 * @date 2019-10-28
 */
@Slf4j
@Controller
@RequestMapping("/cms/document")
public class DocumentController extends BaseController {
    private String prefix = "cms/document";

    @Resource
    private IArticleService articleService;
    @Resource
    private ITagsService tagsService;

    @Resource
    private ISysConfigService configService;

    @Value("${cms.oss.endpoint}")
    private String endpoint;

    @Value("${cms.oss.accessKeyId}")
    private String accessKeyId;

    @Value("${cms.oss.accessKeySecret}")
    private String accessKeySecret;

    @Value("${cms.oss.bucketName}")
    private String bucketName;

    @Value("${cms.oss.objectName}")
    private String objectName;

    private String getEditorType() {
        return configService.selectConfigByKey(CmsConstants.KEY_EDITOR_TYPE);
    }

    @RequiresPermissions("cms:document:view")
    @GetMapping()
    public String article() {
        return prefix + "/article";
    }

    /**
     * 查询文章管理列表
     */
    @RequiresPermissions("cms:document:list")
    @PostMapping("/list")
    @ResponseBody
    public TableDataInfo list(Article article) {
        startPage();
        article.setPdfFlag(1);
        List<Article> list = articleService.selectArticleList(article);
        return getDataTable(list);
    }

    /**
     * 导出文章管理列表
     */
    @RequiresPermissions("cms:document:export")
    @PostMapping("/export")
    @ResponseBody
    public AjaxResult export(Article article) {
        List<Article> list = articleService.selectArticleList(article);
        ExcelUtil<Article> util = new ExcelUtil<Article>(Article.class);
        return util.exportExcel(list, "article");
    }

    /**
     * 新增文章管理
     */
    @GetMapping("/add")
    public String add(ModelMap mmap) {
        List<Tags> tags = tagsService.selectTagsAll();
        mmap.put("tags", tags);

        String editorType = getEditorType();
        if (CmsConstants.EDITOR_TYPE_EDITORMD.equals(editorType)) {
            return prefix + "/add_editormd";
        } else {
            return prefix + "/add";
        }
    }

    /**
     * 新增保存文章管理
     */
    @RequiresPermissions("cms:document:add")
    @Log(title = "文章管理", businessType = BusinessType.INSERT)
    @PostMapping("/add")
    @ResponseBody
    public AjaxResult addSave(Article article) {
        loadStaticUrl(article);
        return toAjax(articleService.insertArticle(article));
    }

    /**
     * 修改文章管理
     */
    @GetMapping("/edit/{id}")
    public String edit(@PathVariable("id") String id, ModelMap mmap) {
        Article article = articleService.selectArticleById(id);
        mmap.put("article", article);
        String tagIds = article.getTags();
        List<Tags> tags = tagsService.selectSelectedTagsAll(tagIds);
        mmap.put("tags", tags);
        String editorType = getEditorType();
        if (CmsConstants.EDITOR_TYPE_EDITORMD.equals(editorType)) {
            return prefix + "/edit_editormd";
        } else {
            return prefix + "/edit";
        }
    }

    /**
     * 修改保存文章管理
     */
    @RequiresPermissions("cms:document:edit")
    @Log(title = "文章管理", businessType = BusinessType.UPDATE)
    @PostMapping("/edit")
    @ResponseBody
    public AjaxResult editSave(Article article) {
        loadStaticUrl(article);
        return toAjax(articleService.updateArticle(article));
    }

    private void loadStaticUrl(Article article) {
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        final MultipartFile docUrl = article.getDocUrl();
        final MultipartFile coverImageUrl = article.getCoverImageUrl();
        try {
            if (null != docUrl) {
                final byte[] content = docUrl.getBytes();
                final long currentTimeMillis = System.currentTimeMillis();
                final String object = objectName + File.separator + "document" + File.separator + currentTimeMillis + docUrl.getOriginalFilename();
                ossClient.putObject(bucketName, object, new ByteArrayInputStream(content));
                final String url = String.format("https://%s.%s/%s", bucketName, endpoint, object);
                article.setStaticUrl(url);
                if (null == coverImageUrl) {
                    final byte[] imgBytes = PdfHelper.pdf2imgFromBytes(content);
                    final String imgObject = objectName + File.separator + "coverImage" + File.separator + currentTimeMillis + ".png";
                    ossClient.putObject(bucketName, imgObject, new ByteArrayInputStream(imgBytes));
                    final String coverImage = String.format("https://%s.%s/%s", bucketName, endpoint, imgObject);
                    article.setCoverImage(coverImage);
                }
            }
            if (null != coverImageUrl) {
                final byte[] content = coverImageUrl.getBytes();
                final long currentTimeMillis = System.currentTimeMillis();
                final String object = objectName + File.separator + "document" + File.separator + currentTimeMillis + coverImageUrl.getOriginalFilename();
                ossClient.putObject(bucketName, object, new ByteArrayInputStream(content));
                final String url = String.format("https://%s.%s/%s", bucketName, endpoint, object);
                article.setCoverImage(url);
            }
        } catch (IOException e) {
            log.error("oss 上传文件[{}]失败～！", null != docUrl ? docUrl.getOriginalFilename() : "获取文件名失败~!", e);
        } finally {
            ossClient.shutdown();
        }
    }

    /**
     * 删除文章管理
     */
    @RequiresPermissions("cms:document:remove")
    @Log(title = "文章管理", businessType = BusinessType.DELETE)
    @PostMapping("/remove")
    @ResponseBody
    public AjaxResult remove(String ids) {
        return toAjax(articleService.deleteArticleByIds(ids));
    }

    @RequestMapping("/detail/{id}")
    public String article_detail(@PathVariable String id, Model model) {
        Article article = articleService.selectArticleById(id);
        if (article == null) {
            throw new BusinessException("您要访问的文章不存在!");
        }
        Map dataMap = JSONObject.parseObject(JSON.toJSONString(article), Map.class);
        model.addAllAttributes(dataMap);
        return prefix + "/article-pdf";

    }


    /**
     * 上传图片(markdown编辑器上传图片使用)
     */
    @PostMapping("/uploadImage")
    @ResponseBody
    public Object uploadImage(@RequestParam("editormd-image-file") MultipartFile file) throws Exception {
        try {
            // 上传图片并返回新文件名称
            String path = FileUploadUtils.upload(Global.getUploadPath(), file, MimeTypeUtils.IMAGE_EXTENSION);
            Map map = new HashMap();
            map.put("success", 1);
            map.put("url", path);
            map.put("message", "上传成功!");
            return map;
        } catch (Exception e) {
            Map map = new HashMap();
            map.put("success", 0);
            map.put("url", "");
            map.put("message", "上传失败!" + e.getMessage());
            return map;
        }
    }

}
