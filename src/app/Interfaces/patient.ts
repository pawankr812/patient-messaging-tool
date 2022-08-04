

export interface IPatientData {
    status: string;
    amplifyControlNo: string;
    patientID: number;
    facilityID: number;
    messageLogID: number;
    messageText: string;
    sentat?: any;
    sentByID?: any;
    sentByName: string;
    messageType: string;
}

export interface IPatientResp {
    status: string;
    data: IPatientData[];
    message?: any;
}



