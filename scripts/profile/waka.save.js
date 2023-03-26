const fs = require('fs');
const APIKey = 'd2FrYV9lZTAzYmVjYS05ODA3LTRjYzMtOWIzYi0zZDY5NjVjNGQ2MDE=';
const url = 'https://wakatime.com/api/v1/users/current/summaries?range=';
const headers = new Headers({
    'Authorization': `Basic ${APIKey}`
});
const path_total = 'data/waka.total.json';
const path_history = 'data/waka.data.bak';

let statistics = {
    total: 0,
    language: []
};
let day;
async function getDayInfo(){
    const { data } = await fetch(url+'Yesterday', {
        headers
    }).then((res)=>{return res.json()});
    statistics.total = data[0].grand_total.total_seconds;
    statistics.language = data[0].languages.map((elem)=>{
        return {
            name:elem.name,
            seconds:elem.total_seconds,
        }
    })
    day = data[0].range.end;
}

const _mapToArr = function (map) {
    let arr = [];
    for(let i of map){
        arr.push({
            name: i[0],
            seconds: i[1]
        })
    }
    return arr;
}
const writeTotal = function(err,data){
    const totalData = JSON.parse(data);
    totalData.days += 1;
    const totalLanguages = new Map();
    let seconds;
    totalData.languages.forEach((elem)=>{
        totalLanguages.set(elem.name,elem.seconds);
    })
    totalData.total += statistics.total;
    statistics.language.forEach((elem)=>{
        if(totalLanguages.has(elem.name)){
            seconds = totalLanguages.get(elem.name);
            seconds += elem.seconds;
            totalLanguages.set(elem.name,seconds);
        } else {
            totalLanguages.set(elem.name,elem.seconds);
        }
    });
    totalData.languages = _mapToArr(totalLanguages);
    fs.writeFile(path_total,JSON.stringify(totalData),{flag:'w'},(err)=>{
        if(err){
            console.log(err.toString());
        } else {
            console.log("[WAKA:SAVE]:total写入成功");
        }
    });
}// pass
getDayInfo().then(res=>{
    console.log(res);
    const history = `,{"${day}": ${JSON.stringify(statistics)}}`
    fs.readFile(path_total,{encoding:'utf-8'},writeTotal);
    fs.appendFile(path_history,history,(err)=>{
        if(err){
            console.log("[WAKA:SAVE]:",err.toString());
        } else {
            console.log("[WAKA:SAVE]:history写入成功");
        }
    });
})