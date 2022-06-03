export interface IAuth {
  email: string;
  password: string;
}

export interface IPersonalInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  country: string;
  residential_area?: string;
  address: string;
  nearest_bus_stop?: string;
  gender?: string;
}

export interface IFellowship {
  name: string;
  meeting_day: string;
  address: string;
  nearest_bus_stop: string;
  leader_id: number;
  assistant_id: number;
  secretary_id: number;
  treasurer_id: number;
  comment: string;
  members_id: number[];
}
