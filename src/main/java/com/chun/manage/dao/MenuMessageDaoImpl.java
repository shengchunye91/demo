package com.chun.manage.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.chun.manage.bean.MenuMessage;

@Repository(value = "menuMessageDao")
public class MenuMessageDaoImpl extends BaseDaoImpl<MenuMessage> implements MenuMessageDao {

    public MenuMessageDaoImpl() {
        super(MenuMessage.class);
    }

    @Override
    public MenuMessage findMenuMessageByKey(String key) {
        String hql = "select m from MenuMessage m where m.msgKey=?";
        List<MenuMessage> menuMessages = this.findByHQL(hql, key);
        return menuMessages.size() == 0 ? null : menuMessages.get(0);
    }
}
