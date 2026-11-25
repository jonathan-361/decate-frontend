export interface SharePayload {
    title?: string;
    text?: string;
    url?: string;
    files?: File[];
}

export interface IncomingShareData {
    title: string;
    text: string;
    url: string;
}

/**
 * Verifica si el navegador soporta la Web Share API (y opcionalmente compartir archivos).
 */
export function canUseWebShare(files?: File[]): boolean {
    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
        return false;
    }

    if (files && files.length > 0) {
        return typeof navigator.canShare === 'function' && navigator.canShare({ files });
    }

    return true;
}

/**
 * Comparte contenido usando el menú nativo del sistema operativo.
 * Si no hay soporte o falla (distinto a cancelación del usuario), copia el texto/URL al portapapeles como fallback.
 */
export async function shareContent(
    payload: SharePayload
): Promise<{ status: 'shared' | 'copied' | 'cancelled' | 'error' }> {
    const { title, text, url, files } = payload;

    if (canUseWebShare(files)) {
        try {
            const shareData: ShareData = {};
            if (title) shareData.title = title;
            if (text) shareData.text = text;
            if (url) shareData.url = url;
            if (files && files.length > 0) shareData.files = files;

            await navigator.share(shareData);
            return { status: 'shared' };
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                return { status: 'cancelled' };
            }
            // Si falla por otro motivo, continúa al fallback del portapapeles
        }
    }

    const fallbackContent = [title, text, url].filter(Boolean).join('\n');
    if (fallbackContent && typeof navigator !== 'undefined' && navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(fallbackContent);
            return { status: 'copied' };
        } catch {
            return { status: 'error' };
        }
    }

    return { status: 'error' };
}

/**
 * Extrae los parámetros recibidos cuando la PWA se abre mediante Web Share Target (GET).
 */
export function extractIncomingShareData(searchParams: URLSearchParams): IncomingShareData | null {
    const title = searchParams.get('title')?.trim() ?? '';
    const text = searchParams.get('text')?.trim() ?? '';
    const url = searchParams.get('url')?.trim() ?? '';

    if (!title && !text && !url) {
        return null;
    }

    return { title, text, url };
}

/**
 * Formatea una tarea para compartirla de manera legible.
 */
export function formatTaskShareText(task: {
    title: string;
    description?: string | null;
    dueDate?: string | Date | null;
    subjectName?: string | null;
    priority?: string | null;
}): SharePayload {
    const lines: string[] = [`Tarea: ${task.title}`];

    if (task.subjectName) {
        lines.push(`📚 Materia: ${task.subjectName}`);
    }

    if (task.dueDate) {
        const formattedDate = new Date(task.dueDate).toLocaleDateString('es-MX', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
        lines.push(`Entrega: ${formattedDate}`);
    }

    if (task.priority) {
        lines.push(`Prioridad: ${task.priority}`);
    }

    if (task.description) {
        lines.push(`\n${task.description}`);
    }

    return {
        title: `Tarea: ${task.title}`,
        text: lines.join('\n'),
    };
}

/**
 * Formatea un examen para compartirlo de manera legible.
 */
export function formatExamShareText(exam: {
    title: string;
    date: string | Date;
    subjectName?: string | null;
    location?: string | null;
    topics?: string | null;
}): SharePayload {
    const formattedDate = new Date(exam.date).toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    });

    const lines: string[] = [
        `📝 Examen: ${exam.title}`,
        `📅 Fecha: ${formattedDate}`,
    ];

    if (exam.subjectName) {
        lines.push(`Materia: ${exam.subjectName}`);
    }

    if (exam.location) {
        lines.push(`Aula/Lugar: ${exam.location}`);
    }

    if (exam.topics) {
        lines.push(`Temas: ${exam.topics}`);
    }

    return {
        title: `Examen: ${exam.title}`,
        text: lines.join('\n'),
    };
}