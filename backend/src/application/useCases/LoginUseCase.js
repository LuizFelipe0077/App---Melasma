import { SystemConfiguration } from '../../shared/config/SystemConfiguration.js';

export class LoginUseCase {
  #pacienteRepository;
  #criptografiaService;
  #tokenService;

  constructor(pacienteRepository, criptografiaService, tokenService) {
    this.#pacienteRepository = pacienteRepository;
    this.#criptografiaService = criptografiaService;
    this.#tokenService = tokenService;
  }

  /**
   * Authenticates a user (Patient or Administrator).
   * @param {object} input DTO (email, senha)
   * @returns {Promise<object>} output DTO (token, role, userId, nome)
   */
  execute({ email, senha }) {
    console.log(`[AUTH LOG] Recebeu login: ${email}`);
    console.log(`[AUTH LOG] Recebeu senha.`);

    if (!email || !senha) {
      console.error('[AUTH LOG] Falha: E-mail ou senha ausentes.');
      throw new Error('E-mail e senha são obrigatórios.');
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check for Admin Login
    // Read admin email from secure config
    const adminEmail = typeof PropertiesService !== 'undefined'
      ? PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL')
      : process.env.ADMIN_EMAIL;
      
    if (adminEmail && cleanEmail === adminEmail.toLowerCase().trim()) {
      console.log('[AUTH LOG] Identificado e-mail de Administrador.');
      // Read admin password hash from secure config
      const adminPassHash = typeof PropertiesService !== 'undefined'
        ? PropertiesService.getScriptProperties().getProperty('ADMIN_PASS_HASH')
        : process.env.ADMIN_PASS_HASH;
        
      if (!adminPassHash) {
        console.error('[AUTH LOG] Falha: Ambiente não configurado para acesso administrativo.');
        throw new Error('Ambiente não configurado para acesso administrativo.');
      }
      
      const isMatch = this.#criptografiaService.compare(senha, adminPassHash);
      
      if (!isMatch) {
        console.error('[AUTH LOG] Falha: Senha do Administrador incorreta.');
        // Security: Use generic message to prevent user enumeration (CWE-204)
        throw new Error('Credenciais inválidas.');
      }

      console.log('[AUTH LOG] Senha correta (Administrador). Criando sessão...');
      const token = this.#tokenService.generate({ userId: 'admin_root', email: cleanEmail, role: 'ADMIN' });
      return {
        token,
        role: 'ADMIN',
        userId: 'admin_root',
        nome: 'Clínico Administrador'
      };
    }

    // 2. Patient Login Flow
    console.log('[AUTH LOG] Identificado e-mail de Paciente. Buscando no banco...');
    const paciente = this.#pacienteRepository.findByEmail(cleanEmail);
    if (!paciente) {
      console.error('[AUTH LOG] Falha: Usuário não encontrado no banco de dados.');
      // Security: Use generic message to prevent user enumeration (CWE-204)
      throw new Error('Credenciais inválidas.');
    }

    console.log(`[AUTH LOG] Encontrou usuário: ${paciente.nome}`);

    // Check domain permissions (inactive, suspended, date expiration)
    try {
      paciente.validarStatusPermissaoLogin();
    } catch (permError) {
      console.error(`[AUTH LOG] Falha: Bloqueio de permissão - ${permError.message}`);
      throw permError;
    }

    // Verify Password
    const passwordMatch = this.#criptografiaService.compare(senha, paciente.senhaHash.value);
    if (!passwordMatch) {
      console.error('[AUTH LOG] Falha: Senha do paciente incorreta.');
      // Security: Use generic message identical to 'email not found' (CWE-204)
      throw new Error('Credenciais inválidas.');
    }

    console.log('[AUTH LOG] Senha correta (Paciente). Criando sessão...');
    // Generate Session Token
    const token = this.#tokenService.generate({
      userId: paciente.id.value,
      email: paciente.email.value,
      role: 'PACIENTE'
    });

    return {
      token,
      role: 'PACIENTE',
      userId: paciente.id.value,
      nome: paciente.nome,
      protocoloNome: paciente.protocoloNome
    };
  }
}
