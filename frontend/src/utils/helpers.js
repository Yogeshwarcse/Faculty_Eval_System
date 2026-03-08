export const avg = (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0;
export const ratingAvg = (feedbacks, key) => avg(feedbacks.map(f => f.ratings[key]));
export const overallAvg = (feedbacks) => {
  if (!feedbacks.length) return 0;
  const totals = feedbacks.map(f => (f.ratings.teaching + f.ratings.knowledge + f.ratings.communication + f.ratings.punctuality) / 4);
  return avg(totals);
};
