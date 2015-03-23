package com.chun.wx.handle;

import weixin.popular.bean.EventMessage;
import weixin.popular.bean.xmlmessage.XMLMessage;


/**
 * 消息处理器
 * @author GodSon
 *
 */
public interface MessageProcessingHandler {
	
	/**
	 * 统一处理器
	 * @param msg
	 * @return
	 */
	public XMLMessage allType(EventMessage msg);
	
	/**
	 * 文字内容的消息处理
	 * @param msg
	 * @return
	 */
	public XMLMessage textTypeMsg(EventMessage msg);
	
	/**
	 * 地理位置类型的消息处理
	 * @param msg
	 * @return
	 */
	public XMLMessage locationTypeMsg(EventMessage msg);
	
	/**
	 * 图片类型的消息处理
	 * @param msg
	 * @return
	 */
	public XMLMessage imageTypeMsg(EventMessage msg);
	
	/**
	 * 视频类型的消息处理
	 * @param msg
	 * @return
	 */
	public XMLMessage videoTypeMsg(EventMessage msg);
	
	/**
	 * 链接类型的消息处理
	 * @param msg
	 * @return
	 */
	public XMLMessage linkTypeMsg(EventMessage msg);

	/**
	 * 语音类型的消息处理
	 * @param msg
	 * @return
	 */
	public XMLMessage voiceTypeMsg(EventMessage msg);
	
	/**
	 * 验证消息处理
	 * @param msg
	 * @return
	 */
	public XMLMessage verifyTypeMsg(EventMessage msg);

	/**
	 * 事件类型的消息处理。<br/>
	 * 在用户首次关注公众账号时，系统将会推送一条subscribe的事件
	 * @param msg
	 * @return
	 */
	public XMLMessage eventTypeMsg(EventMessage msg);

	/**
	 * 处理流程结束，返回输出信息之前执行
	 */
	public XMLMessage afterProcess(EventMessage inMsg,XMLMessage outMsg);
	
	
}
