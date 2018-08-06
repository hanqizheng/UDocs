'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // 两个路由，一个用来显示，一个用来添加
  router.get('/add', controller.docs.index);
  router.post('/add', controller.docs.add);
  router.get('/docs', controller.docs.display);
  router.get('/docs/:docName/*', controller.docs.renderSrc);

  // router.get('/docs/:docName',controller.docs.renderDoc);
  // router.get('/public/:docName/html',controller.docs.renderIndex);
  // router.get('/public/:docName/html/_static/:fileName',controller.docs.renderSrc1);
  // router.get('/public/:docName/html/_static/:dirName/:fileName',controller.docs.renderSrc2);
  // router.get('/docs/:docName/:htmlName',controller.docs.renderSrc);
  // router.get('/docs/:docName/:dirName/:fileName',controller.docs.renderSrc1);
  // router.get('/docs/:docName/:dirName1/:dirName2/:fileName',controller.docs.renderSrc2);
  // router.get('/docs/:docName/:dirName1/:dirName2/:dirName3/:fileName',controller.docs.renderSrc3);
};
