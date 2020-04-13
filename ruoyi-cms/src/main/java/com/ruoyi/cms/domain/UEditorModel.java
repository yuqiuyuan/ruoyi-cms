package com.ruoyi.cms.domain;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

/**
 * UEditorModel
 *
 * @author drebander
 * @since 2020-04-12 3:28 PM
 **/
@Data
public class UEditorModel {
    private String action;
    private String callback;
    private MultipartFile upfile;

}
