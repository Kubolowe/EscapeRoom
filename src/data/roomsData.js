// Escape ROOM: Misja Logistyka
// Rooms and Puzzles Data Definition

export const INITIAL_TIME_SECONDS = 20 * 60; // 20 minut

export const ROOMS_DATA = [
  {
    id: 'room-1',
    number: 1,
    codeDigitIndex: 0,
    awardedDigit: '2',
    name: 'Biuro Planowania',
    theme: 'Planowanie i harmonogramowanie',
    subtitle: 'Krok 1: Metodyka ścieżki krytycznej i unikanie wąskich gardeł',
    bgImage: '/assets/rooms/glowna.jpg',
    atmosphere: 'crt-excel',
    description: '14 października 2007, godzina 18:00. Papiery piętrzą się na biurku, monitor CRT szumi cicho, a arkusz Excela czeka na właściwe ułożenie harmonogramu prac. Bez planu otwarcie escape roomu skończy się katastrofą.',
    hotspots: [
      {
        id: 'r1-monitor',
        x: 48,
        y: 44,
        label: 'Monitor CRT (Arkusz Excel 2007)',
        icon: 'monitor',
        type: 'info',
        title: 'Komputer z systemem Windows i Excel 2007',
        content: `Na wypukłym ekranie 17-calowego monitora CRT otwarty jest arkusz "HARMONOGRAM_PROJEKTU_FINAL.XLS".
        
W kolumnach widoczne są zadania, czasy trwania oraz zależności. W notatce na pulpicie zapisano:
"Pamiętaj: procesy nadrzędne determinują ścieżkę krytyczną. Każde przesunięcie etapu początkowego skutkuje lawinowym opóźnieniem całego otwarcia obiektu."`
      },
      {
        id: 'r1-calendar',
        x: 77,
        y: 45,
        label: 'Kalendarz ścienny - Październik 2007',
        icon: 'calendar',
        type: 'info',
        title: 'Ścienny kalendarz firmowy',
        content: `Data: **Niedziela, 14 października 2007 r.**
        
Czerwonym markerem zakreślono dzisiejszy dzień z dopiskiem:
"18:40 - Oficjalny start pierwszego w Trójmieście Escape Roomu dla dziennikarzy i komisji BHP!"
Pozostało krytycznie mało czasu na dopięcie łańcucha dostaw i procedur bezpieczeństwa.`
      },
      {
        id: 'r1-procedure',
        x: 31,
        y: 79,
        label: 'Teczka z procedurą (Zagadka)',
        icon: 'folder',
        type: 'puzzle',
        puzzleId: 'puzzle-1',
        title: 'Procedura Rozruchu: Ustalenie Kolejności Faz'
      }
    ]
  },
  {
    id: 'room-2',
    number: 2,
    codeDigitIndex: 1,
    awardedDigit: '0',
    name: 'Magazyn Podręczny',
    theme: 'Ewidencja i strefowanie magazynu',
    subtitle: 'Krok 2: Kodowanie towarów, strefy składowania i ładunki wrażliwe',
    bgImage: '/assets/rooms/magazyn.jpg',
    atmosphere: 'warehouse-shadow',
    description: 'Zimne, metalowe regały magazynu podręcznego. W powietrzu unosi się zapach tektury i oleju technicznego. Właśnie dotarły skrzynie ze sprzętem - w tym ultra-wrażliwe czujniki optyczne i fotokomórki do zagadek laserowych.',
    hotspots: [
      {
        id: 'r2-box-a',
        x: 23,
        y: 40,
        label: 'Skrzynia A (Kable i osprzęt)',
        icon: 'box',
        type: 'info',
        title: 'Oznakowanie: SKRZYNIA A - "OSPRZĘT ELEKTRYCZNY"',
        content: `Ciężka skrzynia ze sklejki. W środku: bębny z przewodami miedzianymi, złączki śrubowe, zasilacze 12V oraz listwy zaciskowe. 
Towar odporny na wstrząsy, lecz podatny na wilgoć.`
      },
      {
        id: 'r2-box-b',
        x: 60,
        y: 73,
        label: 'Skrzynia B (Sprzęt optyczny - Zagadka)',
        icon: 'box',
        type: 'puzzle',
        puzzleId: 'puzzle-2',
        title: 'Wybór zabezpieczenia i strefy dla ładunku wrażliwego'
      },
      {
        id: 'r2-box-c',
        x: 34,
        y: 77,
        label: 'Skrzynia C (Narzędzia ciężkie)',
        icon: 'tool',
        type: 'info',
        title: 'Oznakowanie: SKRZYNIA C - "NARZĘDZIA MONTAŻOWE"',
        content: `Czerwona stalowa skrzynia narzędziowa. Zawiera młotki bezodrzutowe, wiertarkę udarową, klucze nasadowe i poziomice laserowe.
Zgodnie z zasadami BHP skrzynie o masie powyżej 25 kg powinny spoczywać na dolnych poziomach paletowych.`
      }
    ]
  },
  {
    id: 'room-3',
    number: 3,
    codeDigitIndex: null, // Room 3 provides decision insight and crucial access clearance
    awardedDigit: null,
    name: 'Strefa Dostaw',
    theme: 'Transport i zarządzanie ryzykiem',
    subtitle: 'Krok 3: Reakcja na zakłócenia w łańcuchu dostaw i zapas bezpieczeństwa',
    bgImage: '/assets/rooms/dostawa.jpg',
    atmosphere: 'delivery-flicker',
    description: 'Rampa rozładunkowa i brama towarowa. Jarzeniówki lekko brzęczą. Na drewnianej skrzyni wibruje telefon komórkowy - kierowca ciężarówki utknął w korku, a ekipa montażowa czeka!',
    hotspots: [
      {
        id: 'r3-phone',
        x: 35,
        y: 77,
        label: 'Telefon Nokia (SMS Alarmowy - Zagadka)',
        icon: 'phone',
        type: 'puzzle',
        puzzleId: 'puzzle-3',
        title: 'Nokia 3310: Decyzja kryzysowa w łańcuchu dostaw'
      },
      {
        id: 'r3-waybill',
        x: 23,
        y: 77,
        label: 'Podkładka z listem przewozowym (CMR)',
        icon: 'file-text',
        type: 'info',
        title: 'Międzynarodowy Samochodowy List Przewozowy (CMR)',
        content: `**Przewoźnik:** Trans-Logistyka 2007 Sp. z o.o.
**Trasa:** Katowice -> Trójmiasto (Gdańsk / Gdynia - Autostrada A1 / DK1)
**Status:** W trasie do Trójmiasta.
**Uwaga dyspozytora:** "Zator drogowy przed węzłem Rusocin na wjeździe do Trójmiasta. Szacowane opóźnienie ciężarówki: minimum 45 minut."
W logistyce brak planu awaryjnego (Contingency Plan) oznacza natychmiastowe zerwanie łańcucha dostaw obiektu w Trójmieście.`
      },
      {
        id: 'r3-gate',
        x: 74,
        y: 40,
        label: 'Brama roletowa strefy wyładunku',
        icon: 'door-closed',
        type: 'info',
        title: 'Brama rozładunkowa nr 2',
        content: `Brama segmentowa z napędem łańcuchowym. Na tabliczce znamionowej widnieje instrukcja:
"W strefie doków przeładunkowych obowiązuje bezwzględny zakaz zastawiania ciągów komunikacyjnych paletami buforowymi."`
      }
    ]
  },
  {
    id: 'room-4',
    number: 4,
    codeDigitIndex: 2,
    awardedDigit: '0',
    name: 'Sala Projektowa',
    theme: 'Layout przestrzeni i BHP',
    subtitle: 'Krok 4: Organizacja ciągów komunikacyjnych, analiza ABC i drogi ewakuacyjne',
    bgImage: '/assets/rooms/projektowa.jpg',
    atmosphere: 'blinds-light',
    description: 'Pracownia projektantów escape roomu. Na ścianie wisi wielka tablica korkowa z rzutem architektonicznym obiektu, a na desce kreślarskiej leżą kalki techniczne. Błędy w rozmieszczeniu rekwizytów i wyjść mogą zagrażać życiu odwiedzających!',
    hotspots: [
      {
        id: 'r4-corkboard',
        x: 69,
        y: 35,
        label: 'Tablica korkowa z rzutem (Zagadka BHP)',
        icon: 'map',
        type: 'puzzle',
        puzzleId: 'puzzle-4',
        title: 'Audyt layoutu: Wskaż 2 krytyczne błędy logistyczne i BHP'
      },
      {
        id: 'r4-evac-plan',
        x: 87,
        y: 22,
        label: 'Plan drogi ewakuacyjnej',
        icon: 'shield-alert',
        type: 'info',
        title: 'Instrukcja Bezpieczeństwa Pożarowego (BHP i PPOŻ)',
        content: `**Rozporządzenie MSWiA dotyczące ewakuacji w obiektach użyteczności publicznej:**
1. Szerokość poziomych dróg ewakuacyjnych nie może być mniejsza niż 1,4 m.
2. Drzwi ewakuacyjne muszą otwierać się na zewnątrz i pod żadnym pozorem NIE MOGĄ być blokowane towarami, skrzyniami ani łańcuchami.
3. Rekwizyty i ładunki o największej częstotliwości pobrań (klasa A w analizie ABC) muszą znajdować się najbliżej wejścia, aby nie generować zatorów.`
      },
      {
        id: 'r4-drafting-table',
        x: 21,
        y: 68,
        label: 'Szkice techniczne na desce kreślarskiej',
        icon: 'pen-tool',
        type: 'info',
        title: 'Rysunki wykonawcze stanowisk gry',
        content: `Odręczne szkice ołówkiem na błękitnym papierze milimetrowym.
Przedstawiają rozmieszczenie czujek dymu, oświetlenia kierunkowego EXIT oraz zamków elektromagnetycznych z funkcją "fail-safe" (odcięcie zasilania powoduje automatyczne otwarcie drzwi).`
      }
    ]
  },
  {
    id: 'room-5',
    number: 5,
    codeDigitIndex: null, // Room 5 manages the strict budget authorization
    awardedDigit: null,
    name: 'Dział Kosztów i Zakupów',
    theme: 'Budżet i priorytetyzacja',
    subtitle: 'Krok 5: Alokacja zasobów finansowych (CAPEX) - bezpieczeństwo ponad estetykę',
    bgImage: '/assets/rooms/biurko.jpg',
    atmosphere: 'desk-lamp',
    description: 'Gabinet księgowo-zakupowy. Zielona lampa bankierska oświetla segregator faktur, kalkulator z taśmą papierową oraz listę pilnych zakupów. Budżet interwencyjny jest sztywny - wynosi dokładnie 500 PLN. Ani grosza więcej!',
    hotspots: [
      {
        id: 'r5-calculator',
        x: 32,
        y: 65,
        label: 'Kalkulator biurowy z taśmą',
        icon: 'calculator',
        type: 'info',
        title: 'Kalkulator Citizen z taśmą rachunkową',
        content: `Wyświetlacz pokazuje: **LIMIT: 500,00 PLN**.
Dyrektor finansowy zostawił czerwoną notatkę:
"Przekroczenie budżetu choćby o 1 PLN oznacza natychmiastowe zablokowanie płatności przez bank. Wybieraj wyłącznie komponenty niosące wartość krytyczną dla bezpieczeństwa i działania obiektu!"`
      },
      {
        id: 'r5-binders',
        x: 41,
        y: 52,
        label: 'Segregatory faktur i umów',
        icon: 'archive',
        type: 'info',
        title: 'Rejestr Zamówień i Kosztów Logistycznych 2007',
        content: `Dokumenty potwierdzają: koszty transportu i cła zostały już rozliczone.
Pozostała jedynie ostatnia pula zakupów awaryjnych przed odbiorem technicznym.`
      },
      {
        id: 'r5-checklist',
        x: 53,
        y: 70,
        label: 'Lista brakujących zakupów (Zagadka)',
        icon: 'shopping-cart',
        type: 'puzzle',
        puzzleId: 'puzzle-5',
        title: 'Optymalizacja koszyka zakupowego: Budżet 500 PLN'
      }
    ]
  },
  {
    id: 'room-6',
    number: 6,
    codeDigitIndex: 3,
    awardedDigit: '7',
    name: 'Centrum Kontroli',
    theme: 'Kontrola jakości i protokół odbioru',
    subtitle: 'Krok 6: Odbiór jakościowy (QA) i bezwzględna weryfikacja sprawności',
    bgImage: '/assets/rooms/monitory.jpg',
    atmosphere: 'cctv-static',
    description: 'Serce techniczne obiektu. Ściana monitorów kineskopowych CCTV transmituje czarno-biały obraz z zakłóceniami. Diody na potężnej szafie sterowniczej pulsują rytmicznie. Na wieszaku czeka oficjalny Protokół Odbioru Końcowego.',
    hotspots: [
      {
        id: 'r6-cctv',
        x: 20,
        y: 35,
        label: 'Monitory podglądu CCTV',
        icon: 'tv',
        type: 'info',
        title: 'System monitoringu przemysłowego CCTV (PAL)',
        content: `Na ekranach widać poszczególne pokoje gry.
Kamera 03 (Korytarz laserowy) wykazuje sporadyczne zakłócenia sygnału. W rogu ekranu mruga czerwony komunikat: "SENSOR #4 GLITCH DETECTED".`
      },
      {
        id: 'r6-panel',
        x: 70,
        y: 48,
        label: 'Szafa sterownicza z kontrolkami',
        icon: 'cpu',
        type: 'info',
        title: 'Główna rozdzielnica automatyki przemysłowej',
        content: `Woltomierze wskazują stabilne 230V i 12V DC.
Zielone diody świecą dla sekcji zasilania awaryjnego, wentylacji i elektrozamków. Jedna żółta kontrolka w sekcji "System laserowy zagadek" mruga nieregularnie.`
      },
      {
        id: 'r6-checklist',
        x: 93,
        y: 44,
        label: 'Podkładka z checklistą odbiorczą (Zagadka)',
        icon: 'clipboard-check',
        type: 'puzzle',
        puzzleId: 'puzzle-6',
        title: 'Protokół odbioru technicznego: Podpisać czy wstrzymać?'
      }
    ]
  },
  {
    id: 'room-final',
    number: 7,
    codeDigitIndex: null,
    awardedDigit: null,
    isFinalRoom: true,
    name: 'Gabinet Dyrektora',
    theme: 'Finał: Sejf Licencyjny',
    subtitle: 'Zwieńczenie misji: Wprowadź 4-cyfrowy kod zebrany w pokojach i odbierz licencję',
    bgImage: '/assets/rooms/koniec.jpg',
    atmosphere: 'safe-glow',
    description: 'Elegancki gabinet w dębowej boazerii. Księgozbiory, portret założyciela, a w centralnym punkcie prawej ściany potężny, stalowy sejf pancerny z elektronicznym szyfratorem. To w nim zamknięty jest oficjalny Certyfikat i Pozwolenie na Otwarcie Obiektu!',
    hotspots: [
      {
        id: 'rf-safe',
        x: 76,
        y: 52,
        label: 'Pancerny sejf z klawiaturą cyfrową (Zamek)',
        icon: 'lock',
        type: 'safe',
        title: 'Szyfrator sejfu MasterLock 2007'
      },
      {
        id: 'rf-desk',
        x: 32,
        y: 68,
        label: 'Biurko dyrektora (Dokumentacja końcowa)',
        icon: 'briefcase',
        type: 'info',
        title: 'Dekret Dyrektora Generalnego Escape Roomu',
        content: `**DO WIADOMOŚCI KOORDYNATORA LOGISTYKI:**
"Sejf zawiera urzędowy Certyfikat Bezpieczeństwa i Pozwolenie na Inaugurację. Kod dostępu został podzielony na 4 cyfry i zabezpieczony w kluczowych węzłach logistycznych obiektu:
- Cyfra 1: Biuro Planowania (Harmonogramowanie)
- Cyfra 2: Magazyn Podręczny (Kodowanie towarów)
- Cyfra 3: Sala Projektowa (Layout i BHP)
- Cyfra 4: Centrum Kontroli (Odbiór jakościowy)

Sprawdź swój HUD w górnym pasku. Wprowadź kombinację na klawiaturze sejfu i otwórz obiekt na czas!"`
      },
      {
        id: 'rf-easter-egg',
        x: 25,
        y: 34,
        label: 'Obraz Dyrektora (Złocona Rama)',
        icon: 'sparkles',
        type: 'easter-egg',
        isSecret: true,
        title: 'Tajemniczy schowek za obrazem dyrektora'
      }
    ]
  }
];

