'use strict';
const Service = require('egg').Service;

class DocsSrvice extends Service {
  async add(docName, urlParameter, docPath) {
    await this.app.mysql.insert('indexPath', { docName: docName, urlParameter: urlParameter, path: docPath });
  }

  async findAll() {
    const addrList = await this.app.mysql.select('indexPath');
    return { addrList };
  }

  async find(docName) {
    const doc = await this.app.mysql.get('indexPath', { docName: docName });

    if (doc === null) {
      return false;
    }
    return { doc };
  }
}

module.exports = DocsSrvice;