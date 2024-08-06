import moment from 'moment';

// eslint-disable-next-line import/prefer-default-export
export function formatDate(dateString: string): string {
  return moment(dateString).format('YYYY-MM-DD HH:mm:ss');
}
