import { mergeAttributes, Node } from '@tiptap/core'
import { clickHandler } from './GeoClickHandler'
import { Dispatch, SetStateAction } from 'react'
import { wayPointType } from 'types'

export interface GeoNodeOptions {
    HTMLAttributes: Record<string, any>,
    setLocation?: Dispatch<SetStateAction<L.LatLngExpression | null>>,
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        GeoNode: {
            insertGeoNode: (attributes: wayPointType) => ReturnType,
        }
    }
}

export const GeoNode = Node.create<GeoNodeOptions>({
    name: "GeoNode",

    priority: 1000,

    group: 'inline',

    content: 'inline*',

    inline: true,

    addOptions() {
        return {
            HTMLAttributes: {
                class: "geonode",
            },
            setLocation: undefined,
        }
    },

    addAttributes() {
        return {
            lat: {
                default: null,
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
                renderHTML: (attributes) => {
                    if (!attributes.lng) {
                        return {}
                    }
            
                    return {
                        "lng": attributes.lng
                    }
                }
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: `span`,
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    },

    addCommands(){
        return {
            insertGeoNode: (attributes: wayPointType) => ({commands}: any) => {
                return commands.insertContent([
                    {
                        type: 'text',
                        text: ' ',
                    },
                    {
                        type: 'GeoNode',
                        attrs: {
                            lat: attributes.lat,
                            lng: attributes.lng,
                        },
                        content: [{
                            type: 'text',
                            text: attributes.descript,
                        }],
                    },
                    {
                        type: 'text',
                        text: ' ',
                    },
                ])
            }
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

