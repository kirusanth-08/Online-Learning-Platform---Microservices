const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const config = require('./config.js');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Proxy configuration
app.use('/course', createProxyMiddleware({ target: config.courseUrl, changeOrigin: true }));
app.use('/user', createProxyMiddleware({ target: config.userUrl, changeOrigin: true }));
app.use('/enrollment', createProxyMiddleware({ target: config.enrollmentUrl, changeOrigin: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
