package com.chun.manage.bean;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "t_text")
public class TextMessage extends BaseModel{
    
    private String content;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
    
    
    
}
