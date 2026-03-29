export interface ToastAction {
  label: string;
  type: string;
}

export interface ToastData {
  title: string;
  name?: string;
  info?: string;
  primaryAction: ToastAction | null;
  secondaryAction: ToastAction | null;
  onAction: (action: string) => void;
}
