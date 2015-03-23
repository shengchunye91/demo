package com.chun.manage.dao;

import java.io.Serializable;
import java.util.List;

import com.chun.manage.bean.BaseModel;


public interface BaseDao<T extends BaseModel> {

    public T save(T entity);

    public T update(T entity);

    public T saveOrUpdate(T entity);

    public void delete(Serializable id);

    public T findById(Serializable id);

    public List<T> findAll();

    public void deleteByHQL(String hql, Object... params);

    public List<T> findByHQL(String hql, Object... params);

}
