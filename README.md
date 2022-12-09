# RegistrationTool-RTool
1. 微信小程序报名工具
2. 能提前检测该表单的内容及其口令
3. 能在前15s内按照奇偶数报名
4. 能自动回答姓名、班级、学号、手机号、学院、微信号，等关键词
5. 能自动提交一张图片

# 微信小程序“报名工具”抢报名脚本
>君子慎独，不欺暗室， 卑以自牧，含章可贞。 
>大丈夫立于天地之间， 当仰天地浩然正气， 行光明磊落之事。 
>克己，慎独，守心，明性。 
---
Github访问慢[请点击这](https://www.dogfight360.com/blog/475/)
## 工具：

~~~
青龙、圈X（软件7.99美金）、GitHub Actions
~~~

## 不详细的教程

### 圈x运行

重写：
```
[rewrite_local]
https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll url script-request-header https://raw.githubusercontent.com/miranda0111/RegistrationTool-RTool/main/RT.js
[mitm]
hostname = api-x-qunsou.weiyoubot.cn
[task_local]
0 12 * * * https://raw.githubusercontent.com/miranda0111/RegistrationTool-RTool/main/RT.js, tag=抢报名, enabled=false
```

圈X重写后，打开报名工具小程序的报名链接即可自动抓取eid、access_token

以下为在boxjs配置的变量

| 变量 / key  | 说明 / illustrate | 参考 / value |
|---------|---------|---------|
|Rtoken|抓包链接中的access_token，利用别人的扫码登录工具获取的token，第一个token值默认替换为是重写获取的token|9a8bb3f233aa4de4b3209b47d5ac0efe@8c31200f097e4fe791f7a957bb1557b6|
|Rname|名字|张三|
|RID|学号|2015223344141|
|Rphone|手机号|19922556677|
|Racadamy|学院|马克思主义学院|
|Rclass|本脚本不会盗用个人信息|23统计9班|
|Rwechat|源码公开|123415425125（微信号）|
|EnableOddEven|启用奇偶数报名，1为启用，0为关闭，默认为0|0|
|oddnum|奇数报名，0为奇数，1为偶数，默认为0|0|
|R1111||无用数据存放|

多账户请用@连接

### 青龙运行
青龙运行，请自行适配，自行抓取这个链接https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v3/detail存入环境变量RToolurl和RToolhd，其他同上，不再赘述。
例如：
| 变量 / key  | 说明 / illustrate | 参考 / value |
|---------|---------|---------|
|RToolurl|青龙平台填写可只填写 eid=63wetqwt12341setwe|https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v1/user_list?eid=63e0a435c086dfe06b23&access_token=9a8bb3f233aa4de4b3209b47d5ac0efe&count=10&info_id=0|
|RToolhd|青龙平台该请求头可直接复制|{"Referer":"https://servicewechat.com/wxfaa08012777a431e/861/page-frame.html","Connection":"keep-alive","Host":"api-xcx-qunsou.weiyoubot.cn","Accept-Encoding":"gzip,compress,br,deflate","Content-Type":"application/json","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d38) NetType/WIFI Language/zh_CN"}|

自己注意格式！

附上json常用工具`https://www.json.cn/`和`https://www.songluyi.com/ChangeHeaderToDict/`

### GitHub Actions运行

- 打开链接`https://github.com/miranda0111/RegistrationTool-RTool.git`
- `miranda0111/RegistrationTool-RTool`这里的下方位置点击`Settings`
- 从左边目录找到`Secrets`点击后出现`Actions`，新的窗口那找绿色按钮`New repository secret`，然后看到有`name`和`Secret`，填入环境变量，例如第一个`name`方框下填`Rname`，`Secret`方框下填`张三`
- 填完以后，点击`Add secret`保存
- 重复上述步骤填写完毕环境变量

- `miranda0111/RegistrationTool-RTool`这里的下方位置点击`Actions`
- 左边目录找到`报名`的按钮
- `报名`的按钮同一水平方向的右边点击`Run workflow`
- 按F5刷新页面即可看到运行，点击图标带黄色的按钮即可看到日志

## 日志和环境变量
### 青龙
![](https://raw.githubusercontent.com/miranda0111/RegistrationTool-RTool/main/assets/ql_env.png)
![](https://raw.githubusercontent.com/miranda0111/RegistrationTool-RTool/main/assets/ql_log1.png)

### 圈x
![](https://raw.githubusercontent.com/miranda0111/RegistrationTool-RTool/main/assets/qx_boxjs.png)
![](https://raw.githubusercontent.com/miranda0111/RegistrationTool-RTool/main/assets/qx_log1.png)
![](https://raw.githubusercontent.com/miranda0111/RegistrationTool-RTool/main/assets/qx_log2.png)
![](https://raw.githubusercontent.com/miranda0111/RegistrationTool-RTool/main/assets/qx_invalid.png)

### GitHub Actions
![](https://raw.githubusercontent.com/miranda0111/RegistrationTool-RTool/main/assets/actions_env.png)
![](https://raw.githubusercontent.com/miranda0111/RegistrationTool-RTool/main/assets/actions_log.png)

## 特别鸣谢:

如有大问题请＋Q群联系：491092107

* [@whyour](https://github.com/whyour/qinglong)「青龙」
* [@xl2101200](https://github.com/xl2101200/-/)「Tom」
* [@yml2213](https://github.com/yml2213/javascript)「yml2213」
* [@ygxiuming](https://github.com/ygxiuming/Lecture-registration.git)「ygxiuming」
