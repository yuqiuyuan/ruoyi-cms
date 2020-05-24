package com.ruoyi.application;

import com.ruoyi.common.utils.ServletUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * 触发系统事件切面
 * <p>
 * 利用apo触发系统事件相比在系统事件发生时触发系统事件降低了代码耦合度。避免代码入侵。
 *
 * @author drebander
 * @since 2020-05-23
 */
@Aspect
@EnableAspectJAutoProxy()
public class ApplicationEventAspect {

    private ApplicationEventManager applicationEventManager;

    public void setApplicationEventManager(ApplicationEventManager applicationEventManager) {
        this.applicationEventManager = applicationEventManager;
    }

    @Pointcut("execution(* com.ruoyi.web.controller.system.SysLoginController.ajaxLogin(..))")
    public void afterLoginPointcut() {
    }

    @Pointcut("execution(* com.ruoyi.quartz.controller.SysJobController.run(..))")
    public void onSchedulerExecutedByHandPointcut() {
    }

    /**
     * 用户登录后切点
     *
     * @param point JoinPoint
     */
    @After("afterLoginPointcut()")
    public void afterLogin(JoinPoint point) {
        String className = point.getTarget().getClass().getName();
        String method = point.getSignature().getName();
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        Map paramMap = ServletUtils.getMap(request);
        //触发系统定义事件
        applicationEventManager.trigger(ApplicationEventDefined.ON_AFTER_LOGIN, className + "." + method, paramMap);
    }

    /**
     * 手工触发定时任务
     *
     * @param point JoinPoint
     */
    @After("onSchedulerExecutedByHandPointcut()")
    public void onSchedulerExecutedByHand(JoinPoint point) {
        String className = point.getTarget().getClass().getName();
        String method = point.getSignature().getName();
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        Map paramMap = ServletUtils.getMap(request);
        applicationEventManager.trigger(ApplicationEventDefined.ON_SCHEDULER_EXECUTED_BY_HAND, className + "." + method, paramMap);
    }

}
