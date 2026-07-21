export default function Spinner({ size = 'md', dark = false }) {
  const classes = ['spinner'];
  if (dark) classes.push('spinner-dark');
  if (size === 'lg') classes.push('spinner-lg');
  return <span className={classes.join(' ')} aria-hidden="true" />;
}
