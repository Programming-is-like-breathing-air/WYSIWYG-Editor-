"use client"
import './index.css';
import {useEffect, useState} from 'react';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LinkPlugin} from "@lexical/react/LexicalLinkPlugin";
import {ListPlugin} from "@lexical/react/LexicalListPlugin";
import {MarkdownShortcutPlugin} from "@lexical/react/LexicalMarkdownShortcutPlugin";
import {TRANSFORMERS} from "@lexical/markdown";
import ExampleTheme from '../ExampleTheme';
import TreeViewPlugin from "@/components/plugins/TreeViewPlugin";
import ToolbarPlugin from "@/components/plugins/ToolbarPlugin";
// import ListMaxIndentLevelPlugin from "@/components/plugins/ListMaxIndentLevelPlugin";
// import CodeHighlightPlugin from "@/components/plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "@/components/plugins/AutoLinkPlugin";

import {Button} from "@/components/ui/button"
import {
    Activity,
    ArrowUpRight,
    CircleUser,
    CreditCard,
    DollarSign,
    Menu,
    Package2,
    Search,
    Users,
} from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Input} from "@/components/ui/input"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"

import {EditorState, LexicalEditor} from 'lexical';
// Assuming ToolbarPlugin and TreeViewPlugin are in the plugins directory
// Placeholder component
function Placeholder() {
    return <div className="editor-placeholder opacity-50">Enter some rich text...</div>;
}

// Define the initial configuration for the Lexical editor with types
const editorConfig = {
    namespace: 'React.js Demo',
    onError(error: Error) {
        console.error('Lexical editor error:', error);
    },
    theme: ExampleTheme,
};

// A plugin to handle changes in the editor state
function MyOnChangePlugin({onChange}: { onChange: (editorState: EditorState) => void }) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        return editor.registerUpdateListener(({editorState}) => {
            onChange(editorState);
        });
    }, [editor, onChange]);
    return null;
}

export default function Editor() {
    const [editorState, setEditorState] = useState<string>();
    const initialConfig = {
        namespace: 'MyEditor',
    };

    function onChange(editorState: EditorState) {
        // Serialize the editor state to JSON and store it in the component state
        const editorStateJSON = editorState.toJSON();
        setEditorState(JSON.stringify(editorStateJSON));
    }
    function handleSubmit() {
        // Here you would send the `editorState` to your backend or database
        // For demonstration, we're just logging it to the console
        console.log("Submitting the following editor state to the backend:", editorState);
        console.log(editorState);
        // Example POST request with fetch (if you have an endpoint to handle this)
        /*
        fetch('/api/save-editor-state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ editorState }),
        })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => {
            console.error('Error:', error);
        });
        */
    }


    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <nav
                    className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link
                        href="#"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <Package2 className="h-6 w-6"/>
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <Link
                        href="#"
                        className="text-foreground transition-colors hover:text-foreground"
                    >
                        Dashboard
                    </Link>
                    <Button
                        className="text-muted-foreground hover:text-foreground"
                        onClick={handleSubmit} // Attach the submit function here
                    >
                        Submit
                    </Button>
                    <Link
                        href="#"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Products
                    </Link>
                    <Link
                        href="#"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Customers
                    </Link>
                    <Link
                        href="#"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Analytics
                    </Link>
                </nav>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5"/>
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-lg font-semibold"
                            >
                                <Package2 className="h-6 w-6"/>
                                <span className="sr-only">Acme Inc</span>
                            </Link>
                            <Link href="#" className="hover:text-foreground">
                                Dashboard
                            </Link>
                            <Button
                                className="text-muted-foreground hover:text-foreground"
                                onClick={handleSubmit} // Attach the submit function here
                            >
                                Submit
                            </Button>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Products
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Customers
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Analytics
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <form className="ml-auto flex-1 sm:flex-initial">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                type="search"
                                placeholder="Search products..."
                                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                            />
                        </div>
                    </form>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5"/>
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main
                className="flex mx-auto overflow-hidden my-5 max-w-screen-xl rounded  border-gray-300 bg-white text-left font-normal leading-5 text-gray-900">
                {/*bg-gray-100 p-2 rounded min-h-[10vh]*/}
                <div className="w-full max-w-5xl min-h-[80vh] min-w-[120vh] ">

                    <div className="flex-1 overflow-auto">
                        <LexicalComposer initialConfig={editorConfig}>
                            <div className="editor-container">
                                <ToolbarPlugin/>
                                <div className="editor-inner">
                                    <RichTextPlugin
                                        contentEditable={<ContentEditable
                                            className="editor-input min-h-[150px] p-2 outline-none"/>}
                                        placeholder={<Placeholder/>}
                                        ErrorBoundary={LexicalErrorBoundary}
                                    />
                                    <p className="font-bold">Editor State (Serialized):</p>
                                    <HistoryPlugin/>
                                    <AutoFocusPlugin/>
                                    <TreeViewPlugin/>
                                    <MyOnChangePlugin onChange={onChange}/>
                                    {/*<AutoLinkPlugin/>*/}
                                </div>
                            </div>
                        </LexicalComposer>
                    </div>
                    {/*<CardFooter>*/}
                    {/*    <div className="w-full">*/}
                    {/*        <p className="font-bold">Editor State (Serialized):</p>*/}
                    {/*        /!*<pre className="bg-gray-100 p-2 rounded min-h-[10vh]">{editorState || 'The editor state will appear here...'}</pre>*!/*/}
                    {/*    </div>*/}
                    {/*</CardFooter>*/}
                </div>
            </main>
        </div>
    );
}
