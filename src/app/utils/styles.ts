// import { Status } from '../types/types';
import { QrStatus, WarrantyCaseResolutionType, WarrantyCaseStatus } from "../types/types";

export const getPriorityStyles = (priorityId: number) => {
  switch (priorityId) {
    case 4:
      return "bg-red-50 text-red-600 border border-red-100"; // urgent
    case 3:
      return "bg-orange-50 text-orange-600 border border-orange-100"; // high
    case 2:
      return "bg-slate-50 text-slate-600 border border-slate-100"; // medium
    case 1:
      return "bg-green-50 text-green-600 border border-green-100"; // low
    default:
      return "bg-slate-50 text-slate-600";
  }
};

// export const getStatusStyles = (status: Status) => {
//     switch (status) {
//         case 'New': return 'bg-blue-50 text-blue-600';
//         case 'In Progress': return 'bg-orange-50 text-orange-600';
//         case 'Waiting for Customer': return 'bg-purple-50 text-purple-600';
//         case 'Resolved': return 'bg-green-50 text-green-600';
//         case 'Closed': return 'bg-slate-100 text-slate-600';
//         default: return 'bg-slate-50 text-slate-600';
//     }
// };

export const getQrStatusLabel = (status: QrStatus, t: (key: string) => string) => {
  switch (status) {
    case QrStatus.EMPTY:
      return t("qrStatusEmpty");
    case QrStatus.PRODUCED:
      return t("qrStatusProduced");
    case QrStatus.ACTIVATED:
      return t("qrStatusActivated");
    case QrStatus.WARRANTY_CASE:
      return t("qrStatusWarrantyCase");
    case QrStatus.EXPIRED:
      return t("qrStatusExpired");
    case QrStatus.NONE:
    default:
      return t("qrStatusNone");
  }
};

export const getQrStatusColor = (status: QrStatus) => {
  switch (status) {
    case QrStatus.EMPTY:
      return "yellow";
    case QrStatus.PRODUCED:
      return "blue";
    case QrStatus.ACTIVATED:
      return "green";
    case QrStatus.WARRANTY_CASE:
      return "orange";
    case QrStatus.EXPIRED:
      return "red";
    case QrStatus.NONE:
    default:
      return "gray";
  }
};

export const getWarrantyCaseStatusLabel = (status: WarrantyCaseResolutionType, t: (key: string) => string) => {
  switch (status) {
    case WarrantyCaseResolutionType.REPAIR:
      return t("repair");
    case WarrantyCaseResolutionType.REPLACE:
      return t("replace");
    case WarrantyCaseResolutionType.REJECT:
      return t("reject");
    default:
      return t("caseStatusNone");
  }
};
export const getWarrantyCaseStatus = (status: WarrantyCaseStatus, t: (key: string) => string) => {
  switch (status) {
    case WarrantyCaseStatus.RECEIVED:
      return t("received");
    case WarrantyCaseStatus.PROCESSING:
      return t("processingCase");
    case WarrantyCaseStatus.COMPLETED:
      return t("completed");
    case WarrantyCaseStatus.REJECTED:
      return t("rejected");
    default:
      return t("caseStatusNone");
  }
};
export const getWarrantyCaseStatusLabelColor = (status: WarrantyCaseResolutionType) => {
  switch (status) {
    case WarrantyCaseResolutionType.REPAIR:
      return "yellow";
    case WarrantyCaseResolutionType.REPLACE:
      return "green";
    case WarrantyCaseResolutionType.REJECT:
      return "red";
    default:
      return "gray";
  }
};
export const getWarrantyCaseStatusColor = (status: WarrantyCaseStatus) => {
  switch (status) {
    case WarrantyCaseStatus.RECEIVED:
      return "yellow";
    case WarrantyCaseStatus.PROCESSING:
      return "blue";
    case WarrantyCaseStatus.COMPLETED:
      return "green";
    case WarrantyCaseStatus.REJECTED:
      return "red";
    default:
      return "gray";
  }
};


