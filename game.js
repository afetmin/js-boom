
var generateMap = function (r, c, num) {
    let map = []
    // 给行数，生成一个 1 维数组
    function row(r) {
        for (let i = 0; i < r; i++) {
            map[i] = []
        }
    }
    // 给列数，生成一个 2 维数组
    function column(col) {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < col; j++) {
                map[i][j] = 0
            }
        }
    }
    // 给列数和行数生成空地图
    let emptyMap = function (r, col) {
        row(r)
        column(col)
    }

    // 给出地雷数量让后随机写入地雷
    let writeInBoom = function (num) {
        // 随机位置写入
        var randomLocation = function () {
            const x = Math.floor(Math.random() * r)
            const y = Math.floor(Math.random() * c)
            // console.log( ':', x, y);
            if (map[x][y] !== 9) {
                map[x][y] = 9
            } else {
                randomLocation()
            }
        }
        for (let i = 0; i < num; i++) {
            randomLocation()
        }
    }

    // 使用循环给雷的边上所有数 +1 , 已经是雷的除外
    let plus = function (array, x, y) {
        if (x >= 0 && x < r && y >= 0 && y < c) {
            if (array[x][y] !== 9) {
                array[x][y] += 1
            }
        }
    }
    let writeInMap = function () {
        for (let x = 0; x < map.length; x++) {
            for (let y = 0; y < map[0].length; y++) {
                if (map[x][y] === 9) {
                    // 上下 6 个
                    for (let i = -1; i < 2; i++) {
                        plus(map, x - 1, y + i)
                        plus(map, x + 1, y + i)
                    }
                    // 左右 2 个
                    plus(map, x, y + 1)
                    plus(map, x, y - 1)
                }
            }
        }
    }

    emptyMap(r, c)
    writeInBoom(num)
    writeInMap()
    return map
}

var writeInHtml = function (map) {
    // 先通过 y轴数量写入 ul，然后通过 x轴上的数量写入 li
    const draw = $('.draw')[0]
    for (let i = 0; i < map.length; i++) {
        draw.innerHTML += `<ul class="row x-${i}" data-x="${i}"></ul>`
    }

    const row = $('.row')
    for (let i = 0; i < row.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            let m = map[i][j]
            if (m === 0) {
                m = ''
            }
            row[i].innerHTML += `
                <li class="col y-${j} num-${m}" data-y="${j}">
                    <span>${m}</span>
                    <img src="flag.svg" class="img-flag hide">
                </li>`
        }
    }
}

// 判断是否胜利
var changeClearMineNum = function (clearMineNum) {
    if (clearMineNum === ((col * row) - num)) {
        let all = $('.col')
        let allNum = 0
        let stop = setInterval(function () {
            let r = Math.floor(Math.random() * 256)
            let g = Math.floor(Math.random() * 256)
            let b = 210
            // var b = Math.floor(Math.random() * 256)
            all[allNum].children[0].style.opacity = '0'
            all[allNum].children[1].style.opacity = '0'
            all[allNum].style.background = `rgba(${r},${g},${b},0.6)`
            allNum++
            if (allNum === all.length) {
                clearInterval(stop)
                if (zz === 0) {
                    alert('你成功啦~！')
                    initializeGame(row, col, num)
                }
                initializeGame(row, col, num)
            }
        }, 20)
    }
}

