# -*- coding: utf-8 -*-
"""
Created on Thu Mar 23 10:35:03 2023

@author: 很多
"""

import base64
import datetime
import json
import os
import time
from datetime import datetime
from pyzbar.pyzbar import decode
from PIL import Image
import qrcode
import requests
import urllib.request
from requests_toolbelt.multipart.encoder import MultipartEncoder
import ssl
import _thread
import threading
import re
import pandas as pd
import random
# import multiprocessing
###################################################################################

Script_Name = "报名工具"
Name_Pinyin = "RTTT"
Script_Change = "优化"
Script_Version = "1.5.1"

####################################请勿动以下部分####################################
def ReadInfo():
    print("##############################参数设置模块###############################")
    df = pd.read_excel('./参数.xlsx', usecols=['参数标题', '参数内容'])# 读取excel文件
    info = df.set_index('参数标题')['参数内容'].to_dict()# 将两列数据转换成字典格式
    # print(info)
    print("##############################参数读取完成###############################")
    return info

def Geterweima():
    print('获取二维码')
    url = 'https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll_web/v1/pc_code'
    ret = requests.get(url,headers=headers).json()
    if ret['msg'] != 'ok':
        return ''
    img_imf = ret['data']['qrcode'].replace('data:image/jpg;base64,', '')
    code = ret['data']['code']
    page_content = base64.b64decode(img_imf)
    with open('./b.png', 'wb') as f:
        f.write(page_content)
    barcode_url = ''
    barcodes = decode(Image.open('./b.png'))
    for barcode in barcodes:
        barcode_url = barcode.data.decode("utf-8")
    qr = qrcode.QRCode()
    qr.add_data(barcode_url)
    # invert=True白底黑块,有些app不识别黑底白块.
    qr.print_ascii(invert=True)
    return code

def GetToken():
    print("微信扫码二维码！！！！")
    code = Geterweima()
    if code == '':
        return ''
    url = 'https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll_web/v1/pc_login?code=%s'% code
    while(True):
        ret = requests.get(url, headers=headers).json()
        if ret['msg'] != 'please wait':
            return ret['data']['access_token']
        time.sleep(1)
        # print(ret['msg'])
    # return ret['data']['access_token']

def GetOftenInfo(token):
    print('获取token')
    url = 'https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v1/userinfo?access_token=%s'%token
    ret = requests.get(url, headers=headers).json()
    if ret["msg"] != "ok":
        return
    for i in ret["data"]["extra_info"]:
        pass

def GetAllTime(token):
    print('获取所有事件')
    url = 'https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v1/user/history?access_token=%s'%token
    ret = requests.get(url, headers=headers).json()
    # print(ret)
    # status:1 进行中 2结束
    index = 1
    for i in ret['data']:
        if i['status'] == 0 or i['status'] == 1:
            #已满
            if i['count'] >= i['limit']:
                continue
            print("编号：%d 讲座：%s"%(index,i["title"]))
            index+=1
            ClassEid.append(i['eid'])
            ClassList[i['eid']] = i["title"]
    # print( ClassList)

def GetTime(token, eid):
    print(token,eid)
    print('获取时间')
    url = 'https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v2/detail?access_token=%s&eid=%s&admin=0&from=detail&referer=' % (token, eid)
    ret = requests.get(url, headers=headers).json()
    # print(ret)
    if ret["msg"] != "ok":
        return
    print("您的选择是：" + ClassList[eid] +" 报名时间：" + datetime.fromtimestamp(ret["data"]["start_time"]).strftime("%Y-%m-%d %H:%M:%S") + "\n" )
    return ret["data"]["start_time"]

#应对超贱情况
def Reg_Exp(text):
    # text = "这是一段中文文本，包含了一些中文字符。"
    pattern = re.compile(r'[\u4e00-\u9fa5]+')
    result = pattern.findall(text)
    chinese_str = ''.join(result)
    return chinese_str

