package com.chun.manage.dao;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.annotation.Resource;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.chun.manage.bean.BaseModel;

@SuppressWarnings("unchecked")
@Repository(value = "baseDao")
public class BaseDaoImpl<T extends BaseModel> implements BaseDao<T> {

    private Class<T> clazz;
    
    
    
    public BaseDaoImpl(Class<T> clazz) {
        this.clazz = clazz;
    }
    
    public BaseDaoImpl() {}
    
    /**
     * install SessionFactory
     */
    @Resource(name = "sessionFactory")
    private SessionFactory sessionFactory;
    @Resource(name = "jdbcTemplate")
    private JdbcTemplate   jdbcTemplate;

    /**
     * @param sessionFactory
     *            the sessionFactory to set
     */
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    /**
     * @return the sessionFactory
     */
    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    /**
     * @return the jdbcTemplate
     */
    public JdbcTemplate getJdbcTemplate() {
        return jdbcTemplate;
    }

    /**
     * @param jdbcTemplate
     *            the jdbcTemplate to set
     */
    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Get Session
     */
    protected Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public T save(T entity) {
        Session session = this.getSession();
        entity.setCreated(Calendar.getInstance().getTime());
        entity.setUserCreated("admin");
        session.save(entity);
        return entity;
    }

    @Override
    public T update(T entity) {
        Session session = this.getSession();
        entity.setUpdated(Calendar.getInstance().getTime());
        entity.setUserCreated("admin");
        session.update(entity);
        return entity;
    }

    @Override
    public T saveOrUpdate(T entity) {
        Session session = this.getSession();
        entity.setUpdated(Calendar.getInstance().getTime());
        entity.setUserCreated("admin");
        session.saveOrUpdate(entity);
        return entity;
    }

    @Override
    public void delete(Serializable id) {
        Session session = this.getSession();
        session.delete(this.findById(id));
    }

    @Override
    public T findById(Serializable id) {
        return (T) this.getSession().get(this.clazz, id);
    }

    @Override
    public List<T> findAll() {
        String hql = "from " + this.clazz.getName();
        Query query = this.getSession().createQuery(hql);
        return query.list();
    }

    @Override
    public void deleteByHQL(String hql, Object... params) {
        Session session = this.getSession();
        Query query = session.createQuery(hql);
        for (int i = 0; params != null && i < params.length; i++) {
            query.setParameter(i, params[i]);
        }
        query.executeUpdate();
    }

    @SuppressWarnings("rawtypes")
    @Override
    public List<T> findByHQL(String hql, Object... params) {
        Query query = this.getSession().createQuery(hql);
        int index = 0;
        for (int i = 0; params != null && i < params.length; i++) {
            Object obj = params[i];
            if (obj instanceof Map) {
                Map map = (Map) obj;
                Iterator iterator = map.entrySet().iterator();
                while (iterator.hasNext()) {
                    Entry entry = (Entry) iterator.next();
                    String key = (String) entry.getKey();
                    Object value = entry.getValue();
                    if (value instanceof List) {
                        query.setParameterList(key, (List) value);
                    } else {
                        query.setParameter(key, value);
                    }
                }
            } else {
                query.setParameter(index++, obj);
            }
        }
        List<T> list = query.list();

        if (list.size() == 0) {
            return new ArrayList<T>();
        }
        return list;
    }

}
