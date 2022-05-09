import { QueryBuilder } from 'objection';

import { Difficulty, Rating } from '../enums';
import { Maybe } from '../graphql';
import { Course } from './Course';
import { Domain } from './Domain';
import { ReviewReport } from './ReviewReport';
import { Semester } from './Semester';
import { User } from './User';
import { withDates } from './utils';

export class Review extends withDates(Domain) {
  id!: string;
  author_id!: string;
  course_id!: string;
  semester_id!: string;
  difficulty!: Maybe<Difficulty>;
  rating!: Maybe<Rating>;
  workload!: Maybe<number>;
  body!: Maybe<string>;

  author!: User;
  course!: Course;
  semester!: Semester;
  reports!: ReviewReport[];

  static tableName = 'omscentral_review';

  static relationMappings = {
    author: {
      relation: Domain.HasOneRelation,
      modelClass: User,
      join: {
        from: `${Review.tableName}.author_id`,
        to: `${User.tableName}.id`,
      },
    },
    course: {
      relation: Domain.BelongsToOneRelation,
      modelClass: Course,
      join: {
        from: `${Review.tableName}.course_id`,
        to: `${Course.tableName}.id`,
      },
    },
    semester: {
      relation: Domain.BelongsToOneRelation,
      modelClass: Semester,
      join: {
        from: `${Review.tableName}.semester_id`,
        to: `${Semester.tableName}.id`,
      },
    },
    reports: {
      relation: Domain.HasManyRelation,
      modelClass: ReviewReport,
      join: {
        from: `${Review.tableName}.id`,
        to: `${ReviewReport.tableName}.review_id`,
      },
    },
  };

  static jsonAttributes = ['meta'];

  static jsonSchema = {
    type: 'object',
    required: ['id', 'author_id', 'course_id', 'semester_id'],
    properties: {
      id: { type: 'string' },
      author_id: { type: 'string' },
      author: User.jsonSchema,
      course_id: { type: 'string' },
      course: Course.jsonSchema,
      semester_id: { type: 'string' },
      semester: Semester.jsonSchema,
      reports: { type: 'array', items: ReviewReport.jsonSchema },
      difficulty: { type: ['integer', 'null'] },
      rating: { type: ['integer', 'null'] },
      workload: { type: ['number', 'null'], minimum: 0 },
      body: { type: ['string', 'null'] },
      created: { type: 'number' },
      updated: { type: ['number', 'null'] },
    },
  };

  static eagerQuery = (): QueryBuilder<Review> =>
    Review.query().withGraphFetched(`[
      author.[program,specialization.[program]],
      course.[metric],
      semester,
      reports
    ]`);

  // this is legacy metadata that may some day have use...
  meta!: Maybe<{
    extraCredit: boolean;
    firstCourse: boolean;
    frontLoad: boolean;
    groupProjects: Maybe<number>;
    moneySpent: Maybe<number>;
    proctortrack: Maybe<boolean>;
    program: Maybe<number>;
    projects: Maybe<number>;
    tests: Maybe<number>;
  }>;
}
