import { CourseMetric as CM } from '../models';
import { getCourseMetrics } from './getCourseMetrics';

interface UpsertCourseMetrics {
  (): Promise<CM[]>;
  (courseId: string): Promise<CM[]>;
}

export const upsertCourseMetrics: UpsertCourseMetrics = async (
  courseId?: string,
): Promise<CM[]> => {
  const dropCurrentMetrics = CM.query()
    .delete()
    .modify((query) => courseId != null && query.where('course_id', courseId));

  const [metrics] = await Promise.all([
    getCourseMetrics(courseId ? [courseId] : [], [], [], []),
    dropCurrentMetrics,
  ]);

  return CM.query().upsertGraphAndFetch(metrics, {
    insertMissing: true,
  });
};
