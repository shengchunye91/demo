package com.chun.manage.service;

import com.chun.manage.bean.MenuMessage;

public interface MenuMessageService extends BaseService<MenuMessage> {

    public MenuMessage findMenuMessageByKey(String key);
}
