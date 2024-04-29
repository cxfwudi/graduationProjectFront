import { useState, useEffect, useRef } from "react"
import { Cascader } from 'antd';
import styles from './index.less';
import ListItem from '@/components/ListItem';
import { Pagination } from 'antd';
import { ListTopics } from '@/services/api'
import { useModel,history } from "@umijs/max";
interface Option {
  value: string;
  label: string;
}
interface ListTopicData {
  id: string,
  title: string,
  category: string,
  created_time: string,
  introduce: string,
  author: string,
  photos: string[]
}
export default () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [category, setCatrgory] = useState('all');
  const [totalItems, setTotalItems] = useState(0);
  const [dataItems, setDataItems] = useState<API.ListTopicData[]>([]);
  const { initialState, setInitialState } = useModel('@@initialState');
  const [carryDelete,setCarryDelete] = useState<boolean>(false);
  const options: Option[] = [
    {
      value: 'tec',
      label: '科技'
    },
    {
      value: 'no-tec',
      label: '其他'
    },
    {
      value: '',
      label: '全部'
    }
  ]
  useEffect(()=>{
    if(initialState?.hasLogin === 'no-has'){
      history.push('/404')
    }
  },[initialState?.hasLogin])
  const onFilterChange = (value: any) => {
    setCatrgory(value[0]);
  }
  const onPageChange = (page: number) => {
    setPageIndex(page)
  }
  const fetchListData = async () => {
    if (initialState?.username) {
      const { data } = await ListTopics(`${pageIndex}`, category, initialState?.username);
      setTotalItems(Number(data.total));
      setDataItems(data.topics);
    }
  }
  const deleteSuccess = (isDelete:boolean)=>{
    setCarryDelete(!carryDelete);
  }
  useEffect(()=>{
    fetchListData();
  },[carryDelete])
  useEffect(() => {
    fetchListData();
  }, [category, pageIndex])
  useEffect(() => {
    fetchListData();
  }, [])
  return (
    <div className={styles.container}>

      <img src={require('@/assets/bg/list.png')} alt="背景" />
      <div className={styles.filterText}>
        <span className={styles.articleListText}>文章列表</span>
        <Cascader className={styles.filter} options={options} onChange={onFilterChange} placeholder="Please select" />
      </div>

      {
        dataItems.map((item, index) => {
          return <ListItem deleteSuccess={deleteSuccess} key={index} params={item}></ListItem>
        })
      }
      <Pagination defaultCurrent={1} total={totalItems} onChange={onPageChange} className={styles.fenpian} />
    </div >
  )
}