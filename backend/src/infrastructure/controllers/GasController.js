import { GasRouter } from './GasRouter.js';
import { RateLimiter } from '../middlewares/RateLimiter.js';
import { InputSanitizer } from '../../shared/utils/InputSanitizer.js';
import { AuditLogger } from '../../shared/logging/AuditLogger.js';

/**
 * GasController.js
 * 
 * Controlador principal / Front Controller do Google Apps Script.
 * Refatorado na Sprint 2 para delegar responsabilidades, focando apenas
 * em parsing HTTP, sanitização, controle de taxa e roteamento genérico.
 */
export function handlePost(e) {
  let responseData;
  let statusCode = 200;

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Corpo de requisição POST ausente ou inválido.');
    }

    // Defesa em Profundidade: Rejeita payloads gigantes (CWE-400)
    const MAX_PAYLOAD_BYTES = 10240; // 10 KB
    if (e.postData.contents.length > MAX_PAYLOAD_BYTES) {
      throw new Error('Payload excede o tamanho máximo permitido.');
    }

    const rawPayload = JSON.parse(e.postData.contents);
    
    // Defesa em Profundidade: Sanitização Anti-XSS e Formula Injection
    const payload = InputSanitizer.sanitizeDTO(rawPayload);
    const action = payload.action;

    if (!action || typeof action !== 'string' || action.length > 50) {
      throw new Error('Ação inválida ou não especificada.');
    }

    // Rate Limiting unificado para todas as ações de Login
    if (action === 'login') {
      const loginKey = (payload.email || '').toLowerCase().trim();
      const rateCheck = RateLimiter.check(loginKey);
      
      if (!rateCheck.allowed) {
        AuditLogger.logSecurityEvent('SECURITY_LOCKOUT', loginKey, { motivo: 'Tentativas de login excedidas' });
        throw new Error(`Conta bloqueada temporariamente. Tente novamente após ${rateCheck.lockedUntilISO}.`);
      }

      try {
        payload.rawSenha = rawPayload.senha;
        responseData = GasRouter.route(action, payload);
        
        RateLimiter.recordSuccess(loginKey);
        AuditLogger.logSecurityEvent('SECURITY_LOGIN_SUCCESS', loginKey);
      } catch (loginError) {
        RateLimiter.recordFailure(loginKey);
        AuditLogger.logSecurityEvent('SECURITY_LOGIN_FAILURE', loginKey, { motivo: loginError.message });
        throw loginError;
      }
    } else {
      // Roteamento padrão (Sem ser login)
      responseData = GasRouter.route(action, payload);
    }

  } catch (error) {
    statusCode = error.message.includes('não autorizado') ||
                 error.message.includes('Token') ||
                 error.message.includes('bloqueada') ? 401 : 400;

    // Toda validação de negócio no domínio/aplicação lança `new Error(...)`
    // puro com uma mensagem já segura para exibir (nenhuma delas vaza
    // detalhe técnico — conferido em todo o backend). Uma exceção de
    // runtime não tratada (TypeError, ReferenceError etc.) é que indica um
    // bug de verdade, não uma validação intencional — só essa classe é
    // mascarada, e agora fica registrada (Stackdriver) em vez de descartada
    // silenciosamente como antes.
    const isIntentionalDomainError = statusCode === 401 || error.constructor === Error;

    if (!isIntentionalDomainError) {
      console.error('[GasController] Erro inesperado:', error.message, error.stack);
    }

    const safeMessage = isIntentionalDomainError
      ? error.message
      : 'Erro interno inesperado. Nossa equipe foi notificada — tente novamente em instantes.';

    responseData = {
      error: true,
      message: safeMessage
    };
  }

  return formatGasResponse(responseData, statusCode);
}

/**
 * Format GAS HTTP Response output.
 */
function formatGasResponse(data, statusCode) {
  const output = typeof ContentService !== 'undefined'
    ? ContentService.createTextOutput(JSON.stringify({ statusCode, data }))
    : JSON.stringify({ statusCode, data });

  if (typeof output !== 'string') {
    output.setMimeType(ContentService.MimeType.JSON);
  }
  return output;
}
