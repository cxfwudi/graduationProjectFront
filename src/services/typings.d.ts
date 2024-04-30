declare namespace API {
  interface UserInfoDetail{
    info:string,
    sign:string,
    nickname:string,
    avatar:string,
    email:string
  }
  interface UserInfo{
    code:number,
    username:string,
    data:UserInfoDetail
  }
  interface LoginData{
    code:number,
    username:string,
    data:{
      token:string,
      role:string
    }
  }
  interface registerData{
    code:number,
    username:string,
    data:{}
  }
  interface TopicData{
    photo:string[],
    id:number,
    title:string,
    category:string,
    created_time:string,
    introduce:string,
    author:string,
    author_avatar:string
  }
  interface ArticleData{
    code:number,
    data:{
      topics:TopicData[]
    }
  }
  interface ListTopicData{
    id:string,
    title:string,
    category:string,
    created_time:string,
    introduce:string,
    author:string,
    photos:string[]
  }
  interface articleList{
    code:number,
    data:{
      total:string,
      nickname:string,
      topics:ListTopicData
    }
  }
  interface replyData{
    id:number,
    publisher:string,
    publisher_avatar:string,
    content:string,
    created_time:string,
  }
  interface commitData{
    id:number,
    publisher:string,
    publisher_avatar:string,
    content:string,
    created_time:string,
    reply:replyData[]
  }
  interface topicDetailPhotoData{
    id:number,
    content:string
  }
  interface topicDetailData{
    code:number,
    data:{
      nickname:string,
      title:string,
      category:string,
      limit:string,
      created_time:string,
      content:string,
      content_text:string,
      introduce:string,
      author:string,
      last_id:number,
      last_title:string,
      next_id:number,
      next_title:string,
      messages:commitData[],
      messages_count:number,
      topic_photos:topicDetailPhotoData[]
    }
  }
  interface userPermissions{
    code:number,
    data:[]
  }
  interface signleUserPerm{
    username:string,
    userAvatar:string,
    permList:[]
  }
  interface allUserPerm{
    code:number,
    total:number
    data:signleUserPerm[]
  }
}