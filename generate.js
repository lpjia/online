const fs = require('fs');
const ejs = require('ejs');
// https://ejs.bootcss.com/#docs

const getTemplateData = (list) => {
  list.forEach(item => {
    // item.txt = item.name.substring(0, item.name.lastIndexOf("."))
    item.txt = item.name.split('.').shift()
    if (item.name.includes('.pdf')) {
      item.fileType = 'pdf'
      item.url = `pdf_view/web/viewer.html?file=../../output/${item.name}`
    }
  })
}

const generateIndexHtml = async (list) => {
  getTemplateData(list)
  // console.log(list)
  let htmlStr = await ejs.renderFile('./template/index.html', { list })
  // console.log(htmlStr);
  fs.writeFileSync(__dirname + '/index.html', htmlStr);
}

module.exports = {
  generateIndexHtml
}