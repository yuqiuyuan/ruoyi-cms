package com.ruoyi.blog.controller;


import cn.hutool.cache.Cache;
import cn.hutool.cache.CacheUtil;
import cn.hutool.core.collection.CollectionUtil;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.model.GetObjectRequest;
import com.aliyun.oss.model.OSSObject;
import com.github.pagehelper.PageInfo;
import com.ruoyi.cms.domain.*;
import com.ruoyi.cms.mapper.PdfDetailMapper;
import com.ruoyi.cms.service.*;
import com.ruoyi.cms.util.CmsConstants;
import com.ruoyi.cms.util.PdfHelper;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.exception.BusinessException;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.Guid;
import com.ruoyi.common.utils.IpUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.system.service.ISysConfigService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 广告位Controller
 *
 * @author wujiyue
 * @date 2019-11-16
 */
@Slf4j
@Controller
@RequestMapping("/blog")
public class BlogController extends BaseController {

  private static final String prefix = "blog/theme";
  //private static final String theme="/pnews";
  //private static final String theme="/pblog";
  //private static final String theme="/avatar";
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

  @Resource
  PdfDetailMapper pdfDetailMapper;

  @Autowired
  private IArticleService articleService;

  @Autowired
  private IAlbumService albumService;
  @Autowired
  private ICommentService commentService;

  @Autowired
  private ITagsService tagsService;
  @Autowired
  private ICategoryService categoryService;
  @Autowired
  private IResourceService resourceService;
  @Autowired
  private ISysConfigService configService;
  @Autowired
  private ILinkTypeService linkTypeService;
  @Autowired
  private ILinkService linkService;
  @Autowired
  private IBlogThemeService blogThemeService;

  private static Cache<String, Integer> articleViewCache = CacheUtil.newLRUCache(1000, 1000 * 60 * 60);
  private static Cache<String, Integer> articleUpVoteCache = CacheUtil.newLRUCache(1000, 1000 * 60 * 60);
  private static Cache<String, Integer> commentUpVoteCache = CacheUtil.newLRUCache(1000, 1000 * 60 * 60);
  private static Cache<String, Map> bannerCache = CacheUtil.newTimedCache(1000 * 60 * 60);

  private static Cache<String, Object> blogCache = CacheUtil.newTimedCache(1000 * 60 * 60 * 3);

  private String getTheme () {
    return configService.selectConfigByKey(CmsConstants.KEY_BLOG_THEME);
  }

  /**
   * 首页
   *
   * @param model 模型
   * @return result
   */
  @GetMapping({"/", "", "/index"})
  public String index (Model model) {
    model.addAttribute("pageUrl", "blog/index");
    model.addAttribute("categoryId", "index");

    Article form = new Article();
    startPage();
    List<Article> articles = articleService.selectArticlesRegionNotNull(form);
    model.addAttribute("pageNo", new PageInfo(articles).getPageNum());
    model.addAttribute("pageSize", new PageInfo(articles).getPageSize());
    model.addAttribute("totalPages", new PageInfo(articles).getPages());
    model.addAttribute("articleList", articles);
    return prefix + "/" + getTheme() + "/index";
  }

  /**
   * 首页
   *
   * @param model
   * @return
   */
  @GetMapping({"/h5page"})
  public String h5page (Model model) {
//        model.addAttribute("pageUrl", "blog/index");
//        model.addAttribute("categoryId", "index");

//    Article form = new Article();
//    startPage();
//    List<Article> articles = articleService.selectArticlesRegionNotNull(form);
//    model.addAttribute("pageNo", new PageInfo(articles).getPageNum());
//    model.addAttribute("pageSize", new PageInfo(articles).getPageSize());
//    model.addAttribute("totalPages", new PageInfo(articles).getPages());
//    model.addAttribute("articleList", articles);
    return "h5page/index";
  }

