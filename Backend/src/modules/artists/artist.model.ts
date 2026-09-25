export enum RequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IArtistRequest {
  userId: string;
  stageName: string;
  bio?: string;
  status: RequestStatus;
}
