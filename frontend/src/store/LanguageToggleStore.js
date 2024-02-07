import { create } from "zustand";

const useLanguageStore = create((set) => ({
    language: localStorage.getItem("language") ?? "English",
    toggle: (state) => {
        set((state) => {
            let changedLangauge = state.language === "English" ? "Default" : "English";
            localStorage.setItem("language", changedLangauge);
            return { language: changedLangauge };
        });
    },
}));

export { useLanguageStore };
