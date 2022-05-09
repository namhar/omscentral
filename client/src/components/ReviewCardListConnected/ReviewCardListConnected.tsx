import Grid from '@material-ui/core/Grid';
import React from 'react';
import { ReviewSortKey as SortKey } from 'src/core';
import { ReviewsQuery, WordsQuery } from 'src/graphql';

import ReviewCardList from '../ReviewCardList';
import Visibility from '../Visibility';
import Toolbar from './components/Toolbar';

interface Props {
  reviews?: ReviewsQuery['reviews'];
  words?: WordsQuery['words'];
  onReportClick: (id: string) => void;
  courseFilter?: string[];
  onCourseFilterChange: (filter: string[]) => void;
  semesterFilter?: string[];
  onSemesterFilterChange: (filter: string[]) => void;
  difficultyFilter?: number[];
  onDifficultyFilterChange: (filter: number[]) => void;
  ratingFilter?: number[];
  onRatingFilterChange: (filter: number[]) => void;
  sortKey?: SortKey;
  onSortKeyChange: (key: SortKey) => void;
  onLoadMore?: () => void;
  loading?: boolean;
  before?: JSX.Element;
  toolbar?: boolean;
  highlight?: string;
}

const ReviewCardListConnected: React.FC<Props> = ({
  reviews,
  words,
  onReportClick,
  courseFilter,
  onCourseFilterChange,
  semesterFilter,
  onSemesterFilterChange,
  difficultyFilter,
  onDifficultyFilterChange,
  ratingFilter,
  onRatingFilterChange,
  sortKey,
  onSortKeyChange,
  onLoadMore,
  loading,
  before,
  toolbar = true,
  highlight,
}) => (
  <ReviewCardList
    loading={loading}
    reviews={reviews}
    onReportClick={onReportClick}
    highlight={highlight}
    before={
      <Grid container spacing={2}>
        {before != null && (
          <Grid item xs={12}>
            {before}
          </Grid>
        )}
        {toolbar && (
          <Grid item xs={12}>
            <Toolbar
              words={words}
              courseFilter={courseFilter}
              onCourseFilterChange={onCourseFilterChange}
              semesterFilter={semesterFilter}
              onSemesterFilterChange={onSemesterFilterChange}
              difficultyFilter={difficultyFilter}
              onDifficultyFilterChange={onDifficultyFilterChange}
              ratingFilter={ratingFilter}
              onRatingFilterChange={onRatingFilterChange}
              sortKey={sortKey}
              onSortKeyChange={onSortKeyChange}
            />
          </Grid>
        )}
      </Grid>
    }
    after={<Visibility onVisible={onLoadMore} />}
  />
);

export default ReviewCardListConnected;
