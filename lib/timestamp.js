module.exports.createTimestamp = createTimestamp;

function createTimestamp() {
    var year = new Date().getFullYear().toString();
    var monthNum = new Date().getMonth()+1;
        if (monthNum < 10){
            monthNum = "0" + monthNum;
            }
    var month = monthNum.toString();
    var dayNum = new Date().getDate();
        if (dayNum < 10){
            dayNum = "0" + dayNum;
            }
    var day = dayNum.toString();
    var hour = new Date().getHours().toString();
    var minute = new Date().getMinutes().toString();
    var second = new Date().getSeconds().toString();
    var milliseconds = new Date().getMilliseconds().toString();
    var timestamp = '-'+ year +'-'+ month +'-'+  day +'-'+ hour + minute +  second +  milliseconds;
    return timestamp;
}

