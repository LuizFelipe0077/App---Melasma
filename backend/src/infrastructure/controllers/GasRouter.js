import { AppModule } from '../ioc/AppModule.js';

/**
 * GasRouter.js
 * 
 * Implementa o Padrão Command / Router Pattern para evitar God Objects.
 * Mapeia as ações (actions) recebidas no payload para seus respectivos manipuladores.
 */
export class GasRouter {
  static getHandlers() {
    const useCases = AppModule.getUseCases();
    const services = AppModule.getServices();

    return {
      'login': (payload) => {
        return useCases.loginUseCase.execute({
          email: payload.email,
          senha: payload.rawSenha // Passed separately to avoid logging
        });
      },

      'criarPaciente': (payload) => {
        GasRouter._verifyAdminToken(payload.token, services.tokenService);
        return useCases.criarPacienteUseCase.execute({
          nome: payload.nome,
          email: payload.email,
          telefone: payload.telefone,
          dataInicio: payload.dataInicio,
          dataFim: payload.dataFim
        });
      },

      'registrarCheckin': (payload) => {
        const user = GasRouter._verifyToken(payload.token, services.tokenService);
        return useCases.registrarCheckinUseCase.execute({
          pacienteId: user.role === 'ADMIN' ? payload.pacienteId : user.userId,
          suplementoId: payload.suplementoId,
          dataHoraPrescrita: payload.dataHoraPrescrita,
          dataHoraRealizada: payload.dataHoraRealizada,
          forceRetroactive: payload.forceRetroactive || false
        });
      },

      'liberarEdicaoRetroativa': (payload) => {
        const adminUser = GasRouter._verifyAdminToken(payload.token, services.tokenService);
        return useCases.liberarEdicaoRetroativaUseCase.execute({
          pacienteId: payload.pacienteId,
          horasLiberadas: Number(payload.horasLiberadas),
          motivo: payload.motivo,
          operadorId: adminUser.userId
        });
      },

      'gerarDashboard': (payload) => {
        const authUser = GasRouter._verifyToken(payload.token, services.tokenService);
        return useCases.gerarDashboardUseCase.execute({
          pacienteId: authUser.role === 'ADMIN' ? payload.pacienteId : authUser.userId,
          dataInicio: payload.dataInicio,
          dataFim: payload.dataFim
        });
      },

      'listarPacientes': (payload) => {
        GasRouter._verifyAdminToken(payload.token, services.tokenService);
        return useCases.listarPacientesUseCase.execute();
      }
    };
  }

  /**
   * Executa uma ação roteada.
   */
  static route(action, payload) {
    const handlers = GasRouter.getHandlers();
    const handler = handlers[action];
    
    if (!handler) {
      throw new Error(`Ação desconhecida ou inválida: ${action}`);
    }

    return handler(payload);
  }

  // Helpers de verificação de token transferidos para cá para manter o controlador limpo.
  static _verifyToken(token, tokenService) {
    const decoded = tokenService.validate(token);
    if (!decoded) {
      throw new Error('Token de sessão expirado ou inválido. Faça login novamente.');
    }
    return decoded;
  }

  static _verifyAdminToken(token, tokenService) {
    const decoded = GasRouter._verifyToken(token, tokenService);
    if (decoded.role !== 'ADMIN') {
      throw new Error('Acesso negado. Ação restrita a administradores.');
    }
    return decoded;
  }
}
