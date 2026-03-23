import * as React from 'react';
import { appointments } from '@services/mockAppointments';
import type { Appointment } from '@types';

const Appointments: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>
      <ul>
        {appointments.map((appt: Appointment) => (
          <li key={appt.id} className="p-2 bg-white rounded shadow mb-2">
            {appt.patient} - {appt.date} ({appt.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appointments;