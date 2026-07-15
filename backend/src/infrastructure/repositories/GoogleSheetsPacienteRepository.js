import { GoogleSheetsRepository } from './GoogleSheetsRepository.js';
import { PacienteRepositoryInterface } from '../../application/repositories/PacienteRepositoryInterface.js';
import { PacienteMapper } from './PacienteMapper.js';
import { SheetColumns } from './GoogleSheetsColumns.js';

export class GoogleSheetsPacienteRepository extends GoogleSheetsRepository {
  constructor() {
    super('Pacientes');
  }

  findById(id) {
    const rows = this.readAllRows();
    const row = rows.find(r => r[SheetColumns.PACIENTE.ID] === id);
    if (!row) return null;
    return PacienteMapper.toDomain(row);
  }

  findByEmail(email) {
    const rows = this.readAllRows();
    const cleanEmail = email.trim().toLowerCase();
    const row = rows.find(r => r[SheetColumns.PACIENTE.EMAIL] && r[SheetColumns.PACIENTE.EMAIL].trim().toLowerCase() === cleanEmail);
    if (!row) return null;
    return PacienteMapper.toDomain(row);
  }

  save(paciente) {
    const row = PacienteMapper.toRow(paciente);
    this.writeRow(row, paciente.id.value, 0);
  }

  update(paciente) {
    this.save(paciente);
  }

  delete(id) {
    this.deleteRow(id, 0);
  }
}
