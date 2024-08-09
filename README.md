# Neptun Codegen

Automatikus 2FA generátor Neptunhoz, hogy ne a CAPTCHA miatt maradj le a tárgyfelvételről

## Hogyan működik

Ha a Neptunon bekapcsolod a kétfaktoros azonosítást (2FA), akkor bejelentkezéskor CAPTCHA helyett egy másik alkalmazás által generált kóddal tudsz bejelentkezni. Ezt kihasználva ez a userscript generálja neked a belépőkódot, és (a jelszó beírása után) gyorsan és automatikusan beléptet!

(Ez azt is lehetővé teszi, hogy Puppeteerrel vagy Playwrighttal saját szkriptet írj, ami nélküled is be tud lépni a Neptunba, hogy adatokat kérjen le.)

## FIGYELMEZETÉS!

**A MIT licensz alapján SEMMILYEN felelősséget nem vállalok a szkript működésével kapcsolatban!** Ebbe beletartozik a fiókodból való kizáródás vagy a 2FA kulcsának elvesztése, ellopása (a szkript titkosítás nélkül tárolja). Akkor használd ezt a szkriptet, ha biztonságban éreznéd a fiókod akkor, ha a 2FA ki lenne kapcsolva.

A fentebbi ijesztgetés ellenére megpróbáltam mindent megtenni, hogy a szkript megfelelően működjön, elvégre *én magam is ezt használom*.

## Telepítés és beállítás

1. [Telepítsd a Tampermonkey bővítményt](https://www.tampermonkey.net/#download) az általad kedvelt böngészőbe
2. Kattints rá <a href="https://raw.githubusercontent.com/fzs111/neptun-codegen/main/userscript.user.js" target="_blank" >erre a linkre</a>! A Tampermonkey fel kell, hogy ismerje, hogy szkriptet szeretnél hozzáadni. Ha mégsem így lenne, [kézzel is hozzáadhatod](https://www.tampermonkey.net/faq.php#Q102).
3. Ellenőrizd a Tampermonkey ikonjára kattintva, hogy a szkript fut, amikor meglátogatod a Neptunt. 

    A szkript az Óbudai Egyetem Neptunjához készült, de lehet, hogy a te egyetemeden is működik. Ha nem látod a futó szkriptek listájában, akkor [add hozzá kézzel](https://www.tampermonkey.net/faq.php#Q103) az egyetemed Neptunjának az URL-jét az engedélyezett weboldalak listájához a Tampermonkeyban a szkript beállításainál. Figyelj arra, hogy a cím végére tegyél `*`-ot, hogy a Neptun minden oldalán fusson a szkript.
4. Lépj be a Neptunba, és navigálj a `Saját adatok > Beállítások` oldalon a `Kétfaktoros hitelesítés` fülre. Ha eddig is használtál 2FA-t a Neptunhoz, akkor sajnos ki kell kapcsolnod, majd újra be. Ha eddig nem használtál 2FA-t, akkor most be kell kapcsolnod. Ekkor egy ablaknak kell feljönnie a következő címmel: `Neptun Codegen: Kulcs mentve!`. 

    Ha ez nem jelenne meg, akkor a Tampermonkey ikonjára kattintva a `Neptun Codegen` alatt kattints a `Kulcs módosítása` gombra. Itt pedig írd be a Neptunban megjelenő ablakban kijelzett (56 számból és betűből álló) kulcsot, vagy a kijelzett QR kód tartalmát (`otpauth://`-al kezdődő link). A 2FA alkalmazás által generált, 6 számból álló kód **nem megfelelő**.

5. Fejezd be a 2FA beállítását a Neptunban. Ehhez (a biztonság kedvéért) szükséged lesz egy másik 2FA generáló alkalmazásra (pl.: Google Authenticator, Authy, 2FAS, Bitwarden, stb.). Ezt a beállítás után nem kell használnod, viszont ha a szkript elromlana, véletlenül kitörölnéd belőle a kulcsot vagy más eszközön akarsz bejelentkezni (pl. sulis gép vizsgán), akkor jól fog jönni.
6. Elkészültél! Ha kilépsz a Neptunból, beírod a jelszót, a `Bejelentkezés` gombra kattintás után pillanatok alatt újra bent kell legyél! :)

Ha más eszközön szeretnél bejelentkezni, akkor a Tampermonkey ikonjára kattintva a `Neptun Codegen` alatt a `Kód generálása` gombbal tudsz egyszeri 2FA kódot generálni.

Ha más eszközön is szeretnéd használni a szkriptet, akkor a Tampermonkey ikonjára kattintva a `Neptun Codegen` alatt a `Kulcs módosítása` gombra kattintva a felugró ablakból kimásolhatod a kulcsot és beillesztheted a másik eszközön. Ilyen módon akárhány eszközt hozzáadhatsz! 

Tipp: Androidon a Firefox böngészőbe is lehet Tampermonkey-t telepíteni!
