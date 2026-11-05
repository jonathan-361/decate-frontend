import type { ProfileFormValues } from "@/modules/users/schemas";

export const MOCK_STUDENT_PROFILE: ProfileFormValues = {
  fullName: "Valentina Rivas Morales",
  email: "valentina.rivas@universidad.edu.mx",
  phone: "+52 55 4123 9876",
  university: "Universidad Nacional Autónoma",
  faculty: "Facultad de Ingeniería",
  career: "Ingeniería en Sistemas Computacionales",
  studentId: "2021-ISC-0942",
  semester: "6",
  shift: "Matutino",
  bio: "Enfocada en arquitectura de software y análisis de algoritmos este ciclo. Meta: mantener promedio arriba de 9.0 y concluir proyecto de compiladores.",
};

export const MOCK_STUDENT_STATS = {
  gpa: 9.4,
  maxGpa: 10,
  activeCourses: 5,
  completedTasks: 48,
  completionPercentage: "96%",
  passedExams: 7,
};

