package com.chun.manage.dao;

import com.chun.manage.bean.MenuMessage;

public interface MenuMessageDao extends BaseDao<MenuMessage> {

    public MenuMessage findMenuMessageByKey(String key);
}