// Education Pillars Summary for Victory Screen
export const LOGISTICS_PILLARS = [
  {
    id: 1,
    title: 'Planowanie i harmonogramowanie',
    room: 'Biuro Planowania (Zdobyta cyfra: 2)',
    desc: 'Określenie ścieżki krytycznej i zależności procesowych zapobiega paraliżowi całego projektu jeszcze przed rozpoczęciem fizycznych prac.'
  },
  {
    id: 2,
    title: 'Ewidencja i strefowanie magazynu',
    room: 'Magazyn Podręczny (Zdobyta cyfra: 0)',
    desc: 'Właściwe kodowanie ładunków, piktogramy ostrzegawcze i strefowanie chronią wrażliwy sprzęt przed zniszczeniem mechanicznym.'
  },
  {
    id: 3,
    title: 'Transport i zarządzanie ryzykiem',
    room: 'Strefa Dostaw (Decyzja kryzysowa)',
    desc: 'Utrzymywanie bufora bezpieczeństwa (safety stock) i lokalnych alternatyw pozwala błyskawicznie reagować na awarie w łańcuchu dostaw.'
  },
  {
    id: 4,
    title: 'Layout przestrzeni i bezwzględne BHP',
    room: 'Sala Projektowa (Zdobyta cyfra: 0)',
    desc: 'Organizacja ergonomicznych ciągów komunikacyjnych (analiza ABC) i bezwzględnie drożne drogi ewakuacyjne to fundament bezpieczeństwa życia.'
  },
  {
    id: 5,
    title: 'Budżetowanie i priorytetyzacja',
    room: 'Dział Kosztów i Zakupów (Bilans 500 PLN)',
    desc: 'W sytuacjach kryzysowych alokacja środków musi bezwzględnie faworyzować atesty techniczne i bezpieczeństwo ponad elementy estetyczne.'
  },
  {
    id: 6,
    title: 'Kontrola jakości i odbiór końcowy',
    room: 'Centrum Kontroli (Zdobyta cyfra: 7)',
    desc: 'Proces logistyczny nie kończy się na dowiezieniu towaru, lecz na pełnej weryfikacji sprawności i podpisaniu rzetelnego protokołu odbioru.'
  }
];
