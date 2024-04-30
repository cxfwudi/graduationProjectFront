/* 这里有个重要逻辑，后端需要作的，评论回复评论，目前只能回复主贴，即只有两层嵌套，正常评论回复逻辑是无限嵌套 */
// 运行时配置
import { logo } from './utils/imgApi';
import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { host, perfix } from '../setting/apiPerfix';
import { settings } from '../setting/layoutDefault';
import { notification } from 'antd';
import RightContent from './components/RightContent';
import './global.less';
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化，获取权限存储进行统一管理
export async function getInitialState(): Promise<{
  settings?: any
  username?:string | null,
  token?: string | null,
  hasLogin?:string | null,
  userPerm?:string[] | null,
  role:string | null
}> {
  const hasLogin = localStorage.getItem('blog_has_login');
  if (history.location.pathname === '/login') {
    console.log("在登录出现")
    return {
      settings,
      username: '',
      token: '',
      role:'',
      hasLogin:hasLogin,
      userPerm:[]
    }
  } else {
    console.log("出现")
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('wusiToken');
    const userPerm = localStorage.getItem('userPerm');
    const role = localStorage.getItem('userRole')
    return {
      settings,
      username,
      token,
      hasLogin:hasLogin,
      userPerm:userPerm?.split(','),
      role:role
    }
  }

}
//请求拦截器
const requestInterceptor = (url: string, options: any) => {

  const notCarryTokenArr: string[] = ['/tokens'];
  if (notCarryTokenArr.includes(url)) {
    return {
      url: `${host}${perfix}${url}`,
      options,
    };
  }
  else {
    //此处使用useModel会报错，不知道为什么，暂时先存在localStorage
    const token:string|null = localStorage.getItem('wusiToken');
    return {
      url: `${host}${perfix}${url}`,
      options: {
        ...options,
        headers: {
          ...(options?.headers ?? {}),
          Authorization: `${token}`,    // 这里获取自己的token携带在请求头上
        },
      },
    };
  }
}
const responseInterceptor = (response:any)=>{
  const {data} = response;
  if(data.code !== 200) {
    console.log("相应拦截器触发")
    notification.error({
      message:data.error
    })
  }
  return response;
}
//此处的请求拦截器与响应拦截器会覆盖request.ts中的拦截设置
export const request: RequestConfig = {
  requestInterceptors: [requestInterceptor],
  responseInterceptors: [responseInterceptor]
}

//成功code,data 失败code,error
export const layout = () => {
  return {
    rightContentRender:() => <RightContent />,
    title: '钨丝|个人博客',
    logo: logo,
    menu: {
      locale: false,
    },
   
    layout: 'top',
    // splitMenus:true
  }
};
