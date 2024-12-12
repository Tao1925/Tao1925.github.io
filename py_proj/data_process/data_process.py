import csv
import os
from PIL import Image
import jieba
from collections import Counter

TYPE_INDEX = 2
MSG_INDEX = 7
DATE_INDEX = 8
NAME_INDEX = 10
MONTH_STRING_SIZE = 7
DAY_STRING_SIZE = 10


def compress_image(input_path, output_path, min_size_kb=150, max_size_kb=300):
    """
    压缩图片以保证大小在 min_size_kb 和 max_size_kb 之间，同时保持纵横比不变。
    :param input_path: 原始图片路径
    :param output_path: 输出图片路径
    :param min_size_kb: 最小目标文件大小 (单位: KB)
    :param max_size_kb: 最大目标文件大小 (单位: KB)
    """
    min_size_bytes = min_size_kb * 1024
    max_size_bytes = max_size_kb * 1024

    # 打开图片
    with Image.open(input_path) as img:

        # 如果图片是 RGBA 模式，转换为 RGB
        if img.mode == 'RGBA':
            img = img.convert('RGB')

        # 获取原始图片尺寸
        original_width, original_height = img.size

        # 初始化压缩比例和输出图片
        scale_factor = 1.0
        while True:
            # 调整图片尺寸（保持纵横比）
            new_width = int(original_width * scale_factor)
            new_height = int(original_height * scale_factor)
            resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

            # 保存到临时文件以获取文件大小
            resized_img.save(output_path, optimize=True, quality=85)
            file_size = os.path.getsize(output_path)

            # 如果文件大小在目标范围内，则完成
            if min_size_bytes <= file_size <= max_size_bytes:
                print(f"压缩完成：文件大小为 {file_size / 1024:.2f} KB")
                break
            elif file_size > max_size_bytes:
                # 如果文件太大，继续缩小尺寸
                scale_factor *= 0.9
            else:
                # 如果文件太小，适当提高尺寸（但不会超过原始尺寸）
                if scale_factor >= 1.0:
                    print("无法达到目标文件大小范围")
                    break
                scale_factor *= 1.1


def resize_photos(input_folder, output_folder):
    photos = []

    for f in os.listdir(input_folder):
        if os.path.isfile(os.path.join(input_folder, f)):
            photos.append(f)

    for photo_filename in photos:
        input_photo_path = os.path.join(input_folder, photo_filename)
        output_photo_path = os.path.join(output_folder, photo_filename)
        compress_image(input_photo_path, output_photo_path)


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
    sorted_word_counts = dict(sorted(word_counts.items(), key=lambda item: item[1], reverse=True))
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


def count_by_month():
    with open("../../output/count_chat_monthly.txt", mode='r', encoding='utf-8') as f:
        lines = f.readlines()
        nums = [0] * 13
        for line in lines:
            words = line.split()
            month_num = words[0].split('-')[1]
            if month_num[0] == '0':
                month_num = month_num[1:]
            month = eval(month_num)
            nums[month] += eval(words[1])
        for i in range(13):
            print(i, end=' ')
            print(nums[i])


def count_char(reader):
    text_length_dict = {}
    long_text_list = []
    for row in reader:
        msg_type = row[TYPE_INDEX]
        if msg_type != '1':
            continue
        text = row[MSG_INDEX]
        text_length = len(text)
        if (text_length > 500):
            long_text_list.append(text)
        if text_length not in text_length_dict:
            text_length_dict[text_length] = 1
        else:
            text_length_dict[text_length] += 1

    sorted_dict = {key: text_length_dict[key] for key in sorted(text_length_dict)}
    # print(sorted_dict)
    tot_char = 0
    with open("../../output/text_char_count.txt", mode='w', encoding='utf-8') as f:
        for key, value in sorted_dict.items():
            f.write(str(key) + ' ' + str(value) + '\n')
            tot_char += key * value
        for long_text in long_text_list:
            f.write(str(len(long_text)) + '\n')
            f.write(long_text + '\n')
        f.close()
    print("一共字符数：" + str(tot_char))



def read_csv():
    f = open("../../data/chat.csv", mode='r', encoding='utf-8')
    reader = csv.reader(f)

    # count_chat_monthly(reader)
    # count_chat_daily(reader)
    # count_chat_hourly(reader)
    count_word_frequency(reader)
    # gen_photos_info("../../output/photo/nj")
    # gen_photos_info("../../output/photo/china")
    # count_call()
    # resize_photos("../../output/photo/movie_tmp", "../../output/photo/movie")
    # count_by_month()
    # count_char(reader)


if __name__ == '__main__':
    read_csv()
