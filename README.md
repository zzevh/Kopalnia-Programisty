# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Kopalnia Programisty - Landing Page

Strona internetowa promująca kursy online "Kopalnia Złota" i "Kopalnia Diamentów".

## Sekcje strony

- Intro
- Dlaczego warto
- Twoja przewaga na starcie
- Co sądzą inni (opinie)
- Wybierz kurs
- Podgląd kursu
- FAQ

## Podgląd kursu

W sekcji "Podgląd kursu" prezentowane są szczegółowe informacje o zawartości kursów. 
Aby prawidłowo wyświetlać obrazy w tej sekcji, należy dodać następujące pliki:

1. `src/assets/podglad/kopalnia-zlota.png` - Główne zdjęcie podglądu kursu Kopalnia Złota
2. `src/assets/podglad/kopalnia-diamentow.png` - Główne zdjęcie podglądu kursu Kopalnia Diamentów 
3. `src/assets/podglad/zloto-preview.png` - Zdjęcie pokazujące przykładowe materiały z kursu Kopalnia Złota
4. `src/assets/podglad/diamenty-preview.png` - Zdjęcie pokazujące przykładowe materiały z kursu Kopalnia Diamentów

## Uruchamianie projektu

1. Zainstaluj zależności: `npm install`
2. Uruchom serwer deweloperski: `npm run dev`
3. Zbuduj wersję produkcyjną: `npm run build`
