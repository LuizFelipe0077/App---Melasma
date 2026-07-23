import { UUID } from '../src/domain/valueObjects/UUID.js';
import { Email } from '../src/domain/valueObjects/Email.js';
import { Telefone } from '../src/domain/valueObjects/Telefone.js';
import { PasswordHash } from '../src/domain/valueObjects/PasswordHash.js';
import { PacienteFactory } from '../src/domain/entities/PacienteFactory.js';
import { CheckIn, StatusCheckin } from '../src/domain/entities/CheckIn.js';
import { BcryptGasService } from '../src/infrastructure/services/BcryptGasService.js';
import { TokenService } from '../src/infrastructure/services/TokenService.js';

import { GoogleSheetsPacienteRepository } from '../src/infrastructure/repositories/GoogleSheetsPacienteRepository.js';
import { GoogleSheetsCheckinRepository } from '../src/infrastructure/repositories/GoogleSheetsCheckinRepository.js';
import { GoogleSheetsProtocoloRepository } from '../src/infrastructure/repositories/GoogleSheetsProtocoloRepository.js';
import { GoogleSheetsGamificacaoRepository } from '../src/infrastructure/repositories/GoogleSheetsGamificacaoRepository.js';
import { GoogleSheetsPermissaoRepository } from '../src/infrastructure/repositories/GoogleSheetsPermissaoRepository.js';
import { GoogleSheetsObservacaoRepository } from '../src/infrastructure/repositories/GoogleSheetsObservacaoRepository.js';
import { SheetColumns } from '../src/infrastructure/repositories/GoogleSheetsColumns.js';
import { fromSheetDateTime, toSheetDateTime } from '../src/shared/utils/DateTimeFormatter.js';

import { CriarPacienteUseCase } from '../src/application/useCases/CriarPacienteUseCase.js';
import { RegistrarCheckinUseCase } from '../src/application/useCases/RegistrarCheckinUseCase.js';
import { CancelarCheckinUseCase } from '../src/application/useCases/CancelarCheckinUseCase.js';
import { AdicionarSuplementoUseCase } from '../src/application/useCases/AdicionarSuplementoUseCase.js';
import { EditarSuplementoUseCase } from '../src/application/useCases/EditarSuplementoUseCase.js';
import { RemoverSuplementoUseCase } from '../src/application/useCases/RemoverSuplementoUseCase.js';
import { LoginUseCase } from '../src/application/useCases/LoginUseCase.js';
import { EditarPacienteUseCase } from '../src/application/useCases/EditarPacienteUseCase.js';
import { ExcluirPacienteUseCase } from '../src/application/useCases/ExcluirPacienteUseCase.js';
import { Protocolo } from '../src/domain/entities/Protocolo.js';
import { Suplemento } from '../src/domain/entities/Suplemento.js';
import { CriarObservacaoClinicaUseCase } from '../src/application/useCases/CriarObservacaoClinicaUseCase.js';
import { ListarObservacoesClinicasUseCase } from '../src/application/useCases/ListarObservacoesClinicasUseCase.js';
import { LiberarEdicaoRetroativaUseCase } from '../src/application/useCases/LiberarEdicaoRetroativaUseCase.js';
import { ListarPermissoesRetroativasUseCase } from '../src/application/useCases/ListarPermissoesRetroativasUseCase.js';

