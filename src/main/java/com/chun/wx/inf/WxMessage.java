package com.chun.wx.inf;

import java.lang.reflect.Method;

import javax.annotation.Resource;

import org.springframework.stereotype.Component;




import com.chun.wx.handle.MessageProcessingHandler;

import weixin.popular.bean.EventMessage;
import weixin.popular.bean.xmlmessage.XMLMessage;
import weixin.popular.bean.xmlmessage.XMLTextMessage;

@Component("wxMessage")
public class WxMessage {

    @Resource(name = "messageProcessingHandler")
    private MessageProcessingHandler messageProcessingHandler;

    public XMLMessage processingMessage(EventMessage message) {
        String handler = "com.chun.wx.handle.MessageProcessingHandlerImpl";
        XMLMessage oms = null;
        try {
            // 加载处理器
            Class<?> clazz = Class.forName(handler);
            // 取得消息类型
            String type = message.getMsgType();
            Method mt = clazz.getMethod(type + "TypeMsg", EventMessage.class);
            oms = (XMLMessage) mt.invoke(messageProcessingHandler, message);
            if (oms == null) {
                oms = new XMLTextMessage(message.getFromUserName(), message.getToUserName(), "系统错误!");
            }
        } catch (Exception e) {
            oms = new XMLTextMessage(message.getFromUserName(), message.getToUserName(), "系统错误!");
        }

        return oms;
    }

}