  /**
   * 首页
   *
   * @param model
   * @return
   */
  @GetMapping({"/h5page/pdfDeal/{articleId}"})
  @ResponseBody
  public String pdfDeal (Model model, @PathVariable("articleId") String articleId) {
    Article q = new Article();
    q.setId(articleId);
    List<Article> articles = articleService.selectArticleList(q);
    OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
    try {
      articles.forEach(article -> {
        log.info("{} 处理中。。。", article.getTitle());
        String[] url = article.getStaticUrl().split("/");
        OSSObject object = ossClient
            .getObject(new GetObjectRequest(bucketName, objectName + File.separator + "document" + File.separator + url[url.length - 1]));
        try {
          byte[] pdfBytes = PdfHelper.ossContent(object.getObjectContent());
          addPdfDetail(ossClient, UUID.randomUUID().toString(), article.getId(), pdfBytes);
        } catch (IOException e) {
          e.printStackTrace();
        }
        log.info("{} 处理完成", article.getTitle());
      });
    } catch (Exception e) {
      log.error("{}处理异常", "", e);
    } finally {
      ossClient.shutdown();
    }
    return "处理完成";
  }

  private String appandDocument (PdfDetail pdfDetail) {
    StringBuilder result = new StringBuilder();
    result.append("<div class=\"panel pagemodel\" data-page=\"").append(pdfDetail.getCurRecords()).append("\">");
    result.append("<div id = \"page1\" >");
    result.append("<img th:src = \"").append(pdfDetail.getUrl()).append("\" data - imgid = \"1\" style = \"transform: scale(1);\" ></div >");
    result.append("<div class=\"pageNum\" >");
    result.append("<text th:text = \"").append(pdfDetail.getCurRecords());
    result.append("\" ></text >/");
    result.append("<text th:text = \"").append(pdfDetail.getTotalRecords()).append("\" ></text >页");
    result.append("</div ></div >");
    return result.toString();
  }


  @GetMapping("/h5page/search")
  public String h5search (String content, Model model) {
    model.addAttribute("content", content);
    Article form = new Article();
    if (!ObjectUtils.isEmpty(content)) {
      form.setTitle(content.trim());
      form.setDescription(content.trim());
    }
    startPage();
    List<Article> articles = articleService.fuzzySearchList(form);
    if (!ObjectUtils.isEmpty(content)) {
      hightLight(content, articles);
    }
    PageInfo pageInfo = new PageInfo(articles);
    model.addAttribute("searchKey", content);
    model.addAttribute("total", pageInfo.getTotal());
    model.addAttribute("pageNo", pageInfo.getPageNum());
    model.addAttribute("pageSize", pageInfo.getPageSize());
    model.addAttribute("totalPages", pageInfo.getPages());
    model.addAttribute("hasPrevious", pageInfo.isHasPreviousPage());
    model.addAttribute("hasNext", pageInfo.isHasNextPage());
    model.addAttribute("currentPage", pageInfo.getPageNum());
    model.addAttribute("prePage", pageInfo.getPrePage());
    model.addAttribute("nextPage", pageInfo.getNextPage());
    model.addAttribute("navNums", pageInfo.getNavigatepageNums());
    model.addAttribute("articleList", articles);
    return "h5page/list";
  }

  @PostMapping("/h5page/search/p")
  @ResponseBody
  public AjaxResult h5searchP (String content) {
    Article form = new Article();
    if (!ObjectUtils.isEmpty(content)) {
      form.setTitle(content.trim());
      form.setDescription(content.trim());
    }
    startPage();
    List<Article> articles = articleService.fuzzySearchList(form);
    PageInfo pageInfo = new PageInfo(articles);
    Map<String, Object> model = new HashMap<>();
    model.put("totalPages", pageInfo.getTotal());
    model.put("hasNext", pageInfo.isHasNextPage());
    model.put("dataHtml", appandHtml(articles));
    return AjaxResult.success(model);
  }

