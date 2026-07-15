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
    if (!email || !senha) {
      throw new Error('E-mail e senha são obrigatórios.');
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check for Admin Login
    // Read admin email from secure config
    const adminEmail = typeof PropertiesService !== 'undefined'
      ? PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL')
      : null;
      
    if (adminEmail && cleanEmail === adminEmail.toLowerCase().trim()) {
      // Read admin password hash from secure config
      const adminPassHash = typeof PropertiesService !== 'undefined'
        ? PropertiesService.getScriptProperties().getProperty('ADMIN_PASS_HASH')
        : null;
        
      if (!adminPassHash) {
        throw new Error('Ambiente não configurado para acesso administrativo.');
      }
      
      const isMatch = this.#criptografiaService.compare(senha, adminPassHash);
      
      if (!isMatch) {
        // Security: Use generic message to prevent user enumeration (CWE-204)
        throw new Error('Credenciais inválidas.');
      }

      const token = this.#tokenService.generate({ userId: 'admin_root', email: cleanEmail, role: 'ADMIN' });
      return {
        token,
        role: 'ADMIN',
        userId: 'admin_root',
        nome: 'Clínico Administrador'
      };
    }

    // 2. Patient Login Flow
    const paciente = this.#pacienteRepository.findByEmail(cleanEmail);
    if (!paciente) {
      // Security: Use generic message to prevent user enumeration (CWE-204)
      throw new Error('Credenciais inválidas.');
    }

    // Check domain permissions (inactive, suspended, date expiration)
    paciente.validarStatusPermissaoLogin();

    // Verify Password
    const passwordMatch = this.#criptografiaService.compare(senha, paciente.senhaHash.value);
    if (!passwordMatch) {
      // Security: Use generic message identical to 'email not found' (CWE-204)
      throw new Error('Credenciais inválidas.');
    }

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
      nome: paciente.nome
    };
  }
}
