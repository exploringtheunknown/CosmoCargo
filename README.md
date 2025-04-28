# 🚀 CosmoCargo™ – Intergalaktisk Fraktcentral

## 🪐 Bakgrund

**CosmoCargo™** är den ledande aktören inom rymdlogistik, med leveranser till över 9000 rymdstationer och kolonier i hela galaxen, från de innersta månarna vid Jupiter till de yttre handelszonerna i Andromedatriangeln. Tusentals transporter koordineras dagligen genom ett sofistikerat bokningssystem som används av kunder, piloter och administratörer. Allt måste gå snabbt, säkert och smidigt i det intergalaktiska kaoset.

## 🛠️ Teknisk Stack

### Frontend
- React
- TypeScript
- Next.js
- Tanstack Query
- Tailwind CSS
- Mocha (för testning)

### Backend
- .NET
- Minimal API
- REST
- Entity Framework Core
- PostgreSQL

### Infrastruktur
- Docker Compose

## 🚀 Utveckling

### Förutsättningar
- Docker och Docker Compose
- Node.js (v22+)
- .NET SDK 9

### Installation

1. Starta hela applikationen med Docker Compose:
```bash
docker compose up --detach --build
```

2. Vänta på seedningen av databasen (endast första gången):
   - Se logg för `cosmocargo-backend-1` containern

3. Applikationen är nu tillgänglig på:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000


### Köra tester
```bash
# Frontend tester
cd frontend
npm test

# Backend tester
cd backend
dotnet test
```

## 📁 Projektstruktur

```
cosmocargo/
├── frontend/           # Next.js React-applikation
├── backend/            # .NET Minimal API
├── docker-compose.yml  # Docker Compose-konfiguration
└── README.md           # Projektdokumentation
```

## 📄 Befintlig funktionalitet

#### 🔐 Inloggning & Roller
- Inloggning/registrering för tre roller: **Kund**, **Pilot**, **Admin**

#### 👩‍🚀 Kundvy
- En kund kan skapa en frakt via formulär (avsändare, mottagare, vikt, kategori, prioritet)
- En kund kan se pågående och tidigare leveranser
- En kund kan spåra paket i realtid (simulerad status)

#### 🚀 Pilotvy
- En pilot kan se tilldelade frakter (status, datum, destination)
- En pilot kan uppdatera leveransens status till: *ongoing*, *delivered*

#### 🧑‍💼 Admin Dashboard
- En admin kan se alla frakter och filtera på olika parametrar.
- En admin kan tilldela en pilot till en frakt
- En admin kan ändra fraktstatus till *delayed*, *lost in black hole*

---

## 📄 Uppgift 1: Galactic Cargo Declaration™ (Frontend)

Universum står inför ett handelskrig och intergalaktiska tullar kommer införas. CosmoCargo har anlitat dig för att ta fram ett system för tullhantering, med fokus på användarvänlighet, tydlig struktur och god kodkvalitet.

### Funktionalitet
- **Kund**: Skickar in tullformulär vid bokning
- **Admin**: Granskar formuläret
- **Pilot**: Ser om frakten är högriskklassad

### Formulärfält

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| `shipmentId` | UUID | Referens till frakten |
| `containsLifeforms` | Boolean | Innehåller levande varelser |
| `lifeformType` | Text | (Om ja) Beskrivning av art, intelligens, riskklass |
| `isPlasmaActive` | Boolean | Innehåller plasma-aktiva material |
| `plasmaStabilityLevel` | Number (1–10) | Stabilitetsskala (om plasmaaktiv) |
| `originPlanetLawsConfirmed` | Checkbox | Intygande om laglig export |
| `quarantineRequired` | Boolean | Kräver karantänzon vid ankomst |
| `customsNotes` | Textarea | Frivillig kommentar |
| `submittedBy` | Auto | Användare kopplas automatiskt |

### Valideringsregler

- `containsLifeforms === true` ⇒ `lifeformType` är obligatoriskt
- `isPlasmaActive === true` ⇒ `plasmaStabilityLevel` måste anges (1–10)
- `plasmaStabilityLevel < 4` ⇒ `quarantineRequired` måste vara true
- `originPlanetLawsConfirmed` måste vara ikryssad
- Textfält har begränsningar (säkerhet)

### Automatiserad Riskbedömning

Bygg en funktion som klassificerar risknivå baserat på tullformulär.

### Riskklassificering

| Villkor | Risknivå |
|---------|----------|
| Plasmaaktiv + stabilitet < 5 + livsform | 🔴 Kritisk |
| Livsform + okänd art | 🔶 Hög |
| Plasmaaktiv med stabilitet 5–7 | 🟡 Medel |
| Inga specialegenskaper | 🟢 Låg |

---

## 📄 Uppgift 2: Intergalactic Chaos Engine™ (Backend/Fullstack)

I rymden kan allt gå fel. Ta rollen som Master of the Universe och bygg en Intergalactic Chaos Engine som slupmässigt genererar olika händelser som påverkar frakterna.

### Funktionalitet
- Var X:e minut muteras en slumpmässig frakt baserat på en kaoshändelse
- Ta hänsyn till sannorlikheter
- Visa dessa i ett “Galactic Event Feed” på admin-panelen med tidsstämpel och påverkan (frontend), alternativt endast i logg (backend)

### Förslag på händelser

| Händelse | Effekt på frakt |
|---------|----------|
| Meteorstorm | Försening |
| Maskhål | Destination omdirigeras |
| Piratattack | Vikt ändras till 0 |
| Virus i biosensor | Livsformflagga ändras till “Instabil” |
| Svart hål nära rutten | Status ändras till “Försvunnen i svart hål”  |
| AI gör uppror | Pilot och destination ändras till "Okänd"  |

### Sannorlikhet

- Vissa frakttyper (ex. plasmaaktiva med instabilitet < 5) har större sannolikhet att drabbas 
- Algoritmen ska ta hänsyn till risknivå. 

## 📄 Uppgift 3: Intergalactic AI Support™ (Fullstack)

CosmoCargo vill kunna erbjudea sina kunder en tillgänglig och engegerande kanal för att snabbt få hjälp med supportärenden och guida användaren genom systemet. Du är anlitad för att implementera en chatbot som ska svara på kundernas vanligaste frågor.

### Funktionalitet
- Svara på frågor baserat på kundens fraktdata
- Svara på frågor om formulär eller regler

### Förslag på smart konversation

| Fråga från användare | Svar från bot |
|---------|----------|
| "Vart är mitt paket?" | "Din frakt med ID SHIP-992 befinner sig vid Mars"  |
| "Hur fyller jag i tullformuläret?"  | "Jag kan guida dig! Har frakten plasmaaktivt innehåll?"  |
| "Vad betyder 'försvunnen i svart hål'?"  | "Det paketet kommer aldrig komma fram" |
| "Vad är risknivå 5?"  | "Ditt paket har ett faligt innehåll och det är hög risk för att något kommer gå fel" |

---

## ✅ Bedömningskriterier

- Funktionalitet & kravuppfyllnad
- Responsiv design
- Arkitektur & kodkvalitet
- UX/UI
- DevOps & struktur
- Dokumentation & onboarding
