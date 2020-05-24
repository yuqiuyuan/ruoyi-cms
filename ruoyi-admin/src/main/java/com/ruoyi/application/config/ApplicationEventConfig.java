package com.ruoyi.application.config;


import com.ruoyi.application.ApplicationEventAspect;
import com.ruoyi.application.ApplicationEventManager;
import com.ruoyi.application.IApplicationEvent;
import com.ruoyi.system.service.IEventLogService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.Resource;
import java.util.List;

/**
 * 系统事件配置
 *
 * @author drebander
 * @since 2020-05-24
 */
@Configuration
public class ApplicationEventConfig {

    /**
     * 所有实现系统事件类
     */

    @Resource
    private List<IApplicationEvent> applicationEventList;
    /**
     * 系统事件日志记录
     */
    @Resource
    private IEventLogService eventLogService;

    /**
     * 系统事件管理器
     *
     * @return event manager
     */
    @Bean("applicationEventManager")
    public ApplicationEventManager getApplicationEventManager() {
        ApplicationEventManager applicationEventManager = new ApplicationEventManager();
        applicationEventManager.setApplicationEventList(applicationEventList);
        applicationEventManager.setEventLogService(eventLogService);
        return applicationEventManager;
    }

    /**
     * 系统事件触发切面类
     *
     * @return event aspect
     */
    @Bean("applicationEventAspect")
    public ApplicationEventAspect getApplicationEventAspect() {
        ApplicationEventAspect applicationEventAspect = new ApplicationEventAspect();
        applicationEventAspect.setApplicationEventManager(getApplicationEventManager());
        return applicationEventAspect;
    }
}
