import { LoadingOutlined } from '@ant-design/icons';
export default () => {
  

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize:'3vw',
    fontWeight:'blod',
  };

  return (
    <div style={containerStyle}>
      <LoadingOutlined style={{color:'blue'}} />
    </div>
  );
};

