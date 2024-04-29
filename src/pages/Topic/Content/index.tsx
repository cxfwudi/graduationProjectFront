import { Button, Avatar, Modal, Upload, Cascader, Input, notification } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { useModel, useLocation } from "@umijs/max";
import { UserOutlined, FieldTimeOutlined,CloseOutlined } from '@ant-design/icons';
import { getTopicDetail, currentUser as getAuthorAvatar,submitTopicComment,submitTopicReply } from '@/services/api';
import { unicodeToStr } from '@/utils';
import { history } from '@umijs/max';
import styles from './index.less';
import ReactHtmlParser from 'react-html-parser';
interface replyData {
  id: number,
  publisher: string,
  publisher_avatar: string,
  content: string,
  created_time: string,
}
interface commitData {
  id: number,
  publisher: string,
  publisher_avatar: string,
  content: string,
  created_time: string,
  reply: replyData[]
}
interface topicDetailPhotoData {
  id: number,
  content: string
}
interface topicDetailData {
  nickname: string,
  title: string,
  category: string,
  limit: string,
  created_time: string,
  content: string,
  content_text: string,
  introduce: string,
  author: string,
  last_id: number,
  last_title: string,
  next_id: number,
  next_title: string,
  messages: commitData[],
  messages_count: number,
  topic_photos: topicDetailPhotoData[]
}
export default () => {
  const [topicData, setTopicData] = useState<topicDetailData>();
  const location = useLocation();
  const { initialState, setInitialState } = useModel('@@initialState');
  const [authorAvatar, setAuthorAvatar] = useState('');
  const [comment, setComment] = useState('');
  const [reply, setReply] = useState('');
  const [modalControll, setModalControl] = useState<number>(-1)

  const t_id: string = location.pathname.split('/')[3];
  const username:string = location.pathname.split('/')[2];
  useEffect(() => {
    const fetchTopicInfo = async () => {
      if (initialState?.username) {
        const { code, data } = await getTopicDetail(username, t_id);
        setTopicData(data);
        if (code === 200) {
          const { data } = await getAuthorAvatar(username);
          setAuthorAvatar(unicodeToStr(data.avatar))
        }
      }
    }
    fetchTopicInfo();
  }, [])
  const sendCommit = async () => {
    if(comment === '') notification.error({message:'不能发布空白评论哦'});
    const {code} = await submitTopicComment(t_id,{content:comment});
    if(code === 200) notification.success({message:'评论成功，活跃度+1'});
    else notification.error({message:'评论时出错！'});
  }
  const sendReply = async (commentId:number) => {
    
    if(reply === '') notification.error({message:'不能回复空白信息哦'});
    const {code} = await submitTopicReply(t_id,{content:reply,parent_id:commentId});
    if(code === 200) notification.success({message:'回复成功，活跃度+1'});
    else notification.error({message:'回复时出错！'});
  }
  const openReplyModal = (commentId:number)=>{
    setModalControl(commentId);
  }
  const cancelReplyModal = ()=>{
    setModalControl(-1);
  }
  return (
    <div className={styles.container}>
      <div className={styles.topicMsg}>
        <Avatar
          shape="square"
          size="large"
          src={`http://www.wusi.fun/media/${authorAvatar}`}
          onClick={()=>{history.push(`/userinfo/${topicData?.author}`)}} 
          style={{cursor:'pointer'}}
        />
        <span className={styles.authorName}>{topicData?.author}</span>
        <span className={styles.publishTime}><FieldTimeOutlined />{topicData?.created_time}</span>
      </div>
      <div className={styles.imgRender}>
        {
          topicData?.topic_photos.map((item, index) => {
            return (
              <img key={index} src={`http://www.wusi.fun/media/${item.content}`} alt="topicPhoto" />
            )
          })
        }
      </div>
      <div className={styles.topicContent}>
        {
          topicData ? ReactHtmlParser(topicData?.content) : undefined
        }
      </div>
      <div className={styles.line}></div>
      <div className={styles.commentRender}>
        <div className={styles.commitInput}>
          <Input className={styles.innerInput} onChange={(e) => setComment(e.target.value)} placeholder='在这里发表评论'></Input>
          <Button type="primary" onClick={sendCommit}>评论</Button>
        </div>
        <div className={styles.commontAndReply}>
          {
            topicData?.messages.map((item, index) => {
              return (
                <>
                  <p className={styles.comment}>
                    <Avatar shape="circle"
                      size="large"
                      src={`http://www.wusi.fun/media/${unicodeToStr(item.publisher_avatar)}`}
                    />
                    <span className={styles.puber}>{item.publisher}:</span>
                    <span className={styles.content}>{item.content}</span>
                    <span className={styles.time}>@{item.created_time}</span>
                    <span className={styles.replyBtn} onClick={()=>{openReplyModal(item.id)}}>回复</span>
                  </p>
                  {
                    item.reply.map((reply, index) => {
                      return (
                        <p className={styles.reply} key={index}>
                          <Avatar shape="circle"
                            size="small"
                            src={`http://www.wusi.fun/media/${unicodeToStr(reply.publisher_avatar)}`}
                          />
                          <span>
                            <span className={styles.puber}>{reply.publisher}</span>
                            回复了
                            <span className={styles.rever}>{item.publisher}:</span>
                            <span className={styles.content}>{reply.content}</span>
                            <span className={styles.time}>@{reply.created_time}</span>
                          </span>
                          {/* 这里有个重要逻辑，后端需要作的，评论回复评论，目前只能回复主贴，即只有两层嵌套，正常评论回复逻辑是无限嵌套 */}
                          {/* <span className={styles.replyBtn} onClick={()=>{openReplyModal(item.id)}}>回复</span> */}
                        </p>
                      )
                    })
                  }
                  {
                    (modalControll === item.id) && (
                      <div className={styles.commitInput}>
                        <Input className={styles.innerInput} onChange={(e) => setReply(e.target.value)} placeholder='在这里进行回复'></Input>
                        <Button className={styles.innerBtn} type="primary" onClick={()=>{sendReply(item.id)}}>回复</Button>
                        <CloseOutlined  style={{opacity:0.6,cursor:'pointer'}} onClick={cancelReplyModal}/>
                      </div>
                    )
                  }
                  <div className={styles.line}></div>
                </>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}