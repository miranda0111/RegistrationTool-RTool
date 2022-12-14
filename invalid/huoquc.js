/*
2022.9.25  
软件：Rtool
注意事项 ：多账号版本，需要抓access-token，仓促写成，集百家之长
获取ck：  打开Rtool页眉即可------
重写：https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v2/detail url script-response-body huoquc.js
主机名：api-xcx-qunsou.weiyoubot.cn

*/



const $ = new Env('Rtool');
let status;

status = (status = ($.getval("RToolstatus") || "1")) > 1 ? `${status}` : "";

const RToolurlArr = [], RToolhdArr = [], RToolbodyArr = [], RToolcount = ''

let RToolurl = $.getdata('RToolurl')
let RToolhd = $.getdata('RToolhd')
let RToolbody = $.getdata('RToolbody')

let acadamy = "";
let className = "";
let Rtname = ($.isNode() ? process.env.Rtname : $.getdata('Rtname')) || '';
let RtschoolID = ($.isNode() ? process.env.RtschoolID : $.getdata('RtschoolID')) || '';
let RtphoneNumber = ($.isNode() ? process.env.RtphoneNumber : $.getdata('RtphoneNumber')) || '';
let wechatNumber = "";

let _eid = "";
let _token = ($.isNode() ? process.env._token : $.getdata('_token')) || '';
let _referer = "";

let getmsgArr = "";
let msg_field_name = [];
let msg_field_key = []; 
let msg_field_value = [];

