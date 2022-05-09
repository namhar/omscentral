import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Chip, { ChipProps } from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import { Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import EditIcon from '@material-ui/icons/Edit';
import LinkIcon from '@material-ui/icons/Link';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Markdown from 'react-markdown';
import { useHistory } from 'react-router';
import { Route, Router } from 'react-router-dom';
import { browserHistory, paths, reviewMeta } from 'src/constants';
import Season from 'src/core/components/Season';
import { ReviewsQuery } from 'src/graphql';

import Grow from '../Grow';
import Link from '../Link';
import ReportToggleIconButton from './components/ReportToggleIconButton';
import { useStyles } from './ReviewCard.styles';
import applyHighlighting from './utils/applyHighlighting';

type Review = ReviewsQuery['reviews'][0];

interface Props {
  review: Review;
  highlight?: string;
  deepLink: string;
  onLinkClick: () => void;
  onReportClick: () => void;
  disabled?: boolean;
}

const ReviewCard: React.FC<Props> = ({
  review,
  highlight,
  deepLink,
  onLinkClick,
  onReportClick,
  disabled = false,
}) => {
  const {
    id,
    is_mine,
    course,
    semester,
    difficulty: d,
    workload: w,
    rating: r,
    body,
    created,
  } = review;

  const classes = useStyles();
  const xs = useMediaQuery<Theme>((theme) => theme.breakpoints.down('xs'));
  const history = useHistory();

  const avatar = xs ? null : <Season season={semester.season} />;

  const title = xs ? course.id : `${course.id}: ${course.name}`;
  const subheader = new Date(created).toLocaleString();
  const difficulty = d && reviewMeta.translateDifficulty(d);
  const rating = r && reviewMeta.translateRating(r);
  const workload = w && `${w} hrs/wk`;

  const chips: Array<ChipProps & { tooltip: string; dataCy: string }> = [
    {
      className: (classes as any)[`difficulty${d}`],
      label: difficulty,
      tooltip: 'Difficulty',
      dataCy: 'review_card:difficulty',
    },
    {
      className: (classes as any)[`rating${r}`],
      label: rating,
      tooltip: 'Rating',
      dataCy: 'review_card:rating',
    },
    {
      label: workload,
      tooltip: 'Workload',
      dataCy: 'review_card:workload',
    },
  ].filter((chip) => Boolean(chip?.label));
  xs && chips.pop() && chips.pop();

  const handleEditClick = () => history.push(paths.review.update(id));
  const handleLinkClick = () => setTimeout(onLinkClick, 0);

  const action = xs ? null : is_mine ? (
    <IconButton
      onClick={handleEditClick}
      color="inherit"
      data-cy="review_card:edit_button"
      disabled={disabled}
    >
      <EditIcon />
    </IconButton>
  ) : (
    <>
      <CopyToClipboard text={deepLink} onCopy={handleLinkClick}>
        <Tooltip title="Copy link">
          <IconButton color="inherit">
            <LinkIcon />
          </IconButton>
        </Tooltip>
      </CopyToClipboard>
      <ReportToggleIconButton
        review={review}
        onClick={onReportClick}
        disabled={disabled}
      />
    </>
  );

  const titleUI = (
    <Router history={browserHistory}>
      <Route path={paths.course()}>
        {course.link ? (
          <Link to={course.link} className={classes.externalLink}>
            <OpenInNewIcon fontSize="small" />
            {title}
          </Link>
        ) : (
          title
        )}
      </Route>
      <Route path={[paths.reviews(), paths.userReviews]} exact>
        <Link to={paths.course(course.id)}>{title}</Link>
      </Route>
    </Router>
  );

  return (
    <Card className={classes.card} data-cy="review_card">
      <CardHeader
        className={classes.header}
        avatar={avatar}
        title={titleUI}
        subheader={subheader}
        action={action}
      />
      <CardContent className={classes.content} data-cy="review_card:content">
        {body ? (
          <Markdown>{applyHighlighting(body, highlight)}</Markdown>
        ) : (
          <Typography variant="body2" color="textSecondary" component="p">
            No commentary provided.
          </Typography>
        )}
      </CardContent>
      <CardActions className={classes.actions}>
        <Chip
          color="primary"
          data-cy="review_card:semester"
          label={semester.name}
          variant="outlined"
        />
        <Grow />
        {chips.map(({ tooltip, label, dataCy, ...rest }) => (
          <Tooltip title={tooltip} key={label!.toString()}>
            <Chip label={label} variant="outlined" {...rest} data-cy={dataCy} />
          </Tooltip>
        ))}
      </CardActions>
    </Card>
  );
};

export default ReviewCard;
