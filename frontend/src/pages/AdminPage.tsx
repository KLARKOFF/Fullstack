import React, { useState } from 'react';
import type { MachineInput, MachineUpdate } from '../api';
import { MACHINE_STATUS_LABELS, MACHINE_TYPE_LABELS } from '../types';
import type { Laundry, Machine, MachineStatus, MachineType } from '../types';

interface AdminPageProps {
  laundry: Laundry | null;
  machines: Machine[];
  onRenameLaundry: (name: string) => Promise<void>;
  onCreateMachine: (data: MachineInput) => Promise<void>;
  onUpdateMachine: (id: string, patch: MachineUpdate) => Promise<void>;
  onDeleteMachine: (id: string) => Promise<void>;
}

const errorText = (e: unknown, fallback: string) =>
  e instanceof Error ? e.message : fallback;

const EDITABLE_STATUSES: MachineStatus[] = ['free', 'maintenance'];

export const AdminPage: React.FC<AdminPageProps> = ({
  laundry,
  machines,
  onRenameLaundry,
  onCreateMachine,
  onUpdateMachine,
  onDeleteMachine,
}) => {
  return (
    <div className="page page-wide">
      <h2 className="section-title">Админ-панель</h2>

      {laundry && (
        <LaundryForm key={laundry.name} initialName={laundry.name} onSave={onRenameLaundry} />
      )}

      <section className="panel">
        <h3 className="panel-title">Машины ({machines.length})</h3>

        {machines.length === 0 ? (
          <p className="muted">Машин пока нет. Добавьте первую с помощью формы ниже.</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Тип</th>
                  <th>Загрузка</th>
                  <th>Статус</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {machines.map((machine) => (
                  <MachineRow
                    key={machine.id}
                    machine={machine}
                    onUpdate={onUpdateMachine}
                    onDelete={onDeleteMachine}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AddMachineForm onCreate={onCreateMachine} />
    </div>
  );
};

interface LaundryFormProps {
  initialName: string;
  onSave: (name: string) => Promise<void>;
}

const LaundryForm: React.FC<LaundryFormProps> = ({ initialName, onSave }) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      await onSave(name);
    } catch (err) {
      setError(errorText(err, 'Не удалось сохранить название'));
      setIsSaving(false);
    }
  };

  return (
    <section className="panel">
      <h3 className="panel-title">Прачечная</h3>
      <form onSubmit={handleSubmit} className="form-inline">
        <label className="field field-grow">
          <span>Название прачечной или общежития</span>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
          />
        </label>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSaving || name.trim() === initialName}
        >
          Сохранить
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}
    </section>
  );
};

interface MachineRowProps {
  machine: Machine;
  onUpdate: (id: string, patch: MachineUpdate) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const MachineRow: React.FC<MachineRowProps> = ({ machine, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [type, setType] = useState<MachineType>(machine.type);
  const [capacity, setCapacity] = useState(String(machine.capacity));
  const [status, setStatus] = useState<MachineStatus>(machine.status);
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const isRunning = !EDITABLE_STATUSES.includes(machine.status);

  const startEditing = () => {
    setType(machine.type);
    setCapacity(String(machine.capacity));
    setStatus(machine.status);
    setError('');
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsBusy(true);
    setError('');
    try {
      const patch: MachineUpdate = { type, capacity: Number(capacity) };
      if (!isRunning) patch.status = status;
      await onUpdate(machine.id, patch);
      setIsEditing(false);
    } catch (err) {
      setError(errorText(err, 'Не удалось сохранить машину'));
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Удалить машину №${machine.id}? Её бронирования тоже будут удалены.`)) return;
    setIsBusy(true);
    try {
      await onDelete(machine.id);
    } catch (err) {
      setError(errorText(err, 'Не удалось удалить машину'));
      setIsBusy(false);
    }
  };

  if (!isEditing) {
    return (
      <>
        <tr>
          <td className="cell-number">{machine.id}</td>
          <td>{MACHINE_TYPE_LABELS[machine.type]}</td>
          <td>{machine.capacity} кг</td>
          <td>
            <span className={`status-pill status-${machine.status}`}>
              {MACHINE_STATUS_LABELS[machine.status]}
            </span>
          </td>
          <td className="cell-actions">
            <button className="btn btn-secondary btn-small" onClick={startEditing} disabled={isBusy}>
              Изменить
            </button>
            <button className="btn btn-danger btn-small" onClick={handleDelete} disabled={isBusy}>
              Удалить
            </button>
          </td>
        </tr>
        {error && (
          <tr>
            <td colSpan={5} className="form-error">{error}</td>
          </tr>
        )}
      </>
    );
  }

  return (
    <>
      <tr className="row-editing">
        <td className="cell-number">{machine.id}</td>
        <td>
          <select className="input" value={type} onChange={(e) => setType(e.target.value as MachineType)}>
            <option value="washer">{MACHINE_TYPE_LABELS.washer}</option>
            <option value="dryer">{MACHINE_TYPE_LABELS.dryer}</option>
          </select>
        </td>
        <td>
          <input
            className="input input-narrow"
            type="number"
            min={1}
            max={30}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </td>
        <td>
          {isRunning ? (
            <span className="muted" title="Статус изменится сам, когда цикл закончится">
              {MACHINE_STATUS_LABELS[machine.status]}
            </span>
          ) : (
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value as MachineStatus)}>
              {EDITABLE_STATUSES.map((s) => (
                <option key={s} value={s}>{MACHINE_STATUS_LABELS[s]}</option>
              ))}
            </select>
          )}
        </td>
        <td className="cell-actions">
          <button className="btn btn-primary btn-small" onClick={handleSave} disabled={isBusy}>
            Сохранить
          </button>
          <button className="btn btn-secondary btn-small" onClick={() => setIsEditing(false)} disabled={isBusy}>
            Отмена
          </button>
        </td>
      </tr>
      {error && (
        <tr>
          <td colSpan={5} className="form-error">{error}</td>
        </tr>
      )}
    </>
  );
};

interface AddMachineFormProps {
  onCreate: (data: MachineInput) => Promise<void>;
}

const AddMachineForm: React.FC<AddMachineFormProps> = ({ onCreate }) => {
  const [number, setNumber] = useState('');
  const [type, setType] = useState<MachineType>('washer');
  const [capacity, setCapacity] = useState('6');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      await onCreate({ id: number, type, capacity: Number(capacity), status: 'free' });
      setNumber('');
    } catch (err) {
      setError(errorText(err, 'Не удалось добавить машину'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="panel">
      <h3 className="panel-title">Добавить машину</h3>
      <form onSubmit={handleSubmit} className="form-inline">
        <label className="field">
          <span>Номер</span>
          <input
            className="input input-narrow"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="07"
            inputMode="numeric"
          />
        </label>
        <label className="field">
          <span>Тип</span>
          <select className="input" value={type} onChange={(e) => setType(e.target.value as MachineType)}>
            <option value="washer">{MACHINE_TYPE_LABELS.washer}</option>
            <option value="dryer">{MACHINE_TYPE_LABELS.dryer}</option>
          </select>
        </label>
        <label className="field">
          <span>Загрузка, кг</span>
          <input
            className="input input-narrow"
            type="number"
            min={1}
            max={30}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={isSaving || !number.trim()}>
          Добавить
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}
    </section>
  );
};
