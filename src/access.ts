export default (initialState: any) => {
  console.log(initialState)
  const userPermissions = initialState.userPerm === undefined ?[]:initialState.userPerm;
  console.log(userPermissions)
  const judgeCanRead = ()=>{
    return userPermissions.includes(0) && !userPermissions.includes(4);
  }
  const judgeCanPublish = ()=>{
    return userPermissions.includes(1) && !userPermissions.includes(4);
  }
  const judgeCanEdit = ()=>{
    return userPermissions.includes(2) && !userPermissions.includes(4);
  }
  const judgeCanComment = ()=>{
    return userPermissions.includes(3) && !userPermissions.includes(4);
  }
  const isBanned = ()=>{
    return userPermissions.includes(4);
  }
  return {
    canRead:judgeCanRead,
    canPublish:judgeCanPublish,
    canEdit:judgeCanEdit,
    canComment:judgeCanComment,
    isBanned:isBanned
  };
};
