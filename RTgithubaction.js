const $ = new Env('Rtool多人版');
let EnableOddEven = ($.isNode() ? process.env.EnableOddEven : $.getdata('EnableOddEven')) || 0;  //启用奇偶数报名，1 为启用
let oddnum = ($.isNode() ? process.env.oddnum : $.getdata('oddnum')) || 0;//奇数号
let status;
status = (status = ($.getval("RToolstatus") || "1")) > 1 ? `${status}` : "";
//let RToolurl = $.getdata('RToolurl')
let RToolurl = ($.isNode() ? process.env.RToolurl : $.getdata('RToolurl')) || '';
//let RToolhd = $.getdata('RToolhd')
let RToolhd = ($.isNode() ? process.env.RToolhd : $.getdata('RToolhd')) || '';
let RTurl = $.getdata('RTurl')
let Rname = ($.isNode() ? process.env.Rname : $.getdata('Rname')) || '';
let RID = ($.isNode() ? process.env.RID : $.getdata('RID')) || '';
let Racadamy = ($.isNode() ? process.env.Racadamy : $.getdata('Racadamy')) || '';
let Rclass = ($.isNode() ? process.env.Rclass : $.getdata('Rclass')) || '';
let Rphone = ($.isNode() ? process.env.Rphone : $.getdata('Rphone')) || '';
let Rwechat = ($.isNode() ? process.env.Rwechat : $.getdata('Rwechat')) || '';

let count = "";
let _eid = "";
let Rtoken = ($.isNode() ? process.env.Rtoken : $.getdata('Rtoken')) || '';
let _referer = "";

let RtokenArr = "";
let getmsgArr = "";
let msg_field_name = [];
let msg_field_key = []; 
let msg_field_value = [];
let msg_type_text = [];
let msg_origin_field_value = [];
let invalidindex = 0;


