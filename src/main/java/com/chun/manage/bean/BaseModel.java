package com.chun.manage.bean;

import java.util.Date;
import java.util.UUID;

import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.apache.commons.lang3.time.DateFormatUtils;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@MappedSuperclass
@JsonIgnoreProperties({ "created", "userCreated", "updated", "userUpdated" })
public abstract class BaseModel {

    @Id
    private String id = UUID.randomUUID().toString();
    @Temporal(TemporalType.TIMESTAMP)
    private Date   created;
    private String userCreated;
    @Temporal(TemporalType.TIMESTAMP)
    private Date   updated;
    private String userUpdated;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public String getUserCreated() {
        return userCreated;
    }

    public void setUserCreated(String userCreated) {
        this.userCreated = userCreated;
    }

    public Date getUpdated() {
        return updated;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }

    public String getUserUpdated() {
        return userUpdated;
    }

    public void setUserUpdated(String userUpdated) {
        this.userUpdated = userUpdated;
    }

    public String getFormattedCreated() {
        if (created == null) {
            return "";
        }
        return DateFormatUtils.ISO_DATETIME_TIME_ZONE_FORMAT.format(created);
    }

    public String getFormattedUpdated() {
        if (updated == null) {
            return "";
        }
        return DateFormatUtils.ISO_DATETIME_TIME_ZONE_FORMAT.format(updated);
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        BaseModel other = (BaseModel) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        return true;
    }

}
