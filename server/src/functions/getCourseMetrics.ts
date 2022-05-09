import { isEmpty, without } from 'lodash';
import { raw } from 'objection';

import { unknownSemester } from '../constants';
import { Difficulty, Rating } from '../enums';
import { CourseMetric as CM, Domain, Review, ReviewReport } from '../models';

class Metric extends Domain {
  static tableName = '_virtual';

  course_id!: string;
  semester_ids!: string[];

  count!: number;
  difficulty_mean!: number;
  difficulty_median!: number;
  difficulty_mode!: number;
  difficulty_min!: number;
  difficulty_max!: number;
  workload_mean!: number;
  workload_median!: number;
  workload_mode!: number;
  workload_min!: number;
  workload_max!: number;
  rating_mean!: number;
  rating_median!: number;
  rating_mode!: number;
  rating_min!: number;
  rating_max!: number;

  reports!: ReviewReport[];
}

const isValid = (metric: Metric): boolean => isEmpty(metric.reports);

const toCourseMetrics = (
  metric: Metric,
): Pick<CM, 'course_id' | 'semesters' | 'reviews'> => ({
  course_id: metric.course_id,
  semesters: without(metric.semester_ids, unknownSemester.id).sort().reverse(),
  reviews: {
    count: metric.count,
    difficulty: {
      mean: metric.difficulty_mean,
      median: metric.difficulty_median,
      mode: metric.difficulty_mode,
      min: metric.difficulty_min,
      max: metric.difficulty_max,
    },
    workload: {
      mean: metric.workload_mean,
      median: metric.workload_median,
      mode: metric.workload_mode,
      min: metric.workload_min,
      max: metric.workload_max,
    },
    rating: {
      mean: metric.rating_mean,
      median: metric.rating_median,
      mode: metric.rating_mode,
      min: metric.rating_min,
      max: metric.rating_max,
    },
  },
});

export const getCourseMetrics = async (
  courseIds: string[],
  semesterIds: string[],
  difficulties: Difficulty[],
  ratings: Rating[],
): Promise<Pick<CM, 'course_id' | 'semesters' | 'reviews'>[]> => {
  const metrics = await Metric.query()
    .select('course_id')
    .select(raw(`array_agg(distinct semester_id) as semester_ids`))
    .modify((query) =>
      ['difficulty', 'workload', 'rating'].map((col) =>
        query
          .select(raw(`avg(${col}) as ${col}_mean`))
          .select(raw(`median(${col}) as ${col}_median`))
          .select(raw(`mode() within group (order by ${col}) as ${col}_mode`))
          .select(raw(`min(${col}) as ${col}_min`))
          .select(raw(`max(${col}) as ${col}_max`)),
      ),
    )
    .select(raw(`cast(count(${Review.tableName}.id) as integer) as count`))
    .from(Review.tableName)
    .leftJoin(
      ReviewReport.tableName,
      `${Review.tableName}.id`,
      `${ReviewReport.tableName}.review_id`,
    )
    .modify((qb) => {
      courseIds.length && qb.whereIn('course_id', courseIds);
      semesterIds.length && qb.whereIn('semester_id', semesterIds);
      difficulties.length && qb.whereIn('difficulty', difficulties);
      ratings.length && qb.whereIn('rating', ratings);
    })
    .groupBy('course_id');

  return metrics.filter(isValid).map(toCourseMetrics);
};
