const dateNowFormattedET = function(){
    let timeNow = new Date();
    const monthNamesET = [
        "jaanuar", "veebruar", "märts", "aprill", "mai", "juuni",
        "juuli", "august", "september", "oktoober", "november", "detsember"
    ];
    return timeNow.getDate() + ". " + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
}

const timeNowFormattedET = function(){
    let timeNow = new Date();
    let t = String(timeNow.getHours()).padStart(2, "0");
    let m = String(timeNow.getMinutes()).padStart(2, "0");
    let s = String(timeNow.getSeconds()).padStart(2, "0");
    return t + ":" + m + ":" + s;
}

const weekDayNowET = function(){
    let timeNow = new Date();
    const weekdayNamesEt = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"];
    return weekdayNamesEt[timeNow.getDay()];
}

const partOfDay = function(){
    let hourNow = new Date().getHours();
    if(hourNow < 6){
        return "varahommik";
    } else if(hourNow < 12){
        return "hommik";
    } else if(hourNow < 17){
        return "pärastlõuna";
    } else if(hourNow < 21){
        return "õhtu";
    } else {
        return "öö";
    }
}

module.exports = {
    fullDate: dateNowFormattedET,
    fullTime: timeNowFormattedET,
    weekDay: weekDayNowET,
    partOfDay: partOfDay
};