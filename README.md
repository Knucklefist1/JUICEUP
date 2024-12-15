Netværksapplikation - JuiceUp!

Formål:
Dette projekt demonstrerer en netværksapplikation udviklet som en del af en eksamensopgave.


Opsætning på Localhost:

Krav
Installer Node.js (mindst version 14.0.0).
Indsæt følgende i en .env-fil i projektets rodmappe med følgende variabler og egne nøgler:

# Eksempel på .env fil:
SESSION_SECRET=123
NODE_ENV=development
PORT=3000
DB_USER=<din-database-bruger>
DB_PASSWORD=<din-database-password>
DB_SERVER=<din-database-server>
DB_NAME=<din-database-navn>
DB_ENCRYPT=true
CLOUDINARY_CLOUD_NAME=<din-cloudinary-cloudname>
CLOUDINARY_API_KEY=<din-cloudinary-api-key>
CLOUDINARY_SECRET=<din-cloudinary-secret>


Installation:

1. Klon projektet til din lokale maskine:

- git clone https://github.com/Knucklefist1/JUICEUP.git

- cd JUICEUP

3. Installer afhængigheder:
npm install (I nogen tilfælde skal man også intallere *npm install express*)

4. Start applikationen:
node server.js

5. Applikationen kører nu på http://localhost:3000.


Cloud Infrastruktur og Eksterne API-nøgler
Dette projekt benytter følgende cloud-infrastruktur og eksterne API'er:

Cloudinary til billedhåndtering
SMTP-server til e-mails

Alle ovenstående services kræver API-nøgler eller adgangsoplysninger, som skal indsættes i .env-filen.


