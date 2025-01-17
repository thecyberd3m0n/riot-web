/*
Copyright 2018 New Vector Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const { ipcRenderer, webFrame } = require('electron');

// expose ipcRenderer to the renderer process
window.ipcRenderer = ipcRenderer;

const language = (process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL || process.env.LC_MESSAGES)
    .split('.')[0]
    .replace('_', '-');

// Allow the fetch API to load resources from this
// protocol: this is necessary to load olm.wasm.
// (Also mark it a secure although we've already
// done this in the main process).
webFrame.registerURLSchemeAsPrivileged('vector', {
    secure: true,
    supportFetchAPI: true,
});


webFrame.setSpellCheckProvider(language, false, {
    spellCheck(words) {
        const result = ipcRenderer.sendSync('spellcheck:ismisspeled', words);
        return !result;
    },
});
