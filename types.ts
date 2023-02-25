export interface userType {
    uid: string | null,
    photoUrl: string | null,
    email: string | null,
    username: string | null,
    uniqname: string | null,
}

export interface geoPointType {
    lat: number,
    lng: number,
    descript: string,
    uuid: string,
}

export interface geoPointArray extends Array<geoPointType>{}

export interface wayPointType {
    lat: number,
    lng: number,
    elevation: number,
    descript: string,
}

export interface wayPointArray extends Array<wayPointType>{}

export interface insertContentType {
    lat: number,
    lng: number,
    descript: string,
}

export interface mountDatas {
    highMountains: GeoJSON.Feature | null
    middleMountains: GeoJSON.Feature | null
    lowMountains: GeoJSON.Feature | null
}

export interface cardDataType {
    title: string,
    date: string,
    uuid: string,
    ms: number,
}

export interface cardDataArray extends Array<cardDataType>{}