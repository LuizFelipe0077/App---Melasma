import { GoogleSheetsRepository } from './GoogleSheetsRepository.js';
import { PacienteRepositoryInterface } from '../../application/repositories/PacienteRepositoryInterface.js';
import { PacienteMapper } from './PacienteMapper.js';
import { SheetColumns } from './GoogleSheetsColumns.js';

export class GoogleSheetsPacienteRepository extends GoogleSheetsRepository {
  constructor() {
    super('Pacientes');
  }

  async findById(id) {
    const rows = await this.readAllRows();
    const row = rows.find(r => r[SheetColumns.PACIENTE.ID] === id);
    if (!row) return null;
    return PacienteMapper.toDomain(row);
  }

  async findByEmail(email) {
    const rows = await this.readAllRows();
    const cleanEmail = email.trim().toLowerCase();
    const row = rows.find(r => r[SheetColumns.PACIENTE.EMAIL] && r[SheetColumns.PACIENTE.EMAIL].trim().toLowerCase() === cleanEmail);
    if (!row) return null;
    return PacienteMapper.toDomain(row);
  }

  async save(paciente) {
    const row = PacienteMapper.toRow(paciente);
    await this.writeRow(row, paciente.id.value, 0);
  }

  async update(paciente) {
    await this.save(paciente);
  }
}
