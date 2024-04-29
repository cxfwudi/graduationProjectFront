import { useModel } from "@umijs/max";
import styles from './index.less'
import {Tooltip, Card, Space, Row, Col, Avatar } from "antd";
import { WechatOutlined, UnorderedListOutlined, QqOutlined, RedditOutlined, InstagramOutlined } from "@ant-design/icons";
import { randomTopics } from '../../services/api';
import { useEffect, useState } from "react";
import { unicodeToStr } from "@/utils";
import { history } from "@umijs/max";

const { Meta } = Card;
export default () => {
  const [topicsData, setTopicsData] = useState<API.TopicData[]>([]);
  const { initialState, setInitialState } = useModel('@@initialState');
  console.log(initialState)
  const cardTitle = (type: string) => {
    if (type === 'content') {
      return (
        <>
          <RedditOutlined />一些话
        </>
      )
    } else if (type === 'photo') {
      return (
        <>
          <InstagramOutlined /> 一些照片
        </>
      )
    } else {
      return (
        <>
          <UnorderedListOutlined />一些文章
        </>
      )
    }
  }
  
  useEffect(() => {
    if(initialState?.hasLogin === 'no-has' || localStorage.getItem('blog_has_login') != 'has') history.push('/login');
    const fetchRandomsTopics = async () => {
      const { data } = await randomTopics();
      const { topics } = data;
      setTopicsData(topics);
    }
    fetchRandomsTopics();
  }, []);
  const picture_22 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const topicTitle = (title:string,username:string,t_id:string)=>{
    return (
      <span onClick={()=>{history.push(`/topic/${username}/${t_id}`)}} style={{cursor:'pointer'}}>
        {title}
      </span>
    )
  }
  return (
    <div className={styles.container}>
      <div className={styles.introd}>
        <div className={styles.text_des}>
          <div className={styles.title}>钨丝</div>
          <div className={styles.signature}>遇事不决，可问春风。春风不语，即随本心。</div>
          <div className={styles.contact}>
            <Tooltip title="cxf2060426040">
              <WechatOutlined />微信
            </Tooltip>
            <Tooltip title="2060426040">
              <QqOutlined />QQ
            </Tooltip>
          </div>
        </div>
      </div>
      <Space direction="vertical" className={styles.card_contaienr} id="part-1">
        <Card title={cardTitle('content')}>
          <p style={{ textAlign: 'center' }}>
            知而不行，谓之不诚。<br />
            行而不成，谓之不能。<br />
            知而行，是赤诚之心，行而能，是贯彻到底，已经很难被其他人和事影响了。<br />
            而知行合一的前提是，格物致知，将一件事研究到极致，变成自己的知识。<br />
            比如做菜，将做菜这门手艺做到尽善尽美，色香味无可挑剔。<br />
            比如建筑，将楼宇亭台建得坚固美观使用，美轮美奂，风雨不倒地震不塌；<br />
            比如造船，将造船原理吃透，用料坚固，风浪不沉。<br />
            这便是格物致知，将一件东西一件事情研究到极点，明白其中所有的道理。<br />
            做到格物致知，方能知行合一。
          </p>
        </Card>
        <Card title={cardTitle('photo')}>
          <Row className={styles.photo_card}>
            {
              picture_22.map((item, index) => {
                return (
                  <Col span={8} key={index}>
                    
                    <Card
                      className={styles.photo_card_item}
                      cover={
                        <img
                          alt="example"
                          src={require(`../../assets/22picture/${item}.jpg`)}
                          className={styles.card_img}
                        />
                      }
                    >
                      <Meta
                        title={`2022年照片集第${item}张`}
                      />
                    </Card>
                  </Col>

                )
              })
            }
          </Row>
        </Card>
        <Card title={cardTitle('article')}>
          {/* 此处内容需要加连接指向文章详情页 */}
          <Row className={styles.photo_card}>
            {
              topicsData.map((item, index) => {
                return (
                  <Col span={8} key={index}>
                    <Card
                      className={styles.photo_card_item}
                      cover={
                        <img
                          alt="example"
                          src={`http://www.wusi.fun/media/${item.photos[0]}`}
                          className={styles.card_img}
                        />
                      }
                    >
                      <Meta
                        title={topicTitle(item.title,item.author,String(item.id))}
                        description={item.introduce}
                        avatar={
                        <Avatar 
                        src={`http://www.wusi.fun/media/${unicodeToStr(item.author_avatar)}`}
                        onClick={()=>{history.push(`/userinfo/${item.author}`)}} 
                        style={{cursor:'pointer'}}
                        />
                      }
                      />
                    </Card>
                  </Col>
                )
              })
            }
          </Row>
        </Card>
      </Space>
      <div className={styles.beian}>
        Copyright © 2022
        <a href="http://www.wusi.fun" style={{textDecorationLine:'none',color:'black'}}>钨丝个人博客</a>
        All Rights Reserved |
        备案号：<a href="https://beian.miit.gov.cn" style={{textDecorationLine:'none',color:'black'}}>黑ICP备2022009410号</a>
      </div>
    </div>
  )
}