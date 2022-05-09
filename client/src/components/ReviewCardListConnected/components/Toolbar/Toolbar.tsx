import Typography from '@material-ui/core/Typography';
import React from 'react';
import Grow from 'src/components/Grow';
import Menu from 'src/components/Menu';
import { Option, ReviewSortKey as SortKey } from 'src/core';
import useBoolean from 'src/core/hooks/useBoolean';
import { WordsQuery } from 'src/graphql';

import AutocompleteFilter from '../AutocompleteFilter';
import DifficultyFilter from '../DifficultyFilter';
import FilterPopover from '../FilterPopover';
import SemesterFilter from '../SemesterFilter';
import ToolbarButton from '../ToolbarButton';
import WordCloud from '../WordCloud';
import { useStyles } from './Toolbar.styles';

export interface Props {
  words?: WordsQuery['words'];
  courseFilter?: string[];
  courseFilterOptions: Option[];
  onCourseFilterChange: (filter: string[]) => void;
  semesterFilter?: string[];
  semesterFilterOptions: Option[];
  onSemesterFilterChange: (filter: string[]) => void;
  difficultyFilter?: number[];
  difficultyFilterOptions: Option<number>[];
  onDifficultyFilterChange: (filter: number[]) => void;
  ratingFilter?: number[];
  ratingFilterOptions: Option<number>[];
  onRatingFilterChange: (filter: number[]) => void;
  sortKey?: SortKey;
  sortKeyOptions: Option<SortKey>[];
  onSortKeyChange: (key: SortKey) => void;
}

const Toolbar: React.FC<Props> = ({
  words,
  courseFilter,
  courseFilterOptions,
  onCourseFilterChange,
  semesterFilter,
  semesterFilterOptions,
  onSemesterFilterChange,
  difficultyFilter,
  difficultyFilterOptions,
  onDifficultyFilterChange,
  ratingFilter,
  ratingFilterOptions,
  onRatingFilterChange,
  sortKey,
  sortKeyOptions,
  onSortKeyChange,
}) => {
  const classes = useStyles();

  const {
    value: isCourseFilterOpen,
    setTrue: showCourseFilter,
    setFalse: hideCourseFilter,
  } = useBoolean(false);

  const {
    value: isSemesterFilterOpen,
    setTrue: showSemesterFilter,
    setFalse: hideSemesterFilter,
  } = useBoolean(false);

  const {
    value: isDifficultyFilterOpen,
    setTrue: showDifficultyFilter,
    setFalse: hideDifficultyFilter,
  } = useBoolean(false);

  const {
    value: isRatingFilterOpen,
    setTrue: showRatingFilter,
    setFalse: hideRatingFilter,
  } = useBoolean(false);

  const handleCourseFilterSubmit = (courseIds: string[]) => {
    onCourseFilterChange(courseIds);
    hideCourseFilter();
  };

  const handleSemesterFilterSubmit = (semesterIds: string[]) => {
    onSemesterFilterChange(semesterIds);
    hideSemesterFilter();
  };

  const handleDifficultyFilterSubmit = (difficulties: number[]) => {
    onDifficultyFilterChange(difficulties);
    hideDifficultyFilter();
  };

  const handleRatingFilterSubmit = (ratings: number[]) => {
    onRatingFilterChange(ratings);
    hideRatingFilter();
  };

  const sortKeyOption = sortKeyOptions.find(({ value }) => value === sortKey)!;

  return (
    <div className={classes.toolbar}>
      <WordCloud words={words} />

      <Grow />

      {courseFilterOptions.length > 0 && courseFilter != null && (
        <FilterPopover
          id="filter_by_courses"
          name="Courses"
          total={courseFilterOptions.length}
          selected={courseFilter.length}
          open={isCourseFilterOpen}
          onOpen={showCourseFilter}
          onClose={hideCourseFilter}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        >
          <AutocompleteFilter
            label="Courses"
            options={courseFilterOptions}
            initialValues={courseFilter}
            onSubmit={handleCourseFilterSubmit}
          />
        </FilterPopover>
      )}

      {semesterFilterOptions.length > 0 && semesterFilter != null && (
        <FilterPopover
          id="filter_by_semesters"
          name="Semesters"
          total={semesterFilterOptions.length}
          selected={semesterFilter.length}
          open={isSemesterFilterOpen}
          onOpen={showSemesterFilter}
          onClose={hideSemesterFilter}
        >
          <SemesterFilter
            options={semesterFilterOptions}
            initialValues={semesterFilter}
            onSubmit={handleSemesterFilterSubmit}
          />
        </FilterPopover>
      )}

      {difficultyFilterOptions.length > 0 && difficultyFilter != null && (
        <FilterPopover
          id="filter_by_difficulties"
          name="Difficulties"
          total={difficultyFilterOptions.length}
          selected={difficultyFilter.length}
          open={isDifficultyFilterOpen}
          onOpen={showDifficultyFilter}
          onClose={hideDifficultyFilter}
        >
          <DifficultyFilter
            options={difficultyFilterOptions}
            initialValues={difficultyFilter}
            onSubmit={handleDifficultyFilterSubmit}
          />
        </FilterPopover>
      )}

      {ratingFilterOptions.length > 0 && ratingFilter != null && (
        <FilterPopover
          id="filter_by_ratings"
          name="Ratings"
          total={ratingFilterOptions.length}
          selected={ratingFilter.length}
          open={isRatingFilterOpen}
          onOpen={showRatingFilter}
          onClose={hideRatingFilter}
        >
          <DifficultyFilter
            options={ratingFilterOptions}
            initialValues={ratingFilter}
            onSubmit={handleRatingFilterSubmit}
          />
        </FilterPopover>
      )}

      <Menu
        id="sort_by"
        renderTrigger={({ open, onOpen }) => (
          <ToolbarButton
            id="sort_by_trigger"
            caption={`Sort: ${sortKeyOption.label}`}
            open={open}
            onClick={onOpen}
          />
        )}
        items={sortKeyOptions.map(({ value, label }) => ({
          key: value,
          onClick: () => onSortKeyChange(value),
          caption: (
            <Typography
              className={sortKey === value ? classes.bold : undefined}
              data-cy={`sort_by:${value}`}
            >
              {label}
            </Typography>
          ),
        }))}
      />
    </div>
  );
};

export default Toolbar;
