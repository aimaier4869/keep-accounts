# 记账工具

![预览图](\assets\0824140114.jpg)

## 1. 使用

1. 如果你是普通用户
  1. 进入 `release` 文件夹
        2. 下载 `记账工具.zip` 文件
            3. 解压
                4. 双击运行 `keep-accounts.exe` 程序
                    5. 开始使用
    
2. 如果你是开发者
  
    1. `git clone`
    2. `npm install`
    3. `node app`

## 2. 主要功能
1. 记账
    1. 可以记录支出、收入。
    2. 支持多个账本、多种存储介质。
    3. 支持支出、收入分类。
    4. 在多个账本、存储介质之间相互转移余额。
2. 首页
    1. 统计本月总收入、支出、余额。
    2. 统计各个账本余额。
    3. 可视化的多种存储介质余额。
3. 所有记录
	1. 以表格形式展示所有记录。
	2. 编辑单个记录。
	3. 删除单个记录。
4. 基本配置
	1. 添加、编辑、调换、删除存储介质。
	2. 添加、编辑、调换、删除账本。
	3. 添加、编辑、调换、删除支出类型。
	4. 添加、编辑、调换、删除收入类型。
	5. 拒绝删除与记录绑定的任意配置（保护机制）。

## 3. 未来

1. [添加功能] 把所有记录导出到Excel文件。
2. [添加功能] 关闭浏览器时自动关闭控制台。
3. [添加功能] 在首页以图表形式展示支出、收入等信息。
4. ...