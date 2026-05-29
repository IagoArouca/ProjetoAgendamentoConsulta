import { useEffect } from 'react';
import { socket } from '../services/socket';
import { useAuthStore } from '../store/authStore';

interface RealtimePayload {
  providerId: string;
  date: string;
  status: 'BOOKED';
}

export const useRealtime = (
  onAppointmentCreated: (payload: RealtimePayload) => void,
  onEmailSent?: (payload: any) => void,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      socket.connect();

      socket.on('appointment_created', onAppointmentCreated);

      if (onEmailSent) {
        socket.on('email_sent', onEmailSent);
      }
    }

    return () => {
      socket.off('appointment_created', onAppointmentCreated);

      if (onEmailSent) {
        socket.off('email_sent', onEmailSent);
      }

      socket.disconnect();
    };
  }, [isAuthenticated, onAppointmentCreated, onEmailSent]);
};