  private void addPdfDetail (OSS ossClient, String originalFilename, String articleId, byte[] content) {
    int rows = PdfHelper.getPages(content);
    for (int i = 0; i < rows; i++) {
      byte[] bytes = PdfHelper.pdf2imgFromBytes(content, i);
      String url = uploadToOss(ossClient, originalFilename, bytes, i);
      PdfDetail pdfDetail = new PdfDetail();
      pdfDetail.setCurRecords(i);
      pdfDetail.setTotalRecords(rows);
      pdfDetail.setUrl(url);
      pdfDetail.setArticleId(articleId);
      pdfDetail.setId(Guid.get());
      pdfDetailMapper.insertPdfDetail(pdfDetail);
    }
  }

  private String uploadToOss (OSS ossClient, String originFilename, byte[] content, int i) {
    final String object = objectName + File.separator + "document" + File.separator + originFilename + "-" + i;
    ossClient.putObject(bucketName, object, new ByteArrayInputStream(content));
    return String.format("https://%s.%s/%s", bucketName, endpoint, object);
  }

  private String appandHtml (List<Article> articles) {
    StringBuilder result = new StringBuilder();
    if (articles.size() > 0) {
      articles.forEach(article -> {
        String description = article.getDescription();
        if (description.length() > 46) {
          description = article.getDescription().substring(0, 46) + "...";
        }
        String curHtml = "<a href=/blog/h5page/detail/" + article.getId() + " target=\"_self\">"
            + "<dl class=\"clear\"><dt>"
            + "<div class=\"bookPic\">"
            + "<img alt=\"" + article.getTitle() + "\" src=\"" + article.getCoverImage() + "\">"
            + "<span class=\"bookPage\">5</span>"
            + "</div></dt>" + "</div>"
            + "<dd class=\"bookTitle\" >" + article.getTitle() + "</dd>"
            + "<dd><span class=\"fch\">" + description + "</span></dd>"
            + "<dd>" + article.getHit() + "&nbsp次阅读</dd>"
            + "</dl>" + "</a>";
        result.append(curHtml);
      });
    } else {

    }
    return result.toString();
  }


  private void hightLight (String content, List<Article> articles) {
    articles.forEach(article -> {
      String title = article.getTitle();
      title.replace(content, String.format("<font size=\"3\" color=\"red\">%s</font>", content));
      article.setTitle(title);
    });
  }

  /**
   * 获取一个专辑以及其关联的素材
   */
  @PostMapping("/getIndexBanner")
  @ResponseBody
  public AjaxResult getAlbum (String code) {
    if (StringUtils.isEmpty(code)) {
      return AjaxResult.error("参数code不能为空!");
    }
    Map data = bannerCache.get(code, false);
    if (data == null) {
      data = albumService.getAlbum(code);
      bannerCache.put(code, data);
    }
    return AjaxResult.success(data);
  }


  /**
   * 文章详情
   *
   * @param model
   * @param articleId
   * @return
   */
  @GetMapping("/h5page/detail/{articleId}")
  public String h5pageDetail (HttpServletRequest request, Model model, @PathVariable("articleId") String articleId) {
    Article article = articleService.selectArticleById(articleId);
    if (article == null) {
      throw new BusinessException("该文章不存在!");
    }
    PdfDetail query = new PdfDetail();
    query.setArticleId(articleId);
    startPage(5);
    List<PdfDetail> articleDetail = articleService.getArticleDetail(query);
    PageInfo pageInfo = new PageInfo(articleDetail);
    article.setPublishTime(DateUtils.dateTime(article.getUpdateTime()));
    model.addAttribute("article", article);
    model.addAttribute("categoryId", article.getCategoryId());
    model.addAttribute("articleDetail", articleDetail);
    model.addAttribute("total", pageInfo.getTotal());
    model.addAttribute("pageNo", pageInfo.getPageNum());
    model.addAttribute("pageSize", pageInfo.getPageSize());
    model.addAttribute("totalPages", pageInfo.getPages());
    model.addAttribute("hasPrevious", pageInfo.isHasPreviousPage());
    model.addAttribute("hasNext", pageInfo.isHasNextPage());
    model.addAttribute("currentPage", pageInfo.getPageNum());
    model.addAttribute("prePage", pageInfo.getPrePage());
    model.addAttribute("nextPage", pageInfo.getNextPage());
    model.addAttribute("navNums", pageInfo.getNavigatepageNums());
    return "h5page/detail";
  }

