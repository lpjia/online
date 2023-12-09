/* 将当前目录下的md文件夹里的md文件；编译成html文件并输出到.vuepress/public/html文件夹下面 */
const path = require('path')
const fs = require('fs')
const vm = require('vm')
const { marked } = require('marked')
const { generateIndexHtml } = require('./generate')
const deleteFolderRecursive = require('./delete')
const copypdf = require('./copypdf')
const SparkMD5 = require('spark-md5')

deleteFolderRecursive('./output')

// 获取文件夹下所有文件
function getFileList(path) {
  const filesList = [];
  readFile(path, filesList);
  return filesList;
}

// 遍历读取文件
function readFile(path, filesList) {
  const files = fs.readdirSync(path); // 需要用到同步读取
  files.forEach(walk);

  function walk(file) {
    const states = fs.statSync(path + '/' + file);
    if (states.isDirectory()) {
      readFile(path + '/' + file, filesList);
    } else {
      // 创建一个对象保存信息
      const obj = {};
      obj.size = states.size; // 文件大小，以字节为单位
      obj.name = file; // 文件名
      obj.path = path + '/' + file; // 文件绝对路径
      filesList.push(obj);
    }
  }
}

/* 生成hash */
const generateHash = (fileCtt) => {
  spark = new SparkMD5()
  // spark = new SparkMD5.ArrayBuffer()
  // spark.append(fs.readFileSync('./index.html'))
  spark.append(fileCtt)
  return spark.end()
}
// generateHash()

/* 模板引擎方法
使用 node 的 vm 模块 */
const templateCompile = (template, data) => {
  // const vm = require('vm')
  return vm.runInNewContext(`\`${template}\``, data)
}

/**
 * 将inputPath文件夹的md文件转为HTML文件输出到outputPath文件夹下
 * @param theme ：markdown文件的主题
 * @param inputPath ： md文件的文件夹
 * @param outputPath： 输出的HTML的文件夹
 */
const md2html = ({ theme, inputPath, outputPath }) => {
  // const themeStr = fs.readFileSync(`./html-component/${theme}.css`, 'utf-8')
  const fileList = getFileList(inputPath)
  for (let i = 0; i < fileList.length; i++) {
    const item = fileList[i]
    const templateHtml = fs.readFileSync('./html-component/index.html')
    const htmlName = item.name.replace('.md', '')
    const contextData = {
      title: htmlName,
      mdHtml: marked(fs.readFileSync(item.path, 'utf-8')),
      // css: themeStr
      css: theme
    }
    const compiledHtml = templateCompile(templateHtml, contextData)
    const hash = generateHash(compiledHtml)
    fs.writeFileSync(`${outputPath}/${htmlName}.${hash.substring(0, 7)}.html`, compiledHtml)
  }
}

// pdf全copy一份到output
copypdf()

md2html({
  theme: 'theme1',
  inputPath: path.resolve(__dirname, './md'),
  outputPath: path.resolve(__dirname, './output')
})

/* 等待md全转为html, 读取html文件, 生成index.html导航 */
const readMd2htmlFile = ({ inputPath }) => {
  const fileList = getFileList(inputPath)
  // console.log(fileList)
  generateIndexHtml(fileList)
}

setTimeout(() => {
  readMd2htmlFile({
    inputPath: path.resolve(__dirname, './output')
  })
}, 1000);