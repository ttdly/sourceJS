import fs from 'fs';
const titleLen = 15,
    timeLen = 25,
    space = 3;
const str1 = '⬛',
    str2 = '⬜';
const formatterSeconds = function (sec){
    let secondTime = parseInt(sec),
        minuteTime = 0,
        hourTime = 0,
        day = 0,
        res;
    res = `${secondTime}s`;
    if (secondTime >= 60) {
        minuteTime = Math.floor(secondTime / 60);
        secondTime = secondTime % 60;
        res = `${minuteTime} m ${secondTime} s`;
        if (minuteTime >= 60) {
            hourTime = Math.floor(minuteTime / 60);
            minuteTime = minuteTime % 60;
            res = `${hourTime} h ${minuteTime} m ${secondTime} s`;
            if(hourTime >= 24){
                day = Math.floor(hourTime / 24);
                hourTime = hourTime % 24;
                res = `${day} d ${hourTime} h ${minuteTime} m ${secondTime} s`;
            }
        }
    }
    return res;
}
const toStr = function (data){
    let res = '';
    let total = 0;
    const totalDataObj = JSON.parse(data);
    const languages = totalDataObj.languages.sort((a,b)=>{
        return b.seconds - a.seconds;
    });
    const top5 = languages.slice(0,4);
    let la5 = {
        name: 'Others',
        seconds: 0
    };
    for(let i = 3; i < languages.length; i++){
        la5.seconds += languages[i].seconds;
    }
    top5.push(la5);
    res += '<pre>\n'+`📊 <strong>Past ${totalDataObj.days} Days I Spent My Time On</strong>\n\n`
    top5.forEach((elem)=>{
        total += elem.seconds;
    })
    top5.forEach((elem)=>{
        let percentNum = (elem.seconds / total) * 100;
        let percentStr = percentNum.toFixed(2).padStart(5,'0')+'%'
        let progress = str1.repeat(Math.floor(percentNum / 4)).padEnd(25, str2);
        let secStr = formatterSeconds(elem.seconds);
        res += elem.name.padEnd(titleLen, ' ') + secStr.padStart(timeLen, ' ');
        res += ' '.repeat(space) + progress + ' '.repeat(space)+percentStr + '\n';
    })
    res += `\nTotally：${formatterSeconds(totalDataObj.total)}\n`+'</pre>\n\n';
    return res;
}
const wakaWriter = function (){
    fs.readFile('data/waka.total.json',{encoding:"utf-8"},(err, data)=>{
        if(err){
            console.log('[WAKA:FORMATTER]:',err.toString());

        } else {
            fs.appendFile('README.md',toStr(data),(err)=>{
                if (err) {
                    console.log('[WAKA:WRITER]:',err.toString());
                } else {
                    console.log('[WAKA:WRITER]:写入成功');
                }
            })
        }
    })
}

export const fun = wakaWriter;