// export const getStatusTone = (status) => {
//   switch (status?.toLowerCase()) {
//     case 'pending':
//       return 'warning';
//     case 'approved':
//     case 'completed':
//       return 'success';
//     case 'rejected':
//     case 'cancelled':
//       return 'critical';
//     case 'in progress':
//       return 'info';
//     default:
//       return 'default';
//   }
// };

export const getStatusTone = (status) => {
  const normalizedStatus = status?.toLowerCase();

  switch (normalizedStatus) {
    case 'pending':
      return 'attention';

    case 'in review':
    case 'in progress':
      return 'info';

    case 'approved':
    case 'fulfilled':
      return 'success';

    case 'completed':
    case 'shipped':
      case 'quoted':
        case 'submitted':
      return 'success';

    case 'cancelled':
    case 'rejected':
      return 'critical';

    case 'on hold':
      return 'warning';

    case 'draft':
      return 'default';

    default:
      return 'default';
  }
};
