

export interface IHeaderdata {
    date: any;
    id: number;
    facilityID: number;
    messageCountToday: number;
    messageCountTotal: number;
    patientCountToday: number;
    patientCountTotal: number;
    facilityName: string;
}

export interface IHeaderInfo {
    status: string;
    data: IHeaderdata[];
    message: any;
}



