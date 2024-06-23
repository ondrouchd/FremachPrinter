# FremachPrinter

### Zadání úkolu:

Máme dotykové terminály běžící na Raspberry Pi a máme lokální webový server. V těchto terminálech běží v kiosk módu prohlížeč s webovou stránkou z tohoto webového serveru. Chceme, aby z této webové stránky mohli lidé ve výrobě přímo tisknout na systémem definované tiskárně.

Podrobnosti k zadání:

·  Máme tři výrobní oddělení: vstřikovna, lakovna, montáž

·  Na každém z oddělení je jedna síťová tiskárna Xerox

·  V aplikaci bude pro každé oddělení nastavena IP adresa této tiskárny nebo název tiskárny nainstalované ve Windows webového serveru

·  Na webové stránce budou tři tlačítka s názvem výrobního oddělení. Po kliknutí na tlačítko se zobrazí náhled dokumentu ve formátu A4 (PDF), tento dokument se uloží do předdefinovaný sdílené složky na Windows serveru a pošle na definovanou tiskárnu

To celé prosím provést v GitHub

## FullPageOS for Kiosk mode
[Link to github page] (https://github.com/guysoft/FullPageOS)

### Practical example of implementation with Raspberry PI 4
[Raspberry Pi 4 Model B - 4GB RAM] (https://rpishop.cz/raspberry-pi-4/1598-raspberry-pi-4-model-b-4gb-ram.html)

<img src="https://github.com/ondrouchd/FremachPrinter/blob/master/realization.jpg">

## PdfPrintService
### Web API
![Web API](https://github.com/ondrouchd/FremachPrinter/blob/master/PdfPrintService.jpg)

### Printers
Folders where are unprocessed PDF files
![Printers](https://github.com/ondrouchd/FremachPrinter/blob/master/printers.jpg)

### Xerox-vstrikovna
Here is a one PDF to print. Once the PDF is printed, Xerox automatically remove that file.

![Vstrikovna](https://github.com/ondrouchd/FremachPrinter/blob/master/vstrikovna.jpg)

## fremach-printer-client
### Look and feel
![React Client](https://github.com/ondrouchd/FremachPrinter/blob/master/client.jpg)



