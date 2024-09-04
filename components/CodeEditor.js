'use client'

import React, {useState} from 'react';
import { CodeiumEditor } from "@codeium/react-code-editor";
import APIClient from "@/services/api";

const languageOptions = [
    {
        value: 'javascript',
        label: 'Javascript'

    },
    {
        value: 'python',
        label: 'Python'
    }
]
const CodeEditor = () => {
    const [form, setForm] = useState({
        code: "test('should throw an error when userId is not provided', async () => {\n  await expect(isValidUser()).rejects.toThrow('Missing User');\n});",
        language: 'javascript',
        theme: 'vs-dark',
    })
    const [loading, setLoading] = useState(false)

    const [response, setResponse] = useState(null)


    const handleSubmit = () => {

        if (!!loading) return;


        setLoading(true)
        return APIClient.api.post('/test', {
            data: form.code
        }).then((data) => {
            setResponse(data)
        }).finally(() => {
            setLoading(false)
        })
    }




    const filterClassName= 'border-2 border-gray-200 hover:border-sky-200 rounded-md p-2 cursor-pointer '
    return (
        <div className={'m-12'}>
            <div>
                <div className={'flex flex-col items-center'}>
                    <div> Language</div>

                    <div className={'flex gap-2'}>
                        {languageOptions.map((option) => (
                            <div key={`language-option-${option.value}`} onClick={() => setForm({
                                ...form,
                                language: option.value
                            })} className={`${filterClassName} ${form.language === option.value ? 'border-blue-500' : ''}`}>{option.label}</div>
                        ))}
                    </div>
                </div>

            </div>
            <CodeiumEditor
                language={form.language}
                // width={'600px'}
                theme={form.theme}
                value={form.code} onChange={(code) => setForm({
                ...form,
                code
            })}/>

            <div className={`${loading ? "cursor-not-allowed" : "cursor-pointer"} min-w-full flex justify-center ${loading ? 'bg-slate-300': 'bg-sky-200'} py-4 px-2 my-4 rounded-2xl font-bold`} onClick={handleSubmit}> {loading ? "Loading..." : "Submit"} </div>

            {response &&
                response?.map((testCase, index) => {
                    return (
                        <div key={`generated-test-${index}`} className={'my-8'}>
                            <CodeiumEditor
                                language={form.language}
                                width={'100%'}
                                theme={form.theme}
                                value={testCase.test}
                                />
                            <div> Explanation: {testCase.explanation} </div>
                        </div>
                    )
                })
                }
        </div>
    );
};

export default CodeEditor;
