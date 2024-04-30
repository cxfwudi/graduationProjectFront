import styles from './index.less'; // 引入 index.less 文件
import { InfoCircleTwoTone } from '@ant-design/icons';
import { Card, Collapse, Pagination, Avatar } from 'antd';
import { getAllUserPermissions, addUserPermission, deleteUserPermission } from '@/services/api'
import { useEffect, useState } from 'react';
import { useModel, history } from '@umijs/max';
const { Panel } = Collapse
export default () => {
  const [userPermissions, setUserPermissions] = useState<any>([])
  const [pageIndex, setPageIndex] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
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
  }, [])
  console.log(userPermissions)
  const collapseHeader = (avatarUrl: string, username: string) => {
    if (avatarUrl === '') avatarUrl = 'avatar/刘能.jpg'
    return (
      <div>
        <Avatar src={`http://127.0.0.1/media/${avatarUrl}`} />
        <span>{username}</span>
      </div>
    )
  }
  const panelContent = (permissions:[])=>{
    return(
      <div>
        
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
            <Panel header="This is panel header 1" key="1">
              <p>dadwadawdawd</p>
            </Panel>
            <Panel header="This is panel header 2" key="2">
              <p>dadwadawdawd</p>
            </Panel>
            <Panel header="This is panel header 3" key="3">
              <p>dadwadawdawd</p>
            </Panel>
          </Collapse>
        </div>
        <Pagination defaultCurrent={1} total={totalItems} onChange={onPageChange} className={styles.fenpian} />
      </Card>

    </div>
  )
}