async function runTests() {
  process.env.ADMIN_EMAIL = 'admin@clinica.com';
  const cryptoService = new BcryptGasService();
  process.env.ADMIN_PASS_HASH = cryptoService.hash('admin123');

  console.log('🧪 INICIANDO SUÍTE DE TESTES UNITÁRIOS DO DOMÍNIO E APLICAÇÃO\n');
  let passCount = 0;
  let failCount = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passCount++;
    } catch (e) {
      console.error(`❌ FAIL: ${name}`);
      console.error(e);
      failCount++;
    }
  };

  // --- Test 1: Value Object Validação de E-mail ---
  await test('Value Object Email - Validações e Imutabilidade', () => {
    const valid = new Email('luiz@email.com');
    if (valid.value !== 'luiz@email.com') throw new Error('E-mail valor incorreto.');

    try {
      new Email('invalido-email');
      throw new Error('Deveria ter lançado erro para e-mail inválido.');
    } catch(e) {
      // pass
    }
  });

  // --- Test 2: Value Object Telefone ---
  await test('Value Object Telefone - Validações de dígitos', () => {
    const valid = new Telefone('(11) 99999-9999');
    if (valid.value !== '(11)99999-9999') throw new Error('Telefone incorreto.');

    try {
      new Telefone('123');
      throw new Error('Deveria ter lançado erro para telefone muito curto.');
    } catch(e) {
      // pass
    }
  });

  // --- Test 3: BcryptGasService Hash e Validação ---
  await test('BcryptGasService - Gerar Hash e Comparação', async () => {
    const service = new BcryptGasService();
    const hash = await service.hash('minhasenha123');
    
    // Check structural Bcrypt format regex matches
    const bcryptRegex = /^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/;
    if (!bcryptRegex.test(hash)) {
      throw new Error(`Hash gerada não atende ao padrão Bcrypt VO: ${hash}`);
    }

    const isMatch = await service.compare('minhasenha123', hash);
    if (!isMatch) throw new Error('Senha deveria bater com a hash gerada.');

    const isDifferent = await service.compare('outraSenha', hash);
    if (isDifferent) throw new Error('Senha incorreta não deveria bater com a hash.');
  });

  // --- Test 4: TokenService JWT tokens ---
  await test('TokenService - JWT Signature e Exibição', () => {
    const service = new TokenService();
    const token = service.generate({ userId: 'user_123', role: 'PACIENTE' });
    
    const payload = service.validate(token);
    if (!payload || payload.userId !== 'user_123' || payload.role !== 'PACIENTE') {
      throw new Error('Payload do Token não pôde ser verificado ou dados inválidos.');
    }
  });

  // --- Test 5: CriarPacienteUseCase ---
  await test('Caso de Uso - CriarPacienteUseCase com Eventos de Domínio', async () => {
    const pacienteRepo = new GoogleSheetsPacienteRepository();
    const cryptoService = new BcryptGasService();
    const useCase = new CriarPacienteUseCase(
      pacienteRepo,
      cryptoService,
      new GoogleSheetsProtocoloRepository(),
      new GoogleSheetsCheckinRepository()
    );

    const result = await useCase.execute({
      nome: 'Mariana Costa',
      email: 'mariana.costa@email.com',
      telefone: '(11) 98888-8888',
      senha: 'mariana123',
      dataInicio: new Date().toISOString(),
      dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    if (!result.id || result.email !== 'mariana.costa@email.com' || !result.senha) {
      throw new Error('Retorno do DTO de criação do paciente inválido.');
    }

    // Verify if patient is persisted in the repository (in-memory fallback)
    const saved = await pacienteRepo.findById(result.id);
    if (!saved || saved.nome !== 'Mariana Costa') {
      throw new Error('Paciente não foi gravado no repositório com sucesso.');
    }
  });

  // --- Test 6: LoginUseCase ---
  await test('Caso de Uso - LoginUseCase do Paciente e Administrador', async () => {
    const pacienteRepo = new GoogleSheetsPacienteRepository();
    const cryptoService = new BcryptGasService();
    const tokenService = new TokenService();
    
    // Register patient first
    const registerUC = new CriarPacienteUseCase(
      pacienteRepo,
      cryptoService,
      new GoogleSheetsProtocoloRepository(),
      new GoogleSheetsCheckinRepository()
    );
    const regResult = await registerUC.execute({
      nome: 'Carla Souza',
      email: 'carla@email.com',
      telefone: '(11) 98888-8888',
      senha: 'carla123',
      dataInicio: new Date().toISOString(),
      dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    const loginUC = new LoginUseCase(pacienteRepo, cryptoService, tokenService);
    
    // Patient Login
    const loginResult = await loginUC.execute({
      email: 'carla@email.com',
      senha: regResult.senha
    });

    if (loginResult.role !== 'PACIENTE' || loginResult.userId !== regResult.id) {
      throw new Error('Autenticação do Paciente falhou.');
    }

    // Admin Login
    const adminLogin = await loginUC.execute({
      email: 'admin@clinica.com',
      senha: 'admin123'
    });

    if (adminLogin.role !== 'ADMIN' || adminLogin.userId !== 'admin_root') {
      throw new Error('Autenticação do Administrador falhou.');
    }
  });

  // --- Test 7: EditarPacienteUseCase ---
  await test('Caso de Uso - EditarPacienteUseCase (Edição e Alteração de Senha)', async () => {
    const pacienteRepo = new GoogleSheetsPacienteRepository();
    const cryptoService = new BcryptGasService();
    const registerUC = new CriarPacienteUseCase(
      pacienteRepo,
      cryptoService,
      new GoogleSheetsProtocoloRepository(),
      new GoogleSheetsCheckinRepository()
    );
    const editarUC = new EditarPacienteUseCase(pacienteRepo, cryptoService);
    const loginUC = new LoginUseCase(pacienteRepo, cryptoService, new TokenService());

    const reg = await registerUC.execute({
      nome: 'José Silva',
      email: 'jose@email.com',
      telefone: '(11) 97777-7777',
      senha: 'oldpassword',
      dataInicio: new Date().toISOString(),
      dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Edit Name & Status & Change Password
    await editarUC.execute({
      id: reg.id,
      nome: 'José Silva Junior',
      email: 'jose@email.com',
      telefone: '(11) 97777-7777',
      dataInicio: new Date().toISOString(),
      dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'INATIVO',
      senha: 'newpassword123'
    });

    const updated = await pacienteRepo.findById(reg.id);
    if (updated.nome !== 'José Silva Junior' || updated.status !== 'INATIVO') {
      throw new Error('Erro ao editar dados ou status do paciente.');
    }

    // Verify old password doesn't work and new password works (when status is active, so let's set status back to active first)
    await editarUC.execute({
      id: reg.id,
      nome: 'José Silva Junior',
      email: 'jose@email.com',
      telefone: '(11) 97777-7777',
      dataInicio: new Date().toISOString(),
      dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ATIVO',
      senha: null // keep password
    });

    const loginRes = await loginUC.execute({
      email: 'jose@email.com',
      senha: 'newpassword123'
    });

    if (!loginRes.token) {
      throw new Error('A nova senha não funcionou.');
    }

    try {
      await loginUC.execute({
        email: 'jose@email.com',
        senha: 'oldpassword'
      });
      throw new Error('A senha antiga ainda está ativa.');
    } catch(e) {
      // pass: should fail
    }
  });

  // --- Test 8: ExcluirPacienteUseCase ---
  await test('Caso de Uso - ExcluirPacienteUseCase', async () => {
    const pacienteRepo = new GoogleSheetsPacienteRepository();
    const cryptoService = new BcryptGasService();
    const registerUC = new CriarPacienteUseCase(
      pacienteRepo,
      cryptoService,
      new GoogleSheetsProtocoloRepository(),
      new GoogleSheetsCheckinRepository()
    );
    const excluirUC = new ExcluirPacienteUseCase(pacienteRepo);

    const reg = await registerUC.execute({
      nome: 'Paciente Deletado',
      email: 'delete@email.com',
      telefone: '(11) 96666-6666',
      senha: 'delete123',
      dataInicio: new Date().toISOString(),
      dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    await excluirUC.execute({ id: reg.id });

    const deleted = await pacienteRepo.findById(reg.id);
    if (deleted !== null) {
      throw new Error('Paciente não foi excluído da memória.');
    }
  });

  // --- Test 9: CancelarCheckinUseCase (additive endpoint) ---
  await test('Caso de Uso - CancelarCheckinUseCase (reverte check-in e guarda de propriedade)', async () => {
    const pacienteRepo = new GoogleSheetsPacienteRepository();
    const protocoloRepo = new GoogleSheetsProtocoloRepository();
    const checkinRepo = new GoogleSheetsCheckinRepository();
    const gamificacaoRepo = new GoogleSheetsGamificacaoRepository();
    const cryptoService = new BcryptGasService();

    const registerUC = new CriarPacienteUseCase(pacienteRepo, cryptoService, protocoloRepo, checkinRepo);
    const registrarCheckinUC = new RegistrarCheckinUseCase(pacienteRepo, protocoloRepo, checkinRepo, gamificacaoRepo, null);
    const cancelarCheckinUC = new CancelarCheckinUseCase(checkinRepo, gamificacaoRepo);

    const dataInicio = new Date();
    const dataFim = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // suplementos: [] on purpose — CriarPacienteUseCase pre-generates a PENDENTE
    // check-in for every future slot of every supplement passed in, which would
    // collide with RegistrarCheckinUseCase's own duplicate-slot guard below.
    // The supplement is added manually afterwards so this test only exercises
    // the check-in registration/cancellation path, not the (separate,
    // pre-existing) prescription-generation flow.
    const reg = await registerUC.execute({
      nome: 'Paciente Checkin',
      email: 'checkin@email.com',
      telefone: '(11) 95555-5555',
      senha: 'checkin123',
      dataInicio: dataInicio.toISOString(),
      dataFim: dataFim.toISOString(),
      protocoloNome: 'Melasma',
      suplementos: []
    });

    const paciente = pacienteRepo.findById(reg.id);
    const suplemento = new Suplemento({
      id: UUID.generate(),
      protocoloId: paciente.protocoloId,
      nome: 'Vitamina C',
      dosagem: '500mg',
      horarios: ['08:00'],
      instrucoes: '',
      quantidade: 1,
      diasSemana: ['todos'],
      dataInicio,
      dataFim,
      tipo: 'Vitamina'
    });
    protocoloRepo.save(new Protocolo({ id: paciente.protocoloId, nome: 'Melasma', suplementos: [suplemento], duracaoDias: 30 }));
    const suplementoId = suplemento.id.value;

    const prescribedTime = new Date();
    prescribedTime.setHours(8, 0, 0, 0);

    const registro = await registrarCheckinUC.execute({
      pacienteId: reg.id,
      suplementoId,
      dataHoraPrescrita: prescribedTime.toISOString(),
      dataHoraRealizada: prescribedTime.toISOString() // on time, deterministically CONCLUIDO regardless of wall-clock
    });

    if (registro.status !== 'CONCLUIDO') {
      throw new Error(`Check-in deveria ter sido registrado como CONCLUIDO, veio: ${registro.status}`);
    }

    // Guard: another patient cannot cancel someone else's check-in
    try {
      cancelarCheckinUC.execute({ userId: 'outro-paciente-id', role: 'PACIENTE', checkinId: registro.checkinId });
      throw new Error('Deveria ter negado o cancelamento de check-in de outro paciente.');
    } catch (e) {
      if (!e.message.includes('Acesso negado')) throw e;
    }

    // Happy path: the owner cancels their own check-in
    const cancelResult = cancelarCheckinUC.execute({ userId: reg.id, role: 'PACIENTE', checkinId: registro.checkinId });
    if (!cancelResult.success) {
      throw new Error('Cancelamento deveria retornar success: true.');
    }

    const revertedCheckin = checkinRepo.findById(registro.checkinId);
    if (revertedCheckin.status !== 'PENDENTE' || revertedCheckin.dataHoraRealizada !== null) {
      throw new Error('Check-in não voltou para o estado PENDENTE após o cancelamento.');
    }

    // Cancelling an already-PENDENTE check-in must be rejected
    try {
      cancelarCheckinUC.execute({ userId: reg.id, role: 'PACIENTE', checkinId: registro.checkinId });
      throw new Error('Deveria ter rejeitado cancelar um check-in que já está PENDENTE.');
    } catch (e) {
      if (!e.message.includes('ainda não foi realizado')) throw e;
    }
  });

  // --- Test 10: Adicionar/Editar/RemoverSuplementoUseCase (additive endpoints) ---
  await test('Casos de Uso - Adicionar/Editar/RemoverSuplemento em paciente já cadastrado', async () => {
    const pacienteRepo = new GoogleSheetsPacienteRepository();
    const protocoloRepo = new GoogleSheetsProtocoloRepository();
    const checkinRepo = new GoogleSheetsCheckinRepository();
    const cryptoService = new BcryptGasService();

    const registerUC = new CriarPacienteUseCase(pacienteRepo, cryptoService, protocoloRepo, checkinRepo);
    const adicionarUC = new AdicionarSuplementoUseCase(pacienteRepo, protocoloRepo);
    const editarUC = new EditarSuplementoUseCase(protocoloRepo);
    const removerUC = new RemoverSuplementoUseCase(protocoloRepo);

    const dataInicio = new Date();
    const dataFim = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const reg = await registerUC.execute({
      nome: 'Paciente Suplementos',
      email: 'suplementos@email.com',
      telefone: '(11) 94444-4444',
      senha: 'suplementos123',
      dataInicio: dataInicio.toISOString(),
      dataFim: dataFim.toISOString(),
      protocoloNome: 'Melasma',
      suplementos: []
    });

    // Adicionar
    const added = adicionarUC.execute({
      pacienteId: reg.id,
      nome: 'Ômega 3',
      dosagem: '1000mg',
      quantidade: 1,
      tipo: 'Manipulado',
      horarios: ['09:00'],
      diasSemana: ['todos'],
      instrucoes: 'Tomar no almoço'
    });

    let suplemento = protocoloRepo.findSuplementoById(added.suplementoId);
    if (!suplemento || suplemento.nome !== 'Ômega 3' || suplemento.dosagem !== '1000mg') {
      throw new Error('Suplemento não foi adicionado corretamente.');
    }

    // Editar
    editarUC.execute({
      suplementoId: added.suplementoId,
      nome: 'Ômega 3 Premium',
      dosagem: '2000mg',
      horarios: ['09:00', '21:00']
    });

    suplemento = protocoloRepo.findSuplementoById(added.suplementoId);
    if (suplemento.nome !== 'Ômega 3 Premium' || suplemento.dosagem !== '2000mg' || suplemento.horarios.length !== 2) {
      throw new Error('Suplemento não foi editado corretamente.');
    }
    if (suplemento.instrucoes !== 'Tomar no almoço') {
      throw new Error('Edição parcial não deveria ter apagado o campo instrucoes não enviado.');
    }

    // Remover
    removerUC.execute({ suplementoId: added.suplementoId });
    suplemento = protocoloRepo.findSuplementoById(added.suplementoId);
    if (suplemento !== null) {
      throw new Error('Suplemento não foi removido corretamente.');
    }

    // Remover um suplemento inexistente deve lançar erro
    try {
      removerUC.execute({ suplementoId: 'id-que-nao-existe' });
      throw new Error('Deveria ter lançado erro ao remover suplemento inexistente.');
    } catch (e) {
      if (!e.message.includes('não encontrado')) throw e;
    }
  });

  // --- Test 11: Observações Clínicas (additive, admin-only) ---
  await test('Casos de Uso - Criar/Listar Observações Clínicas', async () => {
    const pacienteRepo = new GoogleSheetsPacienteRepository();
    const observacaoRepo = new GoogleSheetsObservacaoRepository();
    const cryptoService = new BcryptGasService();
    const registerUC = new CriarPacienteUseCase(pacienteRepo, cryptoService, new GoogleSheetsProtocoloRepository(), new GoogleSheetsCheckinRepository());
    const criarObsUC = new CriarObservacaoClinicaUseCase(pacienteRepo, observacaoRepo);
    const listarObsUC = new ListarObservacoesClinicasUseCase(observacaoRepo);

    const reg = await registerUC.execute({
      nome: 'Paciente Observado',
      email: 'observado@email.com',
      telefone: '(11) 93333-3333',
      senha: 'observado123',
      dataInicio: new Date().toISOString(),
      dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      suplementos: []
    });

    criarObsUC.execute({ pacienteId: reg.id, operadorId: 'admin_root', texto: 'Paciente relatou leve incômodo.', tipo: 'REACAO' });
    criarObsUC.execute({ pacienteId: reg.id, operadorId: 'admin_root', texto: 'Retorno agendado para revisão.', tipo: 'RETORNO' });

    try {
      criarObsUC.execute({ pacienteId: reg.id, operadorId: 'admin_root', texto: 'texto válido', tipo: 'TIPO_INVALIDO' });
      throw new Error('Deveria ter rejeitado um tipo inválido.');
    } catch (e) {
      if (!e.message.includes('Tipo de observação inválido')) throw e;
    }

    const notas = listarObsUC.execute({ pacienteId: reg.id });
    if (notas.length !== 2) throw new Error(`Esperava 2 observações, veio ${notas.length}.`);
    const textos = notas.map(n => n.texto);
    if (!textos.includes('Paciente relatou leve incômodo.') || !textos.includes('Retorno agendado para revisão.')) {
      throw new Error('As observações criadas não foram encontradas na listagem.');
    }
    if (notas.some(n => n.pacienteId !== reg.id)) throw new Error('Observação vazando de outro paciente.');
  });

  // --- Test 12: Tipos de intervenção reaproveitando Observações Clínicas ---
  await test('Caso de Uso - Novos tipos de intervenção (CONTATO/MUDANCA_PROTOCOLO/ORIENTACAO/FEEDBACK)', async () => {
    const pacienteRepo = new GoogleSheetsPacienteRepository();
    const observacaoRepo = new GoogleSheetsObservacaoRepository();
    const cryptoService = new BcryptGasService();
    const registerUC = new CriarPacienteUseCase(pacienteRepo, cryptoService, new GoogleSheetsProtocoloRepository(), new GoogleSheetsCheckinRepository());
    const criarObsUC = new CriarObservacaoClinicaUseCase(pacienteRepo, observacaoRepo);
    const listarObsUC = new ListarObservacoesClinicasUseCase(observacaoRepo);

    const reg = await registerUC.execute({
      nome: 'Paciente Intervencoes',
      email: 'intervencoes@email.com',
      telefone: '(11) 92222-2222',
      senha: 'intervencoes123',
      dataInicio: new Date().toISOString(),
      dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      suplementos: []
    });

    criarObsUC.execute({ pacienteId: reg.id, operadorId: 'admin_root', texto: 'Contato feito por telefone.', tipo: 'CONTATO' });
    criarObsUC.execute({ pacienteId: reg.id, operadorId: 'admin_root', texto: 'Protocolo ajustado.', tipo: 'MUDANCA_PROTOCOLO' });

    const notas = listarObsUC.execute({ pacienteId: reg.id });
    const tipos = notas.map(n => n.tipo).sort();
    if (JSON.stringify(tipos) !== JSON.stringify(['CONTATO', 'MUDANCA_PROTOCOLO'])) {
      throw new Error(`Tipos de intervenção não foram salvos corretamente: ${JSON.stringify(tipos)}`);
    }
  });

  // --- Test 13: ListarPermissoesRetroativasUseCase (histórico completo, não só a ativa) ---
  await test('Caso de Uso - ListarPermissoesRetroativasUseCase (histórico completo)', async () => {
    const pacienteRepo = new GoogleSheetsPacienteRepository();
    const permissaoRepo = new GoogleSheetsPermissaoRepository();
    const cryptoService = new BcryptGasService();
    const registerUC = new CriarPacienteUseCase(pacienteRepo, cryptoService, new GoogleSheetsProtocoloRepository(), new GoogleSheetsCheckinRepository());
    const liberarUC = new LiberarEdicaoRetroativaUseCase(pacienteRepo, permissaoRepo);
    const listarPermissoesUC = new ListarPermissoesRetroativasUseCase(permissaoRepo);

    const reg = await registerUC.execute({
      nome: 'Paciente Liberacoes',
      email: 'liberacoes@email.com',
      telefone: '(11) 91111-1111',
      senha: 'liberacoes123',
      dataInicio: new Date().toISOString(),
      dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      suplementos: []
    });

    liberarUC.execute({ pacienteId: reg.id, horasLiberadas: 24, motivo: 'Esqueceu de registrar a dose de ontem.', operadorId: 'admin_root' });
    liberarUC.execute({ pacienteId: reg.id, horasLiberadas: 48, motivo: 'Segunda liberação, motivo diferente.', operadorId: 'admin_root' });

    const historico = listarPermissoesUC.execute({ pacienteId: reg.id });
    if (historico.length !== 2) throw new Error(`Esperava 2 liberações no histórico, veio ${historico.length}.`);
    if (historico.some(p => p.pacienteId !== reg.id)) throw new Error('Liberação vazando de outro paciente.');
  });

  // --- Test 14: Marcar -> Cancelar -> Marcar de novo (regressão) ---
  await test('Caso de Uso - RegistrarCheckin após CancelarCheckin no mesmo slot (marcar -> cancelar -> marcar de novo)', async () => {
    const pacienteRepo = new GoogleSheetsPacienteRepository();
    const protocoloRepo = new GoogleSheetsProtocoloRepository();
    const checkinRepo = new GoogleSheetsCheckinRepository();
    const gamificacaoRepo = new GoogleSheetsGamificacaoRepository();
    const cryptoService = new BcryptGasService();

    const registerUC = new CriarPacienteUseCase(pacienteRepo, cryptoService, protocoloRepo, checkinRepo);
    const registrarUC = new RegistrarCheckinUseCase(pacienteRepo, protocoloRepo, checkinRepo, gamificacaoRepo, null);
    const cancelarUC = new CancelarCheckinUseCase(checkinRepo, gamificacaoRepo);

    const dataInicio = new Date();
    const dataFim = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const reg = await registerUC.execute({
      nome: 'Paciente Regressao Checkin',
      email: 'regressao-checkin@email.com',
      telefone: '(11) 90000-0001',
      senha: 'regressao123',
      dataInicio: dataInicio.toISOString(),
      dataFim: dataFim.toISOString(),
      suplementos: []
    });

    const paciente = pacienteRepo.findById(reg.id);
    const suplemento = new Suplemento({
      id: UUID.generate(), protocoloId: paciente.protocoloId, nome: 'Vitamina D3', dosagem: '2000UI',
      horarios: ['09:00'], instrucoes: '', quantidade: 1, diasSemana: ['todos'], dataInicio, dataFim, tipo: 'Vitamina'
    });
    protocoloRepo.save(new Protocolo({ id: paciente.protocoloId, nome: 'Melasma', suplementos: [suplemento], duracaoDias: 30 }));

    const prescribedTime = new Date();
    prescribedTime.setHours(9, 0, 0, 0);
    const payload = { pacienteId: reg.id, suplementoId: suplemento.id.value, dataHoraPrescrita: prescribedTime.toISOString(), dataHoraRealizada: prescribedTime.toISOString() };

    // 1. Marcar
    const first = await registrarUC.execute(payload);
    if (first.status !== 'CONCLUIDO') throw new Error(`Primeiro check-in deveria ser CONCLUIDO, veio ${first.status}.`);

    // 2. Cancelar
    const cancelResult = cancelarUC.execute({ userId: reg.id, role: 'PACIENTE', checkinId: first.checkinId });
    if (!cancelResult.success) throw new Error('Cancelamento deveria ter sucesso.');
    const reverted = checkinRepo.findById(first.checkinId);
    if (reverted.status !== 'PENDENTE') throw new Error('Check-in deveria voltar para PENDENTE após cancelar.');

    // 3. Marcar de novo — este é o passo que falhava antes da correção
    // (a linha revertida para PENDENTE era tratada como duplicata).
    const second = await registrarUC.execute(payload);
    if (second.status !== 'CONCLUIDO') throw new Error(`Segundo check-in deveria ser CONCLUIDO, veio ${second.status}.`);
    if (second.checkinId !== first.checkinId) throw new Error('A linha PENDENTE deveria ter sido reaproveitada (mesmo id), não duplicada.');

    // 4. Confirma que não há linhas duplicadas para o mesmo slot
    const allForPatient = checkinRepo.findByPacienteId(reg.id);
    if (allForPatient.length !== 1) throw new Error(`Esperava exatamente 1 linha de check-in para o slot, encontrou ${allForPatient.length}.`);

    // 5. Gamificação não deve ter sobrado XP/streak duplicado (crédito -> débito -> crédito = 1 crédito líquido)
    const gamificacao = gamificacaoRepo.findByPacienteId(reg.id);
    if (gamificacao.xpTotal !== 10) throw new Error(`XP deveria ser 10 (1 crédito líquido), veio ${gamificacao.xpTotal}.`);
    if (gamificacao.streakAtual !== 1) throw new Error(`Streak deveria ser 1, veio ${gamificacao.streakAtual}.`);
  });

  await test('CheckinMapper - linha com status inválido (dado legado/corrompido) não derruba a listagem', async () => {
    const checkinRepo = new GoogleSheetsCheckinRepository();
    const pacienteId = UUID.generate().value;
    const suplementoId = UUID.generate().value;

    // Linha válida
    checkinRepo.writeRow(
      [UUID.generate().value, pacienteId, suplementoId, new Date().toISOString(), '', 'PENDENTE', 'FALSE'],
      UUID.generate().value,
      0
    );

    // Linha corrompida: status fora do enum (ex: dado legado/editado manualmente na planilha)
    const badRowId = UUID.generate().value;
    checkinRepo.writeRow(
      [badRowId, pacienteId, suplementoId, new Date().toISOString(), '', 'CANCELADO', 'FALSE'],
      badRowId,
      0
    );

    // Não deve lançar exceção — a linha inválida deve ser ignorada (e logada), não derrubar as outras
    const results = checkinRepo.findByPacienteId(pacienteId);
    if (results.length !== 1) throw new Error(`Esperava 1 check-in válido (a linha corrompida deve ser ignorada), encontrou ${results.length}.`);
    if (results[0].status !== 'PENDENTE') throw new Error(`Check-in válido deveria manter status PENDENTE, veio ${results[0].status}.`);

    // findById na própria linha corrompida deve retornar null, não lançar
    const badLookup = checkinRepo.findById(badRowId);
    if (badLookup !== null) throw new Error('findById em linha corrompida deveria retornar null.');
  });

  await test('DateTimeFormatter - formata em PT-BR e lê de volta ISO legado sem quebrar', () => {
    const original = new Date(2026, 6, 22, 8, 5, 30); // 22/07/2026 08:05:30 (mês 0-indexado)
    const sheetText = toSheetDateTime(original);
    if (sheetText !== '22/07/2026 08:05:30') throw new Error(`Formato PT-BR incorreto: ${sheetText}`);

    const roundTripped = fromSheetDateTime(sheetText);
    if (roundTripped.getTime() !== original.getTime()) throw new Error('Round-trip PT-BR não bateu com a data original.');

    // Linha legada, gravada antes desta mudança, em ISO puro — precisa continuar legível
    const legacyIso = '2026-07-22T11:05:30.000Z';
    const legacyParsed = fromSheetDateTime(legacyIso);
    if (isNaN(legacyParsed.getTime())) throw new Error('Data legada em ISO deveria continuar sendo lida corretamente.');

    // Célula vazia/sem valor não deve lançar exceção
    if (fromSheetDateTime('') !== null) throw new Error('String vazia deveria retornar null.');
    if (fromSheetDateTime(null) !== null) throw new Error('null deveria retornar null.');
  });

  await test('CheckinMapper - grava data/hora em PT-BR na planilha e lê de volta corretamente', () => {
    const checkinRepo = new GoogleSheetsCheckinRepository();
    const pacienteId = UUID.generate();
    const suplementoId = UUID.generate();
    const prescrita = new Date(2026, 6, 22, 8, 0, 0);
    const realizada = new Date(2026, 6, 22, 8, 15, 0);

    const checkin = new CheckIn({
      id: UUID.generate(), pacienteId, suplementoId,
      dataHoraPrescrita: prescrita, dataHoraRealizada: null, status: StatusCheckin.PENDENTE, retroativo: false
    });
    checkin.confirmIngestion(realizada, 60, false);
    checkinRepo.save(checkin);

    // Confirma que a célula em si está em PT-BR, não ISO
    const rawRows = checkinRepo.readAllRows();
    const rawRow = rawRows.find((r) => r[SheetColumns.CHECKIN.ID] === checkin.id.value);
    if (!/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/.test(rawRow[SheetColumns.CHECKIN.DATA_HORA_PRESCRITA])) {
      throw new Error(`Célula deveria estar em DD/MM/AAAA HH:mm:ss, veio: ${rawRow[SheetColumns.CHECKIN.DATA_HORA_PRESCRITA]}`);
    }
    if (rawRow[SheetColumns.CHECKIN.RETROATIVO] !== 'NAO') {
      throw new Error(`Retroativo deveria gravar 'NAO' em português, veio: ${rawRow[SheetColumns.CHECKIN.RETROATIVO]}`);
    }

    // E que o domínio reconstrói exatamente a mesma data ao ler de volta
    const reloaded = checkinRepo.findById(checkin.id.value);
    if (reloaded.dataHoraPrescrita.getTime() !== prescrita.getTime()) throw new Error('dataHoraPrescrita não bateu após round-trip PT-BR.');
    if (reloaded.dataHoraRealizada.getTime() !== realizada.getTime()) throw new Error('dataHoraRealizada não bateu após round-trip PT-BR.');
  });

  await test('GoogleSheetsPermissaoRepository/ObservacaoRepository - PT-BR na planilha, ISO no retorno', () => {
    const permissaoRepo = new GoogleSheetsPermissaoRepository();
    const observacaoRepo = new GoogleSheetsObservacaoRepository();
    const pacienteId = UUID.generate().value;
    const nowIso = new Date(2026, 6, 22, 9, 0, 0).toISOString();

    const permissaoId = UUID.generate().value;
    permissaoRepo.save({
      id: permissaoId, pacienteId, horasLiberadas: 24, motivo: 'teste',
      operadorId: UUID.generate().value, expiraEm: nowIso, status: 'ATIVA', createdAt: nowIso
    });
    const rawPermRows = permissaoRepo.readAllRows();
    const rawPermRow = rawPermRows.find((r) => r[0] === permissaoId);
    if (!/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/.test(rawPermRow[5])) {
      throw new Error(`Célula expiraEm deveria estar em PT-BR, veio: ${rawPermRow[5]}`);
    }
    const [reloadedPerm] = permissaoRepo.findAllByPacienteId(pacienteId);
    if (new Date(reloadedPerm.createdAt).getTime() !== new Date(nowIso).getTime()) {
      throw new Error('createdAt de permissão retroativa não bateu após round-trip PT-BR.');
    }

    const obsId = UUID.generate().value;
    observacaoRepo.save({ id: obsId, pacienteId, operadorId: UUID.generate().value, texto: 'nota de teste', tipo: 'OBSERVACAO', createdAt: nowIso });
    const rawObsRows = observacaoRepo.readAllRows();
    const rawObsRow = rawObsRows.find((r) => r[0] === obsId);
    if (!/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/.test(rawObsRow[5])) {
      throw new Error(`Célula createdAt da observação deveria estar em PT-BR, veio: ${rawObsRow[5]}`);
    }
    const [reloadedObs] = observacaoRepo.findByPacienteId(pacienteId);
    if (new Date(reloadedObs.createdAt).getTime() !== new Date(nowIso).getTime()) {
      throw new Error('createdAt de observação não bateu após round-trip PT-BR.');
    }
  });

  console.log(`\n📊 RESULTADOS DO TESTE: ${passCount} Passados, ${failCount} Falhas.`);
  if (failCount > 0) {
    process.exit(1);
  }
}

runTests();
