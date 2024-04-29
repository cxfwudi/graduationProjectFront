import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Button, Modal, Upload, Cascader, Input, notification } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { useModel, useLocation } from "@umijs/max";
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import MyEditor from '@/components/WangEditor';
import { publishTopicText, publishTopicPhotos, getTopicDetail, updateTopic as updateTopicData, updateTopicPhotos } from '@/services/api'
import styles from './index.less';
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface limitAndCategoryOption {
  value: string,
  label: string
}
interface replyData {
  id: number,
  publisher: string,
  publisher_avatar: string,
  content: string,
  created_time: string,
}
interface commitData {
  id: number,
  publisher: string,
  publisher_avatar: string,
  content: string,
  created_time: string,
  reply: replyData[]
}
interface topicDetailPhotoData {
  id: number,
  content: string
}
interface topicData {
  nickname: string,
  title: string,
  category: string,
  limit: string,
  created_time: string,
  content: string,
  content_text: string,
  introduce: string,
  author: string,
  last_id: number,
  last_title: string,
  next_id: number,
  next_title: string,
  messages: commitData[],
  messages_count: number,
  topic_photos: topicDetailPhotoData[]
}
const limitOptions: limitAndCategoryOption[] = [
  {
    value: 'private',
    label: '个人的'
  },
  {
    value: 'public',
    label: '公开的'
  }
]
const categoryOptions: limitAndCategoryOption[] = [
  {
    value: 'tec',
    label: '科技'
  },
  {
    value: 'no-tec',
    label: '其他'
  }
]
export default () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);  //文章中的照片
  const [limitValue, setLimitValue] = useState('');
  const [categoryValue, setCategoryValue] = useState('');
  const [titleValue, setTitleValue] = useState('');
  const [htmlContent, setHtmlContent] = useState('');  //富文本编辑器带有结构的内容
  const [textContent, setTextContent] = useState('');  //富文本编辑器纯内容
  const [initEditorContent, setInitEditorContent] = useState<string>('');
  const location = useLocation();
  const t_id: string | null = location.pathname.split('/')[3];
  const { initialState, setInitialState } = useModel('@@initialState');
  const onLimitChange = (value: any) => {
    if (!value) notification.error({
      message: '此字段不能为空'
    })
    setLimitValue(value[0]);
  }
  const onCategoryChange = (value: any) => {
    if (!value) notification.error({
      message: '此字段不能为空'
    })
    setCategoryValue(value[0])
  }
  const onTitleChange = (e: any) => {
    if (e.target.value === '') notification.error({
      message: '此字段不能为空'
    })
    setTitleValue(e.target.value)
  }

  const getEditorCotennt = (SendHtmlContent: string, SendTextContent: string) => {
    setHtmlContent(SendHtmlContent);
    setTextContent(SendTextContent);
  }

  const publishTopic = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      if(file.originFileObj){
        formData.append('files', file.originFileObj);
      }
    });
    const username = initialState?.username;
    if(username) formData.append('username',username);
    
    if (username && limitValue !== '' && categoryValue != '' && titleValue != '' && htmlContent != '') {
      const { code } = await publishTopicText({
        content: htmlContent,
        content_text: textContent,
        limit: limitValue,
        category: categoryValue,
        title: titleValue
      }, username);
      if (code === 200) {
        const { code } = await publishTopicPhotos(formData, username);
        if (code === 200) {
          notification.success({
            message: '上传成功啦'
          })
        }
      }
    } else {
      notification.error({
        message: '请检查是否有空字段'
      })
    }
  }

  const updateTopic = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      if(file.originFileObj){
        formData.append('files', file.originFileObj);
      }
    });
    const username = initialState?.username;
    if(username) formData.append('username',username);
    if (username && limitValue !== '' && categoryValue != '' && titleValue != '' && htmlContent != '') {
      const { code } = await updateTopicData({
        content: htmlContent,
        content_text: textContent,
        limit: limitValue,
        category: categoryValue,
        title: titleValue
      }, username, t_id);
      if (code === 200) {
        const { code } = await updateTopicPhotos(formData, username, t_id);
        if (code === 200) {
          notification.success({
            message: '修改成功啦'
          })
        }
      }
    } else {
      notification.error({
        message: '请检查是否有空字段'
      })
    }
  }

  useEffect(() => {
    if (t_id) {
      const username = initialState?.username;
      if (username) {
        const getTopic = async () => {
          const { data } = await getTopicDetail(username, t_id);
          const photos: UploadFile[] = [];
          data.topic_photos.forEach((item: topicDetailPhotoData, index: number) => {
            // const file = await urlToFile(`http://www.wusi.fun/media/${item.content}`)
            const uploadFile: UploadFile = {
              uid: `${t_id}fileId`, // 使用固定的 uid，可以是任意字符串
              name: 'image.jpg', // 设置文件名
              type: 'image/jpeg', // 设置文件类型，根据实际情况修改
              size: 0, // 设置文件大小，根据实际情况修改
              url: `http://www.wusi.fun/media/${item.content}`, // 设置图片的 URL
              originFileObj: undefined, // 这里设为 null，因为没有原始的 File 对象
              status: 'done', // 设置文件状态为 'done'
              response: null, // 这里设为 null，没有上传响应数据
            };
            photos.push(uploadFile);
          })
          setFileList(photos);
          setTitleValue(data.title);
          setLimitValue(data.limit);
          setCategoryValue(data.category);
          setInitEditorContent(data.content)
        }
        getTopic();
      }
    }
  }, [])
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    //手动进行上传
    beforeUpload: () => {
      return false;
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    fileList,
    listType: 'picture-card',
    onPreview: async (file: UploadFile) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as RcFile);
      }
      setPreviewImage(file.url || (file.preview as string));
      setPreviewOpen(true);
      setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    }
  }

  return (
    <div className={styles.container}>
      <img src={require('@/assets/bg/publish.jpg')} alt="背景" />
      <div className={styles.middleTip}>
        <span>发布文章</span>
        <span>我们都在旅途中</span>
      </div>
      <div className={styles.line}></div>
      <div className={styles.cardContainer}>
        <div className={styles.cardLeft}>
          <Upload
            {...props}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)} keyboard>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
          <Input required value={titleValue} className={styles.titleInput} onChange={(e) => { onTitleChange(e) }} placeholder='文章标题' />
          <Cascader value={[limitValue]} className={styles.limitSelect} options={limitOptions} onChange={onLimitChange} placeholder="Please select" />
          <Cascader value={[categoryValue]} options={categoryOptions} onChange={onCategoryChange} placeholder="Please select" />
        </div>
        <div className={styles.cardRight}>
          <MyEditor htmlValue={initEditorContent} transferEditorContent={getEditorCotennt} />
          {
            location.pathname.split('/')[3] ?
              <Button onClick={updateTopic} style={{ marginTop: '10px' }}>更新文章</Button> :
              <Button onClick={publishTopic} style={{ marginTop: '10px' }}>发布文章</Button>
          }
        </div>
      </div>
    </div>
  )
}