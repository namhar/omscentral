import moment from 'moment';
import { PartialModelObject as PMO } from 'objection';

import { FeatureAlias, FeatureStatus, PricingTier } from '../../src/enums';
import { Feature } from '../../src/models';

export const features: PMO<Feature>[] = [
  // free
  {
    id: FeatureAlias.SomeReviews,
    alias: FeatureAlias.SomeReviews,
    name: 'Access to some reviews',
    description: `This is the default access to reviews, allowing you to see reviews authored >2 years ago. For access to all reviews, sign up for any of our subscription plans. In this tier, you are also able to see all aggregate metrics for CS-6035.`,
    pricing_tier: null,
    release_date: 0,
    status: FeatureStatus.On,
  },

  // .Basic
  {
    id: FeatureAlias.AllReviews,
    alias: FeatureAlias.AllReviews,
    name: 'Access to all reviews',
    description: `With this feature, you can see all reviews as they are published. To ensure low-bandwidth users have a positive experience, reviews are paginated (page size: 10).`,
    pricing_tier: PricingTier.Basic,
    release_date: 0,
    status: FeatureStatus.On,
  },
  {
    id: FeatureAlias.Filtering,
    alias: FeatureAlias.Filtering,
    name: 'Filtering',
    description: `With this feature, you can filter reviews by courses, semesters, difficulties, and ratings. You can also customize the order in which reviews are displayed.`,
    pricing_tier: PricingTier.Basic,
    release_date: 0,
    status: FeatureStatus.On,
  },
  {
    id: FeatureAlias.Sorting,
    alias: FeatureAlias.Sorting,
    name: 'Sorting',
    description: `With this feature, you can sort courses and reviews in the UI.`,
    pricing_tier: PricingTier.Basic,
    release_date: 0,
    status: FeatureStatus.On,
  },

  // .Standard
  {
    id: FeatureAlias.Search,
    alias: FeatureAlias.Search,
    name: 'Searching',
    description: `With this feature, you can search for reviews with custom queries, allowing you to quickly find the most relevant reviews.`,
    pricing_tier: PricingTier.Standard,
    release_date: 0,
    status: FeatureStatus.On,
  },
  {
    id: FeatureAlias.Specializations,
    alias: FeatureAlias.Specializations,
    name: 'Visualize specializations',
    description: `With this feature, you can view the breakdown of courses for each OMS specialization, allowing you to easily see which courses you want to take to satisfy various specialization requirements.`,
    pricing_tier: PricingTier.Standard,
    release_date: 0,
    status: FeatureStatus.On,
  },
  {
    id: FeatureAlias.WordCloud,
    alias: FeatureAlias.WordCloud,
    name: 'Word clouds',
    description: `With this feature, you can see the review word clouds for each course.`,
    pricing_tier: PricingTier.Standard,
    release_date: 0,
    status: FeatureStatus.On,
  },

  // .Premium
  {
    id: FeatureAlias.Metrics,
    alias: FeatureAlias.Metrics,
    name: 'Aggregate metrics',
    description: `With this feature, you can see aggregate metrics for all courses, including mean, median, mode for difficulty, workload, and rating.`,
    pricing_tier: PricingTier.Premium,
    release_date: 0,
    status: FeatureStatus.On,
  },
  {
    id: FeatureAlias.Trends,
    alias: FeatureAlias.Trends,
    name: 'Visualize trends over time',
    description: `With this feature, you can see charts that visualize the aggregate metrics' trends over time (e.g. is a course becoming higher or lower workload over time).`,
    pricing_tier: PricingTier.Premium,
    release_date: 0,
    status: FeatureStatus.On,
  },
  {
    id: FeatureAlias.EarlyAccess,
    alias: FeatureAlias.EarlyAccess,
    name: 'Early access to new features',
    description: `With this, you will be granted priority access to new features.`,
    pricing_tier: PricingTier.Premium,
    release_date: 0,
    status: FeatureStatus.On,
  },

  // end of 2022 Q2
  {
    id: FeatureAlias.Reactions,
    alias: FeatureAlias.Reactions,
    name: 'Review reactions',
    description: `With this feature, you'll be able to share your reaction reviews to improve rankings.`,
    pricing_tier: PricingTier.Basic,
    release_date: moment.utc('2022-07-01').valueOf(),
    status: FeatureStatus.Off,
  },
  {
    id: FeatureAlias.Notifications,
    alias: FeatureAlias.Notifications,
    name: 'Realtime notifications',
    description: ``,
    pricing_tier: PricingTier.Standard,
    release_date: moment.utc('2022-07-01').valueOf(),
    status: FeatureStatus.Off,
  },
  {
    id: FeatureAlias.RepliesComments,
    alias: FeatureAlias.RepliesComments,
    name: 'Review replies & comments',
    description: `With this feature, you'll be able to post a reply to a review. This will inform the review author by email, and they can choose to reply to your comment. Everything remains anonymous, unless you choose to be public.`,
    pricing_tier: PricingTier.Premium,
    release_date: moment.utc('2022-07-01').valueOf(),
    status: FeatureStatus.Off,
  },

  // end of 2022 Q3
  {
    id: FeatureAlias.Notes,
    alias: FeatureAlias.Notes,
    name: 'Course notes',
    description: `With this feature, you'll be able to purchase course notes directly in OMSCentral at a discounted rate.`,
    pricing_tier: PricingTier.Basic,
    release_date: moment.utc('2022-10-01').valueOf(),
    status: FeatureStatus.Off,
  },
  {
    id: FeatureAlias.Enrollments,
    alias: FeatureAlias.Enrollments,
    name: 'Course enrollments',
    description: `With this feature, you'll be able to see historical enrollment data for courses to get an idea of how quickly they fill up, how full they become, whether they have waitlists, and the like.`,
    pricing_tier: PricingTier.Standard,
    release_date: moment.utc('2022-10-01').valueOf(),
    status: FeatureStatus.Off,
  },
  {
    id: FeatureAlias.Grades,
    alias: FeatureAlias.Grades,
    name: 'Course grades',
    description: `With this feature, you'll be able to see metrics around grades, grade distributions, and the like to help you make more informed decisions.`,
    pricing_tier: PricingTier.Premium,
    release_date: moment.utc('2022-10-01').valueOf(),
    status: FeatureStatus.Off,
  },

  // end of 2022 Q4
  {
    id: FeatureAlias.NLP,
    alias: FeatureAlias.NLP,
    name: 'NLP insights',
    description: `With this feature, you'll be able to group similar reviews based on dimensions such as sentiment. For example, what if you could find split reviews into favorable vs. unfavorable ones to detect bias?`,
    pricing_tier: PricingTier.Basic,
    release_date: moment.utc('2023-01-01').valueOf(),
    status: FeatureStatus.Off,
  },
  {
    id: FeatureAlias.WhatIf,
    alias: FeatureAlias.WhatIf,
    name: 'Schedule optimizer',
    description: `With this feature, you'll be equipped to chart a plan for your entire OMS curriculum in a one-stop shop. In the future, you'll even be able to share this with your fellow classmates (with a revenue sharing model, of course).`,
    pricing_tier: PricingTier.Standard,
    release_date: moment.utc('2023-01-01').valueOf(),
    status: FeatureStatus.Off,
  },
  {
    id: FeatureAlias.Crypto,
    alias: FeatureAlias.Crypto,
    name: 'Crypto: $OMS token economy & NFTs on the blockchain',
    description: `With this feature, OMSCentral will become a marketplace where you can participate to earn rewards ($OMS tokens). These rewards can be redeemed for your OMSCentral subscription, to purchase course notes, and much more.`,
    pricing_tier: PricingTier.Premium,
    release_date: moment.utc('2023-01-01').valueOf(),
    status: FeatureStatus.Off,
  },
];
