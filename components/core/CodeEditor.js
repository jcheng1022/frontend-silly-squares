import React from 'react';
import {CodeiumEditor} from "@codeium/react-code-editor";

const CodeEditor = ({height}) => {
    return (
        <CodeiumEditor
            language={'javascript'}
            // width={'600px'}
            theme={'vs-dark'}
            height={height && height}
            value={'// Write your first line of code'}/>
    );
};

export default CodeEditor;
