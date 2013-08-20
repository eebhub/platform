module.exports.createTimestamp = createTimestamp;

function createTimestamp() {
    var year = new Date().getFullYear().toString();
    var monthNum = new Date().getMonth()+1;
    var month = monthNum.toString();
    var day = new Date().getDate().toString();
    var hour = new Date().getHours().toString();
    var minute = new Date().getMinutes().toString();
    var second = new Date().getSeconds().toString();
    var milliseconds = new Date().getMilliseconds().toString();
    var timestamp = year + month +  day + hour + minute +  second +  milliseconds;
    return timestamp;
}
