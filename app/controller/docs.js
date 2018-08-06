'use strict';
const Controller = require('egg').Controller;
const cp = require('child_process');
const fs = require('fs');
const mime = require('mime-types');

class DocsController extends Controller {
  async index() {
    const addrList = await this.service.docs.findAll();
    await this.ctx.render('docsIndex.nj', { addrList: addrList.addrList });
  }

  async add() {
    // 添加文档的git地址
    const gitUrl = this.ctx.request.body.address;

    // 创建存放clone下来的文档的文件夹Docs
    fs.exists('./Docs', exists => {
      if (!exists) {
        cp.exec('mkdir Docs', err => {
          if (err) {
            console.log('err');
          }
        });
      }
    });


    const clonePath = 'git clone ' + gitUrl;
    const docName = gitUrl.substr(26);

    const docInfo = await this.service.docs.find(docName);

    if (docInfo === false) {
      const commond = 'cd Docs && ' + clonePath + ' && cd ' + docName + ' && make html ' + docName;
      cp.exec(commond, error => {
        if (error) {
          console.log(error);
        }
      });

      const urlParameter = '/docs/' + docName;
      const indexPath = './Docs/' + docName + '/build/html/index.html';

      // 将生成的index.html路径添加到数据库中
      await this.service.docs.add(docName, urlParameter, indexPath);
    } else {
      console.log('already have');
    }


    this.ctx.status = 200;
  }


  async display() {
    const docsList = await this.service.docs.findAll();
    await this.ctx.render('docsList.nj', { docsList: docsList.addrList });
  }

  async renderSrc() {
    const { ctx } = this;

    const docName = ctx.params.docName;

    const params = ctx.params[0];
    let tempPath = '';
    const result = params.split('/');

    for (let i = 0; i < result.length; i++) {
      tempPath = tempPath + '/' + result[i];
    }
    const filePath = './Docs/' + docName + '/build/html' + tempPath;

    const suffix = result[result.length - 1].substr(result[result.length - 1].indexOf('.') + 1, result[result.length - 1].length);

    const type = mime.lookup(suffix) || 'application/octet-stream';
    ctx.set('Content-Type', type);

    const fileData = await new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });


    ctx.body = fileData;

  }
}

module.exports = DocsController;
