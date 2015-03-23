package com.chun.manage.action;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chun.manage.bean.Result;
import com.chun.manage.bean.TextMessage;
import com.chun.manage.service.TextMessageService;

import weixin.popular.util.JsonUtil;

@Controller
@RequestMapping("textManageController")
public class TextManageController {

    @Resource(name = "textMessageService")
    private TextMessageService textMessageService;

    @RequestMapping(value = "textMessage", method = RequestMethod.POST)
    @ResponseBody
    public String create(TextMessage textMessage, HttpServletRequest req, HttpServletResponse resp)
            throws Exception {
        if (textMessage!=null){
            textMessageService.save(textMessage);
        }
        Result result=new Result(textMessage);
        return JsonUtil.toJSONString(result);
    }
    
    @RequestMapping(value = "textMessages", method = RequestMethod.GET)
    @ResponseBody
    public String get(HttpServletRequest req, HttpServletResponse resp)
            throws Exception {
        List<TextMessage> textMessages =textMessageService.findAll();
        Result result=new Result(textMessages);
        return JsonUtil.toJSONString(result);
    }

}
