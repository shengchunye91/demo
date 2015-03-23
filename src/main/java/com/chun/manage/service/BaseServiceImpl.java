package com.chun.manage.service;

import java.io.Serializable;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.transaction.annotation.Transactional;

import com.chun.manage.bean.BaseModel;
import com.chun.manage.dao.BaseDao;



@Transactional
public class BaseServiceImpl<T extends BaseModel> implements BaseService<T> {

    private BaseDao<T> dao;

    @Resource
    public void setDao(BaseDao<T> dao) {
        this.dao = dao;
    }

    public BaseDao<T> getDao() {
        return dao;
    }

    public T save(T entity) {
        return dao.save(entity);
    }

    public T update(T entity) {
        return dao.update(entity);
    }

    public T saveOrUpdate(T entity) {
        return dao.saveOrUpdate(entity);
    }

    public void delete(Serializable id) {
        dao.delete(id);
    }

    public void delete(Serializable... ids) {
        if (ids != null) {
            for (Serializable id : ids) {
                delete(id);
            }
        }
    }

    @Override
    public List<T> findAll() {
        return dao.findAll();
    }

    @Override
    public T findById(Serializable id) {
        return dao.findById(id);
    }

    @Override
    public List<T> findByHQL(String hql, Object... params) {
        return dao.findByHQL(hql, params);
    }
}
