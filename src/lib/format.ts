const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (date: Date) => dateFormat.format(date);

/** Rough reading time in minutes for a Markdown body. */
export const readingTime = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 220));
