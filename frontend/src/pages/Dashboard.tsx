import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useRealtime } from '../hooks/useRealtime';
import { Clock, User, LogOut, CheckCircle, AlertCircle } from 'lucide-react';

interface Slot {
  time: string;
  isBooked: boolean;
}

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const currentProviderId = "provider-default-uuid-12345";

  const initializeSlots = () => {
    const hours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    return hours.map((h) => ({ time: h, isBooked: false }));
  };

  const loadAppointments = async () => {
    setLoading(true);

    try {
      const defaultSlots = initializeSlots();
      const response = await api.get('/appointments');

      const updatedSlots = defaultSlots.map((slot) => {
        const match = response.data.some((app: any) => {
          const appHour = new Date(app.date).getUTCHours() + ':00';
          const formattedAppHour =
            appHour.length === 4 ? '0' + appHour : appHour;

          return formattedAppHour === slot.time;
        });

        return { ...slot, isBooked: match };
      });

      setSlots(updatedSlots);
    } catch {
      setSlots(initializeSlots());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // 📌 REALTIME: appointment created
  const handleRealtimeUpdate = useCallback((payload: any) => {
    if (payload.providerId === currentProviderId) {
      const dateObj = new Date(payload.date);
      const hour = dateObj.getUTCHours() + ':00';
      const formattedHour =
        hour.length === 4 ? '0' + hour : hour;

      setSlots((prev) =>
        prev.map((slot) =>
          slot.time === formattedHour
            ? { ...slot, isBooked: true }
            : slot,
        ),
      );
    }
  }, []);

  // 📌 REALTIME: email sent
  const handleEmailSent = useCallback((payload: any) => {
    setMessage({
      type: 'success',
      text: payload.message || 'Email enviado com sucesso!',
    });
  }, []);

  useRealtime(handleRealtimeUpdate, handleEmailSent);

  const handleBooking = async (timeSlot: string) => {
    setMessage(null);

    try {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 1);

      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');

      const dateString = `${year}-${month}-${day}T${timeSlot}:00`;

      const timezoneOffsetInMinutes = targetDate.getTimezoneOffset();
      const offsetSign = timezoneOffsetInMinutes > 0 ? '-' : '+';
      const absOffsetMinutes = Math.abs(timezoneOffsetInMinutes);
      const offsetHours = String(
        Math.floor(absOffsetMinutes / 60),
      ).padStart(2, '0');
      const offsetMins = String(absOffsetMinutes % 60).padStart(
        2,
        '0',
      );

      const targetDateWithOffset = `${dateString}${offsetSign}${offsetHours}:${offsetMins}`;

      await api.post('/appointments', {
        date: targetDateWithOffset,
        providerId: currentProviderId,
      });

      setMessage({
        type: 'success',
        text: 'Agendamento realizado! Um email de confirmação será enviado.',
      });

      setSlots((prev) =>
        prev.map((s) =>
          s.time === timeSlot ? { ...s, isBooked: true } : s,
        ),
      );
    } catch (err: any) {
      const apiMessage = err.response?.data?.message;

      const errorMessage = Array.isArray(apiMessage)
        ? apiMessage.join(', ')
        : apiMessage || 'Erro ao realizar agendamento.';

      setMessage({ type: 'error', text: errorMessage });

      if (err.response?.status === 409) {
        setSlots((prev) =>
          prev.map((s) =>
            s.time === timeSlot ? { ...s, isBooked: true } : s,
          ),
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <Clock size={24} className="text-blue-600" />
          <span className="font-bold text-lg text-slate-800">
            Dashboard de Agendamento
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <User size={18} />
            <span className="text-sm font-medium">
              {user?.name}
            </span>
          </div>

          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Horários de Atendimento (Amanhã)
          </h2>
          <p className="text-slate-500 mt-1">
            Selecione um horário disponível.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="text-sm font-medium">
              {message.text}
            </span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-slate-500">
            Carregando horários...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {slots.map((slot) => (
              <div
                key={slot.time}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between h-32 ${
                  slot.isBooked
                    ? 'bg-slate-100 border-slate-200 opacity-60 pointer-events-none'
                    : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-800">
                    {slot.time}
                  </span>

                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      slot.isBooked
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {slot.isBooked ? 'Ocupado' : 'Disponível'}
                  </span>
                </div>

                <button
                  onClick={() => handleBooking(slot.time)}
                  disabled={slot.isBooked}
                  className={`w-full py-2 text-xs font-bold rounded-xl transition-colors ${
                    slot.isBooked
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {slot.isBooked ? 'Bloqueado' : 'Agendar'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};