import base64
import datetime
import json
import sys
import time
from datetime import datetime
from pyzbar.pyzbar import decode
from PIL import Image
import qrcode
import requests
import _thread
import threading

import cv2
#读取csv文件参数信息  并存储
UserInfo= {},
ClassEid = []
ClassList = {}
InfoList=[]

# 要是你知道eid和你的tocken，本程序自动开始抢
# eid = ''
# tocken = ''
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
import csv
import openpyxl
def  ReadInfo():
    info={}
    print("##############################参数设置模块###############################")

    wb = openpyxl.load_workbook("./参数.xlsx")
    sheetName=wb.sheetnames
    ws=wb[sheetName[0]]
    for row in ws.rows:
        line=[c.value for c in row]
        # print([c.value for c in row])
        key = line[0]
        info[key] = line[1]
    # with open('./参数.csv', 'r',encoding="utf-8") as myFile:
    #     lines = csv.reader(myFile,skipinitialspace=True)
    #     for line in lines:
    #         key = line[0]
    #         info[key] = line[1]
    # # print(json.dumps(info, indent=4, ensure_ascii=False, sort_keys=True))
    print(info)
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
    print(ret)
    if ret["msg"] != "ok":
        return
    print("您的选择是：" + ClassList[eid] +" 报名时间：" + datetime.fromtimestamp(ret["data"]["start_time"]).strftime("%Y-%m-%d %H:%M:%S") + "\n" )
    return ret["data"]["start_time"]
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
            response = requests.request("GET",'https://api-xcx-qunsou.weiyoubot.cn/xcx/enroll/v3/detail?eid={eid}&access_token={token}&admin=0&from=detail&referer='.format(eid = eid, token = token), headers=headers,timeout=2)
            data = response.json()
            # print(json.dumps(data['data']['req_info'], indent=4, ensure_ascii=False, sort_keys=True))
            reqinfo = data['data']['req_info']
            info = []
            for i in range(len(reqinfo)):
                field_name = reqinfo[i]['field_name']
                field_key = reqinfo[i]['field_key']
                if field_name in UserInfo.keys():
                    field_value = UserInfo[field_name]
                else:
                    field_value = UserInfo['未找到']
                date = {"field_name": field_name, "field_value": field_value, "field_key": field_key, "ignore": 0}
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
                        "info": get_optioninfo(ClassEid[index],token),
                        "on_behalf": 0,
                        "items": [],
                        "referer": "",
                        "fee_type": ""
                    }
                    ret = requests.post(url, headers=headers, data=json.dumps(data), verify=False, timeout=2).json()
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

                        return
                    else:
                        print('线程', num , '（', ClassList[ClassEid[index]], '）:', ret)
                        # print(ret)
                        time.sleep(0.7)
                        continue
                except requests.exceptions.RequestException as e:
                    # print(e)
                    print('线程', num , '（', ClassList[ClassEid[index]], '）:',e)
                    print('线程',num,'（',ClassList[ClassEid[index]],'）:出错了')
                    time.sleep(0.5)
                    continue
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



if __name__ =='__main__':
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