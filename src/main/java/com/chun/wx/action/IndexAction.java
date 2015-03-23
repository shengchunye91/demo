package com.chun.wx.action;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.Arrays;

import javax.annotation.Resource;
import javax.servlet.ServletInputStream;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.chun.wx.inf.WxMessage;
import com.chun.wx.util.EncryptUtils;

import weixin.popular.bean.EventMessage;
import weixin.popular.bean.xmlmessage.XMLMessage;
import weixin.popular.util.ExpireSet;
import weixin.popular.util.SignatureUtil;
import weixin.popular.util.XMLConverUtil;

@Controller
@RequestMapping("indexAction")
public class IndexAction extends HttpServlet {

    private static final long        serialVersionUID = -3809653269549941118L;

    @Value("#{configProperties['token']}")
    private String                   token;
    @Value("#{configProperties['appID']}")
    private String                   appID;
    @Value("#{configProperties['appsecret']}")
    private String                   appsecret;

    @Resource(name = "wxMessage")
    private WxMessage                wxMessage;
    
    private static ExpireSet<String> expireSet        = new ExpireSet<String>(60);

    
  @RequestMapping(value = "main", method = RequestMethod.GET)
  public void mainHome(HttpServletRequest req, HttpServletResponse resp)
          throws Exception {
      String signature = req.getParameter("signature") == null ? "" : req
              .getParameter("signature");
      String timestamp = req.getParameter("timestamp") == null ? "" : req
              .getParameter("timestamp");
      String nonce = req.getParameter("nonce") == null ? "" : req
              .getParameter("nonce");
      String echostr = req.getParameter("echostr") == null ? "" : req
              .getParameter("echostr");
      // 将token、timestamp、nonce三个参数进行字典序排序
      String[] strarray = new String[] { token, timestamp, nonce };

      Arrays.sort(strarray);
      StringBuilder content = new StringBuilder();
      for (String s : strarray) {
          content.append(s);
      }
      // 将三个参数字符串拼接成一个字符串进行sha1加密，并与signature对比,如果相同返回echostr
      if (EncryptUtils.sha(content.toString()).equals(signature)) {
          resp.getWriter().print(echostr);
      }
  }
    
    @RequestMapping(value = "main", method = RequestMethod.POST)
    public void main(HttpServletRequest request, HttpServletResponse resp) throws Exception {
        ServletInputStream inputStream = request.getInputStream();
        ServletOutputStream outputStream = resp.getOutputStream();
        String signature = request.getParameter("signature");
        String timestamp = request.getParameter("timestamp");
        String nonce = request.getParameter("nonce");
        String echostr = request.getParameter("echostr");

        if (echostr != null) {
            outputStreamWrite(outputStream, echostr);
            return;
        }

        if (signature != null
                && !signature.equals(SignatureUtil.generateEventMessageSignature(token, timestamp, nonce))) {
            System.out.println("The request signature is invalid");
            return;
        }

        if (inputStream != null) {

            EventMessage eventMessage = XMLConverUtil.convertToObject(EventMessage.class, inputStream);
            String expireKey = eventMessage.getFromUserName() + "__" + eventMessage.getToUserName() + "__"
                    + eventMessage.getMsgId() + "__" + eventMessage.getCreateTime();
            if (expireSet.contains(expireKey)) {

                return;
            } else {

                expireSet.add(expireKey);
            }
            XMLMessage message = wxMessage.processingMessage(eventMessage);
            message.outputStreamWrite(outputStream);
            return;
        }
        outputStreamWrite(outputStream, "");
    }

    private boolean outputStreamWrite(OutputStream outputStream, String text) {
        try {
            outputStream.write(text.getBytes("utf-8"));
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return false;
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return false;
        }
        return true;
    }
}
