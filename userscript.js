// ==UserScript==
// @name         Neptun Codegen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*neptun*/hallgato/login.aspx*
// @match        https://*neptun*/hallgato/Login.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uni-obuda.hu
// @require      https://cdnjs.cloudflare.com/ajax/libs/otpauth/9.3.1/otpauth.umd.min.js
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// ==/UserScript==

const KEY_LENGTH = 35; //bytes

(async function() {
    'use strict';

    const {Secret, TOTP} = window.OTPAuth;

    const {pathname, search} = window.location;

    GM.registerMenuCommand('Kulcs módosítása', async () => {
        let text = await GM.getValue('secret', '');

        while(true) {
            text = window.prompt('Add meg a 2FA kódot (Base32 formátum):', text);

            if(text === null) {
                return;
            }

            let newSecret;
            try {
                newSecret = Secret.fromBase32(text);
            } catch(e) {
                alert('Helytelen kód: ' + e.message);
                continue;
            }

            if(newSecret.bytes.length !== KEY_LENGTH) {
                alert(`Helytelen kód: a kódolt adat nem ${KEY_LENGTH} bájt`);
                continue;
            }

            try {
                await GM.setValue('secret', newSecret.base32);
            } catch(e) {
                alert('Mentés sikertelen, próbáld újra!\nHiba: ' + e.message);
                continue;
            }

            alert('Mentve!');
            return;
        }
    })

    if(/login.aspx/i.test(pathname)) {
        loginPage();
    }

    if(/main.aspx/i.test(pathname) && /ctrl=0104/i.test(search)) {
        settingsPage();
    }

    async function loginPage() {
        const secretString = await GM.getValue('secret', null);
        const secret = Secret.fromBase32(secretString);

        const totp = new TOTP({secret});

        const update = () => {
            if(document.querySelector('#tokenValidationModal')?.style.display !== 'none') {
                document.querySelector('#token').value = totp.generate();
                document.querySelector('button[sdavalidatetoken="submit"]')?.click();
            }
        };

        const observer = new MutationObserver(update)

        observer.observe(document.querySelector('#tokenValidationModal'), { attributes: true })

        setInterval(update, 30000);
    }
})();


