package com.chun.manage.service;

import java.io.Serializable;
import java.util.List;

import com.chun.manage.bean.BaseModel;


public interface BaseService <T extends BaseModel>{

    public T save(T entity);

    public T update(T entity);
    
    public T saveOrUpdate(T entity);

    public void delete(Serializable id);
    
    public void delete(Serializable... ids);
    
    public T findById(Serializable id);

    public List<T> findAll();
    
    public List<T> findByHQL(String hql, Object... params);
}
