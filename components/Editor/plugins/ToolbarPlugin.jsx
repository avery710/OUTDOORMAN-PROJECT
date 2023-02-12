import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    REDO_COMMAND,
    UNDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    $getNodeByKey
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
    $isParentElementRTL,
    $wrapNodes,
    $isAtNodeEnd
} from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { createPortal } from "react-dom";
import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode
} from "@lexical/rich-text";
import OverlayPrompt from '../../Layout/OverlayPrompt'
import GeoPointForm from "./GeoPointPlugin/GeoPointForm"
import ImageForm from "./ImagePlugin/ImageForm";

const LowPriority = 1;

const ToolbarPlugin = ({geoPointData, setGeoPointData}) => {
    const [editor] = useLexicalComposerContext()
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isUnderline, setIsUnderline] = useState(false)
    const [canUndo, setCanUndo] = useState(false)
    const [canRedo, setCanRedo] = useState(false)
    const [isLink, setIsLink] = useState(false)
    const [isGeoPoint, setIsGeoPoint] = useState(false)
    const [geoOverlay, setGeoOverlay] = useState("none")
    const [ImageOverlay, setImageOverlay] = useState("none")

    const formatQuote = () => {
        editor.update(() => {
            const selection = $getSelection();
    
            if ($isRangeSelection(selection)) {
                $wrapNodes(selection, () => $createQuoteNode());
            }
        })
    }

    const formatHeading = () => {
        editor.update(() => {
            const selection = $getSelection();
    
            if ($isRangeSelection(selection)) {
                $wrapNodes(selection, () => $createHeadingNode("h1"))
            }
        })
    }

    const insertLink = useCallback(() => {
        if (!isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
        } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        }
    }, [editor, isLink]);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
        }

        // Update links
        const node = getSelectedNode(selection);
        const parent = node.getParent();
        if ($isLinkNode(parent) || $isLinkNode(node)) {
            setIsLink(true);
        } else {
            setIsLink(false);
        }
        
    }, [editor]);

  
    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar()
                })
            }),

            // editor.registerCommand(
            //     SELECTION_CHANGE_COMMAND,
            //     (_payload, newEditor) => {
            //       updateToolbar();
            //       return false;
            //     },
            //     LowPriority
            // ),

            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload)
                    return false;
                },
                LowPriority
            ),

            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload)
                    return false;
                },
                LowPriority
            )
        )
    }, [editor, updateToolbar])
  
    return (
        <div className="toolbar">
            {/* ----------------------------- redo / undo section ----------------------------- */}
            <button
                disabled={!canUndo}
                onClick={() => { editor.dispatchCommand(UNDO_COMMAND) }}
                className="toolbar-item spaced"
                aria-label="Undo"
            >
                <i className="format undo" />
            </button>

            <button
                disabled={!canRedo}
                onClick={() => { editor.dispatchCommand(REDO_COMMAND) }}
                className="toolbar-item"
                aria-label="Redo"
            >
                <i className="format redo" />
            </button>

            {/* ----------------------------- block styling section ----------------------------- */}
            <div className='divider'></div>

            <button className="toolbar-item spaced" onClick={formatHeading}>
                <i className="format h1" />
            </button>

            <button className="toolbar-item spaced" onClick={formatQuote}>
                <i className="format quote" />
            </button>

            {/* ----------------------------- inline text styling section ----------------------------- */}
            <div className='divider'></div>

            <button 
                onClick={() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold") }}
                className={"toolbar-item spaced " + (isBold ? "active" : "")}
                aria-label="Format Bold"
            >
                <i className="format bold" />
            </button>

            <button
                onClick={() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}}
                className={"toolbar-item spaced " + (isItalic ? "active" : "")}
                aria-label="Format Italics"
            >
                <i className="format italic" />
            </button>

            <button
                onClick={() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline") }}
                className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
                aria-label="Format Underline"
            >
                <i className="format underline" />
            </button>

            <button
                onClick={insertLink}
                className={"toolbar-item spaced " + (isLink ? "active" : "")}
                aria-label="Insert Link"
            >
                <i className="format link" />
            </button>
            {isLink && createPortal(<FloatingLinkEditor editor={editor} />, document.body)}

            <div className='divider'></div>

            <button
                onClick={() => setImageOverlay("flex") }
                className={"toolbar-item spaced"}
            >
                <i className="format image" />
            </button>
            { ImageOverlay === "flex" && 
                <OverlayPrompt overylayDisplay={ImageOverlay} setOverlayDisplay={setImageOverlay}>
                    <ImageForm setOverlayDisplay={setImageOverlay} />
                </OverlayPrompt>
            }

            <button
                onClick={() => { setGeoOverlay("flex"); setIsGeoPoint(true) }}
                className={"toolbar-item spaced "}
            >
                <i className="format geo" />
            </button>
            { geoOverlay === "flex" &&
                <OverlayPrompt overylayDisplay={geoOverlay} setOverlayDisplay={setGeoOverlay}>
                    <GeoPointForm setGeoPointData={setGeoPointData} setOverlayDisplay={setGeoOverlay}/>
                </OverlayPrompt>
            }
            
        </div>
    )
}  

