export interface userType {
    uid: string | null,
    photoUrl: string | null,
    email: string | null,
    username: string | null,
}

export interface geoPointType {
    lat: number,
    lng: number,
    descript: string,
    uuid: string,
}

export interface geoPointArray extends Array<geoPointType>{}