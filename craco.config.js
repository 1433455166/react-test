// 顶部引入
import { createProxyMiddleware } from 'http-proxy-middleware';

/* eslint-disable no-unused-vars */
export const webpack = {
  // 保留你原来的 configure 配置
  configure: (webpackConfig, { env, paths }) => {
    // ...你原来的 Sass 配置...
    webpackConfig.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx'];
    return webpackConfig;
  },

  // 新增：devServer 代理配置
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // 你自己的后端
      devServer.app.use(
        '/api',
        createProxyMiddleware({
          target: 'http://127.0.0.1:888',
          changeOrigin: true,
          pathRewrite: { '^/api': '' },
        })
      );

      // Grok2API
      devServer.app.use(
        '/v1',
        createProxyMiddleware({
          target: 'http://localhost:8000',
          changeOrigin: true,
        })
      );

      return middlewares;
    },
  },
};