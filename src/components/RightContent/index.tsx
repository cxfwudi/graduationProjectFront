import { Dropdown, Space, Avatar, Divider, notification } from 'antd';
import { DownOutlined, PlusOutlined, AlignLeftOutlined, BlockOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useModel, history } from '@umijs/max';
import { Link } from '@umijs/max';
import styles from './index.less'
import { useEffect, useState } from 'react';
import { currentUser } from '@/services/api';
import { unicodeToStr } from '@/utils';
export default () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const hasLogin = initialState?.hasLogin;
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        initialState?.hasLogin === 'has'&&
        <Link to={`/userinfo/${initialState?.username}`}>
          我的
        </Link>
      ),
      icon: initialState?.hasLogin === 'has' && <AlignLeftOutlined />
    },
    {
      key: '2',
      label: (
        <Link to='./register'>注册</Link>
      ),
      icon: <PlusOutlined />,
    },
    {
      key: '3',
      label: (
        hasLogin === null || hasLogin === 'no-has' ?
          <div>
            <Link to={'/login'}>登录</Link>
          </div>
          :
          <div onClick={
            async () => {
              localStorage.removeItem('wusiToken');
              localStorage.removeItem('username');
              localStorage.removeItem('userPerm');
              localStorage.setItem('blog_has_login', 'no-has');
              await setInitialState((s) => {
                return {
                  ...s,
                  token: '',
                  hasLogin:'no-has'
                }
              })
              notification.error({
                message: '退出成功！'
              })
              history.push('/login');
            }}>
            退出
          </div>
      ),
      icon: <BlockOutlined />
    }
  ];
  const [avatarUrl, setAvatarUrl] = useState('');
  let avatarUrlTemp = '';
  const getUserAvatar = async () => {
    if (initialState?.username) {
      const { data } = await currentUser(initialState?.username);
      avatarUrlTemp = data.avatar;
      setAvatarUrl(unicodeToStr(avatarUrlTemp));
    }
  }

  const avatarControl = () => {
    if (initialState?.hasLogin === 'no-has' || initialState?.hasLogin === null) {
      avatarUrlTemp = 'avatar/刘能.jpg';
      setAvatarUrl(avatarUrlTemp)
    } else {
      getUserAvatar();
    }
  }

  useEffect(() => {
    avatarControl();
  }, [initialState?.hasLogin])
  useEffect(() => {
    avatarControl();

  }, [])
  return (
    <Dropdown menu={{ items }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <Avatar size={36} src={`http://127.0.0.1:8000/media//${avatarUrl}`} />
          <DownOutlined className={styles.moreOper} />
        </Space>
      </a>
    </Dropdown>
  )
}
