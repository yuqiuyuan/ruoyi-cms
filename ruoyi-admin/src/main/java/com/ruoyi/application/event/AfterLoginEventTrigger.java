package com.ruoyi.application.event;

import com.alibaba.fastjson.JSON;
import com.ruoyi.application.ApplicationEvent;
import com.ruoyi.application.ApplicationEventDefined;
import com.ruoyi.application.IApplicationEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 用户登录后触发
 *
 * @author drebander
 * @since 2020-05-23
 */
@ApplicationEvent({ApplicationEventDefined.ON_AFTER_LOGIN})
@Component
@Slf4j
public class AfterLoginEventTrigger implements IApplicationEvent {
    @Override
    public void onTrigger(Object source, Object params) {
        log.info("用户登陆后：系统任务被触发：{} \t\t {}", source.toString(), JSON.toJSONString(params));

    }
}