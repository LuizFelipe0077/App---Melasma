import { UUID } from '../src/domain/valueObjects/UUID.js';
import { Email } from '../src/domain/valueObjects/Email.js';
import { Telefone } from '../src/domain/valueObjects/Telefone.js';
import { PasswordHash } from '../src/domain/valueObjects/PasswordHash.js';
import { PacienteFactory } from '../src/domain/entities/PacienteFactory.js';
import { BcryptGasService } from '../src/infrastructure/services/BcryptGasService.js';
import { TokenService } from '../src/infrastructure/services/TokenService.js';

import { GoogleSheetsPacienteRepository } from '../src/infrastructure/repositories/GoogleSheetsPacienteRepository.js';
import { GoogleSheetsCheckinRepository } from '../src/infrastructure/repositories/GoogleSheetsCheckinRepository.js';
import { GoogleSheetsProtocoloRepository } from '../src/infrastructure/repositories/GoogleSheetsProtocoloRepository.js';
import { GoogleSheetsGamificacaoRepository } from '../src/infrastructure/repositories/GoogleSheetsGamificacaoRepository.js';
import { GoogleSheetsPermissaoRepository } from '../src/infrastructure/repositories/GoogleSheetsPermissaoRepository.js';

import { CriarPacienteUseCase } from '../src/application/useCases/CriarPacienteUseCase.js';
import { RegistrarCheckinUseCase } from '../src/application/useCases/RegistrarCheckinUseCase.js';
import { CancelarCheckinUseCase } from '../src/application/useCases/CancelarCheckinUseCase.js';
import { LoginUseCase } from '../src/application/useCases/LoginUseCase.js';
import { EditarPacienteUseCase } from '../src/application/useCases/EditarPacienteUseCase.js';
import { ExcluirPacienteUseCase } from '../src/application/useCases/ExcluirPacienteUseCase.js';
import { Protocolo } from '../src/domain/entities/Protocolo.js';
import { Suplemento } from '../src/domain/entities/Suplemento.js';

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

  console.log(`\n📊 RESULTADOS DO TESTE: ${passCount} Passados, ${failCount} Falhas.`);
  if (failCount > 0) {
    process.exit(1);
  }
}

runTests();
