import type { ExtendedFormData } from '../components/FormularzPoszkodowanego';

// Helper to ensure time format HH:MM:SS
const formatTime = (timeStr: string) => {
    if (!timeStr) return "00:00:00";
    if (timeStr.length === 5) return `${timeStr}:00`;
    return timeStr;
};

export const mapToBackendJSON = (formData: ExtendedFormData) => {
    // 1. ZawiadomienieOWypadku - Mapping
    const zawiadomieniePayload = {
        data_utworzenia: new Date().toISOString().split('T')[0],
        platnik_skladek: formData.dzialalnosc || {
            // W formularzu frontendowym sekcja dzialalnosc jest opcjonalna, 
            // wiec jesli jej nie ma, musimy dac null lub dummy dane jesli backend wymaga
            // Tutaj zakladam ze backend wymaga struktury Dzialalnosc, wiec daje dummy "null-like" wartosci
            nip_regon: "0000000000",
            nazwa_firmy: "Nie podano",
            adres_siedziby: {
                ulica: "Nieznana",
                nr_domu: "0",
                kod_pocztowy: "00-000",
                miejscowosc: "Nieznana",
                panstwo: "Polska"
            }
        },
        poszkodowany: formData, // Struktura Pasuje (Poszkodowany)
        czy_zglasza_pelnomocnik: false,
        pelnomocnik: null,

        data_wypadku: formData.data_wypadku,
        godzina_wypadku: formatTime(formData.godzina_wypadku),
        miejsce_wypadku: formData.miejsce_wypadku,

        planowana_godzina_rozpoczecia: formatTime(formData.godzina_rozpoczecia_pracy),
        planowana_godzina_zakonczenia: formatTime(formData.godzina_zakonczenia_pracy),

        rodzaj_urazow: formData.rodzaj_urazow,
        opis_okolicznosci: formData.opis_okolicznosci,
        przyczyna_zewnetrzna: formData.przyczyna_zewnetrzna,
        czy_naglosc: true, // Brak pola w frontendzie, hardcode
        zwiazek_z_praca: formData.zwiazek_z_praca,

        swiadkowie: [], // Brak pola w frontendzie (User reverted changes) -> null/empty
        czy_udzielono_pomocy: false, // Brak pola w frontendzie -> null/false
        placowka_medyczna: null, // Brak pola w frontendzie -> null
        czy_powiadomiono_sluzby: false, // Brak pola w frontendzie -> null/false
        postepowania: [] // Brak pola w frontendzie -> null/empty
    };

    // 2. ZapisWyjasnienPoszkodowanego - Mapping
    const wyjasnieniaPayload = {
        poszkodowany: {
            ...formData,
            // Brak pola w frontendzie "adres_ostatniego_zamieszkania_polska" -> null
            adres_ostatniego_zamieszkania_polska: null
        },
        data_wypadku: formData.data_wypadku,
        godzina_wypadku: formatTime(formData.godzina_wypadku),
        miejsce_wypadku: formData.miejsce_wypadku,

        godzina_rozpoczecia_pracy: formatTime(formData.godzina_rozpoczecia_pracy),
        godzina_zakonczenia_pracy: formatTime(formData.godzina_zakonczenia_pracy),

        rodzaj_urazow: formData.rodzaj_urazow,
        rodzaj_czynnosci: formData.rodzaj_czynnosci,
        okolicznosci_wypadku: formData.okolicznosci_wypadku,
        przyczyny_wypadku: formData.przyczyny_wypadku,
        sekwencja_zdarzen: formData.sekwencja_zdarzen,
        opis_miejsca_wypadku: formData.opis_miejsca_wypadku,

        czy_wypadek_podczas_obslugi_maszyn: formData.czy_wypadek_podczas_obslugi_maszyn,
        informacje_o_maszynie: formData.czy_wypadek_podczas_obslugi_maszyn ? {
            nazwa: formData.nazwa_maszyny,
            producent: formData.producent_maszyny,
            rok_produkcji: formData.rok_produkcji_maszyny,
            numer_seryjny: formData.numer_seryjny_maszyny
        } : null,

        czy_stosowane_zabezpieczenia: formData.czy_stosowane_zabezpieczenia,
        rodzaj_srodkow_ochrony: formData.rodzaj_srodkow_ochrony,
        czy_srodki_wlasciwe_i_sprawne: formData.czy_srodki_wlasciwe_i_sprawne,

        czy_stosowana_asekuracja: formData.czy_stosowana_asekuracja,
        czy_praca_do_wykonania_samodzielnie: formData.czy_praca_do_wykonania_samodzielnie,
        czy_wymagane_min_2_osoby: formData.czy_wymagane_min_2_osoby,

        czy_przestrzegane_zasady_bhp: formData.czy_przestrzegane_zasady_bhp,
        czy_posiada_przygotowanie: formData.czy_posiada_przygotowanie,
        czy_odbyte_szkolenia_bhp: formData.czy_odbyte_szkolenia_bhp,
        czy_opracowana_ocena_ryzyka: formData.czy_opracowana_ocena_ryzyka,
        srodki_zmniejszajace_ryzyko: formData.srodki_zmniejszajace_ryzyko,

        czy_stan_nietrzezwosci: formData.czy_stan_nietrzezwosci,
        czy_pod_wplywem_srodkow: formData.czy_pod_wplywem_srodkow,
        czy_badany_stan_trzeźwosci: formData.czy_badany_stan_trzezwosci, // Note typo in backend field vs frontend
        przez_kogo_badany: formData.przez_kogo_badany,

        czy_prowadzone_postepowania: formData.czy_prowadzone_postepowania,
        postepowania: [], // Brak listy postepowan w frontendzie -> null/empty

        pomoc_medyczna: {
            czy_udzielono: false, // Brak danych w frontendzie -> null/false
            data_udzielenia: null,
            nazwa_placowki: null,
            okres_hospitalizacji: null,
            miejsce_hospitalizacji: null,
            rozpoznany_uraz: null,
            okres_niezdolnosci: null
        },

        czy_na_zwolnieniu_w_dniu_wypadku: formData.czy_na_zwolnieniu_w_dniu_wypadku,
        swiadkowie: [] // Brak danych w frontendzie -> null/empty
    };

    return { zawiadomieniePayload, wyjasnieniaPayload };
};
