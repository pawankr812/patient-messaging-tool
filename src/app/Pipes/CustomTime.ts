import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'customtime' })
export class CustomTime implements PipeTransform {
    transform(value: string): string {
        if (value) {
            let hours;
            let minutes;
            if(value.length == 5){
                hours = Number(value.split(":")[0]);
                minutes = Number(value.split(":")[1]);
            }
            else{
                hours = new Date(value).getHours();
                minutes = new Date(value).getMinutes();
            }            
            let minutesStr = "";
            let ampm = hours >= 12 ? 'p.m.' : 'a.m.';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutesStr = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
            let strTime = "";
            if (minutesStr === "00") {
                strTime = hours + ' ' + ampm;
            }
            else {
                strTime = hours + ':' + minutesStr + ' ' + ampm;
            }
            
            strTime=(strTime==="12 a.m.")?"12:00 a.m.": (strTime==="12 p.m.")?"12:00 p.m.":strTime;

            return strTime;
        }
    }
}