!(async () => {
    if (typeof $request !== "undefined") {
        RToolck()
        RTck()
    } else {
        console.log(
            `\n\n=============================================== 脚本执行 - 北京时间(UTC+8)：${new Date(
                new Date().getTime() +
                new Date().getTimezoneOffset() * 60 * 1000 +
                8 * 60 * 60 * 1000
            ).toLocaleString()} ===============================================\n`);
                    let RnameArr = await checkEnv(Rname, "Rname");
                    let RIDArr = await checkEnv(RID, "RID");
                    let RphoneArr = await checkEnv(Rphone, "Rphone");
                    RtokenArr = await checkEnv(Rtoken, "Rtoken");
                    let RwechatArr = await checkEnv(Rwechat, "Rwechat");
                    let RacadamyArr = await checkEnv(Racadamy, "Racadamy");
                    let RclassArr = await checkEnv(Rclass, "Rclass");
                    console.log(`\n========== 共找到 ${RnameArr.length} 个账号 ==========`)
                    console.log(`这是你的账号数组:\n ${RnameArr}`);
                    await getkey()
                    await $.wait(1100)
                    if(invalidindex == 1){
                        await getkey_1() //
                    }
                    await $.wait(5000)
                    for (let index = 0; index < RnameArr.length; index++) {
                        let num = index + 1;
                        console.log(`\n========== 共找到 ${num} 个账号 ==========`)
                        Rname = RnameArr[index];
                        RID = RIDArr[index];
                        Rphone = RphoneArr[index];
                        Rtoken = RtokenArr[index];
                        Rwechat = RwechatArr[index];
                        Racadamy = RacadamyArr[index];
                        Rclass = RclassArr[index];
                        await $.wait(700)
                        if(EnableOddEven == 0){
                            if(invalidindex == 0){
                                await sendinfo() //send info
                            }
                        }else {
                            await checkCount()//判断奇偶数，给count赋值，测试时注释
                            for(let ii = 0; ii < 100; ii++) {
                                await checkCount()
                                if(oddnum == 0){
                                    console.log("本次报名奇数的")
                                }else {
                                    console.log("本次报名偶数的")
                                }
                                if(count % 2 == oddnum){
                                    if(invalidindex == 0){
                                        await sendinfo() 
                                    }
                                    break
                                }else console.log("准备下次报名~~~")
                            }
                        } 
                    }
    }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

async function checkEnv(ck, Variables) {
	 return new Promise((resolve) => {
		let ckArr = []
		if (ck) {
			if (ck.indexOf("@") !== -1) {
				ck.split("@").forEach((item) => {
				ckArr.push(item);
				});
			} else if (ck.indexOf("\n") !== -1) {
				ck.split("\n").forEach((item) => {
					ckArr.push(item);
				});
			} else {
				ckArr.push(ck);
			}
			resolve(ckArr)
		} else {
			console.log(` ${$.neme}:未填写变量 ${Variables} ,请仔细阅读脚本说明!`)
		}
	}
	)
}
// https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v2/detail?
function RToolck() {
    if ($request.url.indexOf("detail?") > -1) {
        const RToolurl = $request.url
        if (RToolurl) $.setdata(RToolurl, `RToolurl${status}`)
        $.log(RToolurl)//分割eid

        const RToolhd = JSON.stringify($request.headers)
        if (RToolhd) $.setdata(RToolhd, `RToolhd${status}`)
        $.log(RToolhd)

        $.msg($.name, "", `detail${status}获取${RToolurl}`)

    }
}

// function RTck() {
//     if ($request.url.indexOf("user_list?") > -1) {
//         const RTurl = $request.url
//         if (RTurl) $.setdata(RTurl, `RTurl${status}`)
//         $.log(RTurl)//备用分割eid

//         const RThd = JSON.stringify($request.headers)
//         if (RThd) $.setdata(RThd, `RThd${status}`)
//         $.log(RThd)

//         $.msg($.name, "", `user_list${status}获取${RTurl}`)

//     }
// }
//没有口令
function getkey(timeout = 0) {
    return new Promise((resolve) => {
        _eid = RToolurl.match(/eid=(.*?)&/)[1];
        // _referer = RToolurl.match(/referer=(\S*)/)[1];
        Rtoken = RToolurl.match(/access_token=(.*?)&/)[1];
        let url = {
            // url: RToolurl,
            url: `https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v1/detail?eid=${_eid}&access_token=${Rtoken}&admin=0&from=detail&referer=`,
            headers: JSON.parse(RToolhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                // data = JSON.stringify(data)
                data = JSON.parse(data)
                if(data.msg == "invalid access_token"){
                    console.log(`\n重写获取的token失效`)
                    invalidindex = 1;
                }else {
                    RtokenArr[0] = Rtoken
                }
                let getmsg = data.data.req_info
                getmsgArr = getmsg.length
                console.log(`\n第一种获取方式：该报名表格含有${getmsgArr}条数据~`)
                    for (let i = 0; i < getmsgArr; i++) {
                        msg_field_name[i] = getmsg[i].field_name;
                        msg_field_key[i] = getmsg[i].field_key;
                        msg_type_text[i] = getmsg[i].type_text;
                    // console.log(msg_field_name);
                    // console.log(msg_field_key);
                }
                console.log(`该表格数据分别是：${msg_field_name}`);
                console.log(msg_field_key);
            } catch (e) {
            } finally {
                resolve()
            }
        }, timeout)
    })
}
//有口令得
function getkey_1(timeout = 0) {
    return new Promise((resolve) => {
        _eid = RToolurl.match(/eid=(.*?)&/)[1];
        // _referer = RToolurl.match(/referer=(\S*)/)[1];
        Rtoken = RToolurl.match(/access_token=(.*?)&/)[1];
        let url = {
            // url: RToolurl,
            url: `https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v1/detail?eid=${_eid}&access_token=${RtokenArr[0]}&admin=0&from=detail&referer=`,
            headers: JSON.parse(RToolhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                // data = JSON.stringify(data)
                data = JSON.parse(data)
                if(data.msg == "invalid access_token"){
                    console.log(`\ntoken失效`)
                    invalidindex = 1;
                }else {
                    invalidindex = 0;
                }
                let getmsg = data.data.req_info
                getmsgArr = getmsg.length
                console.log(`\n第二种获取方式：该报名表格含有${getmsgArr}条数据~`)
                    for (let i = 0; i < getmsgArr; i++) {
                        msg_field_name[i] = getmsg[i].field_name;
                        msg_field_key[i] = getmsg[i].field_key;
                        msg_type_text[i] = getmsg[i].type_text;
                    // console.log(msg_field_name);
                    // console.log(msg_field_key);
                }
                console.log(`该表格数据分别是：${msg_field_name}`);
                console.log(msg_field_key);
            } catch (e) {
            } finally {
                resolve()
            }
        }, timeout)
    })
}
//用于检测奇偶数
function checkCount(timeout = 0){
    return new Promise((resolve) => {
        let url = {
            url: `https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v1/detail?eid=${_eid}&access_token=${RtokenArr[0]}&admin=0&from=detail&referer=`,
            headers: JSON.parse(RToolhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                data = JSON.parse(data)
                count = data.data.count
                console.log(`\n该报名当前已有报名人数${count}个`)
            } catch (e) {
            } finally {
                resolve()
            }
        }, timeout)
    })
}
//encode匹配
function ecoU(sts){
    ss = encodeURI(sts)
    //console.log(ss)
    return ss
}
//中文字符匹配
function getStrCN(sts) {
    let str = sts
    let reg = /[\u4e00-\u9fa5]/g;
    let rr = str.match(reg)
    rr = String(rr)
    aa = new RegExp(",", "g")
    rr = rr.replace(aa, "")
    // console.log(`已获取数据：${rr}`)
    return rr
}

function toUnicode(data) {
    let str = '';
    for (let i = 0; i < data.length; i++) {
        str += "\\u" + data.charCodeAt(i).toString(16);
    }
    return str;
}