  /**
   * 文章详情
   *
   * @param model
   * @param articleId
   * @return
   */
  @GetMapping("/article/{articleId}")
  public String article (HttpServletRequest request, Model model, @PathVariable("articleId") String articleId) {
    Article article = articleService.selectArticleById(articleId);
    if (article == null) {
      throw new BusinessException("该文章不存在!");
    }
    model.addAttribute("article", article);
    model.addAttribute("categoryId", article.getCategoryId());
    return prefix + "/" + getTheme() + "/article";
  }

  /**
   * 分类列表
   *
   * @param model
   * @return
   */
  @GetMapping("/category")
  public String category (Model model) {
    model.addAttribute("categoryId", "category");
    Article form = new Article();
    form.setPdfFlag(0);
    startPage();
    List<Article> articles = articleService.selectArticleList(form);
    PageInfo pageInfo = new PageInfo(articles);
    model.addAttribute("total", pageInfo.getTotal());
    model.addAttribute("pageNo", pageInfo.getPageNum());
    model.addAttribute("pageSize", pageInfo.getPageSize());
    model.addAttribute("totalPages", pageInfo.getPages());
    model.addAttribute("hasPrevious", pageInfo.isHasPreviousPage());
    model.addAttribute("hasNext", pageInfo.isHasNextPage());
    model.addAttribute("currentPage", pageInfo.getPageNum());
    model.addAttribute("prePage", pageInfo.getPrePage());
    model.addAttribute("nextPage", pageInfo.getNextPage());
    model.addAttribute("navNums", pageInfo.getNavigatepageNums());
    model.addAttribute("articleList", articles);
    return prefix + "/" + getTheme() + "/category_article";
  }

  /**
   * 分类列表
   *
   * @param categoryId
   * @param model
   * @return
   */
  @GetMapping("/category/{categoryId}")
  public String categoryBy (@PathVariable("categoryId") String categoryId, Model model) {
    Category category = categoryService.selectCategoryById(Long.valueOf(categoryId));
    if (category != null) {
      model.addAttribute("categoryName", category.getCategoryName());
    }
    Article form = new Article();
    form.setCategoryId(categoryId);
    model.addAttribute("categoryId", categoryId);
    startPage();
    List<Article> articles = articleService.selectArticleList(form);
    PageInfo pageInfo = new PageInfo(articles);
    model.addAttribute("total", pageInfo.getTotal());
    model.addAttribute("pageNo", pageInfo.getPageNum());
    model.addAttribute("pageSize", pageInfo.getPageSize());
    model.addAttribute("totalPages", pageInfo.getPages());
    model.addAttribute("hasPrevious", pageInfo.isHasPreviousPage());
    model.addAttribute("hasNext", pageInfo.isHasNextPage());
    model.addAttribute("currentPage", pageInfo.getPageNum());
    model.addAttribute("prePage", pageInfo.getPrePage());
    model.addAttribute("nextPage", pageInfo.getNextPage());
    model.addAttribute("navNums", pageInfo.getNavigatepageNums());
    model.addAttribute("articleList", articles);
    return prefix + "/" + getTheme() + "/category";
  }

  /**
   * 分类列表
   *
   * @param model
   * @return
   */
  @GetMapping("/resource/list")
  public String resourceList (Model model) {
    model.addAttribute("categoryId", "resource");
    Article form = new Article();
    form.setPdfFlag(1);
    startPage();
    List<Article> articles = articleService.selectArticleList(form);
    PageInfo pageInfo = new PageInfo(articles);
    model.addAttribute("total", pageInfo.getTotal());
    model.addAttribute("pageNo", pageInfo.getPageNum());
    model.addAttribute("pageSize", pageInfo.getPageSize());
    model.addAttribute("totalPages", pageInfo.getPages());
    model.addAttribute("hasPrevious", pageInfo.isHasPreviousPage());
    model.addAttribute("hasNext", pageInfo.isHasNextPage());
    model.addAttribute("currentPage", pageInfo.getPageNum());
    model.addAttribute("prePage", pageInfo.getPrePage());
    model.addAttribute("nextPage", pageInfo.getNextPage());
    model.addAttribute("navNums", pageInfo.getNavigatepageNums());
    model.addAttribute("articleList", articles);
    return prefix + "/" + getTheme() + "/list_resource";
  }

