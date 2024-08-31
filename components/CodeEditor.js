'use client'

import React, {useState} from 'react';
import { CodeiumEditor } from "@codeium/react-code-editor";

const CodeEditor = () => {
    const [code, setCode] = useState('// console.log("Hello World")')
    return (
        <div className={'m-12'}>
            <CodeiumEditor
                language={'javascript'}
                width={'600px'}
                theme={'vs-dark'}
                value={code} onChange={(code) => setCode(code)}/>

            <div onClick={() => console.log(JSON.stringify(code))}> Submit </div>
        </div>
    );
};

export default CodeEditor;
