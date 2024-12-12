import csv
import os
# from PIL import Image
# import jieba
from collections import Counter

TYPE_INDEX = 2
MSG_INDEX = 7
DATE_INDEX = 8
NAME_INDEX = 10
MONTH_STRING_SIZE = 7
DAY_STRING_SIZE = 10


def count_chat_monthly(reader):
    month_dict = {}

    for row in reader:
        date = row[DATE_INDEX]
        month_date = date[:MONTH_STRING_SIZE]
        if month_date not in month_dict.keys():
            month_dict[month_date] = 1
        else:
            month_dict[month_date] += 1

    f = open("../../output/count_chat_monthly.txt", mode='w', encoding='utf-8')
    for key, value in month_dict.items():
        f.write(key + ' ' + str(value) + '\n')


def count_chat_daily(reader):
    day_dict = {}

    for row in reader:
        date = row[DATE_INDEX]
        day_date = date[:DAY_STRING_SIZE]
        if day_date not in day_dict.keys():
            day_dict[day_date] = 1
        else:
            day_dict[day_date] += 1

    f = open("../../output/count_chat_daily.txt", mode='w', encoding='utf-8')
    for key, value in day_dict.items():
        f.write(key + ' ' + str(value) + '\n')


def count_chat_hourly(reader):
    hour_dicts = [{}, {}]

    for row in reader:
        date = row[DATE_INDEX]
        name = row[NAME_INDEX]
        colon_index = date.find(':')
        hour = date[DAY_STRING_SIZE + 1: colon_index]
        hour_dict_index = 0
        if name[0] == 'T': hour_dict_index += 1
        hdi = hour_dict_index
        if hour not in hour_dicts[hdi].keys():
            hour_dicts[hdi][hour] = 1
        else:
            hour_dicts[hdi][hour] += 1

    f = open("../../output/count_chat_hourly.txt", mode='w', encoding='utf-8')
    for i in range(len(hour_dicts)):
        for key, value in hour_dicts[i].items():
            f.write(["SXY", "TSY"][i] + ' ' + key + ' ' + str(value) + '\n')

def count_word_frequency(reader):
    text_list = []
    for row in reader:
        msg_type = row[TYPE_INDEX]
        if msg_type != '1':
            continue
        text = row[MSG_INDEX]
        text_list.append(text)
    text_string = " ".join(text_list)
    words = jieba.cut(text_string)

    word_list = list(words)

    # 统计词频
    word_counts = Counter(word_list)
    sorted_word_counts = dict(sorted(word_counts.items(), key=lambda item: item[1],reverse=True))
    # 输出词频
    f = open("../../output/count_word_frequency.txt", mode='w', encoding='utf-8')

    for word, count in sorted_word_counts.items():
        if len(word) <= 1: continue
        if len(word) != 3 and word[0] == word[1]: continue
        f.write(f"{word} {count}\n")

def check_img_ori(img_path):
    with Image.open(img_path) as img:
        width, height = img.size

    # 判断高度和宽度的关系
    if height > width:
        return 'vertical'  # 高度大于宽度，竖向
    else:
        return 'horizontal'  # 宽度大于或等于高度，横向
def gen_photos_info(photo_folder_path):
    # photo_folder_path = "../../output/photo/nj"
    folders = []

    for f in os.listdir(photo_folder_path):
        if os.path.isdir(os.path.join(photo_folder_path, f)):
            folders.append(f)
    for folder in folders:
        info_string = ""
        location_path = os.path.join(photo_folder_path, folder)
        info_path = os.path.join(location_path, "info.txt")
        if os.path.exists(info_path):
            os.remove(info_path)
        imgs = os.listdir(location_path)
        info_string += str(len(imgs)) + '\n'
        for img in imgs:
            img_path = os.path.join(location_path, img)
            info_string += img + ' '
            info_string += check_img_ori(img_path) + '\n'
        info_path = os.path.join(location_path, "info.txt")
        with open(info_path, mode='w', encoding='utf-8') as f:
            f.write(info_string)
            f.close()


def count_call():
    result_string = ""
    with open("../../output/count_calls.txt", mode='r', encoding='utf-8') as f:
        lines = f.readlines()
        audio_cnt = 0
        video_cnt = 0
        audio_total_time = 0
        video_total_time = 0
        max_audio_time = 0
        max_video_time = 0
        for line in lines:
            words = line.split()
            if words[2] == "audio":
                audio_cnt += 1
                audio_total_time += eval(words[3])
                max_audio_time = max(max_audio_time, eval(words[3]))
            elif words[2] == "video":
                video_cnt += 1
                video_total_time += eval(words[3])
                max_video_time = max(max_video_time, eval(words[3]))

        result_string += "语音通话次数：" + str(audio_cnt) + '\n'
        result_string += "视频通话次数：" + str(video_cnt) + '\n'
        result_string += "语音通话总时长：" + str(audio_total_time) + '\n'
        result_string += "视频通话总时长：" + str(video_total_time) + '\n'

        for line in lines:
            words = line.split()
            if words[2] == "audio" and max_audio_time == eval(words[3]):
                result_string += "最长的一次语音通话聊了：" + str(max_audio_time) + "分钟"
                result_string += "是在日期" + words[0] + "在时间" + words[1]
                result_string += "通话类型" + words[2] + '\n'
            elif words[2] == "video" and max_video_time == eval(words[3]):
                result_string += "最长的一次视频通话聊了：" + str(max_video_time) + "分钟"
                result_string += "是在日期" + words[0] + "在时间" + words[1]
                result_string += "通话类型" + words[2] + '\n'

    print(result_string)

    with open("../../output/calls_analyze.txt", mode='w', encoding='utf-8') as f:
        f.write(result_string)
        f.close()



def read_csv():
    # f = open("../../data/chat.csv", mode='r', encoding='utf-8')
    # reader = csv.reader(f)

    # count_chat_monthly(reader)
    # count_chat_daily(reader)
    # count_chat_hourly(reader)
    # count_word_frequency(reader)
    # gen_photos_info("../../output/photo/nj")
    # gen_photos_info("../../output/photo/china")
    count_call()



if __name__ == '__main__':
    read_csv()
