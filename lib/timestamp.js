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
    
    var hourNum = new Date().getHours();
        if (hourNum < 10){
            hourNum = "0" + hourNum;
            }
    var hour = hourNum.toString();
    
    var minuteNum = new Date().getMinutes();
        if (minuteNum < 10){
            minuteNum = "0" + minuteNum;
            }
    var minute = minuteNum.toString();       
    
    var second = new Date().getSeconds().toString();
    var milliseconds = new Date().getMilliseconds().toString();
    var timestamp = '-'+ year +'-'+ month +'-'+  day +'-'+ hour + minute +  second +  milliseconds;
    return timestamp;
}

