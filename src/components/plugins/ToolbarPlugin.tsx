/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {Button} from "@/components/ui/button"
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {mergeRegister} from '@lexical/utils';
import {
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND, LexicalEditor,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from 'lexical';
import DropDown, {DropDownItem} from '../../components/ui/DropDown';
import {Dispatch, useCallback, useEffect, useRef, useState} from 'react';
import FontSize from './fontSize';
import {TOGGLE_LINK_COMMAND} from "@lexical/link";
import {$patchStyleText} from "@lexical/selection";

const LowPriority = 1;
const FONT_FAMILY_OPTIONS: [string, string][] = [
    ['Arial', 'Arial'],
    ['Courier New', 'Courier New'],
    ['Georgia', 'Georgia'],
    ['Times New Roman', 'Times New Roman'],
    ['Trebuchet MS', 'Trebuchet MS'],
    ['Verdana', 'Verdana'],
];

const FONT_SIZE_OPTIONS: [string, string][] = [
    ['10px', '10px'],
    ['11px', '11px'],
    ['12px', '12px'],
    ['13px', '13px'],
    ['14px', '14px'],
    ['15px', '15px'],
    ['16px', '16px'],
    ['17px', '17px'],
    ['18px', '18px'],
    ['19px', '19px'],
    ['20px', '20px'],
];
const ELEMENT_FORMAT_OPTIONS: {
    [key in Exclude<ElementFormatType, ''>]: {
        icon: string;
        iconRTL: string;
        name: string;
    };
} = {
    center: {
        icon: 'center-align',
        iconRTL: 'center-align',
        name: 'Center Align',
    },
    end: {
        icon: 'right-align',
        iconRTL: 'left-align',
        name: 'End Align',
    },
    justify: {
        icon: 'justify-align',
        iconRTL: 'justify-align',
        name: 'Justify Align',
    },
    left: {
        icon: 'left-align',
        iconRTL: 'left-align',
        name: 'Left Align',
    },
    right: {
        icon: 'right-align',
        iconRTL: 'right-align',
        name: 'Right Align',
    },
    start: {
        icon: 'left-align',
        iconRTL: 'right-align',
        name: 'Start Align',
    },
};

function dropDownActiveClass(active: boolean) {
    if (active) {
        return 'active dropdown-item-active';
    } else {
        return '';
    }
}
function Divider(): JSX.Element {
    return <div className="divider" />;
}
function FontDropDown({
                          editor,
                          value,
                          style,
                          disabled = false,
                      }: {
    editor: LexicalEditor;
    value: string;
    style: string;
    disabled?: boolean;
}): JSX.Element {
    const handleClick = useCallback(
        (option: string) => {
            editor.update(() => {
                const selection = $getSelection();
                if (selection !== null) {
                    $patchStyleText(selection, {
                        [style]: option,
                    });
                }
            });
        },
        [editor, style],
    );

    const buttonAriaLabel =
        style === 'font-family'
            ? 'Formatting options for font family'
            : 'Formatting options for font size';

    return (
        <DropDown
            disabled={disabled}
            buttonClassName={'toolbar-item ' + style}
            buttonLabel={value}
            buttonIconClassName={
                style === 'font-family' ? 'icon block-type font-family' : ''
            }
            buttonAriaLabel={buttonAriaLabel}>
            {(style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(
                ([option, text]) => (
                    <DropDownItem
                        className={`item ${dropDownActiveClass(value === option)} ${
                            style === 'font-size' ? 'fontsize-item' : ''
                        }`}
                        onClick={() => handleClick(option)}
                        key={option}>
                        <span className="text">{text}</span>
                    </DropDownItem>
                ),
            )}
        </DropDown>
    );
}
export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isEditable, setIsEditable] = useState(() => editor.isEditable());
    const [fontFamily, setFontFamily] = useState<string>('Arial');
    const [fontSize, setFontSize] = useState<string>('15px');
    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            // Update text format
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({editorState}) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _newEditor) => {
                    $updateToolbar();
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority,
            ),
        );
    }, [editor, $updateToolbar]);
    return (
        <div className="toolbar" ref={toolbarRef}>
            <FontDropDown
                disabled={!isEditable}
                style={'font-family'}
                value={fontFamily}
                editor={editor}
            />
            <Divider />
            {/*<FontSize*/}
            {/*    selectionFontSize={fontSize.slice(0, -2)}*/}
            {/*    editor={editor}*/}
            {/*    disabled={!isEditable}*/}
            {/*/>*/}
            {/*<Divider />*/}

            <button
                disabled={!canUndo}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
                className="toolbar-item spaced"
                aria-label="Undo">
                <i className="format undo"/>
            </button>
            <button
                disabled={!canRedo}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
                className="toolbar-item"
                aria-label="Redo">
                <i className="format redo"/>
            </button>
            <Divider/>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }}
                className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
                aria-label="Format Bold">
                <i className="format bold"/>
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                }}
                className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
                aria-label="Format Italics">
                <i className="format italic"/>
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                }}
                className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
                aria-label="Format Underline">
                <i className="format underline"/>
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                }}
                className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
                aria-label="Format Strikethrough">
                <i className="format strikethrough"/>
            </button>
            <Divider/>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
                }}
                className="toolbar-item spaced"
                aria-label="Left Align">
                <i className="format left-align"/>
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
                }}
                className="toolbar-item spaced"
                aria-label="Center Align">
                <i className="format center-align"/>
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
                }}
                className="toolbar-item spaced"
                aria-label="Right Align">
                <i className="format right-align"/>
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
                }}
                className="toolbar-item"
                aria-label="Justify Align">
                <i className="format justify-align"/>
            </button>

            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
                }}
                className={'toolbar-item spaced'}
                aria-label="Insert code block">
                <i className="format code"/>
            </button>
            {' '}
        </div>
    );
}
