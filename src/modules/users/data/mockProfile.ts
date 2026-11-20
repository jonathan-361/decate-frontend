import type { ProfileFormValues } from "@/modules/users/schemas";

export const MOCK_STUDENT_STATS = {
  gpa: 8.7,
  maxGpa: 10,
  activeCourses: 7,
  completedTasks: 42,
  completionPercentage: "91%",
  passedExams: 18,
};

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
