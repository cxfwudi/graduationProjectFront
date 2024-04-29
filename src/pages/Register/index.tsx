import { Form, Input, Button, Card, Typography, notification } from 'antd';
import { UserOutlined, LockOutlined,PhoneOutlined,MailOutlined } from '@ant-design/icons';
import styles from './index.less'; // 引入 index.less 文件
import { useModel,history } from '@umijs/max';
import { logo } from '@/utils/imgApi';
import { useState } from 'react';
import { registerHandler as fetchRegister } from '@/services/api';
const { Title } = Typography;

export default () => {
  const [account, setAccount] = useState('');
  const [phone,setPhone] = useState('');
  const [email,setEmail] = useState('');
  const [pwd_1, setPwd_1] = useState('');
  const [pwd_2, setPwd_2] = useState('');
  const { initialState, setInitialState } = useModel('@@initialState');
  const loginHandler = async () => {
    const { code, username, data } = await fetchRegister({ username: account, phone,email,password_1: pwd_1,password_2:pwd_2,identifying:'' });
    
    if (code === 200) {
      notification.success({
        message:'注册成功'
      })
      history.push('/login');
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
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" onChange={(e) => { setAccount(e.target.value) }} />
          </Form.Item>
          <Form.Item name="phone" rules={[{ required: true, message: 'Please input your phone!' }]}>
            <Input prefix={<PhoneOutlined />} placeholder="Phone" onChange={(e) => { setPhone(e.target.value) }} />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
          </Form.Item>
          <Form.Item name="password_1" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password_1" onChange={(e) => { setPwd_1(e.target.value) }} />
          </Form.Item>
          <Form.Item name="password_2" rules={[{ required: true, message: 'Please input your password again!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password_2" onChange={(e) => { setPwd_2(e.target.value) }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.loginButton} onClick={loginHandler}>注册</Button>
          </Form.Item>
        </Form>
        <span className={styles.bottomText}>记录生活中的小细节</span>
      </Card>
    </div>
  );
};

