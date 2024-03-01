//1:快點跑-本人讓當月壽星砸1次，20秒
//2:快點砸-本人砸當月壽星1次，20秒
//3:免砸金牌-當有人要被砸時，可以救他1次
//4:輪盤、拉霸-隨機挑出幸運兒被砸20秒
//5:PASS-沒事
var items, counts, ResultItems, interval;
var can, cxt, w, h;
var parentX, parentY, parentWidth, parentHeight;   // 父元素的 x 座標
var deviceType;
items = [1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5, 5];

window.addEventListener('load', function () {
    //刮刮樂前置作業
    //-----------------------------------------------------
    Layout_Adjustment()
    CardLoad();
    CardGenerate();
    // CardConuter();

    if (deviceType === 'mobile') {
        can.addEventListener('touchstart', handleTouchStart);
        console.log('現在使用的設備是行動裝置');
    } else {
        can.onmousedown = handleMouseDown;
        console.log('現在使用的設備是電腦');
    }
    
});

//版面調整
//-----------------------------------------------------
function Layout_Adjustment() {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    var imgCard = document.getElementById('ImgCard');
    var imgRule = document.getElementById('ImgRule');

    var imgWidth = imgCard.width;
    var imgHeight = imgCard.height;

    $("#btn_Again").css("visibility", "hidden");

    // 調整圖像的位置
    if (windowWidth > (imgCard.width + imgRule.width + 20)) {
        imgRule.style.left = (imgCard.width + 20) + 'px'; // 假設左側圖片的寬度為 516，並將右側圖片向右偏移 20 像素
        imgRule.style.top = '0px'; // 調整垂直位置，這裡假設頂部對齊
    }
    else {
        imgRule.style.left = '0px';
        imgRule.style.top = (imgCard.height + 20) + 'px';

        for (var i = 1; i <= 5; i++) {
            document.getElementById('ImgBackColor' + i).style.left = '0px';
            document.getElementById('ImgBackColor' + i).style.top = `${parseInt(window.getComputedStyle(document.getElementById('ImgBackColor' + i)).getPropertyValue('top'), 10) + (imgCard.height + 20)}px`;

            var n1 = `${parseInt(window.getComputedStyle(document.getElementById('CardCount' + i)).getPropertyValue('left'), 10) - (imgCard.width + 20)}px`;
            var n2 = `${parseInt(window.getComputedStyle(document.getElementById('CardCount' + i)).getPropertyValue('top'), 10) + (imgCard.height + 20)}px`;
            document.getElementById('CardCount' + i).style.left = `${parseInt(window.getComputedStyle(document.getElementById('CardCount' + i)).getPropertyValue('left'), 10) - (imgCard.width + 20)}px`;
            document.getElementById('CardCount' + i).style.top = `${parseInt(window.getComputedStyle(document.getElementById('CardCount' + i)).getPropertyValue('top'), 10) + (imgCard.height + 20)}px`;
        }

        document.getElementById('CountText').style.top = '0px';
    }
}
//刮刮樂事件
//-----------------------------------------------------
// 刮刮乐事件
//-----------------------------------------------------

//行動裝置事件
//-----------------------------------------------------
function handleTouchStart(event) {
    event.preventDefault();
    var touch = event.touches[0];
    var lastw = touch.clientX - can.offsetLeft;
    var lasth = touch.clientY - can.offsetTop;
    cxt.lineTo(lastw, lasth);
    cxt.beginPath();

    can.addEventListener("touchmove", handleTouchMove, false);
    can.addEventListener("touchend", handleTouchEnd, false);
}

function handleTouchMove(event) {
    event.preventDefault();
    var touch = event.touches[0];
    var lastw = touch.clientX - can.offsetLeft;
    var lasth = touch.clientY - can.offsetTop;
    cxt.lineTo(lastw, lasth);
    cxt.stroke();
}

function handleTouchEnd(event) {
    event.preventDefault();

    var imageData = cxt.getImageData(parentX, parentY, parentWidth, parentHeight);
    var pixels = imageData.data;
    var transparentPixels = 0;

    //檢查是否刮了80%了
    for (var i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] === 0) { // 檢查透明像素
            transparentPixels++;
        }
    }

    var totalPixels = parentWidth * parentHeight;
    var transparencyPercentage = transparentPixels / totalPixels;

    //如果刮開了 80% 或更多的畫布，則刪除 canvas 元素
    if (transparencyPercentage >= 0.8) {
        cxt.clearRect(0, 0, w, h);
        CardConuter();
        setTimeout(function () {
            // $("#overlay").fadeIn();
            Result();
        }, 1000); // 1000 毫秒即 3 秒延迟
    }

    can.removeEventListener("touchmove", handleTouchMove, false);
    can.removeEventListener("touchend", handleTouchEnd, false);

    // 进行其他操作
}
//行動裝置事件
//-----------------------------------------------------
//-----------------------------------------------------
//-----------------------------------------------------


