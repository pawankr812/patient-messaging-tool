
    export interface DisplayInfo {
        columnDisplayName: string;
        columnName: string;
        sequence: number;
        clickAction: string;
        columnType: string;
        sorting: string;
    }
    export interface Data {
    appointmentDate: string
    checkInTime: string
    contactNumber: string
    dob: string
    facilityCode: string
    familyMemberContactNumber:string
    familyMemberFirstName: string
    familyMemberLastName: string
    familyMemberMiddleName: string
    firstName: string
    imageBase64Code: string
    lastName: string
    message: string
    messageStatus: string
    middleName: string
    mrn: string
    patientID: string
    patientName: string
    provider: string
    sex: string
    status: string
    }
    

    export interface IDataSource {
        displayInfo: DisplayInfo[];
        data: Data[];
    }

