import { useRequest, request } from "umi";
export const currentUser = (username: string) => {
  return request<API.UserInfo>(`/users/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

//修改个人信息
export const updateUserInfo = (username: string, params: {
  nickname: string,
  sign: string,
  info: string,
  email: string
}) => {
  return request<{ code: number }>(`/users/${username}`, {
    method: 'PUT',
    data: { ...params }
  })
}

export const uploadAvatar = (formdata: FormData, username: string) => {
  return request<{ code: number }>(`/users/${username}/avatar`, {
    method: 'POST',
    data: formdata,
    processData: false,
    contentType: false,
  })
}

export const loginHandler = (params: {
  username: string,
  password: string,
  role: string
}) => {
  return request<API.LoginData>('/tokens', {
    method: 'POST',
    data: { ...params },
  })
}

export const registerHandler = (
  params: {
    username: string,
    email: string,
    phone: string,
    password_1: string,
    password_2: string,
    identifying: string
  }
) => {
  return request<API.registerData>('/users', {
    method: 'POST',
    data: { ...params }
  })
}

export const randomTopics = () => {
  return request<API.ArticleData>('/topics', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const findTopics = (page: string) => {
  return request<API.ArticleData>(`/topics/?page=${page}`, {
    method: 'GET'
  })
}

export const ListTopics = (page: string, category: string, username: string) => {
  return request<API.articleList>(`/topics/${username}?page=${page}&category=${category}`, {
    method: 'GET'
  })
}

export const publishTopicText = (data: {
  content: string,
  content_text: string,
  limit: string,
  title: string,
  category: string
}, username: string) => {
  return request<{ code: number }>(`/topics/${username}`, {
    method: 'POST',
    data: data
  })
}

export const publishTopicPhotos = (data: FormData, username: string) => {
  return request<{ code: number }>(`/topicPhotos/${username}`, {
    method: 'POST',
    data: data
  })
}

export const getTopicDetail = (useranme: string, t_id: string) => {
  return request<API.topicDetailData>(`/topics/${useranme}?t_id=${t_id}`, {
    method: 'GET'
  })
}

export const submitTopicComment = (topic_id: string, params: { content: string }) => {
  return request<{ code: number }>(`/messages/${topic_id}`, {
    method: 'POST',
    data: params
  })
}

export const submitTopicReply = (topic_id: string, params: { content: string, parent_id: number }) => {
  return request<{ code: number }>(`/messages/${topic_id}`, {
    method: 'POST',
    data: params
  })
}

export const updateTopic = (data: {
  title: string,
  content: string,
  content_text: string,
  limit: string,
  category: string
},
  blogUsername: string,
  t_id: string
) => {
  return request<{ code: number }>(`/topics/${blogUsername}?t_id=${t_id}`, {
    method: 'PUT',
    data: data
  })
}

export const updateTopicPhotos = (data: FormData, username: string, t_id: string) => {
  return request<{ code: number }>(`/topicPhotos/${username}?t_id=${t_id}`, {
    method: 'POST',
    data: data
  })
}

export const deleteTopic = (username: string, t_id: string) => {
  return request<{ code: number }>(`/topics/${username}?t_id=${t_id}`, {
    method: 'DELETE'
  })
}

export const addUserPermission = (params:{userName:string,roleCode:string})=>{
  return request<{code:number}>('/permission',{
    method:'POST',
    data:params
  })
}

export const deleteUserPermission = (params:{userName:string,roleCode:string})=>{
  return request<{code:number}>('/permission',{
    method:'DELETE',
    data:params
  })
}
//路由权限控制
export const getUserPermissions = (userName: string) => {
  return request<API.userPermissions>(`/permission?userName=${userName}`, {
    method: 'GET'
  })
}
//管理员
export const getAllUserPermissions = (pageIndex:number) => {
  return request<API.allUserPerm>(`/permission?page=${pageIndex}`,{
    method:'GET'
  })
}