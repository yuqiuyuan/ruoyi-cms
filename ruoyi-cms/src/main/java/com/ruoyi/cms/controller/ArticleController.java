package com.ruoyi.cms.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import cn.hutool.core.util.RandomUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ruoyi.cms.domain.ArticleModel;
import com.ruoyi.cms.domain.Tags;
import com.ruoyi.cms.service.ITagsService;
import com.ruoyi.common.core.text.Convert;
import com.ruoyi.common.exception.BusinessException;
import com.ruoyi.common.utils.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.cms.domain.Article;
import com.ruoyi.cms.service.IArticleService;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;

/**
 * 文章管理Controller
 * 
 * @author wujiyue
 * @date 2019-10-28
 */
@Controller
@RequestMapping("/cms/article")
public class ArticleController extends BaseController
{
    private String prefix = "cms/article";

    @Autowired
    private IArticleService articleService;
    @Autowired
    private ITagsService tagsService;
    @RequiresPermissions("cms:article:view")
    @GetMapping()
    public String article()
    {
        return prefix + "/article";
    }

    /**
     * 查询文章管理列表
     */
    @RequiresPermissions("cms:article:list")
    @PostMapping("/list")
    @ResponseBody
    public TableDataInfo list(Article article)
    {
        startPage();
        List<Article> list = articleService.selectArticleList(article);
        return getDataTable(list);
    }

    /**
     * 导出文章管理列表
     */
    @RequiresPermissions("cms:article:export")
    @PostMapping("/export")
    @ResponseBody
    public AjaxResult export(Article article)
    {
        List<Article> list = articleService.selectArticleList(article);
        ExcelUtil<Article> util = new ExcelUtil<Article>(Article.class);
        return util.exportExcel(list, "article");
    }

    /**
     * 新增文章管理
     */
    @GetMapping("/add")
    public String add(ModelMap mmap)
    {
        List<Tags> tags=tagsService.selectTagsAll();
        mmap.put("tags",tags);
        return prefix + "/add";
    }

    /**
     * 新增保存文章管理
     */
    @RequiresPermissions("cms:article:add")
    @Log(title = "文章管理", businessType = BusinessType.INSERT)
    @PostMapping("/add")
    @ResponseBody
    public AjaxResult addSave(Article article)
    {
        return toAjax(articleService.insertArticle(article));
    }

    /**
     * 修改文章管理
     */
    @GetMapping("/edit/{id}")
    public String edit(@PathVariable("id") String id, ModelMap mmap)
    {
        Article article = articleService.selectArticleById(id);
        mmap.put("article", article);
        String tagIds=article.getTags();
        List<Tags> tags= tagsService.selectSelectedTagsAll(tagIds);
        mmap.put("tags", tags);
        return prefix + "/edit";
    }

    /**
     * 修改保存文章管理
     */
    @RequiresPermissions("cms:article:edit")
    @Log(title = "文章管理", businessType = BusinessType.UPDATE)
    @PostMapping("/edit")
    @ResponseBody
    public AjaxResult editSave(Article article)
    {
        return toAjax(articleService.updateArticle(article));
    }

    /**
     * 删除文章管理
     */
    @RequiresPermissions("cms:article:remove")
    @Log(title = "文章管理", businessType = BusinessType.DELETE)
    @PostMapping( "/remove")
    @ResponseBody
    public AjaxResult remove(String ids)
    {
        return toAjax(articleService.deleteArticleByIds(ids));
    }

    @RequestMapping ("/detail/{id}")
    public String article_detail(@PathVariable String id, Model model){

        Article article= articleService.selectArticleById(id);
        if(article==null){
            throw new BusinessException("您要访问的文章不存在!");
        }
        String article_model=  article.getArticleModel();//文章模型
        if(ArticleModel.DUOGUYU.getVal().equals(article_model)){
            List<Tags> fullTabs=tagsService.selectBlogTabs();
            model.addAttribute("fullTabs",fullTabs);
            String tagIds=article.getTags();
            if(StringUtils.isNotEmpty(tagIds)){
                String[] arr= Convert.toStrArray(tagIds);
                List<Tags> tagsList=new ArrayList<Tags>();
                Tags tmp=null;
                for(String tid:arr){
                    //检测每个标签再数据库cms_tag表中是否存在（根据名称），如果存在记下id，不存在则新增并记下id
                    tmp=tagsService.selectTagsById(Long.valueOf(tid));
                    if(tmp!=null){
                        tagsList.add(tmp);
                    }
                }
                model.addAttribute("tagsList",tagsList);//这个值用于输出模板文件的标签
            }
            Map dataMap= JSONObject.parseObject(JSON.toJSONString(article),Map.class);
            model.addAllAttributes(dataMap);

        }else{

        }
        return prefix+"/article-duoguyu";

    }
}
