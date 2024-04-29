//组件中的状态应该由父组件进行管理，这个组件只是一个工具，唯一的状态实在初始化时用到
import '@wangeditor/editor/dist/css/style.css'
import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
function MyEditor(props: {
  transferEditorContent: (SendHtmlContent:string,sendTextContent:string) => void,
  htmlValue:string
}) {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null);

  // 编辑器内容
  const [html, setHtml] = useState<string>('请在这里进行编辑');
  
  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
  }
  
  const [initEditorValue,setInitEditorValue] = useState<string>('');

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: [
      'headerSelect',
      '|',
      'group-more-style',
      'color',
      'bgColor',
      'fontSize',
      'fontFamily',
      'lineHeight',
      'todo',
      'group-image',
      'group-video',
      'insertTable',
      'codeBlock',
      'divider',
      'undo',
      'redo'
    ]
  }
  
  const { transferEditorContent } = props;
  //编辑时发送给父组件
  const sendContent = (editor: IDomEditor) => {
    //在这里调用setHtml会发生问题，死循环(和执行顺序有关)
    transferEditorContent(editor.getHtml(),editor.getText());
  }

  useEffect(()=>{
    setHtml(props.htmlValue);
  },[props.htmlValue])

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => sendContent(editor)}
          mode="default"
          style={{ height: '400px', overflowY: 'hidden' }}
        />
      </div>
    </>
  )
}

export default MyEditor