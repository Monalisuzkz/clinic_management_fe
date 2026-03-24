import * as React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import './HealthRecords.css';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: 'M' | 'F';
  email: string;
  phone: string;
  allergies: string;
  diagnosis: string;
  notes: string;
}

const mockPatients: Patient[] = [
  {
    id: 1,
    name: 'John Doe',
    age: 45,
    gender: 'M',
    email: 'john@email.com',
    phone: '555-1234',
    allergies: 'Penicillin',
    diagnosis: 'Hypertension',
    notes: 'Blood pressure improving with medication',
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 32,
    gender: 'F',
    email: 'jane@email.com',
    phone: '555-5678',
    allergies: 'None',
    diagnosis: 'Diabetes Type 2',
    notes: 'Under regular monitoring',
  },
];

const HealthRecords: React.FC = () => {
  const [patients, setPatients] = React.useState(mockPatients);
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);

  const handleDelete = (id: number) => {
    setPatients(patients.filter((p) => p.id !== id));
  };

  
  return (
    <>
      {/* Header */}
      <div className="healthrecords-header">
        <h1 className="healthrecords-title">E-Health Records</h1>
        <p className="healthrecords-subtitle">Centralized patient medical history</p>
      </div>
    <div>
        <button className="btn-primary">
          <Plus size={18} /> Add New Patient
        </button>
      </div>

      <div className="records-layout">
        {/* Patient List */}
        <div className="patient-list">
          <h2>Patients</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Diagnosis</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.diagnosis}</td>
                  <td>
                    <button onClick={() => setSelectedPatient(patient)}>View</button>
                    <button onClick={() => handleDelete(patient.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Patient Details */}
        {selectedPatient && (
          <div className="patient-details">
            <h2>Patient Details</h2>
            <div className="detail-grid">
              <div>
                <label>Name:</label>
                <p>{selectedPatient.name}</p>
              </div>
              <div>
                <label>Age:</label>
                <p>{selectedPatient.age}</p>
              </div>
              <div>
                <label>Gender:</label>
                <p>{selectedPatient.gender}</p>
              </div>
              <div>
                <label>Email:</label>
                <p>{selectedPatient.email}</p>
              </div>
              <div>
                <label>Phone:</label>
                <p>{selectedPatient.phone}</p>
              </div>
              <div>
                <label>Allergies:</label>
                <p>{selectedPatient.allergies}</p>
              </div>
              <div>
                <label>Diagnosis:</label>
                <p>{selectedPatient.diagnosis}</p>
              </div>
              <div>
                <label>Notes:</label>
                <p>{selectedPatient.notes}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HealthRecords;