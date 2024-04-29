import { Form, Input, Button, Card, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined, SolutionOutlined } from '@ant-design/icons';
import styles from './index.less'; // 引入 index.less 文件
import { useModel, history } from '@umijs/max';
import { logo } from '@/utils/imgApi';
import { useState } from 'react';
import { loginHandler as fetchLogin, getUserPermissions } from '@/services/api';
const { Title } = Typography;
const { Option } = Select;

export default () => {
  const [account, setAccount] = useState('');
  const [pwd, setPwd] = useState('');
  const [role, setRole] = useState('');
  const { initialState, setInitialState } = useModel('@@initialState');
  const onIdentityChange = (value: string) => {
    setRole(value);
  }
  const loginHandler = async () => {
    const { code, username, data } = await fetchLogin({ username: account, password: pwd, role: role });

    if (code === 200) {
      const userPermInfo = await getUserPermissions(username);
      const permCode = userPermInfo.code;
      const userPerm = userPermInfo.data;
      if (permCode === 200) {
        localStorage.setItem('username', username);
        localStorage.setItem('wusiToken', data.token);
        localStorage.setItem('blog_has_login', 'has');
        localStorage.setItem('userPerm',userPerm.toString());
        await setInitialState((s) => {
          return {
            ...s,
            username,
            token: data.token,
            hasLogin: 'has',
            userPerm: userPerm
          }
        })
        history.push('/home');
      }

    }
  }
  return (
    <div className={styles.container}>
      <Card className={styles.loginCard}>
        <Title level={2} className={styles.loginTitle}>
          <img src={logo} alt="logo" />
          wusi|blog
        </Title>
        <Form name="login" className={styles.loginForm}>
          <Form.Item name="role" rules={[{ required: true, message: 'Please select your identity!' }]} >
            <SolutionOutlined className={styles.loginFormItem} />
            <Select
              placeholder="Please select your identity"
              onChange={onIdentityChange}
              allowClear
              className={styles.roleSelect}
            >
              <Option value="0" perfix={<SolutionOutlined />}>普通用户</Option>
              <Option value="1">管理员</Option>
            </Select>
          </Form.Item>
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input prefix={<UserOutlined />} placeholder="请用账号:xby" onChange={(e) => { setAccount(e.target.value) }} />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="请用密码:111" onChange={(e) => { setPwd(e.target.value) }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.loginButton} onClick={loginHandler}>Login</Button>
          </Form.Item>
        </Form>
        <span className={styles.bottomText}>记录生活中的小细节</span>
      </Card>
    </div>
  );
};

