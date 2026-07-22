import { GoogleSheetsRepository } from './GoogleSheetsRepository.js';
import { CheckinRepositoryInterface } from '../../application/repositories/CheckinRepositoryInterface.js';
import { CheckinMapper } from './CheckinMapper.js';
import { SheetColumns } from './GoogleSheetsColumns.js';

export class GoogleSheetsCheckinRepository extends GoogleSheetsRepository {
  constructor() {
    super('Check_Ins');
  }

  findById(id) {
    const rows = this.readAllRows();
    const row = rows.find(r => r[SheetColumns.CHECKIN.ID] === id);
    if (!row) return null;
    return CheckinMapper.toDomain(row);
  }

  findByPacienteId(pacienteId) {
    const rows = this.readAllRows();
    const matches = rows.filter(r => r[SheetColumns.CHECKIN.PACIENTE_ID] === pacienteId);
    return matches.map(r => CheckinMapper.toDomain(r)).filter(c => c !== null);
  }

  findByInterval(pacienteId, startDate, endDate) {
    const rows = this.readAllRows();
    const startMs = startDate.getTime();
    const endMs = endDate.getTime();

    const matches = rows.filter(r => {
      if (r[SheetColumns.CHECKIN.PACIENTE_ID] !== pacienteId) return false;
      const prescritaTime = new Date(r[SheetColumns.CHECKIN.DATA_HORA_PRESCRITA]).getTime();
      return prescritaTime >= startMs && prescritaTime <= endMs;
    });

    return matches.map(r => CheckinMapper.toDomain(r)).filter(c => c !== null);
  }

  save(checkin) {
    const row = CheckinMapper.toRow(checkin);
    this.writeRow(row, checkin.id.value, 0);
  }

  saveAll(checkins) {
    if (!checkins || checkins.length === 0) return;
    const rows = checkins.map(c => CheckinMapper.toRow(c));
    this.writeRowsBatch(rows);
  }

  update(checkin) {
    this.save(checkin);
  }
}
