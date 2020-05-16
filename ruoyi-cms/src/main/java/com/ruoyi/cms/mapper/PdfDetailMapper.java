package com.ruoyi.cms.mapper;

import java.util.List;
import java.util.Map;

import com.ruoyi.cms.domain.Article;
import com.ruoyi.cms.domain.PdfDetail;
import org.apache.ibatis.annotations.Param;

/**
 * 文章管理Mapper接口
 *
 * @author wujiyue
 * @date 2019-10-28
 */
public interface PdfDetailMapper {

  /**
   * 查询文章列表
   *
   * @param article 文章
   * @return 文章集合
   */
  List<PdfDetail> selectPdfDetail (PdfDetail article);


  /**
   * 新增文章管理
   *
   * @param pdfDetail 文章
   * @return 结果
   */
  int insertPdfDetail (PdfDetail pdfDetail);

}