export default ToolbarPlugin

/* ----------------------------------- split ----------------------------------- */

function getSelectedNode(selection) {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
      return anchorNode;
    }
    const isBackward = selection.isBackward();
    if (isBackward) {
      return $isAtNodeEnd(focus) ? anchorNode : focusNode;
    } else {
      return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
    }
}

function FloatingLinkEditor({ editor }) {
    const editorRef = useRef(null);
    const inputRef = useRef(null);
    const mouseDownRef = useRef(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [isEditMode, setEditMode] = useState(false);
    const [lastSelection, setLastSelection] = useState(null);
  
    const updateLinkEditor = useCallback(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection);
        const parent = node.getParent();
        if ($isLinkNode(parent)) {
          setLinkUrl(parent.getURL());
        } else if ($isLinkNode(node)) {
          setLinkUrl(node.getURL());
        } else {
          setLinkUrl("");
        }
      }
      const editorElem = editorRef.current;
      const nativeSelection = window.getSelection();
      const activeElement = document.activeElement;
  
      if (editorElem === null) {
        return;
      }
  
      const rootElement = editor.getRootElement();
      if (
        selection !== null &&
        !nativeSelection.isCollapsed &&
        rootElement !== null &&
        rootElement.contains(nativeSelection.anchorNode)
      ) {
        const domRange = nativeSelection.getRangeAt(0);
        let rect;
        if (nativeSelection.anchorNode === rootElement) {
          let inner = rootElement;
          while (inner.firstElementChild != null) {
            inner = inner.firstElementChild;
          }
          rect = inner.getBoundingClientRect();
        } else {
          rect = domRange.getBoundingClientRect();
        }
  
        if (!mouseDownRef.current) {
          positionEditorElement(editorElem, rect);
        }
        setLastSelection(selection);
      } else if (!activeElement || activeElement.className !== "link-input") {
        positionEditorElement(editorElem, null);
        setLastSelection(null);
        setEditMode(false);
        setLinkUrl("");
      }
  
      return true;
    }, [editor]);
  
    useEffect(() => {
      return mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            updateLinkEditor();
          });
        }),
  
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          () => {
            updateLinkEditor();
            return true;
          },
          LowPriority
        )
      );
    }, [editor, updateLinkEditor]);
  
    useEffect(() => {
      editor.getEditorState().read(() => {
        updateLinkEditor();
      });
    }, [editor, updateLinkEditor]);
  
    useEffect(() => {
      if (isEditMode && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditMode]);
  
    return (
      <div ref={editorRef} className="link-editor">
        {isEditMode ? (
          <input
            ref={inputRef}
            className="link-input"
            value={linkUrl}
            onChange={(event) => {
              setLinkUrl(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (lastSelection !== null) {
                  if (linkUrl !== "") {
                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                  }
                  setEditMode(false);
                }
              } else if (event.key === "Escape") {
                event.preventDefault();
                setEditMode(false);
              }
            }}
          />
        ) : (
          <>
            <div className="link-input">
              <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                {linkUrl}
              </a>
              <div
                className="link-edit"
                role="button"
                tabIndex={0}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setEditMode(true);
                }}
              />
            </div>
          </>
        )}
      </div>
    );
}

function positionEditorElement(editor, rect) {
    if (rect === null) {
        editor.style.opacity = "0";
        editor.style.top = "-1000px";
        editor.style.left = "-1000px";
    } else {
        editor.style.opacity = "1";
        editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
        editor.style.left = `${
        rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
        }px`;
    }
}