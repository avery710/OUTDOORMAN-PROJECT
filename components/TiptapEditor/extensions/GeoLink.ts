import {
    Mark,
    markInputRule,
    markPasteRule,
    mergeAttributes,
} from '@tiptap/core'
import { clickHandler } from './GeoClickHandler';
import L from "leaflet"
import { Dispatch, SetStateAction } from 'react';
import { geoPointArray } from 'types';

/* -------------------set the type of this mark------------------- */
export interface GeoLinkOptions {
    HTMLAttributes: Record<string, any>,
    openOnClick: boolean,
    setLocation?: Dispatch<SetStateAction<L.LatLngExpression | null>>,
    geoPoints?: geoPointArray | null,
    setGeoPoints?: Dispatch<SetStateAction<geoPointArray | null>>,
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        GeoLink: {
            /**
             * Set a GeoLink mark
             */
            setGeoLink: (attributes: { lat: number; lng: number; uuid: string; descript: string }) => ReturnType,
            /**
             * Unset a bold mark
             */
            unsetGeoLink: () => ReturnType,
        }
    }
}

export const GeoLink = Mark.create<GeoLinkOptions>({
    name: 'GeoLink',

    priority: 1000,

    keepOnSplit: false,

    inclusive(){
        return false
    },

    addOptions() {
        return {
            HTMLAttributes: {
                class: "geolink",
            },
            openOnClick: true,
            setLocation: undefined,
        }
    },

    addAttributes() {
        return {
            uuid: {
                default: null,
                parseHTML: element => element.getAttribute('data-uuid'),
                renderHTML: (attributes) => {
                    if (!attributes.uuid) {
                        return {}
                    }
            
                    return {
                        "uuid": attributes.uuid
                    }
                }
            },
            
            lat: {
                default: null,
                // parseHTML: element => element.getAttribute('lat'),
                renderHTML: (attributes) => {
                    if (!attributes.lat) {
                        return {}
                    }
            
                    return {
                        "lat": attributes.lat
                    }
                }
            },

            lng: {
                default: null,
                // parseHTML: element => element.getAttribute('lng'),
                renderHTML: (attributes) => {
                    if (!attributes.lng) {
                        return {}
                    }
            
                    return {
                        "lng": attributes.lng
                    }
                }
            },

            descrip: {
                default: null,
            },
        }
    },

    parseHTML() {
        return [
            {
              tag: "span"
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    },

    addCommands(){
        return{
            setGeoLink: (attributes) => ({ commands }) => {
                return commands.setMark(this.name, attributes)
            },
            unsetGeoLink: () => ({ commands }) => {
                return commands.unsetMark(this.name, { extendEmptyMarkRange: true })
            },
        }   
    },

    addProseMirrorPlugins() {
        return [
            clickHandler({
                type: this.type,
                setLocation: this.options.setLocation,
            }),
        ]
    },
})