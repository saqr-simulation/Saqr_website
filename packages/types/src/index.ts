export interface StudentProfile {
  id: string;
  email: string;
  name: string | null;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPER_ADMIN';
}
export interface CoursePreview {
  id: string;
  title: string;
  description: string;
  modules: readonly string[];
}
export const demoCourse: CoursePreview = {
  id: 'agricultural-drone-operations',
  title: 'Agricultural Drone Operations',
  description:
    'Build a practical foundation in safety, mission preparation, imaging and agricultural applications.',
  modules: [
    'Introduction to Agricultural Drones',
    'Drone Systems & Safety',
    'Mission & Flight Preparation',
    'Agricultural Drone Applications',
    'Assessment',
  ],
};
export const demoProgress = {
  percent: 35,
  completedLessons: 7,
  totalLessons: 20,
  trainingHours: 3.5,
} as const;

export const demoUsers = {
  traineeStudent: {
    id: '00000000-0000-4000-8000-000000000001',
    email: 'demo.student@example.invalid',
    name: 'Demo Pilot',
    role: 'STUDENT' as const,
  },
  graduateStudent: {
    id: '00000000-0000-4000-8000-000000000002',
    email: 'sarah.pilot@example.invalid',
    name: 'Sarah Amrani',
    role: 'STUDENT' as const,
  },
  newStudent: {
    id: '00000000-0000-4000-8000-000000000003',
    email: 'amine.pilot@example.invalid',
    name: 'Amine Tazi',
    role: 'STUDENT' as const,
  },
  instructor: {
    id: '00000000-0000-4000-8000-000000000010',
    email: 'karim.instructor@example.invalid',
    name: 'Capt. Karim Alami',
    role: 'INSTRUCTOR' as const,
  },
  admin: {
    id: '00000000-0000-4000-8000-000000000099',
    email: 'admin@saqr.invalid',
    name: 'Platform Admin',
    role: 'ADMIN' as const,
  },
} as const;