#图片上传,在线获取URL图片链接
def upload_pic(eid):
    filename = "upload_image.jpg"
    if os.path.isfile('./'+filename):
        print(f'{filename}文件存在')
    else:
        print(f'{filename}文件不存在,生产中') 
        download_urls = [
                "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fci.xiaohongshu.com%2F48641552-06c0-37ac-8f6a-1f5e8752c4c0%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fci.xiaohongshu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1682143629&t=3ab7869f9aedb2824c5d6c6e339b0f42",
                "https://www.baidu.com/img/flexible/logo/pc/result@2.png",
                "https://static.zhihu.com/heifetz/assets/apple-touch-icon-152.81060cab.png",
                "https://i0.hdslb.com/bfs/archive/bcac17c22b1458a90a0a943ecf4e00ad9482ab84.png",
                "http://www.iqiyipic.com/pcwimg/128-128-logo.png",
                "https://y.qq.com/mediastyle/yqq/img/logo.png?max_age=2592000"
            ]
        download_url = random.choice(download_urls)
        urllib.request.urlretrieve(download_url, filename)
        
    url = "https://api-xcx-qunsou.weiyoubot.cn/xcx/image/v2/upload"
    headers = {
            "Host":"api-xcx-qunsou.weiyoubot.cn",
            "Connection":"keep-alive",
            "Content-Length":"227022",
            "Accept-Encoding":"gzip,compress,br,deflate",
            "User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.33(0x18002128) NetType/4G Language/zh_CN",
            "Referer":"https//servicewechat.com/wxfaa08012777a431e/904/page-frame.html"
        }
    boundarys = ''.join(random.sample('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 16))
    multipart_encoder=MultipartEncoder(
            fields={
                    'biz_id': eid,'file': (filename,open('./'+filename,'rb'),'image/jpeg')
                },
            boundary='----WebKitFormBoundary{boundarys}')
    headers["Content-Type"]=multipart_encoder.content_type
    response = requests.request("POST", url, headers=headers, data=multipart_encoder)
    ret = response.json()
    if ret['msg'] == 'OK':
        pic_url = response.json()['data']['url']
        print(f'上传图片成功：{pic_url}')
    else:
        global Send_index
        Send_index = 0
        pic_url = None
        print('上传失败')
    return pic_url
    
#获取相关参数
def get_optioninfo(eid,token):
    headers = {
            'Accept': '*/*',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'Connection': 'keep-alive',
            'DNT': '1',
            'If-None-Match': 'W/"dca076a0e10683920f8a758fc500c825ac2426f0"',
            'Origin': 'http://www.baominggongju.com',
            'Referer': 'http://www.baominggongju.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 Edg/104.0.1293.70',
            'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99", "Microsoft Edge";v="104"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
        }
    try:
            response = requests.request("GET",'https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v1/req_detail?eid={eid}&access_token={token}&admin=0&from=detail&referer='.format(eid = eid, token = token), headers=headers,timeout=2)
            data = response.json()
            # print(json.dumps(data['data']['req_info'], indent=4, ensure_ascii=False, sort_keys=True))
            reqinfo = data['data']['req_info']
            info = []
            global Send_index
            for i in range(len(reqinfo)):
                field_name = Reg_Exp(reqinfo[i]['field_name'])#判断
                field_key = reqinfo[i]['field_key']#填写
                type_text = reqinfo[i]['type_text']#判断
                if field_name in UserInfo.keys():#正则判断
                    field_value = UserInfo[field_name]
                    if field_name == '学院' and type_text == '单项选择':#学院有单项选择题
                        options = reqinfo[i]['new_options']
                        c = 0
                        for j in range(len(options)):#学院选项值
                            if options[j]['value'] == Reg_Exp(UserInfo[field_name]):#学院都是中文吧？
                                new_field_value = options[j]['key']   
                            else:
                                c += 1
                        if c == len(options):
                            print('这。。。如果学院都不匹配的话，手抢吧!脚本暂停')
                            new_field_value = '37515'
                            Send_index = 0
                            break
                            
                else:
                    field_value = UserInfo['未找到']
                    Send_index = 0
                if type_text == '描述':#判断
                    # field_name = reqinfo[i]['field_name']
                    field_value = ""
                    Send_index = 1
                if type_text == '单张图片':#判断
                    pic_url = upload_pic(eid)
                    field_value = [pic_url]
                    Send_index = 1
                date = {"field_name": reqinfo[i]['field_name'], "field_value": field_value, "field_key": field_key, "ignore": 0}
                if type_text == '单张图片':#需要单独改data构造
                    date["origin_field_value"] = [pic_url]
                if field_name == '学院' and type_text == '单项选择':#需要单独改data构造
                    date["new_field_value"] = new_field_value
                print(date)
                # date = json.dumps(date)
                info.append(date)
            # print(info)
            # print(json.dumps(info, indent=4, ensure_ascii=False, sort_keys=True))
            return info
    except Exception as e:
            print("\n获取infoti失败，重新获取")
            info = []
    return info

def clicked_button(token,index,start,num):
    # print(token)
    # print(index)
    # print(info)
    # print(start)
    # print(num)
    start=int(start)

    url = "http://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v5/enroll"
    # print(ClassEid[index],'   ',token)
    # print(get_optioninfo(ClassEid[index],token))
    # input("\n讲座要求是否已经配置要求，如是请回车!")
    while 1:
        t = time.time()
        # 多次测试提前2秒开始抢没问题，当然你觉得不行，也可以提前1秒开始
        if t >= start-4:
            while(1):
                print('##############################线程', num, '（', ClassList[ClassEid[index]], '）在拼命中###############################')
                try:

                    data = {
                        "access_token": token,
                        "eid": ClassEid[index],
                        "info": get_optioninfo(ClassEid[index],token),#
                        "on_behalf": 0,
                        "items": [],
                        "referer": "",
                        "fee_type": ""
                    }
                    global Send_index
                    if Send_index == 1:
                        ret = requests.post(url, headers=headers, data=json.dumps(data), verify=False, timeout=2).json()
                    elif Send_index == 0:
                        print('存在未知报名参数，暂停提交')
                        ret['msg'] = ''
                    # print(ret)
                    # print(ret['sta'])
                    if ret['msg'] == '':
                        print('线程', num, '（', ClassList[ClassEid[index]], '）:成功了兄弟!!!!!!!')
                        print("##############################抢到了###############################")
                        # print("成功了兄弟!!!!!!!")
                        return
                    elif ret['msg'] == '报名未开始':
                        time.sleep(0.3)
                        continue
                    elif ret['msg'] == '请求过于频繁，请稍后重试':
                        time.sleep(0.7)
                        continue
                    elif ret['msg'] == '活动名额已满':
                        return
                    elif ret['msg'] == '活动期间，只允许提交1次':
                        print(ret['msg'])
                        return
                    else:
                        print('线程', num , '（', ClassList[ClassEid[index]], '）:', ret)
                        # print(ret)
                        time.sleep(0.7)
                        break
                        # continue
                except requests.exceptions.RequestException as e:
                    # print(e)
                    print('线程', num , '（', ClassList[ClassEid[index]], '）:',e)
                    print('线程',num,'（',ClassList[ClassEid[index]],'）:出错了')
                    time.sleep(0.5)
                    continue
                    # break
            return
        time.sleep(1)
        print('\r线程',num,'（',ClassList[ClassEid[index]],'）开抢:还剩',int(start-t),'秒，当前时间:',datetime.now().strftime("%Y-%m-%d %H:%M:%S"),end='||||||||||')
        # print("当前时间：" + datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

# 抢单个活动
# index = int(input("请选择抢购讲座编号(填编号):"))
# index=index-1
# start = GetTime(token, ClassEid[index]) #获取开始时间 以及所需要求
#
# info =GetInfo(index) #获取报名要求信息
# clicked_button(token,index ,info,start)

class myThread(threading.Thread):
    def __init__(self,token, index, starttime, name):
        threading.Thread.__init__(self)
        self.token = token
        self.index = index
        self.starttime = starttime
        self.name = name
    def run(self):
        print ("开始线程:",self.name)
        # 获得锁，成功获得锁定后返回 True
        # 可选的timeout参数不填时将一直阻塞直到获得锁定
        # 否则超时后将返回 False
        # threadLock.acquire()
        clicked_button(self.token, self.index, self.starttime, self.name)
        # 释放锁
        # threadLock.release()
    def __del__(self):
        print (self.name,"线程结束！")

def last_version(name, mold):
    url = ''
    if mold == 1:
        url = f"https://gitee.com/miranda0111/baomingongju/raw/master/{name}.py"
    try:
        _url = url
        _headers = {}
        resp = requests.get(url=_url, headers=_headers, verify=True)
        result = resp.text
        resp.close()
        r = re.compile(r'Script_Version = "(.*?)"')
        _data = r.findall(result)
        if not _data:
            return "出现未知错误 ,请稍后重试!"
        else:
            return _data[0]
    except Exception as err:
        print(err)
# In[]
if __name__ =='__main__':
    # multiprocessing.freeze_support()
    # requests.packages.urllib3.disable_warnings()
    ssl._create_default_https_context = ssl._create_unverified_context
    origin_version = last_version(Name_Pinyin, 1)
    print(f"本地脚本: {Script_Version}\n远程仓库版本: {origin_version}")
    if str(Script_Version) == str(origin_version):
        print(f"脚本版本一致，完成内容: {Script_Change}")
    else:
        print('发现版本更新！请尽快更新！📌 📌 📌 \n')
        print(f"更新内容: {Script_Change}")
    UserInfo= {},
    ClassEid = []
    ClassList = {}
    InfoList=[]
    Send_index = 1
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0",
        "Accept": "*/*",
        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
        "Origin": "http://baominggongju.com",
        "Connection": "keep-alive",
        "Referer": "http://baominggongju.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
    }
    token = GetToken()
    UserInfo=ReadInfo()
    print(UserInfo)
    if token != '':
        print("登录成功!")
    else:
        print("未扫码，程序退出......")
        exit(1)

    GetAllTime(token)

    input_num = [int(i) for i in input("请选择抢购讲座编号(填编号多个使用空格隔开):").split(' ')]
    print(input_num)
    LectureConditions = []
    Lecture = []
    for i in range(0, len(input_num)):
        index = input_num[i] - 1
        start = GetTime(token, ClassEid[index])  # 获取开始时间 以及所需要求
        LectureConditions.append({
            'start': start,
        })

    # 使用_thread创建多线程
    # for i in range(0, len(input_num)):
    #     try:
    #         # print(i)
    #         # token, index, info, start, num
    #         _thread.start_new_thread(clicked_button, (
    #         token, input_num[i] - 1, LectureConditions[i]['info'], LectureConditions[i]['start'], i))
    #     except:
    #         print("Error: unable to start thread")
    #
    # while 1:
    #     pass
    print("##############################开始挂机###############################")
    threadLock = threading.Lock()
    threads = []
    for i in range(0, len(input_num)):
        thread=myThread(token, input_num[i] - 1, LectureConditions[i]['start'], i)
        thread.start()
        threads.append(thread)
    # # 创建新线程
    # thread1 =    myThread(token, input_num[i] - 1, LectureConditions[i]['info'], LectureConditions[i]['start'], i)
    # thread2 = myThread(2, "Thread-2", 2)
    # # 开启新线程
    # thread1.start()
    # thread2.start()
    # # 添加线程到线程列表
    # threads.append(thread1)
    # threads.append(thread2)
    # 等待所有线程完成
    for t in threads:
        t.join()
    print
    "主进程结束！"