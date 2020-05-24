package com.ruoyi.framework.web.service;

import org.springframework.stereotype.Service;
import com.ruoyi.system.service.ISysConfigService;

import javax.annotation.Resource;

/**
 * RuoYi首创 html调用 thymeleaf 实现参数管理
 * 
 * @author ruoyi
 * @since 2020-05-24
 */
@Service("config")
public class ConfigService
{
    @Resource
    private ISysConfigService configService;

    /**
     * 根据键名查询参数配置信息
     * 
     * @param configKey 参数名称
     * @return 参数键值
     */
    public String getKey(String configKey)
    {
        return configService.selectConfigByKey(configKey);
    }
}
