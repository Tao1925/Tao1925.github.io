
function loadContent(targetId, file) {
    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${file}`);
            return response.text();
        })
        .then(data => {
            document.getElementById(targetId).innerHTML = data;
            if (targetId === "page0"){
                set_page0_animation();
            }
            if (targetId === "page1"){
                set_page1_animation();
            }
            if (targetId === "page2"){
                create_month_chart();
            }
            if (targetId === "page3"){
                create_day_chart();
            }
            if (targetId === "page4"){
                create_wordcloud_chart();
            }
            if (targetId === "page5"){
                create_calls_chart();
            }
            if (targetId === "page6"){
                create_hour_chart();
            }
            if (targetId === "page7"){
                create_china_chart();
            }
            if (targetId === "page8"){
                create_nj_chart();
            }
            if (targetId === "page9"){
                create_movie_page();
            }
            if (targetId === "page10"){
                // create_time_page();
            }
        })
        .catch(err => console.error(err));
}

function timeToDecimal(timeStr) {
    // 分割输入的时间字符串
    const [hours, minutes] = timeStr.split(":").map(Number);

    // 将分钟转换为小时，并返回总的小时数
    return hours + minutes / 60;
}


function getRandomThreeNumbers(n) {
    if (n < 3) {
        throw new Error("n 必须大于等于 3");
    }

    const result = new Set();

    // 不断添加随机数直到集合中有 3 个不同的数字
    while (result.size < 3) {
        const randomNum = Math.floor(Math.random() * n);
        result.add(randomNum);
    }

    return Array.from(result);
}


function getFileNameFromURL(url) {
    const parsedUrl = new URL(url);  // 创建 URL 对象
    const pathname = parsedUrl.pathname;  // 获取路径部分

    // 使用正则表达式从路径中提取文件名
    const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
    return fileName;
}



async function show_photos(page_id, marker_name) {
    try {

        var folder_path;
        if (page_id === "page7") folder_path = "/output/photo/china/" + marker_name;
        else if (page_id === "page8") folder_path = "/output/photo/nj/" + marker_name;
        const response = await fetch(folder_path + '/' + "info.txt");
        const content = await response.text();
        const lines = content.split('\n');

        var img_info = [];
        var img_ori_hashmap = {};
        var total_cnt = 0;

        const image_urls = []
        lines.forEach(line => {
            const words = line.split(' ');
            console.log(words);
            console.log("words.length = " + words.length);
            if (words.length === 1 && words[0].length >= 1) {
                total_cnt = parseInt(words[0].trim());
                console.log("words[0].trim() = " + words[0].trim());
            }else if (words.length === 2){
                var url = words[0].trim();
                var ori = words[1].trim();
                img_info.push({
                    url: url,
                    ori: ori,
                });
                img_ori_hashmap[url] = ori;
            }
        })

        console.log(img_info);
        console.log(img_ori_hashmap);


        let i;
        var element_id;
        if (page_id === "page7") element_id = "china_chart";
        else if (page_id === "page8") element_id = "container";
        var target_page = document.getElementById(element_id);

        var photo_container = document.createElement('div');
        photo_container.id = "photo_container";
        photo_container.style.position = "static";
        photo_container.style.width = "100%";
        photo_container.style.height = "100%";
        target_page.appendChild(photo_container)

        console.log(total_cnt);

        const random_three_numbers = getRandomThreeNumbers(total_cnt);
        console.log("random_three_numbers = " + random_three_numbers);

        for (i = 0; i < 3; i++) {
            const random_index = random_three_numbers[i];
            console.log("random_index = " + random_index);
            image_urls.push(folder_path +  '/' + img_info[random_index].url);
        }
        console.log(img_info);
        console.log(image_urls);

        const img_elements = [];

        image_urls.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            // img.onload = function(){
            //     // 获取屏幕的宽高
            //     const screenWidth = window.innerWidth;
            //     const screenHeight = window.innerHeight;
            //
            //     // 计算目标面积 (屏幕面积的1/8)
            //     const targetArea = (screenWidth * screenHeight) / 8;
            //
            //     // 图片的原始宽高
            //     const originalWidth = img.naturalWidth;
            //     const originalHeight = img.naturalHeight;
            //
            //     // 计算图片的长宽比
            //     const aspectRatio = originalWidth / originalHeight;
            //
            //     // 计算目标宽高，使图片面积接近 targetArea 且保持长宽比
            //     const targetWidth = Math.sqrt(targetArea * aspectRatio);
            //     const targetHeight = targetWidth / aspectRatio;
            //
            //     // 设置图片的宽高
            //     img.style.width = `${targetWidth}px`;
            //     img.style.height = `${targetHeight}px`;
            //     img.style.position = "relative";
            //     img.style.zIndex = 9999;
            // }
            photo_container.appendChild(img);
            img_elements.push(img);

        })
        console.log(img_elements);
        console.log(img_elements[0].naturalHeight);

        const vertical_imgs = [];
        const horizontal_imgs = [];

        img_elements.forEach(img => {
            console.log(img.src);
            var img_name = getFileNameFromURL(img.src);
            if (img_ori_hashmap[img_name] === "vertical") {
                vertical_imgs.push(img);
            } else if (img_ori_hashmap[img_name] === "horizontal"){
                horizontal_imgs.push(img);
            }
        })
        console.log(img_ori_hashmap);
        console.log("vertical_imgs = " + vertical_imgs);
        console.log("horizontal_imgs = " + horizontal_imgs);

        // for (i = 0; i < 3; i++){
        //     console.log("img_elements[i].naturalHeight = " + img_elements[i].naturalHeight);
        //     console.log("img_elements[i].naturalWidth = " + img_elements[i].naturalWidth);
        //     if (img_elements[i].naturalHeight > img_elements[i].naturalWidth){
        //         vertical_imgs.push(img_elements[i]);
        //     }else{
        //         horizontal_imgs.push(img_elements[i]);
        //     }
        // }

        console.log("horizontal_imgs.length = " + horizontal_imgs.length);
        console.log("vertical_imgs.length = " + vertical_imgs.length);
        if (horizontal_imgs.length === 3 && vertical_imgs.length === 0) {

            horizontal_imgs.forEach((img, idx) => {
                img.onload = function () {
                    const screenWidth = window.innerWidth;
                    const screenHeight = window.innerHeight;
                    const targetArea = (screenWidth * screenHeight) / 8;
                    const originalWidth = this.naturalWidth;
                    const originalHeight = this.naturalHeight;
                    const aspectRatio = originalWidth / originalHeight;
                    const targetWidth = Math.sqrt(targetArea * aspectRatio);
                    const targetHeight = targetWidth / aspectRatio;

                    this.style.width = `${targetWidth}px`;
                    this.style.height = `${targetHeight}px`;
                    this.style.position = "absolute";
                    this.style.zIndex = 9999;

                    this.style.left = `${screenWidth / 4 * (idx + 1) - targetWidth / 2}px`;
                    this.style.top = `${screenHeight / 4 * ((idx % 2) * 2 + 1) - targetHeight / 2}px`;
                }
            })

        } else if (horizontal_imgs.length === 2 && vertical_imgs.length === 1) {
            horizontal_imgs.forEach((img, idx) => {
                img.onload = function () {
                    const screenWidth = window.innerWidth;
                    const screenHeight = window.innerHeight;
                    const targetArea = (screenWidth * screenHeight) / 8;
                    const originalWidth = this.naturalWidth;
                    const originalHeight = this.naturalHeight;
                    const aspectRatio = originalWidth / originalHeight;
                    const targetWidth = Math.sqrt(targetArea * aspectRatio);
                    const targetHeight = targetWidth / aspectRatio;

                    this.style.width = `${targetWidth}px`;
                    this.style.height = `${targetHeight}px`;
                    this.style.position = "absolute";
                    this.style.zIndex = 9999;

                    this.style.left = `${screenWidth / 3  - targetWidth / 2}px`;
                    this.style.top = `${screenHeight / 4 * (idx * 2 + 1) - targetHeight / 2}px`;
                }
            });
            vertical_imgs.forEach((img, idx) => {
                img.onload = function () {
                    const screenWidth = window.innerWidth;
                    const screenHeight = window.innerHeight;
                    const targetArea = (screenWidth * screenHeight) / 8;
                    const originalWidth = this.naturalWidth;
                    const originalHeight = this.naturalHeight;
                    const aspectRatio = originalWidth / originalHeight;
                    const targetWidth = Math.sqrt(targetArea * aspectRatio);
                    const targetHeight = targetWidth / aspectRatio;

                    this.style.width = `${targetWidth}px`;
                    this.style.height = `${targetHeight}px`;
                    this.style.position = "absolute";
                    this.style.zIndex = 9999;

                    this.style.left = `${screenWidth / 6 * 5 - targetWidth / 2}px`;
                    this.style.top = `${screenHeight / 2 - targetHeight / 2}px`;
                }
            })
        } else if (horizontal_imgs.length === 1 && vertical_imgs.length === 2) {
            horizontal_imgs.forEach((img, idx) => {
                img.onload = function () {
                    const screenWidth = window.innerWidth;
                    const screenHeight = window.innerHeight;
                    const targetArea = (screenWidth * screenHeight) / 8;
                    const originalWidth = this.naturalWidth;
                    const originalHeight = this.naturalHeight;
                    const aspectRatio = originalWidth / originalHeight;
                    const targetWidth = Math.sqrt(targetArea * aspectRatio);
                    const targetHeight = targetWidth / aspectRatio;

                    this.style.width = `${targetWidth}px`;
                    this.style.height = `${targetHeight}px`;
                    this.style.position = "absolute";
                    this.style.zIndex = 9999;

                    this.style.left = `${screenWidth / 2  - targetWidth / 2}px`;
                    this.style.top = `${screenHeight / 2  - targetHeight / 2}px`;
                }
            });
            vertical_imgs.forEach((img, idx) => {
                img.onload = function () {
                    const screenWidth = window.innerWidth;
                    const screenHeight = window.innerHeight;
                    const targetArea = (screenWidth * screenHeight) / 8;
                    const originalWidth = this.naturalWidth;
                    const originalHeight = this.naturalHeight;
                    const aspectRatio = originalWidth / originalHeight;
                    const targetWidth = Math.sqrt(targetArea * aspectRatio);
                    const targetHeight = targetWidth / aspectRatio;

                    this.style.width = `${targetWidth}px`;
                    this.style.height = `${targetHeight}px`;
                    this.style.position = "absolute";
                    this.style.zIndex = 9999;

                    this.style.left = `${screenWidth / 6 * (idx * 4 + 1) - targetWidth / 2}px`;
                    this.style.top = `${screenHeight / 2 - targetHeight / 2}px`;
                }
            })
        } else if (horizontal_imgs.length === 0 && vertical_imgs.length === 3) {
            vertical_imgs.forEach((img, idx) => {
                img.onload = function () {
                    const screenWidth = window.innerWidth;
                    const screenHeight = window.innerHeight;
                    const targetArea = (screenWidth * screenHeight) / 8;
                    const originalWidth = this.naturalWidth;
                    const originalHeight = this.naturalHeight;
                    const aspectRatio = originalWidth / originalHeight;
                    const targetWidth = Math.sqrt(targetArea * aspectRatio);
                    const targetHeight = targetWidth / aspectRatio;

                    this.style.width = `${targetWidth}px`;
                    this.style.height = `${targetHeight}px`;
                    this.style.position = "absolute";
                    this.style.zIndex = 9999;

                    this.style.left = `${screenWidth / 6 * (idx * 2 + 1) - targetWidth / 2}px`;
                    this.style.top = `${screenHeight / 2 - targetHeight / 2}px`;
                }
            })
        }
        // 创建 GSAP 时间轴
        const tl = gsap.timeline({
            onComplete: () => {
                // 动画完成后，移除 overlay
                target_page.removeChild(photo_container);
            }
        });

        // 淡入 Overlay
        tl.to(photo_container, {duration: 0.5, opacity: 1});

        // 图片进入动画
        tl.to(img_elements, {
            duration: 1,
            opacity: 1,
            scale: 1,
            stagger: 0.2,
            ease: 'power3.out'
        }, "-=0.3");

        // 等待5秒
        tl.to({}, {duration: 5});

        // 图片退出动画
        tl.to(img_elements, {
            duration: 1,
            opacity: 0,
            scale: 0.8,
            stagger: 0.2,
            ease: 'power3.in'
        });

        // 淡出 Overlay
        tl.to(photo_container, {duration: 0.5, opacity: 0}, "-=0.5");

    }catch (error){
        console.error('读取文件失败:', error);
    }


}


// 加载内容
document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i <= 9; i++) {
        loadContent('page' + i, 'html/page' + i + '.html');
    }
});


function gen_single_chat(direction, user, content){
    var chat_container = document.getElementById('chat_container');
    const chats = chat_container.querySelectorAll('.single_chat');
    var chats_num = chats.length;

    const single_chat = document.createElement('div');
    single_chat.classList.add('single_chat');

    if (direction === 'left') {
        single_chat.style.direction = 'ltr';
    }else if (direction === 'right') {
        single_chat.style.direction = 'rtl';
    }

    const circle_container = document.createElement('div');
    circle_container.classList.add('circle_container');

    const logo_img = document.createElement('img');
    if (user === 'sxy'){
        logo_img.src = '/web_proj/res/sxy_logo.jpg';
    }else if (user === 'tsy'){
        logo_img.src = '/web_proj/res/tsy_logo.jpg';
    }
    circle_container.appendChild(logo_img);

    const typing = document.createElement('div');
    typing.classList.add('typing');
    typing.id = 'typing' + (chats_num + 1);

    const obj = {
        output: '',
        type: 'normal',
        isEnd: false,
        speed: 60,
        backSpeed: 40,
        sleep: 3000,
        singleBack: false,
        sentencePause: false
    }


    const easyTyper = new EasyTyper(obj, content,
        instance => {
            // 回调函数
            // 此回调一般用于获取新的数据然后循环输出
            // instance { 实例EasyTyper }
            console.log(instance) // 打印出实例对象
        }, (output, instance)=>{
            // 钩子函数
            // output { 当前帧的输出内容 }
            // instance { 实例EasyTyper }
            // 通过钩子函数动态更新dom元素
            typing.innerHTML = `${output}`
        })


    single_chat.appendChild(circle_container);
    single_chat.appendChild(typing);

    chat_container.appendChild(single_chat);


}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function clear_chat_container() {
    var chat_container = document.getElementById('chat_container');
    const chats = chat_container.querySelectorAll('.single_chat');
    chats.forEach(chat => {
        chat.remove();
    })
}

function scrollDown() {
    // gsap.registerPlugin(ScrollTrigger);
    // // 滚动目标：100vh
    // var target = window.innerHeight;
    //
    // // 使用 GSAP 动画库进行滚动
    // gsap.to(window, {
    //     duration: 2, // 动画时长
    //     scrollTo: target, // 滚动目标（100vh）
    //     ease: "power2.inOut" // ease-in-out 曲线
    // });

    var current_height = window.scrollY;
    var target_height = current_height + window.innerHeight;

    window.scrollTo(0,target_height);
}



async function gen_chat(){

    gen_single_chat('left', 'tsy', '1234567890');
    await delay(2000);
    gen_single_chat('right', 'sxy', '44556677');
    await delay(2000);
    // gen_single_chat('left', 'sxy', '098765432');
    // await delay(2000);
    // clear_chat_container();
    // await delay(3000);
    // scrollDown();
    // await delay(3000);
    // scrollDown();

}

async function show_heart(){
    const heart_container = document.getElementById('heart_container');

}


async function set_page0_animation(){

    await gen_chat();
    await show_heart();


}


function set_page1_animation(){
    gsap.registerPlugin(ScrollTrigger);

    const spans = document.querySelectorAll("#basic_info .animated_num");

    const targetValues = []
    spans.forEach(span => {
        targetValues.push(parseInt(span.textContent));
        const span_width = span.textContent.length;
        span.style.width = '5' + 'ch';
        span.textContent = "";

    })

    console.log(spans);
    spans.forEach((span, index) => {
        // 获取 span 元素中的目标数字
        const targetValue = parseInt(span.textContent);
        // 每个 span 的动画，延迟逐个触发
        gsap.to(span, {
            scrollTrigger: {
                trigger: "#page1", // 触发动画的元素
                start: "top center", // 当 div1 顶部到达视窗中心时开始
                end: "bottom center", // 当 div1 底部到达视窗中心时结束
                scrub: false, // 不与滚动进度同步
                once: true,  // 确保动画只触发一次
                onEnter: function (){
                    console.log(span);
                    console.log(index);
                    gsap.to(span, {
                        innerText: targetValues[index], // 动画到达目标值
                        duration: 5, // 动画时长
                        snap: {innerText: 1}, // 确保数值为整数
                        ease: "expo.inOut", // 缓动函数
                        delay: index, // 每个动画延迟 1 秒
                        onUpdate: function () {
                            const target = this.targets()[0];
                            target.textContent = Math.round(target.innerText);
                        }
                    })

                }
            }
        });
    });
    /*
    gsap.to(spans[0], {
        scrollTrigger: {
            trigger: "#page1", // 触发动画的元素
            start: "top center", // 当 div2 顶部到达视窗中心时开始
            end: "bottom center", // 当 div2 底部到达视窗中心时结束
            scrub: false, // 不与滚动进度同步
            once: true,  // 确保动画只触发一次
            onEnter: function() {
                // 触发数值动画从 0 到 10000
                gsap.to(spans[0], {
                    innerText: 10000,
                    duration: 3, // 动画时长
                    snap: { innerText: 1 }, // 确保数值为整数
                    ease: "expo.inOut", // 先快后慢
                    delay: 5,
                    onUpdate: function(self) {
                        // 动画中实时更新数字
                        const target = this.targets()[0];
                        target.textContent = Math.round(target.innerText);
                    }
                });
            }
        }
    });

    gsap.to(spans[1], {
        scrollTrigger: {
            trigger: "#page1", // 触发动画的元素
            start: "top center", // 当 div2 顶部到达视窗中心时开始
            end: "bottom center", // 当 div2 底部到达视窗中心时结束
            scrub: false, // 不与滚动进度同步
            once: true,  // 确保动画只触发一次
            onEnter: function() {
                // 触发数值动画从 0 到 10000
                gsap.to(spans[1], {
                    innerText: 10000,
                    duration: 3, // 动画时长
                    snap: { innerText: 1 }, // 确保数值为整数
                    ease: "expo.inOut", // 先快后慢
                    onUpdate: function(self) {
                        // 动画中实时更新数字
                        const target = this.targets()[0];
                        target.textContent = Math.round(target.innerText);
                    }
                });
            }
        }
    });

     */
}

function create_month_chart() {
    // var ctx = document.getElementById('lineChart').getContext('2d');
    var chart = echarts.init(document.getElementById('month_chart'));
    const strings = [];
    const numbers = [];
    var data;

    fetch('/output/count_chat_monthly.txt')
        .then(response => response.text())
        .then(content => {
            const lines = content.split('\n');

            const strings = [];
            const numbers = [];

            lines.forEach(line => {
                const parts = line.split(' ');
                if (parts.length === 2) {
                    strings.push(parts[0]);
                    numbers.push(parseFloat(parts[1])); // 假设数字是浮动类型
                }
            });

            var option = {
                xAxis: {
                    type: 'category',
                    data: strings,
                    interval: 3,
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: numbers,
                    type: 'line',
                    smooth: true, // 使线条平滑
                    lineStyle: {
                        width: 3
                    },
                    symbol: 'circle', // 数据点的样式为圆形
                    animation: true, // 启用动画
                    animationDuration: 30000, // 动画持续时间
                    animationEasing: 'elasticOut', // 弹性缓动效果
                    animationDelay: function (idx) {
                        return idx * 200; // 每个数据点有不同的延迟
                    },
                    animationDurationUpdate: 15000, // 更新时的动画时长
                    animationEasingUpdate: 'bounceOut' // 更新时的弹跳效果
                }]
            };
            // 创建并渲染图表
            chart.setOption(option);


            console.log('Strings:', strings);
            console.log('Numbers:', numbers);


        })
        .catch(error => console.error('读取文件失败:', error));
}

async function create_day_chart() {

    try {

        const response = await fetch("/output/count_chat_daily.txt");
        const content = await response.text();
        const lines = content.split('\n');

        const strings = [];
        const numbers = [];

        lines.forEach(line => {
            const  parts = line.split(' ');
            if (parts.length === 2){
                strings.push(parts[0]);
                numbers.push(parseInt(parts[1]));
            }
        })

        console.log('Strings:', strings);
        console.log('Numbers:', numbers);

        var chartDom = document.getElementById('day_chart');
        var myChart = echarts.init(chartDom);
        var option = {
            title: {
                text: 'Beijing AQI',
                left: '1%'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '5%',
                right: '15%',
                bottom: '10%'
            },
            xAxis: {
                data: strings
            },
            yAxis: {},
            toolbox: {
                right: 10,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            dataZoom: [
                {
                    startValue: '2024-01-01'
                },
                {
                    type: 'inside'
                }
            ],
            visualMap: {
                top: 50,
                right: 10,
                pieces: [
                    {
                        gt: 0,
                        lte: 50,
                        color: '#93CE07'
                    },
                    {
                        gt: 50,
                        lte: 100,
                        color: '#FBDB0F'
                    },
                    {
                        gt: 100,
                        lte: 150,
                        color: '#FC7D02'
                    },
                    {
                        gt: 150,
                        lte: 200,
                        color: '#FD0100'
                    },
                    {
                        gt: 200,
                        lte: 300,
                        color: '#AA069F'
                    },
                    {
                        gt: 300,
                        color: '#AC3B2A'
                    }
                ],
                outOfRange: {
                    color: '#999'
                }
            },
            series: {
                name: 'Beijing AQI',
                type: 'line',
                data: numbers,
                markLine: {
                    silent: true,
                    lineStyle: {
                        color: '#333'
                    },
                    data: [
                        {
                            yAxis: 50
                        },
                        {
                            yAxis: 100
                        },
                        {
                            yAxis: 150
                        },
                        {
                            yAxis: 200
                        },
                        {
                            yAxis: 300
                        }
                    ]
                }
            }
        }

        myChart.setOption(option);
    } catch (error) {
        console.error('读取文件失败:', error);
    }
}

async function create_wordcloud_chart(){
    try {
        const response = await fetch("/output/count_word_frequency.txt");
        const content = await response.text();
        const lines = content.split('\n');

        const strings = [];
        const numbers = [];

        lines.forEach(line => {
            const  parts = line.split(' ');
            if (parts.length === 2){
                strings.push(parts[0]);
                numbers.push(parseInt(parts[1]));
            }
        })

        console.log(strings)
        console.log(numbers)
        const tmp_data = strings.map((str, idx) =>({
            name: str,
            value: numbers[idx]
        }));
        const data = tmp_data.slice(0, 100);
        console.log(data)

        var maskImage = new Image();
        maskImage.src = '/web_proj/res/heart_mask.png'

        var chart = echarts.init(document.getElementById('wordcloud_chart'));
        /*
        var data = [
            { name: 'ECharts', value: 10000 },
            { name: 'WordCloud', value: 6181 },
            { name: 'Data', value: 4386 },
            { name: 'JavaScript', value: 4055 },
            { name: 'Python', value: 2467 },
            { name: 'React', value: 1981 },
            { name: 'Node.js', value: 1506 },
            { name: 'Chart', value: 1483 },
            { name: 'VUE', value: 1323 },
            { name: 'CSS', value: 1024 }
        ];
        */
        // 配置项
        var option = {
            tooltip: {
                show: true
            },
            series: [{
                type: 'wordCloud',
                gridSize: 20,
                sizeRange: [12, 60],
                rotationRange: [-90, 90],
                shape: 'circle',
                maskImage: maskImage,
                right: null,
                bottom: null,
                width: '100%',
                height: '100%',
                drawOutOfBound: true,
                data: data,
            }]
        };

        maskImage.onload = function (){
            // option.series[0].maskImage;
            chart.setOption(option);
        }



    } catch (error){
        console.error('读取文件失败:', error);
    }
}

async function create_calls_chart(){
    try {
        const response = await fetch("/output/count_calls.txt");
        const content = await response.text();
        const lines = content.split('\n');

        const audio_data = [];
        const video_data = [];

        lines.forEach(line => {
                            const parts = line.split(' ');
                            if (parts.length === 4){
                                if (parts[2] === "audio") {
                                    audio_data.push([parts[0], timeToDecimal(parts[1]), parseInt(parts[3])]);
                                }else if (parts[2] === "video") {
                                    video_data.push([parts[0], timeToDecimal(parts[1]), parseInt(parts[3])]);
                                }
                            }
                        })

        var chart = echarts.init(document.getElementById('calls_chart'));
        console.log(audio_data)

        var option = {
            color: ['#dd4444','#80F1BE'],
            legend: {
                top: 10,
                data: ['语音', '视频'],
                textStyle: {
                    fontSize: 16
                }
            },
            xAxis: {
                type: 'time'
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '北京',
                    type: 'scatter',
                    data: audio_data,
                    symbolSize: function (data){
                        return data[2];
                    }
                }
            ],

        };
        chart.setOption(option);


    } catch (error){
        console.error('读取文件失败:', error);
    }
}


async function create_hour_chart(){
    try{
        const response = await fetch("/output/count_chat_hourly.txt");
        const content = await response.text();
        const lines = content.split('\n');




        var sxy_hour_data = new Array(24).fill(0);
        var tsy_hour_data = new Array(24).fill(0);

        const x_data = Array.from({ length: 24 }, (v, i) => i);


        lines.forEach(line => {
            const parts = line.split(' ');
            if (parts.length === 3){
                var ind = parseInt(parts[1]);
                var cnt = parseInt(parts[2]);
                if (parts[0] === "SXY"){
                    sxy_hour_data[ind] = cnt;
                }else if (parts[0] === "TSY"){
                    tsy_hour_data[ind] = cnt;
                }
            }
        })


        var chart = echarts.init(document.getElementById('hour_chart'));

        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: x_data
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'SXY',
                    type: 'bar',
                    stack: 'hour',
                    emphasis: {
                        focus: 'series'
                    },
                    data: sxy_hour_data
                },
                {
                    name: 'TSY',
                    type: 'bar',
                    stack: 'hour',
                    emphasis: {
                        focus: 'series'
                    },
                    data: tsy_hour_data
                }
            ]
        };

        chart.setOption(option);

    } catch (error){
        console.error('读取文件失败:', error);
    }
}


async function create_china_chart(){
    var chart = echarts.init(document.getElementById("china_chart"));

    $.getJSON("/output/china_full.json", function (data) {
        // 注册地图
        echarts.registerMap("china", data);
        // 配置option
        const option = {
            // 地理坐标系组件用于地图的绘制
            geo: {
                // 使用 registerMap 注册的地图名称。
                map: "china",
                // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
                roam: true,
                zoom: 1.5,
                top: '25%',
                // 图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。
                label: {
                    show: false,
                    color: "#666666",
                },
                // 地图区域的多边形 图形样式。
                /*
                itemStyle: {
                    // 地图区域的颜色
                    areaColor: "#71d5a1", // 绿色
                    // 图形的描边颜色
                    borderColor: "#2979ff", // 蓝色
                },*/
                // 设置高亮状态下的多边形和标签样式
                emphasis: {
                    // 设置区域样式
                    itemStyle: {
                        areaColor: "#ffff99", // 黄色
                        borderColor: "#f29100", // 描边颜色黄色
                    },
                    // 设置字体
                    label: {
                        fontSize: 16, // 16px
                        color: "#f29100", // 白色
                    },
                },
            },
            visualMap: {
                type: 'piecewise',
                pieces: [
                    { min: 0, max: 10, color: '#e0ffff' },   // 10 及以下的值，颜色为浅蓝色
                    { min: 10.1, max: 20, color: '#006edd' }, // 10 到 20 的值，颜色为深蓝色
                    { min: 20.1, max: 30, color: '#ff0000' }, // 20 到 30 的值，颜色为红色
                    { min: 30.1, max: 40, color: '#ff7f00' }, // 30 到 40 的值，颜色为橙色
                    { min: 40.1, max: 50, color: '#ffff00' }, // 40 到 50 的值，颜色为黄色
                ],
                text: ['高', '低'], // 映射显示的文字
                calculable: true,
            },
            series: [
                {
                    type: "map",
                    map: "china",
                    geoIndex: 0,
                    roam: true,
                    data: [
                        { name: "苏州市", value:5 },  // 北京省份设置为红色
                        { name: "湖州市", value:15 },  // 上海省份设置为绿色
                        { name: "成都市", value:25 }, // 广东省份设置为蓝色
                        { name: "大连市", value:35 }
                        // 其他省份使用默认颜色（如果不设置）
                    ]
                },
                {
                    type: "scatter",
                    coordinateSystem: "geo",
                    symbolSize: "20",
                    itemStyle: {
                        color: "#fa3534",
                    },
                    data: [
                        // { name: "北京", value: [116.4074, 39.9042] },
                        // { name: "上海", value: [121.4737, 31.2304] },
                        // { name: "广州", value: [113.2644, 23.1292] },
                        // // 更多数据...
                    ],
                },
            ],
        };
        chart.setOption(option, true);
    });

    chart.on('click', function(params) {
        console.log(params);
        if (params.componentType === 'series') {
            // 获取点击的省份名称
            var provinceName = params.name;

            // 执行你的函数
            // console.log('点击了省份:', provinceName);
            show_photos("page7", provinceName)
        }
    })
}

async function create_nj_chart(){
    /*
    window._AMapSecurityConfig = {
        securityJsCode: "bdf632a55278fa6e8480dc7917083027",
    };
    AMapLoader.load({
        key: "2105cea408b19738068689ff54a09fdd", //申请好的Web端开发者 Key，调用 load 时必填
        version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
    })
        .then((AMap) => {
            const map = new AMap.Map("nj-chart");
        })
        .catch((e) => {
            console.error(e); //加载错误提示
        }); */

    try {
        var map = new AMap.Map("container", {
            zoom: 13,
            center: [118.796709, 32.060362],
            resizeEnable: true
        });

        const response = await fetch("/output/map_points.txt");
        const content = await response.text();
        const lines = content.split('\n');

        const map_points_info = []

        lines.forEach(line => {
            const words = line.split(' ');
            const location_name = words[0];
            const cords = words[1].split(',');
            const x = parseFloat(cords[0]);
            const y = parseFloat(cords[1]);
            map_points_info.push({
                location_name: location_name,
                x: x,
                y: y
            })
        })
        console.log(map_points_info)

        var onMarkerClick = function (e) {
            var marker_location_name = e.target._originOpts.location_name;
            show_photos("page8", marker_location_name);

            // e.target 就是被点击的 Marker
        }

        for (var i = 0; i < map_points_info.length; i++){
            var marker = new AMap.Marker({
                map: map,
                icon: "/web_proj/res/poi-marker-default.png",
                position: [map_points_info[i].x, map_points_info[i].y],
                offset: new AMap.Pixel(-13, -30),
                location_name: map_points_info[i].location_name,
            });
            marker.on('click', onMarkerClick);
        }

    } catch (error){
        console.log(error)
    }
}

function getFormattedTime() {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
}


function create_movie_page() {

}

function updateTime(){
    const { hours, minutes, seconds } = getFormattedTime();

    // 更新小时、分钟和秒钟的文本
    const hourElement = document.getElementById('hours');
    const minuteElement = document.getElementById('minutes');
    const secondElement = document.getElementById('seconds');

    // 使用 GSAP 为每个部分添加动画效果
    gsap.fromTo(hourElement, {
        opacity: 0, // 初始状态透明
        scale: 0.5  // 初始状态缩小
    }, {
        opacity: 1, // 变为完全不透明
        scale: 1,   // 还原为原始大小
        duration: 0.6, // 动画持续时间
        ease: "back.out(1.7)", // 缓动效果
    });

    gsap.fromTo(minuteElement, {
        opacity: 0,
        scale: 0.5
    }, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
    });

    gsap.fromTo(secondElement, {
        opacity: 0,
        scale: 0.5
    }, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
    });

    // 更新 DOM 中的时间显示
    hourElement.textContent = hours;
    minuteElement.textContent = minutes;
    secondElement.textContent = seconds;

}

function create_time_page(){

    // 每秒更新一次时间
    setInterval(updateTime, 1000);

    // 初次运行时立即更新一次时间
    updateTime();
}
