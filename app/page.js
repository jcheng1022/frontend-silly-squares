import React from 'react';
import {CodeiumEditor} from "@codeium/react-code-editor";
import CodeProcessor from "@/components/CodeProcessor";
import CodeEditor from "@/components/core/CodeEditor";
import Hero from "@/components/landing/Hero";

const Page = () => {
    return (
        <div className={'p-4'}>
            <Hero />
           <div className={'border-2 border-white rounded-2xl  p-2'}>
               <CodeEditor height={100} />
           </div>

            <div className={'flex flex-col lg:flex-row justify-around gap-4 '}>
                <div className={'flex flex-col items-center my-12'}>
                    <div className={'text-2xl font-bold mb-2'}>  🔎 Paste and Go</div>

                    <div className={'text-center max-w-64 text-slate-400'}>
                        Code Tests Generator will analyze your code and generate tests using <a className={'text-sky-200 hover:underline'} href={"https://jestjs.io/"} target={"_blank"}>Jest </a>.

                    </div>

                </div>

                <div className={'flex flex-col items-center my-12'}>
                    <div className={'text-2xl font-bold mb-2'}> 🚀 Top Standard AI Models</div>

                    <div className={'text-center max-w-64 text-slate-400'}>
                        <span className={'text-slate-400'}> We use Claude AI to analyze your code. <a className={'text-sky-200 hover:underline'} href={"https://observer.com/2024/06/anthropic-release-claude-ai-model-gpt-comparison/#:~:text=Claude%20comes%20out%20on%20top%20for%20reading%2C%20coding%20and%20math&text=Claude%203.5%20Sonnet%20slightly%20outperforms,Despite%20Claude's%20impressive%20results%2C%20A.I."} target={"_blank"}>Claude outperforms other popular AI models such as ChatGPT-4o  </a>, so you get the best quality test code.</span>

                    </div>

                </div>

                <div className={'flex flex-col items-center my-12'}>
                    <div className={'text-2xl font-bold mb-2'}>  ✨ Trusted Code Editor</div>

                    <div className={'text-center max-w-64 text-slate-400'}>
                        <span className={'text-slate-400'}> We use  <a className={'text-sky-200 hover:underline'} href={"https://codeium.com/"} target={'_blank'}>  Codenium </a> under the hood, equipped with autocompletion and intellisense </span>

                    </div>

                </div>
            </div>


        </div>
    );
};

export default Page;
