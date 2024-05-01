import access from "@/access";

export default [
  {
    path: '/',
    component: 'Home',
  },
  {
    path: '/home',
    component: 'Home',
    name: '主页'
  },
  {
    path: '/find',
    component: 'Find',
    name: '发现'
  },
  {
    path: '/publish',
    component: 'Topic/Publish',
    name: '发布文章',
    access:'canPublish'
  },
  {
    path: '/list',  //当前入口只有自己看自己的文章列表
    component: 'List',
    name: '管理文章',
    menuRender: false
  },
  {
    path:'/manage',
    component:'Manage',
    name:'权限管理',
    access:'isManager'
  },
  {
    path: '/login',
    component: 'Login',
    layout: false,  //关闭整体布局
  },
  {
    path: '/register',
    component: 'Register',
    layout: false
  },
  {
    path: '/userinfo/:username',
    component: 'UserInfo'
  },
  {
    path:'/topic/:username/:t_id',
    component:'Topic/Content'
  },
  {
    path:'/topic/update/:t_id',
    component:'Topic/Publish'
  },
  {
    path:'/404',
    component:'NotFound'
  }
]