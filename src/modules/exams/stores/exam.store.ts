import { create } from "zustand";
import { toast } from "sonner";
import { examService } from "@/modules/exams/services/exam.service";
import { getErrorMessage } from "@/modules/core/services/api-error";
import type { Exam, ExamPayload } from "@/modules/exams/schemas";

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

            try {
                const { success, message, data } = await examService.getAll();
                if (!success || !data) throw new Error(message);
                set({ exams: data, isLoading: false, error: null });
            } catch (err) {
                const msg = getErrorMessage(err, "No se pudieron cargar los exámenes");
                if (get().exams.length > 0) {
                    // Ya hay datos en pantalla: se conservan y solo se avisa.
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
        } catch (err) {
            throw new Error(getErrorMessage(err, "Error al crear el examen"));
        }
    },

    updateExam: async (id, payload) => {
        try {
            const { success, message, data } = await examService.update(id, payload);
            if (!success || !data) throw new Error(message);
            set((s) => ({ exams: s.exams.map((e) => (e.id === id ? data : e)) }));
        } catch (err) {
            throw new Error(getErrorMessage(err, "Error al actualizar el examen"));
        }
    },

    deleteExam: async (id) => {
        try {
            const { success, message } = await examService.remove(id);
            if (!success) throw new Error(message);
            set((s) => ({ exams: s.exams.filter((e) => e.id !== id) }));
        } catch (err) {
            throw new Error(getErrorMessage(err, "Error al eliminar el examen"));
        }
    },

    clear: () => set({ exams: [], error: null }),
}));