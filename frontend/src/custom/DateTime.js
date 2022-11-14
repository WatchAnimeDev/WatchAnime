function getCurrentTime() {
    let currentDate = new Date();
    return `${roundOffTime(getHoursIn12HoursFormat(currentDate.getHours()))}:${roundOffTime(currentDate.getMinutes())}:${roundOffTime(currentDate.getSeconds())} ${currentDate.getHours() >= 12 ? "PM" : "AM"}`;
}
function roundOffTime(time) {
    return time < 10 ? "0" + time : time;
}
function getHoursIn12HoursFormat(hours) {
    hours = hours % 12;
    return hours ? hours : 12;
}
function getTimeZoneOffesetFromGMT() {
    let currentDate = new Date();
    let offsetHour = Math.abs(Math.ceil(currentDate.getTimezoneOffset() / 60));
    let offsetMinute = offsetHour > 0 ? Math.abs(currentDate.getTimezoneOffset() % 60) : 0;
    return `${currentDate.getTimezoneOffset() >= 0 ? "-" : "+"}${roundOffTime(offsetHour)}:${roundOffTime(offsetMinute)}`;
}
function getCurrentDate() {
    let currentDate = new Date();
    return `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
}
function getDayAndDateFromDateString(dateObj) {
    let dateString = dateObj.toDateString();
    let dayMap = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };
    dateString = dateString.split(" ");
    return { day: dayMap[dateString[0]], date: `${dateString[1]} ${dateString[2]}`, dateObj: dateObj };
}
function getDateAndDayForMonthFromCurrentDate() {
    let currentDate = new Date();
    let dateArray = [];
    for (let index = currentDate.getDate() - 1; index >= 1; index--) {
        let tempDate = new Date();
        tempDate.setDate(currentDate.getDate() - index);
        dateArray.push(getDayAndDateFromDateString(tempDate));
    }
    dateArray.push(getDayAndDateFromDateString(currentDate));
    for (let index = currentDate.getDate() + 1; index <= 30; index++) {
        let tempDate = new Date();
        tempDate.setDate(currentDate.getDate() + (index - currentDate.getDate()));
        dateArray.push(getDayAndDateFromDateString(tempDate));
    }
    return dateArray;
}
function getDayHourMinuteSecondFromSecond(totalseconds) {
    const dayInSec = 86400;
    const hourInSec = 3600;
    const minInSec = 60;

    let days = Math.floor(totalseconds / dayInSec);
    let hours = Math.floor((totalseconds - days * dayInSec) / hourInSec);
    let mins = Math.floor((totalseconds - days * dayInSec - hours * hourInSec) / minInSec);
    let secs = totalseconds - days * dayInSec - hours * hourInSec - mins * minInSec;

    return { days, hours, mins, secs };
}
export { getCurrentTime, getTimeZoneOffesetFromGMT, getCurrentDate, getDateAndDayForMonthFromCurrentDate, roundOffTime, getHoursIn12HoursFormat, getDayHourMinuteSecondFromSecond };
