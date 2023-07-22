//使用fs.readdir()方法读取文件夹中的所有文件和文件夹，然后使用递归来删除每个文件和文件夹。
const fs = require('fs');
const path = require('path');

function deleteFolderRecursive(folderPath) {
  //判断文件夹是否存在
  if (fs.existsSync(folderPath)) {
    //读取文件夹下的文件目录，以数组形式输出
    fs.readdirSync(folderPath).forEach((file) => {
      //拼接路径
      const curPath = path.join(folderPath, file);
      //判断是不是文件夹，如果是，继续递归
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        //删除文件或文件夹
        fs.unlinkSync(curPath);
      }
    });
    //仅可用于删除空目录
    // fs.rmdirSync(folderPath);
  }
}

module.exports = deleteFolderRecursive

// https://blog.csdn.net/miemiem_/article/details/129635515