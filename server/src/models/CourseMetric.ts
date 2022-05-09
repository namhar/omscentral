import { FeatureAlias } from '../enums';
import { Features } from '../utils';
import { Domain } from './Domain';

interface Stats {
  mean: number;
  median: number;
  mode: number;
  min: number;
  max: number;
}

const emptyStats: Stats = {
  mean: 0,
  median: 0,
  mode: 0,
  min: 0,
  max: 0,
};

const statsSchema = {
  type: 'object',
  required: ['mean', 'median', 'mode'],
  properties: {
    mean: { type: 'number' },
    median: { type: 'number' },
    mode: { type: 'number' },
    min: { type: 'number' },
    max: { type: 'number' },
  },
};

export class CourseMetric extends Domain {
  course_id!: string;
  reviews!: {
    count: number;
    difficulty: Stats;
    workload: Stats;
    rating: Stats;
  };
  semesters!: string[];

  static tableName = 'omscentral_course_metric';

  static idColumn = 'course_id';

  static jsonAttributes = ['reviews', 'semesters'];

  static jsonSchema = {
    type: 'object',
    required: ['course_id', 'reviews'],
    properties: {
      course_id: { type: 'string' },
      reviews: {
        type: 'object',
        required: ['count', 'workload', 'difficulty', 'rating'],
        properties: {
          count: { type: 'integer' },
          difficulty: statsSchema,
          workload: statsSchema,
          rating: statsSchema,
        },
      },
      semesters: { type: 'array', items: { type: 'string' } },
    },
  };

  public $cloneEmpty(features: Features): CourseMetric {
    const clone = this.$clone();

    if (!features.isEnabled(FeatureAlias.AllReviews)) {
      clone.reviews.count = 0;
    }

    if (!features.isEnabled(FeatureAlias.Metrics)) {
      clone.reviews.difficulty = { ...emptyStats };
      clone.reviews.workload = { ...emptyStats };
      clone.reviews.rating = { ...emptyStats };

      clone.semesters = [];
    }

    return clone;
  }
}