  /**
   * 资源详情
   *
   * @param model
   * @param categoryId
   * @return
   */
  @GetMapping("/resource/{categoryId}")
  public String resource (@PathVariable("categoryId") String categoryId, Model model) {
    Category category = categoryService.selectCategoryById(Long.valueOf(categoryId));
    if (category != null) {
      model.addAttribute("categoryName", category.getCategoryName());
    }
    Article form = new Article();
    form.setPdfFlag(1);
    form.setCategoryId(categoryId);
    model.addAttribute("categoryId", categoryId);
    startPage();
    List<Article> articles = articleService.selectArticleList(form);
    PageInfo pageInfo = new PageInfo(articles);
    model.addAttribute("total", pageInfo.getTotal());
    model.addAttribute("pageNo", pageInfo.getPageNum());
    model.addAttribute("pageSize", pageInfo.getPageSize());
    model.addAttribute("totalPages", pageInfo.getPages());
    model.addAttribute("hasPrevious", pageInfo.isHasPreviousPage());
    model.addAttribute("hasNext", pageInfo.isHasNextPage());
    model.addAttribute("currentPage", pageInfo.getPageNum());
    model.addAttribute("prePage", pageInfo.getPrePage());
    model.addAttribute("nextPage", pageInfo.getNextPage());
    model.addAttribute("navNums", pageInfo.getNavigatepageNums());
    model.addAttribute("articleList", articles);
    return prefix + "/" + getTheme() + "/list_resource";
  }

  /**
   * 搜索内容 目前仅支持文章标题模糊搜索
   *
   * @param content
   * @param model
   * @return
   */
  @GetMapping("/search")
  public String search (String content, Model model) {
    model.addAttribute("content", content);
    Article form = new Article();
    form.setTitle(content.trim());
    startPage();
    List<Article> articles = articleService.selectArticleList(form);
    PageInfo pageInfo = new PageInfo(articles);
    model.addAttribute("total", pageInfo.getTotal());
    model.addAttribute("pageNo", pageInfo.getPageNum());
    model.addAttribute("pageSize", pageInfo.getPageSize());
    model.addAttribute("totalPages", pageInfo.getPages());
    model.addAttribute("hasPrevious", pageInfo.isHasPreviousPage());
    model.addAttribute("hasNext", pageInfo.isHasNextPage());
    model.addAttribute("currentPage", pageInfo.getPageNum());
    model.addAttribute("prePage", pageInfo.getPrePage());
    model.addAttribute("nextPage", pageInfo.getNextPage());
    model.addAttribute("navNums", pageInfo.getNavigatepageNums());
    model.addAttribute("articleList", articles);
    return prefix + "/" + getTheme() + "/search";
  }

  @PostMapping("/h5page/q/{categoryId}")
  @ResponseBody
  public AjaxResult queryByCategory (@PathVariable("categoryId") String categoryId, String content) {
    List<Article> articles = getArticles(categoryId, content);
    PageInfo pageInfo = new PageInfo(articles);
    Map<String, Object> model = new HashMap<>();
    model.put("totalPages", pageInfo.getTotal());
    model.put("hasNext", pageInfo.isHasNextPage());
    model.put("dataHtml", appandHtml(articles));
    return AjaxResult.success(model);
  }

  private List<Article> getArticles (@PathVariable("categoryId") String categoryId, String content) {
    Article form = new Article();
    if (!ObjectUtils.isEmpty(content)) {
      form.setTitle(content.trim());
      form.setDescription(content.trim());
    }
    form.setCategoryId(categoryId);
    startPage();
    return articleService.fuzzySearchList(form);
  }

