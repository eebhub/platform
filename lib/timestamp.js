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
    
    var secondNum = new Date().getSeconds().toString();
        if (secondNum < 10){
                secondNum = "0" + secondNum;
                }
    var second = secondNum.toString(); 
    
    var millisecondNum = new Date().getMilliseconds().toString();
        if (millisecondNum < 10){
                millisecondNum = "00" + millisecondNum;
                }
        if (millisecondNum > 10 && millisecondNum < 100){
                millisecondNum = "0" + millisecondNum;
                }
        
    var millisecond = millisecondNum.toString();
    
    var timestamp = '_'+ year +'-'+ month +'-'+  day +'_'+ hour + minute +  second +  millisecond;
    return timestamp;
}

