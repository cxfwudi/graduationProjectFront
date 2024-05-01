import styles from './index.less'; // 引入 index.less 文件
import { InfoCircleTwoTone, CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Collapse, Pagination, Avatar, Tag } from 'antd';
import { getAllUserPermissions, addUserPermission, deleteUserPermission } from '@/services/api';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { useModel, history } from '@umijs/max';

const { Panel } = Collapse
export default () => {
  const [userPermissions, setUserPermissions] = useState<any>([])
  const [pageIndex, setPageIndex] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [permissionMove, setPermissionMove] = useState(true);
  const permReflection = ['查看', '发布', '修改', '评论', '封禁'];

  const fetchUserPermData = async () => {
    const { data, total } = await getAllUserPermissions(pageIndex);
    setTotalItems(Number(total));
    setUserPermissions(data)
  }

  const onPageChange = (page: number) => {
    setPageIndex(page)
  }

  useEffect(() => {
    fetchUserPermData();
  }, [pageIndex, permissionMove])

  const collapseHeader = (avatarUrl: string, username: string) => {
    if (avatarUrl === '') avatarUrl = 'avatar/刘能.jpg'
    return (
      <div className={styles.collapseHeaderContainer}>
        <Avatar src={`http://127.0.0.1:8000/media/${avatarUrl}`} />
        <span>{username}</span>
      </div>
    )
  }

  const deletePermission = async (role: number, username: string) => {
    const { code } = await deleteUserPermission({ userName: username, roleCode: role + '' })
    if (code === 200) {
      setPermissionMove(!permissionMove);
    }
  }

  const addPermission = async (role: number, username: string) => {
    const { code } = await addUserPermission({ userName: username, roleCode: role + '' })
    if (code === 200) {
      setPermissionMove(!permissionMove);
    }
  }

  const panelContent = (permissions: any[], username: string) => {
    const allPermissions = [0, 1, 2, 3, 4];
    permissions = permissions.map((item) => parseInt(item))
    //没有的权限
    const nonePermissions = allPermissions.filter((item) => {
      return !permissions.includes(item)
    })

    return (
      <div className={styles.permListItem}>
        <div className={styles.hasPerm}>
          已有权限:
          {
            permissions.map((item, index) => {
              return (
                <Tag className={styles.itemTag} color="#87d068" closeIcon onClose={() => { deletePermission(item, username) }} key={nanoid()}>{permReflection[item]}</Tag>
              )
            })
          }
        </div>
        <div className={styles.nohasPerm}>
          未有权限:
          {
            nonePermissions.map((item, index) => {
              return (
                <Tag className={styles.itemTag} color="#f50" closeIcon={<PlusOutlined />} onClose={() => { addPermission(item, username) }} key={nanoid()}>{permReflection[item]}</Tag>
              )
            })
          }
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <img src={require('@/assets/bg/manage.jpg')} alt="背景" />
      <div className={styles.filterText}>
        <span className={styles.articleListText}>用户管理</span>
      </div>
      <Card className={styles.userManageCard}>
        <div>
          <span className={styles.cardText}>用户管理</span>
          <InfoCircleTwoTone />
        </div>
        <div className={styles.permList}>
          <Collapse defaultActiveKey={['1']} >
            {
              userPermissions.map((item: any, index: any) => {
                return (
                  <Panel header={collapseHeader(item.userAvatar, item.userName)} key={index}>
                    {panelContent(item.permList, item.userName)}
                  </Panel>
                )
              })
            }
          </Collapse>
        </div>
        <Pagination defaultPageSize={5} defaultCurrent={1} total={totalItems} onChange={onPageChange} className={styles.fenpian} />
      </Card>
    </div>
  )
}