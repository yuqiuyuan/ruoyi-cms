package com.ruoyi.application;

/**
 * 系统事件接口
 *
 * @author drebander
 * @since 2020-05-23
 */
public interface IApplicationEvent {
    /**
     * 当事件被触发时
     *
     * @param source source
     * @param params params
     */
    void onTrigger(Object source, Object params);
}
