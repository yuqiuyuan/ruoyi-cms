package com.ruoyi.cms.service;

import org.springframework.web.multipart.MultipartFile;

public interface IUEditorService {
    /**
     * 加载Ueditor配置文件
     *
     * @return json str
     */
    String loadConfig();

    /**
     * 保存文件
     *
     * @param upFile 上传文件
     * @return 升上文件url
     */
    String saveFile(MultipartFile upFile);
}
