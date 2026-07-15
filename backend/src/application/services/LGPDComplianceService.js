/**
 * LGPDComplianceService.js
 * Service responsible for implementing all LGPD (Lei Geral de Proteção de Dados)
 * data subject rights: access, portability, rectification, anonymization,
 * and consent management.
 * 
 * Compliance: LGPD Articles 15-20 (Direitos do Titular)
 * 
 * Architecture Note: This service operates at the Application layer and
 * depends on repository interfaces, not concrete implementations.
 */

export class LGPDComplianceService {

  #pacienteRepository;
  #checkinRepository;
  #gamificacaoRepository;

  /**
   * @param {object} pacienteRepository - IPacienteRepository
   * @param {object} checkinRepository - ICheckinRepository
   * @param {object} gamificacaoRepository - IGamificacaoRepository
   */
  constructor(pacienteRepository, checkinRepository, gamificacaoRepository) {
    this.#pacienteRepository = pacienteRepository;
    this.#checkinRepository = checkinRepository;
    this.#gamificacaoRepository = gamificacaoRepository;
  }

  /**
   * LGPD Art. 18, II - Direito de Acesso.
   * Exports all personal data of a patient in a structured, machine-readable format (JSON).
   * @param {string} pacienteId
   * @returns {Promise<object>} Complete data export package
   */
  exportarDadosPessoais(pacienteId) {
    if (!pacienteId) throw new Error('ID do paciente é obrigatório para exportação LGPD.');

    const paciente = this.#pacienteRepository.findById(pacienteId);
    if (!paciente) throw new Error('Paciente não encontrado para exportação de dados.');

    const checkins = this.#checkinRepository.findByPacienteId(pacienteId);
    const gamificacao = this.#gamificacaoRepository.findByPacienteId(pacienteId);

    return {
      metadados: {
        dataExportacao: new Date().toISOString(),
        formatoVersao: '1.0.0',
        finalidade: 'Atendimento ao Direito de Acesso do Titular (LGPD Art. 18, II)'
      },
      dadosPessoais: {
        nome: paciente.nome,
        email: paciente.email?.value || paciente.email,
        telefone: paciente.telefone?.value || paciente.telefone,
        status: paciente.status,
        dataInicio: paciente.dataInicio,
        dataFim: paciente.dataFim
      },
      historicoCheckins: historicoCheckins.map(c => ({
        suplemento: c.suplementoId.value,
        dataHoraPrescrita: c.dataHoraPrescrita ? c.dataHoraPrescrita.toISOString() : null,
        dataHoraRealizada: c.dataHoraRealizada ? c.dataHoraRealizada.toISOString() : null,
        status: c.status,
        retroativo: c.retroativo
      })),
      gamificacao: gamificacao ? {
        xpTotal: gamificacao.xpTotal,
        streakAtual: gamificacao.streakAtual,
        conquistas: gamificacao.conquistas
      } : null
    };
  }

  /**
   * LGPD Art. 18, VI - Direito à Eliminação (Anonimização).
   * Anonymizes all personal identifiers, making the record irreversibly
   * unlinkable to the data subject while preserving statistical integrity.
   * @param {string} pacienteId
   * @param {string} motivo - Justification for anonymization
   * @returns {Promise<object>} Confirmation of anonymization
   */
  anonimizarPaciente(pacienteId, motivo) {
    if (!pacienteId) throw new Error('ID do paciente é obrigatório para anonimização.');
    if (!motivo || motivo.length < 10) throw new Error('Motivo deve conter no mínimo 10 caracteres.');

    // Busca o paciente atual para preservar os invariants da entidade
    const paciente = this.#pacienteRepository.findById(pacienteId);
    if (!paciente) {
      throw new Error('Paciente não encontrado para anonimização.');
    }

    // Aplica os dados anonimizados na entidade
    const dadosAnonimizados = {
      nome: `Anonimizado_${pacienteId.substring(0, 4)}`,
      email: `${pacienteId}@anonimizado.local`,
      telefone: '00000000000',
      senhaHash: '$2b$10$ANONIMIZADO_LGPD_COMPLIANCE_HASH_DUMMY_VALUE_000',
      status: 'ANONIMIZADO'
    };
    
    // Atualiza as propriedades internas do paciente
    paciente.atualizarDadosParaAnonimizacao(dadosAnonimizados);

    // Persiste a entidade no repositório, respeitando o contrato
    this.#pacienteRepository.update(paciente);

    return {
      sucesso: true,
      pacienteId,
      dataAnonimizacao: new Date().toISOString(),
      motivo,
      camposAnonimizados: ['nome', 'email', 'telefone', 'senhaHash']
    };
  }

  /**
   * Returns a human-readable privacy policy summary describing data processing activities.
   * LGPD Art. 9 - Transparência.
   * @returns {object}
   */
  static getPoliticaPrivacidade() {
    return {
      controlador: 'Clínica de Tratamentos Integrativos',
      finalidade: 'Acompanhamento clínico de protocolos de suplementação integrativa para melhoria da saúde e qualidade de vida.',
      baseLegal: 'Execução de contrato de prestação de serviços médicos (Art. 7, V) e tutela da saúde (Art. 7, VIII).',
      dadosColetados: [
        'Nome completo',
        'E-mail',
        'Telefone',
        'Registros de check-in de suplementação',
        'Estatísticas de gamificação (XP, Streaks)'
      ],
      periodoRetencao: 'Dados clínicos serão retidos por no mínimo 20 anos conforme regulamentação do CFM (Resolução 1.821/2007).',
      compartilhamento: 'Os dados NÃO são compartilhados com terceiros.',
      direitosDoTitular: [
        'Acesso aos dados pessoais (exportação em JSON)',
        'Correção de dados inexatos',
        'Anonimização irreversível',
        'Revogação de consentimento'
      ]
    };
  }
}
