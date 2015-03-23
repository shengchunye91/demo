package com.chun.wx.handle;

import javax.annotation.Resource;

import org.springframework.stereotype.Component;






import com.chun.manage.bean.MenuMessage;
import com.chun.manage.bean.TextMessage;
import com.chun.manage.service.MenuMessageService;
import com.chun.manage.service.TextMessageService;

import weixin.popular.bean.EventMessage;
import weixin.popular.bean.xmlmessage.XMLMessage;
import weixin.popular.bean.xmlmessage.XMLTextMessage;

/**
 * 自定义实现消息处理
 * 
 * 
 */
@Component("messageProcessingHandler")
public class MessageProcessingHandlerImpl implements MessageProcessingHandler {

    @Resource(name = "menuMessageService")
    private MenuMessageService menuMessageService;

    @Resource(name = "textMessageService")
    private TextMessageService textMessageService;

    @Override
    public XMLMessage allType(EventMessage msg) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public XMLMessage textTypeMsg(EventMessage msg) {
        XMLMessage oms = new XMLTextMessage(msg.getFromUserName(), msg.getToUserName(), "文字");
        return oms;
    }

    @Override
    public XMLMessage locationTypeMsg(EventMessage msg) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public XMLMessage imageTypeMsg(EventMessage msg) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public XMLMessage videoTypeMsg(EventMessage msg) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public XMLMessage linkTypeMsg(EventMessage msg) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public XMLMessage voiceTypeMsg(EventMessage msg) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public XMLMessage verifyTypeMsg(EventMessage msg) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public XMLMessage eventTypeMsg(EventMessage msg) {
        XMLMessage oms = null;
        if ("CLICK".equals(msg.getEvent())) {
            oms = findMsgByKey(msg.getEventKey(), msg.getFromUserName(), msg.getToUserName());
        }

        if (oms == null) {
            oms = new XMLTextMessage(msg.getFromUserName(), msg.getToUserName(), "找不到匹配！");
        }
        return oms;
    }

    @Override
    public XMLMessage afterProcess(EventMessage inMsg, XMLMessage outMsg) {
        // TODO Auto-generated method stub
        return null;
    }

    public XMLMessage findMsgByKey(String key, String fromUserName, String toUserName) {
        MenuMessage menuMessage = menuMessageService.findMenuMessageByKey(key);
        XMLMessage oms = null;
        if (menuMessage != null) {
            switch (menuMessage.getMsgType()) {
            case text:
                TextMessage textMessage = textMessageService.findById(menuMessage.getMsgId());
                oms = new XMLTextMessage(fromUserName, toUserName, textMessage.getContent());
                break;

            default:
                break;
            }
        }

        if (oms == null) {
            oms = new XMLTextMessage(fromUserName, toUserName, "找不到匹配！");
        }
        return oms;
    }
    
    
}
