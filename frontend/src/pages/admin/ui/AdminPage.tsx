import { useLaundry } from '@/entities/laundry';
import { useMachines } from '@/entities/machine';
import { AddMachineForm, EditableMachineRow } from '@/features/manage-machines';
import { RenameLaundryForm } from '@/features/rename-laundry';
import { EmptyState, ErrorState, Skeleton } from '@/shared/ui';

export function AdminPage() {
  return (
    <div className="page page-wide">
      <h2 className="section-title">Админ-панель</h2>

      <section className="panel">
        <h3 className="panel-title">Прачечная</h3>
        <LaundrySettings />
      </section>

      <section className="panel">
        <MachinesTable />
      </section>

      <section className="panel">
        <h3 className="panel-title">Добавить машину</h3>
        <AddMachineForm />
      </section>
    </div>
  );
}

function LaundrySettings() {
  const { laundry, status, error, reload } = useLaundry();

  if (status === 'loading') return <Skeleton height="36px" />;
  if (status === 'error' || !laundry) return <ErrorState message={error} onRetry={reload} />;

  // key: после сохранения форма пересоздаётся с новым названием
  return <RenameLaundryForm key={laundry.name} initialName={laundry.name} />;
}

const SKELETON_ROWS = 4;

function MachinesTable() {
  const { machines, status, error, reload } = useMachines();

  return (
    <>
      <h3 className="panel-title">Машины{status === 'success' && ` (${machines.length})`}</h3>

      {status === 'error' ? (
        <ErrorState message={error} onRetry={reload} />
      ) : status === 'success' && machines.length === 0 ? (
        <EmptyState icon="🧺" title="Машин пока нет" description="Добавьте первую с помощью формы ниже." />
      ) : (
        <div className="table-wrapper">
          <table className="admin-table" aria-busy={status === 'loading'}>
            <thead>
              <tr>
                <th>№</th>
                <th>Тип</th>
                <th>Загрузка</th>
                <th>Статус</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {status === 'loading'
                ? Array.from({ length: SKELETON_ROWS }, (_, i) => (
                    <tr key={i} aria-hidden="true">
                      <td colSpan={5}>
                        <Skeleton height="20px" />
                      </td>
                    </tr>
                  ))
                : machines.map((machine) => <EditableMachineRow key={machine.id} machine={machine} />)}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
