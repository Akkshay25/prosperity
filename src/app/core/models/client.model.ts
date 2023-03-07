export interface Client {
    name: string;
    pan: string;
    onboardingDate: Date;
    followUpDate: Date;
    cid: number;
    remarks: Remark[];
  }

  export interface Remark {
    id: number;
    remarkDate: Date;
    rid: number;
    cid: number;
    remark: string;
  }