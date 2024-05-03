//个人信息页
import { Tooltip, Pagination, Form, Input, Button, Card, Typography, notification, Avatar } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import styles from './index.less'; // 引入 index.less 文件
import { useEffect, useRef, useState } from 'react';
import { useModel, history, useLocation } from '@umijs/max';
import { ListTopics, currentUser, updateUserInfo, uploadAvatar as fetchUploadAvatar } from '@/services/api';
import { unicodeToStr } from '@/utils';
import { useAccess, Access } from 'umi';
const { Title } = Typography;

interface ListTopicData {
  id: string,
  title: string,
  category: string,
  created_time: string,
  introduce: string,
  author: string,
  photos: string[]
}
export default () => {
  const [form] = Form.useForm();
  const [account, setAccount] = useState('');
  const [sign, setSign] = useState('');
  const [email, setEmail] = useState('');
  const [introd, setIntrod] = useState('');
  const [avatar, setAvatar] = useState('');
  const avatarRef = useRef<HTMLInputElement>(null);
  //文章
  const [pageIndex, setPageIndex] = useState(1);
  const [category, setCatrgory] = useState('all');
  const [totalItems, setTotalItems] = useState(0);
  const [dataItems, setDataItems] = useState<ListTopicData[]>([]);
  const { initialState, setInitialState } = useModel('@@initialState');
  const location = useLocation();
  const username = location.pathname.split('/')[2];
  const access = useAccess();
  useEffect(() => {
    if (initialState?.hasLogin === 'no-has') {
      history.push('/404')
    }
  }, [initialState?.hasLogin])
  const getUserInfo = async () => {
    const { data } = await currentUser(username);
    setAvatar(unicodeToStr(data.avatar));
    form.setFieldsValue({
      username: data.nickname,
      sign: data.sign,
      email: data.email,
      introd: data.info
    })
    setAccount(data.nickname);
    setEmail(data.email);
    setIntrod(data.info);
    setSign(data.sign);
  }
  const fetchListData = async () => {

    const { data } = await ListTopics(`${pageIndex}`, category, username);
    setTotalItems(Number(data.total));
    setDataItems(data.topics);
  }
  useEffect(() => {

    if (initialState?.hasLogin === 'has') {
      getUserInfo();
      fetchListData();
    }
  }, [])

  useEffect(() => {
    if (initialState?.hasLogin === 'has') {
      getUserInfo();
      fetchListData();
    }
  }, [location.pathname])

  const updateInfo = async () => {
    if (initialState?.username) {
      const { code } = await updateUserInfo(initialState?.username, {
        nickname: account,
        sign: sign,
        email: email,
        info: introd
      })
      if (code === 200) {
        notification.success({
          message: '修改成功'
        })
      }
    } else {
      notification.error({
        message: '请登录'
      })
    }

  }
  const uploadAvatar = async () => {
    const formdataAvatar = new FormData();
    if (avatarRef.current?.files !== null) {
      if (avatarRef.current?.files[0]) {
        formdataAvatar.append('avatar', avatarRef.current?.files[0]);
      } else {
        notification.error({
          message: "请选择合适的图片"
        })
      }
    }
    if (initialState?.username) {
      const { code } = await fetchUploadAvatar(formdataAvatar, initialState?.username)
      if (code === 200) notification.success({
        message: '修改成功'
      })
    }

  }
  const gotoTopicDetail = (author: string, topicId: string) => {
    if (!access.canRead()) {
      notification.error({
        message: '您暂时没有权限阅读，请联系管理员'
      })
    }
    history.push(`/topic/${author}/${topicId}`)
  }
  const onPageChange = (page: number) => {
    setPageIndex(page)
  }
  useEffect(() => {
    const fetchListData = async () => {

      const { data } = await ListTopics(`${pageIndex}`, category, username);
      setTotalItems(Number(data.total));
      setDataItems(data.topics);

    }
    fetchListData();
  }, [pageIndex])
  return (
    <div className={styles.container}>
      <Card className={styles.loginCard}>
        <Title level={2} className={styles.loginTitle}>
          个人信息
        </Title>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarImg}>
            <Avatar size={100} shape='square' src={`http://127.0.0.1:8000/media/${avatar}`} />
          </div>
          <div className={styles.avatarUplodaBtn}>
            <label htmlFor="fileinp" className={styles.avatarLabel}>
              <input type="button" id="btn" value="更新头像" className={styles.updateBtn} />
              <input type="file" ref={avatarRef} className={styles.upload} onChange={uploadAvatar} />
            </label>
          </div>
        </div>
        <Form name="login" className={styles.loginForm} form={form}>
          <Form.Item name="username" label="昵称">
            <Input placeholder="Username" onChange={(e) => { setAccount(e.target.value) }} />
          </Form.Item>
          <Form.Item name="sign" label="签名">
            <Input placeholder="sign" onChange={(e) => { setSign(e.target.value) }} />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
          </Form.Item>
          <Form.Item name="introd" label="简介">
            <Input placeholder="introduce" onChange={(e) => { setIntrod(e.target.value) }} />
          </Form.Item>

          <Form.Item>
            {username === initialState?.username && (<Button type="primary" htmlType="submit" className={styles.loginButton} onClick={updateInfo}>修改信息</Button>)}
          </Form.Item>
        </Form>

        <span className={styles.bottomText}>记录生活中的小细节</span>
      </Card>
      <Card className={styles.topicRender}>
        <div className={styles.topicList}>
          {
            dataItems.map((item, index) => {
              return (
                <Tooltip title="点击查看文章详情">
                  <div className={styles.topicImg} key={index}>
                    <img src=
                      {item.photos[0] ? `http://127.0.0.1:8000/media//${item.photos[0]}`
                        : require('@/assets/no-img.jpg')
                      } alt="文章图片"
                      onClick={() => { gotoTopicDetail(item.author, item.id) }}
                    />
                    {/* <span className={styles.toolTip}>点击查看详细文章</span> */}
                  </div>
                </Tooltip>

              )
            })
          }
        </div>
        <Pagination defaultCurrent={1} total={totalItems} onChange={onPageChange} className={styles.fenpian} />
      </Card>
    </div>
  );
};

