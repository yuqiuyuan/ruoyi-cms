package com.ruoyi.cms.domain;

/**
 * UEditorAction
 *
 * @author drebander
 * @since 2020-04-12
 */
public enum UEditorAction {
    /**
     * 加载配置文件
     */
    CONFIG("config", "配置文件"),
    UPLOAD_FILE("uploadfile", "上传文件");

    UEditorAction(String actionCode, String actionDesc) {
        this.actionCode = actionCode;
        this.actionDesc = actionDesc;
    }

    private String actionCode;
    private String actionDesc;

    public String getActionCode() {
        return actionCode;
    }

    public void setActionCode(String actionCode) {
        this.actionCode = actionCode;
    }

    public String getActionDesc() {
        return actionDesc;
    }

    public void setActionDesc(String actionDesc) {
        this.actionDesc = actionDesc;
    }
}