  /**
   * 标签列表
   *
   * @param tagId
   * @param model
   * @return
   */
  @GetMapping("/tag/{tagId}")
  public String tag (@PathVariable("tagId") String tagId, Model model) {
    model.addAttribute("tagId", tagId);
    Tags tag = tagsService.selectTagsById(Long.valueOf(tagId));
    if (tag != null) {
      model.addAttribute("tagName", tag.getTagName());
    }
    Article form = new Article();
    form.setTag(tagId);
    model.addAttribute("pageUrl", "blog/tag/" + tagId);
    startPage();
    List<Article> articles = articleService.selectArticleList(form);
    PageInfo pageInfo = new PageInfo(articles);
    model.addAttribute("total", pageInfo.getTotal());
    model.addAttribute("pageNo", pageInfo.getPageNum());
    model.addAttribute("pageSize", pageInfo.getPageSize());
    model.addAttribute("totalPages", pageInfo.getPages());
    model.addAttribute("hasPrevious", pageInfo.isHasPreviousPage());
    model.addAttribute("hasNext", pageInfo.isHasNextPage());
    model.addAttribute("currentPage", pageInfo.getPageNum());
    model.addAttribute("prePage", pageInfo.getPrePage());
    model.addAttribute("nextPage", pageInfo.getNextPage());
    model.addAttribute("navNums", pageInfo.getNavigatepageNums());
    model.addAttribute("articleList", articles);
    return prefix + "/" + getTheme() + "/tag";
  }

  /**
   * 留言
   *
   * @param model
   * @return
   */
  @GetMapping("/siteMsg")
  public String comment (Model model) {
    model.addAttribute("categoryId", "siteMsg");
    return prefix + "/" + getTheme() + "/siteMsg";
  }

  @PostMapping("/article/view")
  @ResponseBody
  public AjaxResult articleView (HttpServletRequest request, String articleId) {
    if (StringUtils.isEmpty(articleId)) {
      return AjaxResult.error("系统错误!");
    }
    String ip = IpUtils.getIpAddr(request);
    Integer n = articleViewCache.get(ip + "|" + articleId);
    if (n == null || n == 0) {
      articleService.articleLook(articleId);
      articleViewCache.put(ip + "|" + articleId, 1);
      return AjaxResult.success("浏览数+1");
    } else {
      articleViewCache.put(ip + "|" + articleId, n++);
      return AjaxResult.error("系统错误!");
    }
  }

  @PostMapping("/article/upVote")
  @ResponseBody
  public AjaxResult articleUpVote (HttpServletRequest request, String articleId) {
    if (StringUtils.isEmpty(articleId)) {
      return AjaxResult.error("系统错误!");
    }
    String ip = IpUtils.getIpAddr(request);
    Integer n = articleUpVoteCache.get(ip + "|" + articleId);
    if (n == null || n == 0) {
      articleService.upVote(articleId);
      articleUpVoteCache.put(ip + "|" + articleId, 1);
      return AjaxResult.success("点赞数+1");
    } else {
      articleUpVoteCache.put(ip + "|" + articleId, n++);
      return AjaxResult.error("系统错误!");
    }
  }

  @PostMapping("/resource/view")
  @ResponseBody
  public AjaxResult resourceView (HttpServletRequest request, String id) {
    if (StringUtils.isEmpty(id)) {
      return AjaxResult.error("系统错误!");
    }
    String ip = IpUtils.getIpAddr(request);
    Integer n = articleViewCache.get(ip + "|" + id);
    if (n == null || n == 0) {
      resourceService.resourceLook(id);
      articleViewCache.put(ip + "|" + id, 1);
      return AjaxResult.success("浏览数+1");
    } else {
      articleViewCache.put(ip + "|" + id, n++);
      return AjaxResult.error("系统错误!");
    }
  }

