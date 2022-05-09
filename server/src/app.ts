import { json, text, urlencoded } from 'body-parser';
import compression from 'compression';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { xframe, xssProtection } from 'lusca';

import { bootable, pp } from './components';
import { logger } from './components';
import { appConfig } from './config';
import { handleStripeEvent } from './functions';
import * as middleware from './middleware';
import * as phases from './phases';

export const app = bootable(express(), logger);

app.phase(phases.processEvents, 'process_events');
app.phase(phases.createServer, 'create_server');
app.phase(phases.knex, 'knex');
app.phase(phases.postgres, 'postgres');
app.phase(phases.upsertSemesters, 'upsert_semesters');
app.phase(phases.upsertCourses, 'upsert_courses');
app.phase(phases.upsertCourseMetrics, 'upsert_course_metrics');
app.phase(phases.upsertSpecializations, 'upsert_specializations');
app.phase(phases.upsertFeatures, 'upsert_features');
app.phase(phases.indexReviews, 'index_reviews');

app.use(compression());

app.use(text({ type: ['*/xml'], limit: '50mb' }));
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ limit: '50mb', extended: true }));

app.use(xframe('SAMEORIGIN'));
app.use(xssProtection(true));

app.use(middleware.cors());
appConfig.rateLimit && app.use(rateLimit({ windowMs: 500, max: 10 }));
app.use(middleware.morgan());
app.use(middleware.user());
app.use(middleware.features()); // depends on .user()

app.use(pp.middleware());
app.use('/pp', pp.router(handleStripeEvent));

app.use(middleware.error());
