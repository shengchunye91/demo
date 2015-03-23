package com.chun.manage.service;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chun.manage.bean.MenuMessage;
import com.chun.manage.dao.BaseDao;
import com.chun.manage.dao.MenuMessageDao;

@Service("menuMessageService")
@Transactional
public class MenuMessageServiceImpl extends BaseServiceImpl<MenuMessage> implements MenuMessageService {

    @Resource(name = "menuMessageDao")
    public void setDao(BaseDao<MenuMessage> dao) {
        super.setDao(dao);
    }

    @Resource(name = "menuMessageDao")
    private MenuMessageDao menuMessageDao;

    @Override
    public MenuMessage findMenuMessageByKey(String key) {
        if (!StringUtils.isBlank(key)) {
            MenuMessage menuMessage = menuMessageDao.findMenuMessageByKey(key);
            return menuMessage;
        }
        return null;
    }
}