  @PostMapping("/resource/upVote")
  @ResponseBody
  public AjaxResult resourceUpVote (HttpServletRequest request, String id) {
    if (StringUtils.isEmpty(id)) {
      return AjaxResult.error("系统错误!");
    }
    String ip = IpUtils.getIpAddr(request);
    Integer n = articleUpVoteCache.get(ip + "|" + id);
    if (n == null || n == 0) {
      resourceService.upVote(id);
      articleUpVoteCache.put(ip + "|" + id, 1);
      return AjaxResult.success("点赞数+1");
    } else {
      articleUpVoteCache.put(ip + "|" + id, n++);
      return AjaxResult.error("系统错误!");
    }
  }

  @PostMapping("/comments")
  @ResponseBody
  public AjaxResult comments (String tid, String type) {
    if (StringUtils.isEmpty(tid) || StringUtils.isEmpty(type)) {
      return AjaxResult.error("参数错误!");
    }
    Comment form = new Comment();
    form.setTid(tid);
    form.setType(type);
    startPage();
    List<Comment> list = commentService.selectComments(form);
    Map<String, Object> data = new HashMap<>();
    data.put("total", new PageInfo(list).getTotal());
    data.put("rows", list);
    data.put("hasNextPage", new PageInfo(list).isHasNextPage());
    data.put("nextPage", new PageInfo(list).getNextPage());
    return AjaxResult.success(data);
  }

  @PostMapping("/comments/save")
  @ResponseBody
  public AjaxResult saveComments (HttpServletRequest request, Comment comment) {
    if (StringUtils.isEmpty(comment.getUserName())) {
      return AjaxResult.error("请输入昵称!");
    }
    if (StringUtils.isEmpty(comment.getQq())) {
      return AjaxResult.error("请输入QQ!");
    }
    if (!comment.getQq().matches("[1-9][0-9]{4,11}")) {
      return AjaxResult.error("QQ格式不合法!");
    }
    comment.setIp(IpUtils.getIpAddr(request));
    comment.setCreateTime(new Date());
    comment.setStatus(0);//无需审核即可显示
    comment.setAvatar("http://q1.qlogo.cn/g?b=qq&nk=" + comment.getQq() + "&s=100");
    int n = commentService.insertComment(comment);
    if (n > 0) {
      return AjaxResult.success(comment);
    } else {
      return AjaxResult.error("评论失败!");
    }

  }

  @PostMapping("/comments/upVote")
  @ResponseBody
  public AjaxResult commentsUpVote (HttpServletRequest request, String commentId) {
    if (StringUtils.isEmpty(commentId)) {
      return AjaxResult.error("系统错误!");
    }
    String ip = IpUtils.getIpAddr(request);
    Integer n = commentUpVoteCache.get(ip + "|" + commentId);
    if (n == null || n == 0) {
      commentService.upVote(commentId);
      commentUpVoteCache.put(ip + "|" + commentId, 1);
      return AjaxResult.success("支持数+1");
    } else {
      commentUpVoteCache.put(ip + "|" + commentId, n++);
      return AjaxResult.error("系统错误!");
    }
  }

  private static final String KEY_LINK_TYPE_LIST = "linkTypeList";
  private static final String KEY_LINK_LIST = "linkList_";

  /**
   * 导航
   *
   * @param model
   * @return
   */
  @GetMapping("/nav")
  public String nav (Model model) {
    model.addAttribute("categoryId", "nav");
    List<LinkType> linkTypeList = (List<LinkType>) blogCache.get(KEY_LINK_TYPE_LIST);
    if (CollectionUtil.isEmpty(linkTypeList)) {
      LinkType form = new LinkType();
      form.setStatus(CmsConstants.STATUS_NORMAL);
      linkTypeList = linkTypeService.selectLinkTypeList(form);
      blogCache.put(KEY_LINK_TYPE_LIST, linkTypeList);
    }
    for (LinkType type : linkTypeList) {
      List<Link> tempList = (List<Link>) blogCache.get(KEY_LINK_LIST + type.getLinkType());
      if (CollectionUtil.isEmpty(tempList)) {
        Link tempForm = new Link();
        tempForm.setAuditState(CmsConstants.AUDIT_STATE_AGREE);
        tempForm.setLinkType(type.getLinkType());
        tempForm.setStatus(CmsConstants.STATUS_NORMAL);
        tempList = linkService.selectLinkList(tempForm);
        blogCache.put(KEY_LINK_LIST + type.getLinkType(), tempList);
      }
      tempList = tempList.stream().limit(3).collect(Collectors.toList());
      type.setChildren(tempList);
    }
    model.addAttribute("linkTypeList", linkTypeList);

    return prefix + "/" + getTheme() + "/navAll";
  }

