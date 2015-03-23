package com.chun.manage.service;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chun.manage.bean.TextMessage;
import com.chun.manage.dao.BaseDao;

@Service("textMessageService")
@Transactional
public class TextMessageServiceImpl extends BaseServiceImpl<TextMessage> implements TextMessageService {

    @Resource(name = "textMessageDao")
    public void setDao(BaseDao<TextMessage> dao) {
        super.setDao(dao);
    }
}
