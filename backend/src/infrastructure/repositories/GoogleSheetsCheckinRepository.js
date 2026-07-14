import { GoogleSheetsRepository } from './GoogleSheetsRepository.js';
import { CheckinRepositoryInterface } from '../../application/repositories/CheckinRepositoryInterface.js';
import { CheckinMapper } from './CheckinMapper.js';
import { SheetColumns } from './GoogleSheetsColumns.js';

export class GoogleSheetsCheckinRepository extends GoogleSheetsRepository {
  constructor() {
    super('Check_Ins');
  }

  async findById(id) {
    const rows = await this.readAllRows();
    const row = rows.find(r => r[SheetColumns.CHECKIN.ID] === id);
    if (!row) return null;
    return CheckinMapper.toDomain(row);
  }

  async findByPacienteId(pacienteId) {
    const rows = await this.readAllRows();
    const matches = rows.filter(r => r[SheetColumns.CHECKIN.PACIENTE_ID] === pacienteId);
    return matches.map(r => CheckinMapper.toDomain(r));
  }

  async findByInterval(pacienteId, startDate, endDate) {
    const rows = await this.readAllRows();
    const startMs = startDate.getTime();
    const endMs = endDate.getTime();

    const matches = rows.filter(r => {
      if (r[SheetColumns.CHECKIN.PACIENTE_ID] !== pacienteId) return false;
      const prescritaTime = new Date(r[SheetColumns.CHECKIN.DATA_HORA_PRESCRITA]).getTime();
      return prescritaTime >= startMs && prescritaTime <= endMs;
    });

    return matches.map(r => CheckinMapper.toDomain(r));
  }

  async save(checkin) {
    const row = CheckinMapper.toRow(checkin);
    await this.writeRow(row, checkin.id.value, 0);
  }

  async update(checkin) {
    await this.save(checkin);
  }
}