//電腦事件
//-----------------------------------------------------
function handleMouseDown(event) {
    var ev = event || window.event;
    var lastw = ev.clientX - can.offsetLeft;
    var lasth = ev.clientY - can.offsetTop;
    cxt.lineTo(lastw, lasth);
    cxt.beginPath();


    can.onmousemove = function (event) {
        var ev = event || window.event;
        var lastw = ev.clientX - can.offsetLeft;
        var lasth = ev.clientY - can.offsetTop;
        cxt.lineTo(lastw, lasth);
        cxt.stroke();
    }

    can.onmouseup = function (event) {
        can.onmousemove = null;
        // var imageData = cxt.getImageData(0, 0, w, h);
        var imageData = cxt.getImageData(parentX, parentY, parentWidth, parentHeight);
        var pixels = imageData.data;
        var transparentPixels = 0;

        //檢查是否刮了80%了
        for (var i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] === 0) { // 檢查透明像素
                transparentPixels++;
            }
        }

        var totalPixels = parentWidth * parentHeight;
        var transparencyPercentage = transparentPixels / totalPixels;

        //如果刮開了 80% 或更多的畫布，則刪除 canvas 元素
        if (transparencyPercentage >= 0.8) {
            cxt.clearRect(0, 0, w, h);
            CardConuter();
            setTimeout(function () {
                // $("#overlay").fadeIn();
                Result();
            }, 1000); // 1000 毫秒即 3 秒延迟
        }
    }
}
//電腦事件
//-----------------------------------------------------
//-----------------------------------------------------
//-----------------------------------------------------

$("#btn_Again").click(function () {
    // 在這裡添加按鈕點擊後的動作
    // CardConuter();

    CardLoad();
    CardGenerate();
    $("#ImgBackColor1").css("visibility", "hidden");
    $("#ImgBackColor2").css("visibility", "hidden");
    $("#ImgBackColor3").css("visibility", "hidden");
    $("#ImgBackColor4").css("visibility", "hidden");
    $("#ImgBackColor5").css("visibility", "hidden");
    clearInterval(interval);

    if (deviceType === 'mobile') {
        can.addEventListener('touchstart', handleTouchStart);
        console.log('現在使用的設備是行動裝置');
    } else {
        can.onmousedown = handleMouseDown;
        console.log('現在使用的設備是電腦');
    }

    $("#btn_Again").css("visibility", "hidden");
});

function CardLoad() {
    //刮刮樂前置作業
    //-----------------------------------------------------
    can = document.getElementById("zwhCanvas");
    cxt = can.getContext("2d");
    cxt.globalCompositeOperation = 'source-over';
    w = can.width;
    h = can.height;
    cxt.clearRect(0, 0, can.width, can.height);
    cxt.fillStyle = "lightgray";

    parentX = 35;   // 父元素的 x 座標
    parentY = 231;  // 父元素的 y 座標
    parentWidth = 446;  // 父元素的寬度
    parentHeight = 244; // 父元素的高度

    cxt.fillRect(parentX, parentY, parentWidth, parentHeight);
    cxt.globalCompositeOperation = 'destination-out';
    cxt.lineWidth = '30';
    cxt.lineCap = 'round';
}