// 3，扫雷过程
var clearMine = function (row, col, num) {
    let clearMineNum = 0
    let makeWhite = function (x, y) {
        if (x < row && y < col && x >= 0 && y >= 0) {
            let el = $(`.x-${x}`).children[y]
            if (el.style.background !== 'white') {
                el.style.background = 'white'
                el.children[0].style.opacity = '1'
                el.children[1].classList.add('hide')
                clearMineNum++
                changeClearMineNum(clearMineNum)
                if (el.innerText === '') {
                    showNoMine(x, y)
                }
            }
        }
    }
    // 空的周围全空
    let showNoMine = function (x, y) {
        makeWhite(x - 1, y + 1)
        makeWhite(x - 1, y - 1)
        makeWhite(x - 1, y)
        makeWhite(x + 1, y + 1)
        makeWhite(x + 1, y - 1)
        makeWhite(x + 1, y)
        makeWhite(x, y + 1)
        makeWhite(x, y - 1)
    }

    // 给所有方块绑定点击事件，点击显示数字，或者 boom
    let show = function () {
        let x = $('.row')
        for (let i = 0; i < x.length; i++) {
            x[i].addEventListener('click', function (event) {
                let el = event.target
                if (el.tagName !== 'LI') {
                    // 因为事件委托的原因
                    // 如果点击到了 span 上面，那么就会出现 bug
                    // 所以如果点击到 span 上面，那么 el 就等于 span 的父节点
                    el = event.target.parentElement
                }
                // 已经被标记的不能点击
                let flag = el.children[1].classList.contains('hide')
                if (el.tagName === 'LI' && flag) {
                    if (el.children[0].innerText !== '9' && el.style.background !== 'white') {
                        el.children[0].style.opacity = '1'
                        el.style.background = 'white'
                        clearMineNum++
                        changeClearMineNum(clearMineNum)
                    } else if (el.children[0].innerText === '9') {
                        zz = 1
                        el.classList.add('boom')
                        alert('游戏失败')
                        let all = $('.col')
                        let ff = []
                        let allNum = 0
                        for (let i = 0; i < all.length; i++) {
                            if (all[i].children[0].innerText === '9') {
                                // all[i].style.background = 'red'
                                ff[allNum] = all[i]
                                allNum++
                            }
                        }
                        allNum = 0
                        let time = 60
                        if (num > 50) {
                            time = 10
                        } else if (num > 10) {
                            time = 25
                        }
                        let stop = setInterval(function () {
                            ff[allNum].classList.add('boom')
                            allNum++
                            if (allNum === ff.length) {
                                clearInterval(stop)
                            }
                        }, time)
                    }
                    // 如果点击的方格为空（什么有没有），那么周围没有点开的空方格都会被点开
                    if (el.children[0].innerText === '') {
                        // 获取到位置
                        let x = parseInt(el.parentElement.dataset.x)
                        let y = parseInt(el.dataset.y)
                        // console.log(x,y, 'data');
                        // 背景变成白色
                        showNoMine(x, y)
                    }
                }
            })
        }
        for (let i = 0; i < x.length; i++) {
            let mineNum = num
            x[i].addEventListener('contextmenu', function (event) {
                event.preventDefault();
                let btnNum = event.button
                let el = event.target
                if (el.tagName !== 'LI') {
                    // 因为事件委托的原因
                    // 如果点击到了 span 上面，那么就会出现 bug
                    // 所以如果点击到 span 上面，那么 el 就等于 span 的父节点
                    el = event.target.parentElement
                }
                if (el.tagName === 'LI') {
                    let classList = el.children[1].classList
                    // 已经被点击过的地方不能标记
                    if (classList.contains('hide') && el.style.background !== 'white') {
                        let residue = $('.residue')
                        if (mineNum !== 0) {
                            mineNum--
                        }
                        residue.innerText = `${mineNum}`
                        classList.remove('hide')
                    } else if (el.style.background !== 'white') {
                        classList.add('hide')
                    }
                }
            })
        }
    }
    show()
}

// 4，清除画面，然后写入新的画面
var stopTime
let initializeGame = function (row, col, num) {
    let residue = $('.have')
    residue.innerText = `${num}`
    let time = $('.time')
    time.innerText = `0`
    let i = 1
    clearInterval(stopTime)
    stopTime = setInterval(function () {
        time.innerText = `${i++}S`
    }, 1000)
    // zz
    zz = 0
    // 首先清除原来的地图，然后重新初始化
    let box = $('.draw')
    box.innerHTML = ''
    let body = $('body')
    // body.style.minWidth = `${27 * col}px`
    let map = generateMap(row, col, num)
    writeInHtml(map)
    clearMine(row, col, num)
}

// 5，选择游戏等级，给按钮绑定功能
var Btn = function () {
    let level = document.querySelectorAll('.menu')
    for (let i = 0; i < level.length; i++) {
        level[i].addEventListener('click', function (event) {
            let levelText = event.target.innerHTML
            if (levelText === '初级') {
                row = 9
                col = 9
                num = 10
                initializeGame(row, col, num)
            } else if (levelText === '中级') {
                row = 16
                col = 16
                num = 40
                initializeGame(row, col, num)
            } else if (levelText === '高级') {
                row = 16
                col = 30
                num = 99
                initializeGame(row, col, num)
            }
        })
    }
    let restart = $('.retry')
    restart.click(function(event) {
        initializeGame(row, col, num)
    })
}
Btn()

// 6，初始数据
// zz 用来确定是否已经点到地雷
var zz = 0
var row = 16
var col = 16
var num = 40
initializeGame(row, col, num)


