package com.ruoyi.blog.controller;


import com.ruoyi.common.core.controller.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/h5-airport")
public class H5PageController extends BaseController {

  @GetMapping({"/", "", "/index"})
  public String index (Model model) {
//    model.addAttribute("pageUrl", "blog/index");
//    model.addAttribute("categoryId", "index");
//
//    Article form = new Article();
//    startPage();
//    List<Article> articles = articleService.selectArticlesRegionNotNull(form);
//    model.addAttribute("pageNo", new PageInfo(articles).getPageNum());
//    model.addAttribute("pageSize", new PageInfo(articles).getPageSize());
//    model.addAttribute("totalPages", new PageInfo(articles).getPages());
//    model.addAttribute("articleList", articles);
    return "h5page/index";
  }
}