function CardGenerate() {

    var randomIndex = Math.floor(Math.random() * items.length);// 隨機選擇一個索引
    var randomItem = items[randomIndex];
    var removedItem = items.splice(randomIndex, 1);// 移除該索引對應的元素

    var numColumns = 5; // 列數
    var numRows = 2;    // 行數

    var rectangles = []; // 存放分割後的長方形區域

    var childWidth = parentWidth / numColumns;
    var childHeight = parentHeight / numRows;

    //刮刮樂區域分割成10個矩形並在10個矩形內隨機取出10個x、y(亂數但是平均)
    for (var i = 0; i < numRows; i++) {
        for (var j = 0; j < numColumns; j++) {
            var x = Math.round(parentX + (j * childWidth) + (Math.random() * childWidth / 2));
            var y = Math.round(parentY + (i * childHeight) + (Math.random() * childHeight / 2));
            if (x > (parentX + parentWidth - childWidth)) {
                x = parentX + parentWidth - childWidth;
            }
            // var x = Math.round(parentX + (j * childWidth) + (childWidth / 4));
            // var y = Math.round(parentY + (i * childHeight) + (childHeight / 4));
            rectangles.push({ x: x, y: y, width: childWidth, height: childHeight });
        }
    }

    var ImageArray = new Array(10).fill(0); // 創建一個長度為 10 的初始值為 0 的陣列
    var countArray = [9999, 0, 0, 0, 0, 0]; // 用於記錄填入的數字次數


    // 在 ImageArray 中隨機索引丟 1，並且最多隨機三次
    var usedIndexes = []; // 用於記錄已使用的索引
    for (var i = 0; i < 3; i++) {
        var randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * 10);
        } while (usedIndexes.includes(randomIndex)); // 檢查是否已經使用過此索引
        // 將已使用的索引添加到列表中
        usedIndexes.push(randomIndex);

        ImageArray[randomIndex] = randomItem;//載入這次選到的值
        countArray[randomItem]++;
    }

    // 剩下的空索引隨機填入 2-5，但不能超過三次
    for (var j = 0; j < 10; j++) {
        if (ImageArray[j] === 0) {
            var randomValue = Math.floor(Math.random() * 5) + 1; // 生成 1-5 的隨機數
            // 檢查 randomValue 出現的次數是否已經達到三次
            if (countArray[randomValue] < 2) {
                ImageArray[j] = randomValue;
                countArray[randomValue]++;
            } else {
                // 如果已經超過三次，則重新生成隨機數填入
                j--; // 重新填入當前位置
            }
        }
        // console.log("ImageArray[" + j + "]:" + ImageArray[j]);
    }

    //繪製到刮刮樂上面
    var imageSources = ["img/tag-01.png", "img/tag-02.png", "img/tag-03.png", "img/tag-04.png", "img/tag-05.png"];
    var CradCan = document.getElementById("CradCanvas");
    var Cradcxt = CradCan.getContext("2d");
    Cradcxt.clearRect(0, 0, can.width, can.height);

    for (var i = 0; i < rectangles.length; i++) {
        (function (index) {
            var imageSource = imageSources[ImageArray[index] - 1];
            var img = new Image();
            img.src = imageSource;
            img.onload = function () {
                var rect = rectangles[index];
                Cradcxt.drawImage(img, rect.x, rect.y, img.width, img.height);
            };
        })(i);
    }

    ResultItems = randomItem;//這次的結果
}

function CardConuter() {
    counts = {};
    for (var i = 1; i <= 5; i++) {
        counts[i] = 0;
    }

    items.forEach(function (item) {
        counts[item] = (counts[item] || 0) + 1;
    });

    $("#CardCount1").html("<p>" + counts[1] + "</p>");
    $("#CardCount2").html("<p>" + counts[2] + "</p>");
    $("#CardCount3").html("<p>" + counts[3] + "</p>");
    $("#CardCount4").html("<p>" + counts[4] + "</p>");
    $("#CardCount5").html("<p>" + counts[5] + "</p>");
}

$("#closeButton").click(function () {
    $("#overlay").fadeOut();
});

function Result() {
    var idname = "#ImgBackColor" + ResultItems;
    interval = setInterval(function () {
        $(idname).css("visibility", "visible").fadeOut(1000).fadeIn(1000);
    }, 2000); // 2秒为一次循环

    $("#btn_Again").css("visibility", "visible");

    var countDownTime = 20;
    switch (ResultItems) {
        case 1:
        case 2:
            $("#CountText").css("visibility", "visible");
            $("#CountText").fadeIn();
            // 开始倒计时
            var countdownInterval = setInterval(function () {
                // 更新倒计时时间
                countDownTime--;

                // 更新HTML元素中的文本
                $("#CountText").html("<p>倒數時間：" + countDownTime + "秒</p>");
                // 如果倒计时时间为0，清除计时器
                if (countDownTime <= 0) {
                    clearInterval(countdownInterval);
                    $("#CountText").fadeOut();
                    // 可以添加其他逻辑，比如倒计时结束后的操作
                }
            }, 1000); // 每秒执行一次
            break;
    }
}

function detectDeviceType() {
    // 检测是否是移动设备
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return 'mobile';
    } else {
        return 'desktop';
    }
}