package com.ruoyi.cms.domain;

import java.util.List;

import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文章管理对象 cms_article
 *
 * @author wujiyue
 * @date 2019-10-28
 */

@EqualsAndHashCode(callSuper = true)
@Data
public class PdfDetail extends BaseEntity {

  private static final long serialVersionUID = 1L;

  /**
   * 主键，文章ID
   */
  private String id;

  /**
   * 主键，文章ID
   */
  private String articleId;

  /**
   * 图片地址
   */
  @Excel(name = "地址")
  private String url;

  /**
   * 总记录数
   */
  @Excel(name = "总记录数")
  private Integer totalRecords;

  /**
   * 当前记录坐标
   */
  @Excel(name = "当前记录坐标")
  private Integer curRecords;


  /**
   * 当前记录坐标
   */
  @Excel(name = "总页数")
  private Integer totalPages;

  /**
   * 当前记录坐标
   */
  @Excel(name = "当前页数")
  private Integer curPages;

  /**
   * 0：没有删除；1：已经删除
   */
  @Excel(name = "删除标志")
  private Integer deleteFlag;

}
