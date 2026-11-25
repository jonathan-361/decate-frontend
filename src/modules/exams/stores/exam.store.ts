import { create } from "zustand";
import { toast } from "sonner";
import { examService } from "@/modules/exams/services/exam.service";
import { getErrorMessage } from "@/modules/core/services/api-error";
import { idbDelete, idbGet, idbSet } from "@/modules/core/services/indexeddb";
import type { Exam, ExamPayload } from "@/modules/exams/schemas";

export const EXAMS_KEY = "dacate-exams";

interface ExamState {
    exams: Exam[];
    isLoading: boolean;
    error: string | null;
    fetchExams: () => Promise<void>;
    createExam: (payload: ExamPayload) => Promise<void>;
    updateExam: (id: number, payload: Partial<ExamPayload>) => Promise<void>;
    deleteExam: (id: number) => Promise<void>;
    clear: () => void;
}

let inFlightFetch: Promise<void> | null = null;

export const useExamStore = create<ExamState>((set, get) => ({
    exams: [],
    isLoading: false,
    error: null,

    fetchExams: async () => {
        if (inFlightFetch) return inFlightFetch;

        inFlightFetch = (async () => {
            set({ isLoading: true, error: null });

            const guardados = await idbGet<Exam[]>(EXAMS_KEY);
            if (guardados && get().exams.length === 0) {
                set({ exams: guardados });
            }

            try {
                const { success, message, data } = await examService.getAll();
                if (!success || !data) throw new Error(message);
                set({ exams: data, isLoading: false, error: null });
                void idbSet(EXAMS_KEY, data);
            } catch (err) {
                const isOffline =
                    !navigator.onLine ||
                    (err instanceof Error &&
                        (err.message.includes("Network Error") ||
                            err.message.includes("offline")));

                if (isOffline || guardados !== undefined) {
                    set({
                        error: null,
                        isLoading: false,
                        exams: guardados ?? [],
                    });
                    return;
                }

                const msg = getErrorMessage(err, "No se pudieron cargar los exámenes");
                if (get().exams.length > 0) {
                    set({ isLoading: false });
                    toast.error(msg);
                } else {
                    set({ error: msg, isLoading: false });
                }
            } finally {
                inFlightFetch = null;
            }
        })();

        return inFlightFetch;
    },

    createExam: async (payload) => {
        try {
            const { success, message, data } = await examService.create(payload);
            if (!success || !data) throw new Error(message);
            set((s) => ({ exams: [...s.exams, data] }));
            void idbSet(EXAMS_KEY, get().exams);
        } catch (err) {
            throw new Error(getErrorMessage(err, "Error al crear el examen"));
        }
    },

    updateExam: async (id, payload) => {
        try {
            const { success, message, data } = await examService.update(id, payload);
            if (!success || !data) throw new Error(message);
            set((s) => ({ exams: s.exams.map((e) => (e.id === id ? data : e)) }));
            void idbSet(EXAMS_KEY, get().exams);
        } catch (err) {
            throw new Error(getErrorMessage(err, "Error al actualizar el examen"));
        }
    },

    deleteExam: async (id) => {
        try {
            const { success, message } = await examService.remove(id);
            if (!success) throw new Error(message);
            set((s) => ({ exams: s.exams.filter((e) => e.id !== id) }));
            void idbSet(EXAMS_KEY, get().exams);
        } catch (err) {
            throw new Error(getErrorMessage(err, "Error al eliminar el examen"));
        }
    },

    clear: () => {
        void idbDelete(EXAMS_KEY);
        set({ exams: [], error: null });
    },
}));