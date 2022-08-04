export interface IPatientData {
    providerName: string;
    firstName: string;
    facilityID: number;
    middleName: string;
    lastName: string;
    contactNo: string;
    lastMessageTime: number;
    patientID: number;
    appointmentTime: number;
    appointmentDate: string,
    lastMessageDesc: string;
    checkInTime: number;
}

export interface IPatientListResp {
    status: string;
    data: IPatientData[];
    message?: any;
}


