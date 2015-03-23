package com.chun.manage.action;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chun.manage.bean.MenuMessage;
import com.chun.manage.bean.Result;
import com.chun.manage.service.MenuMessageService;

import weixin.popular.api.MenuAPI;
import weixin.popular.api.TokenAPI;
import weixin.popular.bean.BaseResult;
import weixin.popular.bean.Token;
import weixin.popular.util.JsonUtil;

@Controller
@RequestMapping("menuManageController")
public class MenuManageController {

    @Resource(name = "menuMessageService")
    private MenuMessageService menuMessageService;

    @Value("#{configProperties['appID']}")
    private String             appID;

    @Value("#{configProperties['appsecret']}")
    private String             appsecret;

    @RequestMapping(value = "menuMessage", method = RequestMethod.POST)
    @ResponseBody
    public String createMenuMessage(MenuMessage menuMessage, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        if (menuMessage != null) {
            menuMessageService.save(menuMessage);
        }
        Result result = new Result(menuMessage);
        return JsonUtil.toJSONString(result);
    }

    @RequestMapping(value = "menu", method = RequestMethod.POST)
    @ResponseBody
    public String creatMenu(@RequestParam String button, HttpServletRequest req, HttpServletResponse resp)
            throws Exception {
        Token appToken = TokenAPI.token(appID, appsecret);
        BaseResult result = MenuAPI.menuCreate(appToken.getAccess_token(), button);
        return JsonUtil.toJSONString(result);
    }

}
