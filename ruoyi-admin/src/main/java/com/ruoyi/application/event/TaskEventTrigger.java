package com.ruoyi.application.event;

import com.alibaba.fastjson.JSON;
import com.ruoyi.application.ApplicationEvent;
import com.ruoyi.application.ApplicationEventDefined;
import com.ruoyi.application.IApplicationEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 定时任务被触发或者被手工触发
 *
 * @author drebander
 * @since 2020-05-23
 */
@ApplicationEvent({ApplicationEventDefined.ON_SCHEDULER_EXECUTED, ApplicationEventDefined.ON_SCHEDULER_EXECUTED_BY_HAND})
@Component
@Slf4j
public class TaskEventTrigger implements IApplicationEvent {
    @Override
    public void onTrigger(Object source, Object params) {
        log.info("系统任务被触发：{} \t\t {}", source.toString(), JSON.toJSONString(params));
    }
}
