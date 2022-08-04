
export class user {
    iss: string;
    iat: string;
    exp: string;
    aud: string;
    sub: string;
    userID: string;
    lastName: string;
    firstName: string;
    userName: string;
    Role: string;
    facilities: facility;
}

export class facility {
    facilityCode: string;
    facilityName: string;
    facilityID: any;
    facilityType:string;
}