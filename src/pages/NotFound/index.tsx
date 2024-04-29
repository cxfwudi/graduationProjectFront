import React from 'react';
import './index.css'; // 导入自定义的样式

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-subtitle">Oops! The page you're looking for doesn't exist.</p>
        <a href="/" className="not-found-link">
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
