import { point } from "leaflet";
import { EditorConfig, LexicalNode, NodeKey, SerializedTextNode, Spread, TextNode } from "lexical";

export type SerializedDateTimeNode = Spread<
  {
    className: string;
    type: string;
  },
  SerializedTextNode
>;

export class GeoPointNode extends TextNode {
    __color: string;

    constructor(text: string, key?: NodeKey){
        super(text, key);
        this.__color = "#00FF00";
    }

    static getType(): string {
        return 'GeoPoint'
    }

    static clone(node: GeoPointNode): GeoPointNode {
        return new GeoPointNode(node.__text, node.__key);
    }

    static importJSON(serializedNode: SerializedDateTimeNode): GeoPointNode {
        const node = $createGeoNode(serializedNode.text);
        node.setFormat(serializedNode.format);
        node.setDetail(serializedNode.detail);
        node.setMode(serializedNode.mode);
        node.setStyle(serializedNode.style);
        return node;
    }
    
    exportJSON(): SerializedDateTimeNode {
        return {
            ...super.exportJSON(),
            type: GeoPointNode.getType(),
            className: this.getClassName(),
        };
    }

    createDOM(config: EditorConfig): HTMLElement {
        const element = super.createDOM(config);
        element.style.backgroundColor = this.__color;
        element.style.cursor = "pointer";
        return element;
    }

    updateDOM(
        prevNode: GeoPointNode,
        dom: HTMLElement,
        config: EditorConfig,
    ): boolean {
        const isUpdated = super.updateDOM(prevNode, dom, config);
        if (prevNode.__color !== this.__color) {
            dom.style.color = this.__color;
        }
        return isUpdated;
    }
}

export function $createGeoNode(text: string): GeoPointNode {
    return new GeoPointNode(text);
}

export function $isGeoNode(node: LexicalNode): boolean {
    return node instanceof GeoPointNode;
}