  /**
   * 导航
   *
   * @param model
   * @return
   */
  @GetMapping("/nav/{type}")
  public String navByType (@PathVariable("type") String type, Model model) {
    model.addAttribute("categoryId", "nav");
    LinkType linkType = linkTypeService.selectLinkTypeByType(type);
    if (linkType == null) {
      throw new BusinessException("不存在的分类!");
    }
    model.addAttribute("linkType", linkType);

    List<LinkType> linkTypeList = (List<LinkType>) blogCache.get(KEY_LINK_TYPE_LIST);
    if (CollectionUtil.isEmpty(linkTypeList)) {
      LinkType form = new LinkType();
      form.setStatus(CmsConstants.STATUS_NORMAL);
      linkTypeList = linkTypeService.selectLinkTypeList(form);
      blogCache.put(KEY_LINK_TYPE_LIST, linkTypeList);
    }
    model.addAttribute("linkTypeList", linkTypeList);

    Link form = new Link();
    form.setAuditState(CmsConstants.AUDIT_STATE_AGREE);
    form.setLinkType(type);
    form.setStatus(CmsConstants.STATUS_NORMAL);
    startPage();
    List<Link> linkList = linkService.selectLinkList(form);
    PageInfo pageInfo = new PageInfo(linkList);
    model.addAttribute("total", pageInfo.getTotal());
    model.addAttribute("pageNo", pageInfo.getPageNum());
    model.addAttribute("pageSize", pageInfo.getPageSize());
    model.addAttribute("totalPages", pageInfo.getPages());
    model.addAttribute("hasPrevious", pageInfo.isHasPreviousPage());
    model.addAttribute("hasNext", pageInfo.isHasNextPage());
    model.addAttribute("currentPage", pageInfo.getPageNum());
    model.addAttribute("prePage", pageInfo.getPrePage());
    model.addAttribute("nextPage", pageInfo.getNextPage());
    model.addAttribute("navNums", pageInfo.getNavigatepageNums());
    model.addAttribute("linkList", linkList);

    return prefix + "/" + getTheme() + "/list_nav";
  }

  @GetMapping("/blogTheme")
  public String blogTheme (Model model) {
    BlogTheme form = new BlogTheme();
    startPage();
    List<BlogTheme> themes = blogThemeService.selectBlogThemeList(form);
    PageInfo pageInfo = new PageInfo(themes);
    model.addAttribute("total", pageInfo.getTotal());
    model.addAttribute("pageNo", pageInfo.getPageNum());
    model.addAttribute("pageSize", pageInfo.getPageSize());
    model.addAttribute("totalPages", pageInfo.getPages());
    model.addAttribute("hasPrevious", pageInfo.isHasPreviousPage());
    model.addAttribute("hasNext", pageInfo.isHasNextPage());
    model.addAttribute("currentPage", pageInfo.getPageNum());
    model.addAttribute("prePage", pageInfo.getPrePage());
    model.addAttribute("nextPage", pageInfo.getNextPage());
    model.addAttribute("navNums", pageInfo.getNavigatepageNums());
    model.addAttribute("themeList", themes);
    String currentTheme = blogThemeService.queryCurrentBlogTheme();
    model.addAttribute("currentTheme", currentTheme);
    return prefix + "/blogTheme";
  }
}