function toStrCN(data) {
    data = data.split("\\u");
    let str = '';
    for (let i = 0; i < data.length; i++) {
        str += String.fromCharCode(parseInt(data[i], 16).toString(10));
    }
    return str;
}

function checkContains(msg, data){
    data = toUnicode(data)
    let reg = new RegExp(data, "g");
    let index = reg.test(msg)
    // console.log(index)
    return index
}

//版块
function sendinfo(timeout = 0) {
    return new Promise((resolve) => {
        let index = 1;
        let _data = {
            "eid":_eid,
            "access_token":Rtoken,
            "referer":_referer,
            "on_behalf":0,
            "items":[
        
            ],
            "fee_type":"",
            "info":[

            ]
        };       
        // console.log(`_data数据${JSON.stringify(_data)}`)
        for (let i = 0; i < getmsgArr; i++) {
            if(checkContains(getStrCN(msg_field_name[i]),"姓名")) {
                msg_field_value[i] = Rname
            }else if(checkContains(getStrCN(msg_field_name[i]),"名字")){//名字
                msg_field_value[i] = Rname
            }else if(checkContains(getStrCN(msg_field_name[i]),"名称")){//名称
                msg_field_value[i] = Rname
            }else if(checkContains(getStrCN(msg_field_name[i]),"名")){
                msg_field_value[i] = Rname
            }else if(checkContains(getStrCN(msg_field_name[i]),"姓")){
                msg_field_value[i] = Rname
            // }else if(checkContains(getStrCN(msg_field_name[i]),"手机号")){//手机号
            //     msg_field_value[i] = Rphone
            }else if(checkContains(getStrCN(msg_field_name[i]),"电话")){//电话
                msg_field_value[i] = Rphone
            }else if(checkContains(getStrCN(msg_field_name[i]),"手机")){//手机
                msg_field_value[i] = Rphone
            }else if(checkContains(getStrCN(msg_field_name[i]),"手")){//
                msg_field_value[i] = Rphone
            }else if(checkContains(getStrCN(msg_field_name[i]),"联系方式")){//联系方式
                msg_field_value[i] = Rphone
            }else if(checkContains(getStrCN(msg_field_name[i]),"班级")){//班级
                msg_field_value[i] = Rclass
            }else if(checkContains(getStrCN(msg_field_name[i]),"班")){//班级
                msg_field_value[i] = Rclass
            }else if(checkContains(getStrCN(msg_field_name[i]),"学号")){//学号
                msg_field_value[i] = RID
            }else if(checkContains(getStrCN(msg_field_name[i]),"工号")){//工号
                msg_field_value[i] = RID
            }else if(checkContains(getStrCN(msg_field_name[i]),"学院")){//学院
                msg_field_value[i] = Racadamy
            }else if(checkContains(getStrCN(msg_field_name[i]),"院")){
                msg_field_value[i] = Racadamy
            }else if(checkContains(getStrCN(msg_field_name[i]),"微信")){//微信
                msg_field_value[i] = Rwechat
            }else if(msg_type_text[i] == "单张图片"){

            }else {
                msg_field_value[i] = ''
                index = 0
                console.log("还有东西填？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？")
            }
            if(msg_type_text[i] == "单张图片"){
                _data.info[i] = {
                    "field_name":msg_field_name[i],
                    "field_value":"https:\/\/pic9.58cdn.com.cn\/nowater\/webim\/big\/n_v26a4bf4b5be8d49b39eada11d356a3847.png",
                    "origin_field_value":"https:\/\/pic9.58cdn.com.cn\/nowater\/webim\/big\/n_v26a4bf4b5be8d49b39eada11d356a3847.png",
                    "field_key":msg_field_key[i],
                    "ignore":0
                }
            }else {
                _data.info[i] = {
                    "field_name":msg_field_name[i],
                    "field_value":msg_field_value[i],
                    "field_key":msg_field_key[i],
                    "ignore":0
                }
            }
            console.log(`info数据${JSON.stringify(_data.info)}`)
        }
        // console.log(`body数据${JSON.stringify(_data)}`)
        if(index == 1){
            let url = {
                url: `https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v5/enroll`,
                headers: JSON.parse(RToolhd),
                body:JSON.stringify(_data)
            }
            $.post(url, async (err, resp, data) => {
                try {
                    // console.log(`\n\n开始【Rtool多人版${data}】`)
                    data = JSON.parse(data)
                    console.log(data.data.verified)
                    if (data.data.verified == 1) {
                        console.log("提交成功啦！！！！！")
    
                    } else {
                        console.log("出BUG啦！！！！！")
                        console.log("赶紧手动填啦！！！！！")
                    }
                } catch (e) {
                } finally {
                    resolve()
                }
            }, timeout)
        }else console.log("\n还有东西填？？？？？？？？？？？？？？？？？？？？？？")
    })
}
//env模块    不要动  
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,o)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),h=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t)))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t))}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",o){const r=t=>{if(!t||!this.isLoon()&&this.isSurge())return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,r(o)):this.isQuanX()&&$notify(e,s,i,r(o)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}