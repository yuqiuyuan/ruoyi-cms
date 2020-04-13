package com.ruoyi.cms.controller;

import com.ruoyi.cms.domain.UEditorAction;
import com.ruoyi.cms.domain.UEditorModel;
import com.ruoyi.cms.service.IUEditorService;
import com.ruoyi.common.core.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

/**
 * UEditorController
 *
 * @author drebander
 * @since 2020-04-05 6:38 PM
 **/
@Controller
@RequestMapping("/cms/UEditor")
public class UEditorController extends BaseController {

    /**
     * ueditor资源路径
     */


    @Resource
    private IUEditorService iuEditorService;

    /**
     * ueditor action
     * 调用地址：    /cms/UEditor/action
     */
    @RequestMapping(value = "/action")
    @ResponseBody
    public String action(UEditorModel uEditorModel) {
        final String action = uEditorModel.getAction();
        if (UEditorAction.CONFIG.getActionCode().equals(action)) {
            return iuEditorService.loadConfig();
        } else if (UEditorAction.UPLOAD_FILE.getActionCode().equals(action)) {
            return iuEditorService.saveFile(uEditorModel.getUpfile());
        }
        return null;
    }
}
