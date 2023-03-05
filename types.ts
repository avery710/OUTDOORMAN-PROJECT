import { JSONContent } from "@tiptap/react"

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

export interface storyDataType {
    drawLayer: string,
    editorContent: JSONContent,
    geoPointLayer: string,
    gpxLayer: string,
    title: string,
    uniqname: string,
    url: string,
    date: string,
    ms: number,
    userId: string,
}

export interface storyCardType {
    title: string,
    date: string,
    uuid: string,
    ms: number,
    editorContent: JSONContent,
    userId: string,
}

export interface storyCardArray extends Array<storyCardType>{}

export interface publishCardType {
    title: string,
    date: string,
    editorTextContent: string,
    previewImageUrl: string,
    ms: number,
    uuid: string,
    url: string,
    userId: string,
}

export interface publishCardArray extends Array<publishCardType>{}

export interface autherInfo {
    photoUrl: string,
    username: string,
    uniqname: string,
}

export interface recommendCardType {
    title: string,
    ms: number,
    userId: string,
    url: string,
}

export interface recommendCardArray extends Array<recommendCardType>{}