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
