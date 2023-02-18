import { getAttributes } from '@tiptap/core'
import { MarkType } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { LatLngExpression } from 'leaflet'
import { Dispatch, SetStateAction } from 'react'

type ClickHandlerOptions = {
    type: MarkType,
    setLocation?: Dispatch<SetStateAction<L.LatLngExpression | null>>
}

export function clickHandler(options: ClickHandlerOptions): Plugin {
    return new Plugin({
        key: new PluginKey('handleClickGeoLink'),
        props: {
            handleClick: (view, pos, event) => {
                const attrs = getAttributes(view.state, options.type.name)

                if (attrs.lat && attrs.lng && options.setLocation) {
                    const location: LatLngExpression = [attrs.lat, attrs.lng]
                    options.setLocation(location)

                    return true
                }

                return false
            },
        },
    })
}