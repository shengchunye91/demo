package com.chun.manage.dao;

import org.springframework.stereotype.Repository;

import com.chun.manage.bean.TextMessage;

@Repository(value = "textMessageDao")
public class TextMessageDaoImpl extends BaseDaoImpl<TextMessage> implements TextMessageDao {

    public TextMessageDaoImpl() {
        super(TextMessage.class);
    }

}
