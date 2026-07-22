import { GoogleSheetsPacienteRepository } from '../repositories/GoogleSheetsPacienteRepository.js';
import { GoogleSheetsCheckinRepository } from '../repositories/GoogleSheetsCheckinRepository.js';
import { GoogleSheetsProtocoloRepository } from '../repositories/GoogleSheetsProtocoloRepository.js';
import { GoogleSheetsGamificacaoRepository } from '../repositories/GoogleSheetsGamificacaoRepository.js';
import { GoogleSheetsPermissaoRepository } from '../repositories/GoogleSheetsPermissaoRepository.js';
import { GoogleSheetsObservacaoRepository } from '../repositories/GoogleSheetsObservacaoRepository.js';
import { BcryptGasService } from '../services/BcryptGasService.js';
import { TokenService } from '../services/TokenService.js';

import { LoginUseCase } from '../../application/useCases/LoginUseCase.js';
import { CriarPacienteUseCase } from '../../application/useCases/CriarPacienteUseCase.js';
import { RegistrarCheckinUseCase } from '../../application/useCases/RegistrarCheckinUseCase.js';
import { CancelarCheckinUseCase } from '../../application/useCases/CancelarCheckinUseCase.js';
import { AdicionarSuplementoUseCase } from '../../application/useCases/AdicionarSuplementoUseCase.js';
import { EditarSuplementoUseCase } from '../../application/useCases/EditarSuplementoUseCase.js';
import { RemoverSuplementoUseCase } from '../../application/useCases/RemoverSuplementoUseCase.js';
import { LiberarEdicaoRetroativaUseCase } from '../../application/useCases/LiberarEdicaoRetroativaUseCase.js';
import { GerarDashboardUseCase } from '../../application/useCases/GerarDashboardUseCase.js';
import { ListarPacientesUseCase } from '../../application/useCases/ListarPacientesUseCase.js';
import { EditarPacienteUseCase } from '../../application/useCases/EditarPacienteUseCase.js';
import { ExcluirPacienteUseCase } from '../../application/useCases/ExcluirPacienteUseCase.js';
import { CriarObservacaoClinicaUseCase } from '../../application/useCases/CriarObservacaoClinicaUseCase.js';
import { ListarObservacoesClinicasUseCase } from '../../application/useCases/ListarObservacoesClinicasUseCase.js';
import { ListarPermissoesRetroativasUseCase } from '../../application/useCases/ListarPermissoesRetroativasUseCase.js';

/**
 * AppModule (IoC Container)
 * 
 * Centraliza a instanciação de todas as dependências do sistema.
 * Implementa um padrão Service Locator simples (Singleton) para injeção de dependência.
 */
class Container {
  constructor() {
    this.services = {};
    this.useCases = {};
  }

  getServices() {
    if (!this.services.initialized) {
      // Repositories
      this.services.pacienteRepository = new GoogleSheetsPacienteRepository();
      this.services.checkinRepository = new GoogleSheetsCheckinRepository();
      this.services.protocoloRepository = new GoogleSheetsProtocoloRepository();
      this.services.gamificacaoRepository = new GoogleSheetsGamificacaoRepository();
      this.services.permissaoRepository = new GoogleSheetsPermissaoRepository();
      this.services.observacaoRepository = new GoogleSheetsObservacaoRepository();

      // Infrastructure Services
      this.services.criptografiaService = new BcryptGasService();
      this.services.tokenService = new TokenService();

      this.services.initialized = true;
    }
    return this.services;
  }

  getUseCases() {
    if (!this.useCases.initialized) {
      const s = this.getServices();

      this.useCases.loginUseCase = new LoginUseCase(
        s.pacienteRepository, 
        s.criptografiaService, 
        s.tokenService
      );

      this.useCases.criarPacienteUseCase = new CriarPacienteUseCase(
        s.pacienteRepository, 
        s.criptografiaService,
        s.protocoloRepository,
        s.checkinRepository
      );

      this.useCases.registrarCheckinUseCase = new RegistrarCheckinUseCase(
        s.pacienteRepository, 
        s.protocoloRepository, 
        s.checkinRepository, 
        s.gamificacaoRepository,
        s.permissaoRepository
      );

      this.useCases.cancelarCheckinUseCase = new CancelarCheckinUseCase(
        s.checkinRepository,
        s.gamificacaoRepository
      );

      this.useCases.adicionarSuplementoUseCase = new AdicionarSuplementoUseCase(
        s.pacienteRepository,
        s.protocoloRepository
      );

      this.useCases.editarSuplementoUseCase = new EditarSuplementoUseCase(
        s.protocoloRepository
      );

      this.useCases.removerSuplementoUseCase = new RemoverSuplementoUseCase(
        s.protocoloRepository
      );

      this.useCases.liberarEdicaoRetroativaUseCase = new LiberarEdicaoRetroativaUseCase(
        s.pacienteRepository, 
        s.permissaoRepository
      );

      this.useCases.gerarDashboardUseCase = new GerarDashboardUseCase(
        s.pacienteRepository, 
        s.protocoloRepository, 
        s.checkinRepository,
        s.gamificacaoRepository
      );

      this.useCases.listarPacientesUseCase = new ListarPacientesUseCase(
        s.pacienteRepository,
        s.checkinRepository
      );

      this.useCases.editarPacienteUseCase = new EditarPacienteUseCase(
        s.pacienteRepository,
        s.criptografiaService
      );

      this.useCases.excluirPacienteUseCase = new ExcluirPacienteUseCase(
        s.pacienteRepository
      );

      this.useCases.criarObservacaoClinicaUseCase = new CriarObservacaoClinicaUseCase(
        s.pacienteRepository,
        s.observacaoRepository
      );

      this.useCases.listarObservacoesClinicasUseCase = new ListarObservacoesClinicasUseCase(
        s.observacaoRepository
      );

      this.useCases.listarPermissoesRetroativasUseCase = new ListarPermissoesRetroativasUseCase(
        s.permissaoRepository
      );

      this.useCases.initialized = true;
    }
    return this.useCases;
  }
}

export const AppModule = new Container();
