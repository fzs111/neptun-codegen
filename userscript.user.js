// ==UserScript==
// @name            Neptun Codegen
// @namespace       http://tampermonkey.net/
// @version         1.0.3
// @description:hu  Automatikus 2FA generátor Neptunhoz, hogy ne a CAPTCHA miatt maradj le a tárgyfelvételről
// @author          FZs
// @copyright       Copyright © 2024 FZs
// @include         https://*neptun*/*hallgato*/*
// @match           https://neptun.uni-obuda.hu/hallgato/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/otpauth/9.3.1/otpauth.umd.min.js
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.registerMenuCommand
// @homepage        https://github.com/fzs111/neptun-codegen
// @homepageURL     https://github.com/fzs111/neptun-codegen
// @supportURL      https://github.com/fzs111/neptun-codegen/issues
// @updateURL       https://raw.githubusercontent.com/fzs111/neptun-codegen/main/userscript.user.js
// @downloadURL     https://raw.githubusercontent.com/fzs111/neptun-codegen/main/userscript.user.js
// ==/UserScript==

const KEY_LENGTH = 35; //bytes

(async function() {
    'use strict';

    const {Secret, TOTP} = window.OTPAuth;

    const {pathname, search} = window.location;

    addChangeKeyMenuItem();

    if(/login.aspx/i.test(pathname)) {
        handleLoginPage();
    }

    if(/main.aspx/i.test(pathname) && /ctrl=0104/i.test(search)) {
        handleSettingsPage();
    } else {
        // This is in an `else` block to prevent user from generating the 2FA code with this script during 2FA setup.
        // This is so the user must also save the code to an external 2FA authenticator app, preventing accidental lockout,
        // in case this script breaks or the stored secret is changed / deleted.
        addGenerateCodeMenuItem();
    }

    function addGenerateCodeMenuItem() {
        GM.registerMenuCommand('Kód generálása', async () => {
            const totp = await loadTOTPGenerator();

            if(!totp) {
                alert('Még nincs kulcs beállítva!\nKulcs beállításához használd a "Kulcs módosítása" gombot. Kövesd végig a telepítési útmutatót a https://github.com/fzs111/neptun-codegen oldalon!');
                return;
            }

            alert(totp.generate());
        });
    }

    async function addChangeKeyMenuItem() {
        GM.registerMenuCommand('Kulcs módosítása', async () => {
            let text = await GM.getValue('secret', '');

            while(true) {
                text = window.prompt(`Add meg a 2FA kulcsot (${KEY_LENGTH} bájtos Base32 formátum vagy otpauth:// URI):`, text);

                if(text === null) {
                    return;
                }

                if(/^\d{6}$/.test(text)) {
                    alert(`Helytelen kulcs!\nItt NEM a 2FA alkalmazás által generált 6 számból álló kódot kell megadni, hanem a 2FA bekapcsolásakor kapott, ${Math.ceil(KEY_LENGTH * 8 / 5)} karakteres, betűkből és számokból álló (Base32) kulcsot.`);
                    continue;
                }

                let newSecretText;
                if(text.startsWith('otpauth://')) {
                    const url = new URL(text);

                    const secret = url.searchParams.get('secret');

                    newSecretText = secret;
                } else {
                    newSecretText = text;
                }

                let newSecret;
                try {
                    newSecret = Secret.fromBase32(newSecretText);
                } catch(e) {
                    alert('Helytelen kulcs: ' + e.message);
                    continue;
                }

                if(newSecret.bytes.length !== KEY_LENGTH) {
                    const forceDifferentLength = confirm(`Helytelen kulcs: a kódolt adat nem ${KEY_LENGTH} bájt!\nBiztosan menteni akarod ezt a kulcsot?\n(Mégse esetén szerkesztheted)`);

                    if(!forceDifferentLength) {
                        continue;
                    }
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
        });
    }

    async function handleLoginPage() {
        const totp = await loadTOTPGenerator();

        if(!totp) {
            alert('Üdvözöl a Neptun Codegen: még nincs kulcs beállítva.\n\nBejelentkezés után a 2FA beállításoknál újra be kell kapcsolnod a 2FA-t, vagy beírnod a kulcsot a "Kulcs módosítása" menüpontban, hogy a Neptun Codegen működjön. Kövesd a telepítési útmutatót a https://github.com/fzs111/neptun-codegen oldalon!\n\nHa nem akarod többet látni ezt a figyelmezetést, kapcsold ki a Neptun Codegen-t a Tampermonkey-ben!');
            return;
        }

        function update() {
            if(document.querySelector('#tokenValidationModal')?.style.display !== 'none') {
                // Fill in 2FA token
                document.querySelector('#token').value = totp.generate();

                // Click Login button
                document.querySelector('button[sdavalidatetoken="submit"]')?.click();
            }
        }

        const observer = new MutationObserver(update);

        observer.observe(document.querySelector('#tokenValidationModal'), { attributes: true });

        setInterval(update, 30000);
    }

    async function loadTOTPGenerator() {
        const secretString = await GM.getValue('secret', null);
        if(secretString === null) {
            return null;
        }

        const secret = Secret.fromBase32(secretString);

        const totp = new TOTP({ secret });
        return totp;
    }

    async function handleSettingsPage() {
        let secretElement;

        async function update() {
            const newSecretElement = document.querySelector('#twoFactorSetup_Secret');

            if(!newSecretElement) {
                return;
            }

            if(secretElement !== newSecretElement) {
                secretElement = newSecretElement;
                observer.observe(secretElement, { characterData: true });
            }

            const savedSecret = await GM.getValue('secret', null);

            if(secretElement.innerText !== savedSecret) {
                await GM.setValue('secret', secretElement.innerText);
                alert('Neptun Codegen: kulcs mentve!\n\nHa most engedélyezed a 2FA-t, akkor nincs is más teendőd, a következő bejelentkezésnél már nem kell megadnod a 2FA kódot.');
            }


        }

        const observer = new MutationObserver(update);

        observer.observe(document.body, { childList: true });
    }
})();