!(async () => {
    if (typeof $request !== "undefined") {
        RToolck()
    } else {
        RToolurlArr.push($.getdata('RToolurl'))
        RToolhdArr.push($.getdata('RToolhd'))
        RToolbodyArr.push($.getdata('RToolbody'))
        let RToolcount = ($.getval('RToolcount') || '1');
        for (let i = 2; i <= RToolcount; i++) {
            RToolurlArr.push($.getdata(`RToolurl${i}`))
            RToolhdArr.push($.getdata(`RToolhd${i}`))
            RToolbodyArr.push($.getdata(`RToolbody${i}`))
        }
        console.log(
            `\n\n=============================================== 脚本执行 - 北京时间(UTC+8)：${new Date(
                new Date().getTime() +
                new Date().getTimezoneOffset() * 60 * 1000 +
                8 * 60 * 60 * 1000
            ).toLocaleString()} ===============================================\n`);
                    let RtnameArr = await checkEnv(Rtname, "Rtname");
                    let RtschoolIDArr = await checkEnv(RtschoolID, "RtschoolID");
                    let RtphoneNumberArr = await checkEnv(RtphoneNumber, "RtphoneNumber")
                    let _tokenArr = await checkEnv(_token, "_token")
                    console.log(`\n========== 共找到 ${RtnameArr.length} 个账号 ==========`)
                    console.log(`这是你的账号数组:\n ${RtnameArr}`);
                    for (let index = 0; index < RtnameArr.length; index++) {
                        let num = index + 1;
                        console.log(`\n========== 共找到 ${num} 个账号 ==========`)
                        Rtname = RtnameArr[index];
                        RtschoolID = RtschoolIDArr[index];
                        RtphoneNumber = RtphoneNumberArr[index];
                        _token = _tokenArr[index];
                    await getkey()//你要执行的版块  
                    await $.wait(1000)//你要延迟的时间  1000=1秒
                    await sendinfo()
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
//获取ck
// https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v2/detail?
function RToolck() {
    if ($request.url.indexOf("detail?") > -1) {
        const RToolurl = $request.url
        if (RToolurl) $.setdata(RToolurl, `RToolurl${status}`)
        $.log(RToolurl)

        const RToolhd = JSON.stringify($request.headers)
        if (RToolhd) $.setdata(RToolhd, `RToolhd${status}`)
        $.log(RToolhd)

        const RToolbody = JSON.stringify($request.response)
        if (RToolbody) $.setdata(RToolbody, `RToolbody${status}`)
        $.log(RToolbody)

        $.msg($.name, "", `Rtool${status}获取headers成功`)

    }
}

//https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v1/user_list?
function RTck() {
    if ($request.url.indexOf("user_list?") > -1) {
        const RTurl = $request.url
        if (RTurl) $.setdata(RTurl, `RTurl${status}`)
        $.log(RTurl)

        const RThd = JSON.stringify($request.headers)
        if (RThd) $.setdata(RThd, `RThd${status}`)
        $.log(RThd)

        $.msg($.name, "", `Rt${status}获取${RTurl}成功`)
    }
}


function getkey(timeout = 0) {
    return new Promise((resolve) => {
        // console.log(RToolurl)
        _eid = RTurl.match(/eid=(.*?)&/)[1];
        //_eid = RToolurl.match(/(?<=eid=)(.+?)(?=&)/);
        // _token = RToolurl.match(/access_token=(.*?)&/)[1];
        _referer = RToolurl.match(/referer=(\S*)/)[1];
        console.log(_eid)
        // console.log(_token)
        console.log(_referer)
        let url = {
            url: RToolurl,
            headers: JSON.parse(RToolhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                // data = JSON.stringify(data)
                // console.log(`\n\n开始【Rtool${data}】`)
                data = JSON.parse(data)
                let getmsg = data.data.req_info
                getmsgArr = getmsg.length
                console.log(`\n该报名表格含有${getmsgArr}条数据~`)
                // getmsg = JSON.stringify(getmsg)
                for (let i = 0; i < getmsgArr; i++) {
                    msg_field_name[i] = getmsg[i].field_name;
                    msg_field_key[i] = getmsg[i].field_key;
                }
                console.log(msg_field_name);
                console.log(msg_field_key);
                // let datamsg = JSON.parse(getmsg)
                // console.log(`\n\n开始【Rtool${getmsg}】`)
            } catch (e) {
            } finally {
                resolve()
            }
        }, timeout)
    })
}
//用于检测奇偶数
function checkCount(){
    return new Promise((resolve) => {
        let url = {
            url: RToolurl,
            headers: JSON.parse(RToolhd),
        }
        $.get(url, async (err, resp, data) => {
            try {
                data = JSON.parse(data)
                let getcount = data.data.count
                console.log(`\n该报名当前有报名人数${getcount}个`)
            } catch (e) {
            } finally {
                resolve()
            }
        }, timeout)
    })
}

function sendinfo(timeout = 0) {
    return new Promise((resolve) => {
        let _data = {
            "eid":_eid,
            "access_token":_token,
            "referer":_referer,
            "on_behalf":0,
            "items":[
        
            ],
            "fee_type":"",
            "info":[

            ]
        };
        //console.log(`_data数据${JSON.stringify(_data)}`)
        for (let i = 0; i < getmsgArr; i++) {
            if(ecoU(msg_field_name[i]) == "%E5%A7%93%E5%90%8D"){//姓名为1
                msg_field_value[i] = Rtn
            }else if(ecoU(msg_field_name[i]) == "%E6%89%8B%E6%9C%BA%E5%8F%B7"){//手机号为6
                msg_field_value[i] = Rtp
            }else if(ecoU(msg_field_name[i]) == "%E8%81%94%E7%B3%BB%E6%96%B9%E5%BC%8F"){//联系方式
                msg_field_value[i] = Rtp
            }else if(ecoU(msg_field_name[i]) == "%E7%8F%AD%E7%BA%A7"){//班级为12
                msg_field_value[i] = className
            }else if(ecoU(msg_field_name[i]) == "%E5%AD%A6%E5%8F%B7"){//学号为13
                msg_field_value[i] = Rts
            }else if(ecoU(msg_field_name[i]) == "%E5%AD%A6%E9%99%A2"){
                msg_field_value[i] = acadamy
            }else console.log("还有东西填？？？？？？？？？？？？？？？？？？？？？？")
            _data.info[i] = {
                "field_name":msg_field_name[i],
                "field_value":msg_field_value[i],
                "field_key":msg_field_key[i],
                "ignore":0
            }
            //console.log(`info数据${_data.info}`)
        }
        console.log(`body数据${JSON.stringify(_data)}`)
        let url = {
            url: `https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v5/enroll`,
            headers: JSON.parse(RToolhd),
            body:JSON.stringify(_data)
        }
        $.post(url, async (err, resp, data) => {
            try {
                console.log(`\n\n开始【Rtool${data}】`)
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
    })
}

function ecoU(sts){
    ss = encodeURI(sts)
    //console.log(ss)
    return ss
}

//env模块    不要动  
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(a, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t) { let e = { "M+": (new Date).getMonth() + 1, "d+": (new Date).getDate(), "H+": (new Date).getHours(), "m+": (new Date).getMinutes(), "s+": (new Date).getSeconds(), "q+": Math.floor(((new Date).getMonth() + 3) / 3), S: (new Date).getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length))); for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))); let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="]; h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }