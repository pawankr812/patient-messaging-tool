import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'PhoneUSA'
})
export class PhoneFormat implements PipeTransform {
    transform(phone: string) {
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (phoneRegex.test(phone)) {
            return phone.replace(phoneRegex, "$1-$2-$3");
        }
    }
}