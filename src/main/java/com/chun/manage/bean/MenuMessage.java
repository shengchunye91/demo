package com.chun.manage.bean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.chun.manage.enums.MsgType;

@Entity
@Table(name = "t_menu", uniqueConstraints = { @UniqueConstraint(columnNames = { "msgKey" }) })
public class MenuMessage extends BaseModel {

    private String  msgKey;

    @Column
    @Enumerated(EnumType.STRING)
    private MsgType msgType = MsgType.text;

    private String  msgId;

    public String getMsgKey() {
        return msgKey;
    }

    public void setMsgKey(String msgKey) {
        this.msgKey = msgKey;
    }

    public MsgType getMsgType() {
        return msgType;
    }

    public void setMsgType(MsgType msgType) {
        this.msgType = msgType;
    }

    public String getMsgId() {
        return msgId;
    }

    public void setMsgId(String msgId) {
        this.msgId = msgId;
    }

}
