/**
 * doPost(e)
 * Global entrypoint for Google Apps Script WebApp POST requests.
 */
function doPost(e) {
}
/**
 * doGet(e)
 * Global entrypoint for Google Apps Script WebApp GET requests.
 * Used for status checking and health check verification.
 */
function doGet(e) {
}
/**
 * setup()
 * Manual trigger function to initialize the spreadsheet database structure.
 * Clinical administrators run this function once from the GAS Editor after deployment.
 */
function setup() {
}/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 240
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ StatusCheckin),
/* harmony export */   _: () => (/* binding */ CheckIn)
/* harmony export */ });
/* harmony import */ var _valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(744);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }

var StatusCheckin = {
  CONCLUIDO: 'CONCLUIDO',
  ATRASADO: 'ATRASADO',
  PENDENTE: 'PENDENTE'
};

/**
 * CheckIn.js
 * Domain Entity representing a log of ingestion.
 */
var _id = /*#__PURE__*/new WeakMap();
var _pacienteId = /*#__PURE__*/new WeakMap();
var _suplementoId = /*#__PURE__*/new WeakMap();
var _dataHoraPrescrita = /*#__PURE__*/new WeakMap();
var _dataHoraRealizada = /*#__PURE__*/new WeakMap();
var _status = /*#__PURE__*/new WeakMap();
var _retroativo = /*#__PURE__*/new WeakMap();
var CheckIn = /*#__PURE__*/function () {
  function CheckIn(_ref) {
    var id = _ref.id,
      pacienteId = _ref.pacienteId,
      suplementoId = _ref.suplementoId,
      dataHoraPrescrita = _ref.dataHoraPrescrita,
      dataHoraRealizada = _ref.dataHoraRealizada,
      status = _ref.status,
      retroativo = _ref.retroativo;
    _classCallCheck(this, CheckIn);
    _classPrivateFieldInitSpec(this, _id, void 0);
    _classPrivateFieldInitSpec(this, _pacienteId, void 0);
    _classPrivateFieldInitSpec(this, _suplementoId, void 0);
    _classPrivateFieldInitSpec(this, _dataHoraPrescrita, void 0);
    _classPrivateFieldInitSpec(this, _dataHoraRealizada, void 0);
    _classPrivateFieldInitSpec(this, _status, void 0);
    _classPrivateFieldInitSpec(this, _retroativo, void 0);
    if (!(id instanceof _valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_0__/* .UUID */ .k)) throw new Error('ID do Check-in deve ser UUID.');
    if (!(pacienteId instanceof _valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_0__/* .UUID */ .k)) throw new Error('ID do Paciente do Check-in deve ser UUID.');
    if (!(suplementoId instanceof _valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_0__/* .UUID */ .k)) throw new Error('ID do Suplemento do Check-in deve ser UUID.');
    if (!(dataHoraPrescrita instanceof Date)) {
      throw new Error('Data hora prescrita deve ser Date.');
    }
    if (dataHoraRealizada && !(dataHoraRealizada instanceof Date)) {
      throw new Error('Data hora realizada deve ser Date ou null.');
    }
    if (!Object.values(StatusCheckin).includes(status)) {
      throw new Error("Status de Check-in inv\xE1lido: ".concat(status));
    }
    _classPrivateFieldSet(_id, this, id);
    _classPrivateFieldSet(_pacienteId, this, pacienteId);
    _classPrivateFieldSet(_suplementoId, this, suplementoId);
    _classPrivateFieldSet(_dataHoraPrescrita, this, dataHoraPrescrita);
    _classPrivateFieldSet(_dataHoraRealizada, this, dataHoraRealizada || null);
    _classPrivateFieldSet(_status, this, status);
    _classPrivateFieldSet(_retroativo, this, !!retroativo);
  }
  return _createClass(CheckIn, [{
    key: "id",
    get: function get() {
      return _classPrivateFieldGet(_id, this);
    }
  }, {
    key: "pacienteId",
    get: function get() {
      return _classPrivateFieldGet(_pacienteId, this);
    }
  }, {
    key: "suplementoId",
    get: function get() {
      return _classPrivateFieldGet(_suplementoId, this);
    }
  }, {
    key: "dataHoraPrescrita",
    get: function get() {
      return _classPrivateFieldGet(_dataHoraPrescrita, this);
    }
  }, {
    key: "dataHoraRealizada",
    get: function get() {
      return _classPrivateFieldGet(_dataHoraRealizada, this);
    }
  }, {
    key: "status",
    get: function get() {
      return _classPrivateFieldGet(_status, this);
    }
  }, {
    key: "retroativo",
    get: function get() {
      return _classPrivateFieldGet(_retroativo, this);
    }

    /**
     * Performs the ingestion confirmation, checking whether it falls within the tolerance window.
     * @param {Date} realTime 
     * @param {number} toleranceMinutes 
     * @param {boolean} forceRetroactive 
     */
  }, {
    key: "confirmIngestion",
    value: function confirmIngestion(realTime) {
      var toleranceMinutes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 60;
      var forceRetroactive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (_classPrivateFieldGet(_status, this) !== StatusCheckin.PENDENTE) {
        throw new Error('Check-in já foi realizado anteriormente.');
      }
      _classPrivateFieldSet(_dataHoraRealizada, this, realTime);
      _classPrivateFieldSet(_retroativo, this, forceRetroactive);
      if (forceRetroactive) {
        _classPrivateFieldSet(_status, this, StatusCheckin.ATRASADO);
        return;
      }

      // Calculando diferença absoluta em minutos
      var diffMs = Math.abs(realTime.getTime() - _classPrivateFieldGet(_dataHoraPrescrita, this).getTime());
      var diffMinutes = Math.floor(diffMs / 1000 / 60);
      if (diffMinutes <= toleranceMinutes) {
        _classPrivateFieldSet(_status, this, StatusCheckin.CONCLUIDO);
      } else {
        _classPrivateFieldSet(_status, this, StatusCheckin.ATRASADO);
      }
    }
  }, {
    key: "revert",
    value: function revert() {
      _classPrivateFieldSet(_dataHoraRealizada, this, null);
      _classPrivateFieldSet(_status, this, StatusCheckin.PENDENTE);
      _classPrivateFieldSet(_retroativo, this, false);
    }
  }]);
}();

/***/ },

/***/ 855
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Gamificacao: () => (/* binding */ Gamificacao)
/* harmony export */ });
/* harmony import */ var _valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(744);
/* harmony import */ var _CheckIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(240);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateMethodInitSpec(e, a) { _checkPrivateRedeclaration(e, a), a.add(e); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }



/**
 * Gamificacao.js
 * Domain Entity representing a patient's gamification stats and accomplishments.
 */
var _id = /*#__PURE__*/new WeakMap();
var _pacienteId = /*#__PURE__*/new WeakMap();
var _xpTotal = /*#__PURE__*/new WeakMap();
var _streakAtual = /*#__PURE__*/new WeakMap();
var _maiorStreak = /*#__PURE__*/new WeakMap();
var _conquistas = /*#__PURE__*/new WeakMap();
var _Gamificacao_brand = /*#__PURE__*/new WeakSet();
var Gamificacao = /*#__PURE__*/function () {
  // Array of strings (achievement IDs/slugs)

  function Gamificacao(_ref) {
    var id = _ref.id,
      pacienteId = _ref.pacienteId,
      xpTotal = _ref.xpTotal,
      streakAtual = _ref.streakAtual,
      maiorStreak = _ref.maiorStreak,
      conquistas = _ref.conquistas;
    _classCallCheck(this, Gamificacao);
    _classPrivateMethodInitSpec(this, _Gamificacao_brand);
    _classPrivateFieldInitSpec(this, _id, void 0);
    _classPrivateFieldInitSpec(this, _pacienteId, void 0);
    _classPrivateFieldInitSpec(this, _xpTotal, void 0);
    _classPrivateFieldInitSpec(this, _streakAtual, void 0);
    _classPrivateFieldInitSpec(this, _maiorStreak, void 0);
    _classPrivateFieldInitSpec(this, _conquistas, void 0);
    if (!(id instanceof _valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_0__/* .UUID */ .k)) throw new Error('ID da Gamificação deve ser UUID.');
    if (!(pacienteId instanceof _valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_0__/* .UUID */ .k)) throw new Error('ID do Paciente deve ser UUID.');
    _classPrivateFieldSet(_id, this, id);
    _classPrivateFieldSet(_pacienteId, this, pacienteId);
    _classPrivateFieldSet(_xpTotal, this, Number.isInteger(xpTotal) ? xpTotal : 0);
    _classPrivateFieldSet(_streakAtual, this, Number.isInteger(streakAtual) ? streakAtual : 0);
    _classPrivateFieldSet(_maiorStreak, this, Number.isInteger(maiorStreak) ? maiorStreak : 0);
    _classPrivateFieldSet(_conquistas, this, Array.isArray(conquistas) ? _toConsumableArray(conquistas) : []);
  }
  return _createClass(Gamificacao, [{
    key: "id",
    get: function get() {
      return _classPrivateFieldGet(_id, this);
    }
  }, {
    key: "pacienteId",
    get: function get() {
      return _classPrivateFieldGet(_pacienteId, this);
    }
  }, {
    key: "xpTotal",
    get: function get() {
      return _classPrivateFieldGet(_xpTotal, this);
    }
  }, {
    key: "streakAtual",
    get: function get() {
      return _classPrivateFieldGet(_streakAtual, this);
    }
  }, {
    key: "maiorStreak",
    get: function get() {
      return _classPrivateFieldGet(_maiorStreak, this);
    }
  }, {
    key: "conquistas",
    get: function get() {
      return _classPrivateFieldGet(_conquistas, this);
    }
  }, {
    key: "nivel",
    get: function get() {
      // Basic level calculation: Level = Math.floor(XP / 100) + 1
      return Math.floor(_classPrivateFieldGet(_xpTotal, this) / 100) + 1;
    }

    /**
     * Awards XP based on the check-in status.
     */
  }, {
    key: "creditarCheckin",
    value: function creditarCheckin(statusCheckin) {
      if (statusCheckin === _CheckIn_js__WEBPACK_IMPORTED_MODULE_1__/* .StatusCheckin */ .C.CONCLUIDO) {
        _classPrivateFieldSet(_xpTotal, this, _classPrivateFieldGet(_xpTotal, this) + 10);
      } else if (statusCheckin === _CheckIn_js__WEBPACK_IMPORTED_MODULE_1__/* .StatusCheckin */ .C.ATRASADO) {
        _classPrivateFieldSet(_xpTotal, this, _classPrivateFieldGet(_xpTotal, this) + 5);
      }

      // Check if new achievements are unlocked by XP thresholds
      _assertClassBrand(_Gamificacao_brand, this, _verificarConquistasXp).call(this);
    }
  }, {
    key: "incrementarStreak",
    value: function incrementarStreak() {
      var _this$streakAtual, _this$streakAtual2;
      _classPrivateFieldSet(_streakAtual, this, (_this$streakAtual = _classPrivateFieldGet(_streakAtual, this), _this$streakAtual2 = _this$streakAtual++, _this$streakAtual)), _this$streakAtual2;
      if (_classPrivateFieldGet(_streakAtual, this) > _classPrivateFieldGet(_maiorStreak, this)) {
        _classPrivateFieldSet(_maiorStreak, this, _classPrivateFieldGet(_streakAtual, this));
      }
      _assertClassBrand(_Gamificacao_brand, this, _verificarConquistasStreak).call(this);
    }
  }, {
    key: "resetarStreak",
    value: function resetarStreak() {
      _classPrivateFieldSet(_streakAtual, this, 0);
    }
  }, {
    key: "concederConquista",
    value: function concederConquista(conquistaSlug) {
      if (!_classPrivateFieldGet(_conquistas, this).includes(conquistaSlug)) {
        _classPrivateFieldGet(_conquistas, this).push(conquistaSlug);
      }
    }
  }]);
}();
function _verificarConquistasXp() {
  if (_classPrivateFieldGet(_xpTotal, this) >= 100 && !_classPrivateFieldGet(_conquistas, this).includes('nivel_1_alcance')) {
    this.concederConquista('nivel_1_alcance');
  }
  if (_classPrivateFieldGet(_xpTotal, this) >= 500) this.concederConquista('consistencia_prata');
  if (_classPrivateFieldGet(_xpTotal, this) >= 1000) this.concederConquista('consistencia_ouro');
}
function _verificarConquistasStreak() {
  if (_classPrivateFieldGet(_streakAtual, this) >= 7) this.concederConquista('streak_semanal');
  if (_classPrivateFieldGet(_streakAtual, this) >= 30) this.concederConquista('streak_mensal');
}

/***/ },

/***/ 344
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q: () => (/* binding */ Paciente),
/* harmony export */   y: () => (/* binding */ StatusPaciente)
/* harmony export */ });
/* harmony import */ var _valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(744);
/* harmony import */ var _valueObjects_Email_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(471);
/* harmony import */ var _valueObjects_Telefone_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(605);
/* harmony import */ var _valueObjects_PasswordHash_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(126);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }




var StatusPaciente = {
  ATIVO: 'ATIVO',
  INATIVO: 'INATIVO',
  SUSPENSO: 'SUSPENSO',
  ANONIMIZADO: 'ANONIMIZADO'
};

/**
 * Paciente.js
 * Domain Entity representing a patient undergoing treatment.
 */
var _id = /*#__PURE__*/new WeakMap();
var _nome = /*#__PURE__*/new WeakMap();
var _email = /*#__PURE__*/new WeakMap();
var _telefone = /*#__PURE__*/new WeakMap();
var _senhaHash = /*#__PURE__*/new WeakMap();
var _protocoloId = /*#__PURE__*/new WeakMap();
var _status = /*#__PURE__*/new WeakMap();
var _dataInicio = /*#__PURE__*/new WeakMap();
var _dataFim = /*#__PURE__*/new WeakMap();
var Paciente = /*#__PURE__*/function () {
  function Paciente(_ref) {
    var id = _ref.id,
      nome = _ref.nome,
      email = _ref.email,
      telefone = _ref.telefone,
      senhaHash = _ref.senhaHash,
      protocoloId = _ref.protocoloId,
      status = _ref.status,
      dataInicio = _ref.dataInicio,
      dataFim = _ref.dataFim;
    _classCallCheck(this, Paciente);
    _classPrivateFieldInitSpec(this, _id, void 0);
    _classPrivateFieldInitSpec(this, _nome, void 0);
    _classPrivateFieldInitSpec(this, _email, void 0);
    _classPrivateFieldInitSpec(this, _telefone, void 0);
    _classPrivateFieldInitSpec(this, _senhaHash, void 0);
    _classPrivateFieldInitSpec(this, _protocoloId, void 0);
    _classPrivateFieldInitSpec(this, _status, void 0);
    _classPrivateFieldInitSpec(this, _dataInicio, void 0);
    _classPrivateFieldInitSpec(this, _dataFim, void 0);
    if (!(id instanceof _valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_0__/* .UUID */ .k)) throw new Error('ID do Paciente deve ser uma instância de UUID.');
    if (!nome || typeof nome !== 'string' || nome.trim().length < 3) {
      throw new Error('Nome do Paciente inválido (mínimo de 3 caracteres).');
    }
    if (!(email instanceof _valueObjects_Email_js__WEBPACK_IMPORTED_MODULE_1__/* .Email */ .P)) throw new Error('E-mail do Paciente deve ser uma instância de Email.');
    if (!(telefone instanceof _valueObjects_Telefone_js__WEBPACK_IMPORTED_MODULE_2__/* .Telefone */ .n)) throw new Error('Telefone do Paciente deve ser uma instância de Telefone.');
    if (!(senhaHash instanceof _valueObjects_PasswordHash_js__WEBPACK_IMPORTED_MODULE_3__/* .PasswordHash */ .q)) throw new Error('Senha hash deve ser uma instância de PasswordHash.');
    if (protocoloId && !(protocoloId instanceof _valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_0__/* .UUID */ .k)) {
      throw new Error('ID do Protocolo deve ser uma instância de UUID ou nulo.');
    }
    if (!Object.values(StatusPaciente).includes(status)) {
      throw new Error("Status do Paciente inv\xE1lido: ".concat(status));
    }
    if (!(dataInicio instanceof Date) || !(dataFim instanceof Date)) {
      throw new Error('As datas de início e fim do tratamento devem ser instâncias de Date.');
    }
    if (dataFim < dataInicio) {
      throw new Error('A data de término não pode ser anterior à data de início do tratamento.');
    }
    _classPrivateFieldSet(_id, this, id);
    _classPrivateFieldSet(_nome, this, nome.trim());
    _classPrivateFieldSet(_email, this, email);
    _classPrivateFieldSet(_telefone, this, telefone);
    _classPrivateFieldSet(_senhaHash, this, senhaHash);
    _classPrivateFieldSet(_protocoloId, this, protocoloId || null);
    _classPrivateFieldSet(_status, this, status);
    _classPrivateFieldSet(_dataInicio, this, dataInicio);
    _classPrivateFieldSet(_dataFim, this, dataFim);
  }

  // Getters
  return _createClass(Paciente, [{
    key: "id",
    get: function get() {
      return _classPrivateFieldGet(_id, this);
    }
  }, {
    key: "nome",
    get: function get() {
      return _classPrivateFieldGet(_nome, this);
    }
  }, {
    key: "email",
    get: function get() {
      return _classPrivateFieldGet(_email, this);
    }
  }, {
    key: "telefone",
    get: function get() {
      return _classPrivateFieldGet(_telefone, this);
    }
  }, {
    key: "senhaHash",
    get: function get() {
      return _classPrivateFieldGet(_senhaHash, this);
    }
  }, {
    key: "protocoloId",
    get: function get() {
      return _classPrivateFieldGet(_protocoloId, this);
    }
  }, {
    key: "status",
    get: function get() {
      return _classPrivateFieldGet(_status, this);
    }
  }, {
    key: "dataInicio",
    get: function get() {
      return _classPrivateFieldGet(_dataInicio, this);
    }
  }, {
    key: "dataFim",
    get: function get() {
      return _classPrivateFieldGet(_dataFim, this);
    }

    // Domain Actions
  }, {
    key: "ativar",
    value: function ativar() {
      _classPrivateFieldSet(_status, this, StatusPaciente.ATIVO);
    }
  }, {
    key: "inativar",
    value: function inativar() {
      _classPrivateFieldSet(_status, this, StatusPaciente.INATIVO);
    }
  }, {
    key: "suspender",
    value: function suspender() {
      _classPrivateFieldSet(_status, this, StatusPaciente.SUSPENSO);
    }

    /**
     * Applies anonymization data to the domain entity.
     * This is part of the LGPD compliance workflow.
     * @param {object} dadosAnonimizados 
     */
  }, {
    key: "atualizarDadosParaAnonimizacao",
    value: function atualizarDadosParaAnonimizacao(_ref2) {
      var nome = _ref2.nome,
        email = _ref2.email,
        telefone = _ref2.telefone,
        senhaHash = _ref2.senhaHash,
        status = _ref2.status;
      _classPrivateFieldSet(_nome, this, nome);
      _classPrivateFieldSet(_email, this, new _valueObjects_Email_js__WEBPACK_IMPORTED_MODULE_1__/* .Email */ .P(email));
      _classPrivateFieldSet(_telefone, this, new _valueObjects_Telefone_js__WEBPACK_IMPORTED_MODULE_2__/* .Telefone */ .n(telefone));
      _classPrivateFieldSet(_senhaHash, this, new _valueObjects_PasswordHash_js__WEBPACK_IMPORTED_MODULE_3__/* .PasswordHash */ .q(senhaHash));
      _classPrivateFieldSet(_status, this, status);
    }
  }, {
    key: "vincularProtocolo",
    value: function vincularProtocolo(protocoloId) {
      if (!(protocoloId instanceof _valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_0__/* .UUID */ .k)) {
        throw new Error('ID do Protocolo a vincular deve ser uma instância de UUID.');
      }
      _classPrivateFieldSet(_protocoloId, this, protocoloId);
    }
  }, {
    key: "validarStatusPermissaoLogin",
    value: function validarStatusPermissaoLogin() {
      if (_classPrivateFieldGet(_status, this) === StatusPaciente.INATIVO) {
        throw new Error('Esta conta está inativa. Entre em contato com seu clínico.');
      }
      if (_classPrivateFieldGet(_status, this) === StatusPaciente.SUSPENSO) {
        throw new Error('Esta conta está temporariamente bloqueada por segurança.');
      }
      var hoje = new Date();
      if (hoje < _classPrivateFieldGet(_dataInicio, this)) {
        throw new Error('Seu período de tratamento ainda não iniciou.');
      }
      if (hoje > _classPrivateFieldGet(_dataFim, this)) {
        throw new Error('Seu período de tratamento já expirou.');
      }
      return true;
    }
  }]);
}();

/***/ },

/***/ 148
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ PacienteFactory)
/* harmony export */ });
/* harmony import */ var _Paciente_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(344);
/* harmony import */ var _valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(744);
/* harmony import */ var _valueObjects_Email_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(471);
/* harmony import */ var _valueObjects_Telefone_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(605);
/* harmony import */ var _valueObjects_PasswordHash_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(126);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }






/**
 * PacienteFactory.js
 * Factory to safely instantiate a new Paciente Aggregate Root,
 * translating raw strings to specific Domain Value Objects.
 */
var PacienteFactory = /*#__PURE__*/function () {
  function PacienteFactory() {
    _classCallCheck(this, PacienteFactory);
  }
  return _createClass(PacienteFactory, null, [{
    key: "createNew",
    value:
    /**
     * Creates a new Paciente instance with a random UUID.
     * Typically used when registering a new patient.
     */
    function createNew(_ref) {
      var nome = _ref.nome,
        email = _ref.email,
        telefone = _ref.telefone,
        senhaHashString = _ref.senhaHashString,
        dataInicio = _ref.dataInicio,
        dataFim = _ref.dataFim;
      var id = _valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_1__/* .UUID */ .k.generate();
      var emailVO = new _valueObjects_Email_js__WEBPACK_IMPORTED_MODULE_2__/* .Email */ .P(email);
      var telefoneVO = new _valueObjects_Telefone_js__WEBPACK_IMPORTED_MODULE_3__/* .Telefone */ .n(telefone);
      var passwordVO = new _valueObjects_PasswordHash_js__WEBPACK_IMPORTED_MODULE_4__/* .PasswordHash */ .q(senhaHashString);
      var start = dataInicio instanceof Date ? dataInicio : new Date(dataInicio);
      var end = dataFim instanceof Date ? dataFim : new Date(dataFim);
      return new _Paciente_js__WEBPACK_IMPORTED_MODULE_0__/* .Paciente */ .Q({
        id: id,
        nome: nome,
        email: emailVO,
        telefone: telefoneVO,
        senhaHash: passwordVO,
        protocoloId: null,
        status: _Paciente_js__WEBPACK_IMPORTED_MODULE_0__/* .StatusPaciente */ .y.ATIVO,
        dataInicio: start,
        dataFim: end
      });
    }

    /**
     * Reconstitutes an existing Paciente from persistent storage data (Google Sheets row).
     */
  }, {
    key: "reconstitute",
    value: function reconstitute(_ref2) {
      var id = _ref2.id,
        nome = _ref2.nome,
        email = _ref2.email,
        telefone = _ref2.telefone,
        senhaHash = _ref2.senhaHash,
        protocoloId = _ref2.protocoloId,
        status = _ref2.status,
        dataInicio = _ref2.dataInicio,
        dataFim = _ref2.dataFim;
      return new _Paciente_js__WEBPACK_IMPORTED_MODULE_0__/* .Paciente */ .Q({
        id: new _valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_1__/* .UUID */ .k(id),
        nome: nome,
        email: new _valueObjects_Email_js__WEBPACK_IMPORTED_MODULE_2__/* .Email */ .P(email),
        telefone: new _valueObjects_Telefone_js__WEBPACK_IMPORTED_MODULE_3__/* .Telefone */ .n(telefone),
        senhaHash: new _valueObjects_PasswordHash_js__WEBPACK_IMPORTED_MODULE_4__/* .PasswordHash */ .q(senhaHash),
        protocoloId: protocoloId ? new _valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_1__/* .UUID */ .k(protocoloId) : null,
        status: status,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim)
      });
    }
  }]);
}();

/***/ },

/***/ 471
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ Email)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateMethodInitSpec(e, a) { _checkPrivateRedeclaration(e, a), a.add(e); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
var _value = /*#__PURE__*/new WeakMap();
var _Email_brand = /*#__PURE__*/new WeakSet();
/**
 * Email.js
 * Value Object representing a validated, immutable E-mail address.
 */
var Email = /*#__PURE__*/function () {
  function Email(_value2) {
    _classCallCheck(this, Email);
    _classPrivateMethodInitSpec(this, _Email_brand);
    _classPrivateFieldInitSpec(this, _value, void 0);
    if (!_value2 || typeof _value2 !== 'string') {
      throw new Error('E-mail deve ser uma string preenchida.');
    }
    var cleanValue = _value2.trim().toLowerCase();
    _assertClassBrand(_Email_brand, this, _validate).call(this, cleanValue);
    _classPrivateFieldSet(_value, this, cleanValue);
    Object.freeze(this);
  }
  return _createClass(Email, [{
    key: "value",
    get: function get() {
      return _classPrivateFieldGet(_value, this);
    }
  }, {
    key: "equals",
    value: function equals(other) {
      if (!(other instanceof Email)) return false;
      return _classPrivateFieldGet(_value, this) === other.value;
    }
  }]);
}();
function _validate(value) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw new Error("Endere\xE7o de e-mail inv\xE1lido: ".concat(value));
  }
}

/***/ },

/***/ 126
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   q: () => (/* binding */ PasswordHash)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateMethodInitSpec(e, a) { _checkPrivateRedeclaration(e, a), a.add(e); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
var _value = /*#__PURE__*/new WeakMap();
var _PasswordHash_brand = /*#__PURE__*/new WeakSet();
/**
 * PasswordHash.js
 * Value Object representing a validated Bcrypt password hash.
 */
var PasswordHash = /*#__PURE__*/function () {
  function PasswordHash(_value2) {
    _classCallCheck(this, PasswordHash);
    _classPrivateMethodInitSpec(this, _PasswordHash_brand);
    _classPrivateFieldInitSpec(this, _value, void 0);
    if (!_value2 || typeof _value2 !== 'string') {
      throw new Error('Hash de senha deve ser uma string preenchida.');
    }
    _assertClassBrand(_PasswordHash_brand, this, _validate).call(this, _value2);
    _classPrivateFieldSet(_value, this, _value2);
    Object.freeze(this);
  }
  return _createClass(PasswordHash, [{
    key: "value",
    get: function get() {
      return _classPrivateFieldGet(_value, this);
    }
  }, {
    key: "equals",
    value: function equals(other) {
      if (!(other instanceof PasswordHash)) return false;
      return _classPrivateFieldGet(_value, this) === other.value;
    }
  }]);
}();
function _validate(value) {
  // Bcrypt hashes are 60 characters long and start with $2a$, $2b$, or $2y$
  var bcryptRegex = /^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/;
  if (!bcryptRegex.test(value)) {
    throw new Error('Formato de hash de senha inválido para Bcrypt.');
  }
}

/***/ },

/***/ 605
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   n: () => (/* binding */ Telefone)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateMethodInitSpec(e, a) { _checkPrivateRedeclaration(e, a), a.add(e); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
var _value = /*#__PURE__*/new WeakMap();
var _Telefone_brand = /*#__PURE__*/new WeakSet();
/**
 * Telefone.js
 * Value Object representing a validated telephone/mobile number.
 */
var Telefone = /*#__PURE__*/function () {
  function Telefone(_value2) {
    _classCallCheck(this, Telefone);
    _classPrivateMethodInitSpec(this, _Telefone_brand);
    _classPrivateFieldInitSpec(this, _value, void 0);
    if (!_value2 || typeof _value2 !== 'string') {
      throw new Error('Telefone deve ser uma string preenchida.');
    }
    var cleanValue = _value2.replace(/\s+/g, ''); // strip spaces
    _assertClassBrand(_Telefone_brand, this, _validate).call(this, cleanValue);
    _classPrivateFieldSet(_value, this, cleanValue);
    Object.freeze(this);
  }
  return _createClass(Telefone, [{
    key: "value",
    get: function get() {
      return _classPrivateFieldGet(_value, this);
    }
  }, {
    key: "equals",
    value: function equals(other) {
      if (!(other instanceof Telefone)) return false;
      return _classPrivateFieldGet(_value, this).replace(/\D/g, '') === other.value.replace(/\D/g, '');
    }
  }]);
}();
function _validate(value) {
  // Regex for DDI + DDD + Number, allowing digits, dashes and parentheses.
  // Normalized check: must have at least 10 digits.
  var numericOnly = value.replace(/\D/g, '');
  if (numericOnly.length < 10 || numericOnly.length > 15) {
    throw new Error("N\xFAmero de telefone inv\xE1lido: ".concat(value));
  }
}

/***/ },

/***/ 744
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   k: () => (/* binding */ UUID)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateMethodInitSpec(e, a) { _checkPrivateRedeclaration(e, a), a.add(e); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
var _value = /*#__PURE__*/new WeakMap();
var _UUID_brand = /*#__PURE__*/new WeakSet();
/**
 * UUID.js
 * Value Object representing a validated UUID (v4).
 */
var UUID = /*#__PURE__*/function () {
  function UUID(_value2) {
    _classCallCheck(this, UUID);
    _classPrivateMethodInitSpec(this, _UUID_brand);
    _classPrivateFieldInitSpec(this, _value, void 0);
    if (!_value2 || typeof _value2 !== 'string') {
      throw new Error('UUID deve ser uma string preenchida.');
    }
    var cleanValue = _value2.trim().toLowerCase();
    _assertClassBrand(_UUID_brand, this, _validate).call(this, cleanValue);
    _classPrivateFieldSet(_value, this, cleanValue);
    Object.freeze(this);
  }
  return _createClass(UUID, [{
    key: "value",
    get: function get() {
      return _classPrivateFieldGet(_value, this);
    }
  }, {
    key: "equals",
    value: function equals(other) {
      if (!(other instanceof UUID)) return false;
      return _classPrivateFieldGet(_value, this) === other.value;
    }

    /**
     * Generates a new random UUID v4 using the crypto API (fallback to math.random if not in browser/node environment).
     */
  }], [{
    key: "generate",
    value: function generate() {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return new UUID(crypto.randomUUID());
      }
      // Apps Script / fallback generator
      var s4 = function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      };
      var variantChar = (Math.floor(Math.random() * 4) + 8).toString(16);
      var uuid = "".concat(s4()).concat(s4(), "-").concat(s4(), "-4").concat(s4().substring(1), "-").concat(variantChar).concat(s4().substring(1), "-").concat(s4()).concat(s4()).concat(s4());
      return new UUID(uuid);
    }
  }]);
}();
function _validate(value) {
  var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  if (!uuidRegex.test(value)) {
    throw new Error("UUID v4 inv\xE1lido: ".concat(value));
  }
}

/***/ },

/***/ 263
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CheckinMapper: () => (/* binding */ CheckinMapper)
/* harmony export */ });
/* harmony import */ var _domain_entities_CheckIn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(240);
/* harmony import */ var _domain_valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(744);
/* harmony import */ var _GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(499);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




/**
 * CheckinMapper.js
 * Translates Google Sheets rows to CheckIn entity instances and vice versa.
 */
var CheckinMapper = /*#__PURE__*/function () {
  function CheckinMapper() {
    _classCallCheck(this, CheckinMapper);
  }
  return _createClass(CheckinMapper, null, [{
    key: "toRow",
    value:
    /**
     * Converts CheckIn domain entity to array row.
     * @param {CheckIn} checkin 
     */
    function toRow(checkin) {
      var row = [];
      row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_2__/* .SheetColumns */ .$.CHECKIN.ID] = checkin.id.value;
      row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_2__/* .SheetColumns */ .$.CHECKIN.PACIENTE_ID] = checkin.pacienteId.value;
      row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_2__/* .SheetColumns */ .$.CHECKIN.SUPLEMENTO_ID] = checkin.suplementoId.value;
      row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_2__/* .SheetColumns */ .$.CHECKIN.DATA_HORA_PRESCRITA] = checkin.dataHoraPrescrita.toISOString();
      row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_2__/* .SheetColumns */ .$.CHECKIN.DATA_HORA_REALIZADA] = checkin.dataHoraRealizada ? checkin.dataHoraRealizada.toISOString() : '';
      row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_2__/* .SheetColumns */ .$.CHECKIN.STATUS] = checkin.status;
      return row;
    }

    /**
     * Converts array row to CheckIn domain entity.
     * @param {Array<any>} row 
     */
  }, {
    key: "toDomain",
    value: function toDomain(row) {
      if (!row || row.length === 0) return null;
      return new _domain_entities_CheckIn_js__WEBPACK_IMPORTED_MODULE_0__/* .CheckIn */ ._({
        id: new _domain_valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_1__/* .UUID */ .k(row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_2__/* .SheetColumns */ .$.CHECKIN.ID]),
        pacienteId: new _domain_valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_1__/* .UUID */ .k(row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_2__/* .SheetColumns */ .$.CHECKIN.PACIENTE_ID]),
        suplementoId: new _domain_valueObjects_UUID_js__WEBPACK_IMPORTED_MODULE_1__/* .UUID */ .k(row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_2__/* .SheetColumns */ .$.CHECKIN.SUPLEMENTO_ID]),
        dataHoraPrescrita: new Date(row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_2__/* .SheetColumns */ .$.CHECKIN.DATA_HORA_PRESCRITA]),
        dataHoraRealizada: row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_2__/* .SheetColumns */ .$.CHECKIN.DATA_HORA_REALIZADA] ? new Date(row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_2__/* .SheetColumns */ .$.CHECKIN.DATA_HORA_REALIZADA]) : null,
        status: row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_2__/* .SheetColumns */ .$.CHECKIN.STATUS]
      });
    }
  }]);
}();

/***/ },

/***/ 499
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ SheetColumns)
/* harmony export */ });
/**
 * GoogleSheetsColumns.js
 * 
 * Centraliza os índices de colunas de todas as abas (Sheets) do banco de dados Google Sheets.
 * Resolve o problema de "Magic Numbers" nos repositórios e mappers.
 * 
 * Se a estrutura da planilha mudar, basta alterar este mapeamento.
 */
var SheetColumns = {
  PACIENTE: {
    ID: 0,
    NOME: 1,
    EMAIL: 2,
    TELEFONE: 3,
    SENHA_HASH: 4,
    PROTOCOLO_ID: 5,
    STATUS: 6,
    DATA_INICIO: 7,
    DATA_FIM: 8
  },
  GAMIFICACAO: {
    ID: 0,
    PACIENTE_ID: 1,
    XP_TOTAL: 2,
    STREAK_ATUAL: 3,
    MAIOR_STREAK: 4,
    CONQUISTAS: 5
  },
  CHECKIN: {
    ID: 0,
    PACIENTE_ID: 1,
    SUPLEMENTO_ID: 2,
    DATA_HORA_PRESCRITA: 3,
    DATA_HORA_REALIZADA: 4,
    STATUS: 5
  },
  PROTOCOLO: {
    ID: 0,
    NOME: 1,
    SUPLEMENTOS: 2 // Array serializado
  },
  PERMISSAO: {
    PACIENTE_ID: 0,
    OPERADOR_ID: 1,
    HORAS_LIBERADAS: 2,
    DATA_HORA_CONCESSAO: 3,
    MOTIVO: 4
  }
};

/***/ },

/***/ 395
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PacienteMapper: () => (/* binding */ PacienteMapper)
/* harmony export */ });
/* harmony import */ var _domain_entities_PacienteFactory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(148);
/* harmony import */ var _GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(499);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



/**
 * PacienteMapper.js
 * Translates Google Sheets rows (Arrays) to Domain Entity instances and vice versa.
 */
var PacienteMapper = /*#__PURE__*/function () {
  function PacienteMapper() {
    _classCallCheck(this, PacienteMapper);
  }
  return _createClass(PacienteMapper, null, [{
    key: "toRow",
    value:
    /**
     * Converts a domain Paciente entity into an array row for Google Sheets.
     * @param {Paciente} paciente 
     * @returns {Array<any>}
     */
    function toRow(paciente) {
      var row = [];
      row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.ID] = paciente.id.value;
      row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.NOME] = paciente.nome;
      row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.EMAIL] = paciente.email.value;
      row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.TELEFONE] = paciente.telefone.value;
      row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.SENHA_HASH] = paciente.senhaHash.value;
      row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.PROTOCOLO_ID] = paciente.protocoloId ? paciente.protocoloId.value : '';
      row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.STATUS] = paciente.status;
      row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.DATA_INICIO] = paciente.dataInicio.toISOString();
      row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.DATA_FIM] = paciente.dataFim.toISOString();
      return row;
    }

    /**
     * Converts an array row from Google Sheets into a domain Paciente entity.
     * @param {Array<any>} row 
     * @returns {Paciente}
     */
  }, {
    key: "toDomain",
    value: function toDomain(row) {
      if (!row || row.length === 0) return null;
      return _domain_entities_PacienteFactory_js__WEBPACK_IMPORTED_MODULE_0__/* .PacienteFactory */ .S.reconstitute({
        id: row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.ID],
        nome: row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.NOME],
        email: row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.EMAIL],
        telefone: row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.TELEFONE],
        senhaHash: row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.SENHA_HASH],
        protocoloId: row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.PROTOCOLO_ID] || null,
        status: row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.STATUS],
        dataInicio: row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.DATA_INICIO],
        dataFim: row[_GoogleSheetsColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .SheetColumns */ .$.PACIENTE.DATA_FIM]
      });
    }
  }]);
}();

/***/ },

/***/ 798
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

/* (ignored) */

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

;// ./src/shared/config/SystemConfiguration.js
/**
 * SystemConfiguration.js
 * Centralized configuration settings for the Clinical Integrative Treatment Tracking Backend.
 * Strictly avoids hardcoding sensitive strings across the codebase.
 */
var SystemConfiguration = {
  // Database / Sheets Config
  // This will be read from PropertiesService at runtime in Apps Script,
  // falling back to a default sandbox sheet for local/staging testing.
  DATABASE_SPREADSHEET_ID: typeof PropertiesService !== 'undefined' ? PropertiesService.getScriptProperties().getProperty('DATABASE_SPREADSHEET_ID') : 'SANDBOX_SPREADSHEET_ID_DEFAULT',
  // Clinical Rules & Window Tolerances
  CHECKIN_WINDOW_TOLERANCE_MINUTES: 60,
  // Window of ±60 minutes around prescribed time
  MAX_DAYS_TREATMENT: 365,
  // Maximum allowed protocol duration
  ALERT_TOLERANCE_MINUTES: 15,
  // Dispatch pre-alerts 15 minutes before dosage

  // Security Rules
  MAX_LOGIN_ATTEMPTS: 5,
  // Max password failures before locking account
  LOGIN_LOCKOUT_MINUTES: 15,
  // Lockout period on brute-force detection
  SESSION_TIMEOUT_MINUTES: 120,
  // Session inactivity timeout (2 hours)

  // Gamification Mechanics (Refined)
  XP_PER_ON_TIME_CHECKIN: 10,
  // On time check-in reward
  XP_PER_LATE_CHECKIN: 5,
  // Late check-in reward
  XP_STREAK_BONUS_MULTIPLIER: 1.5,
  // Multiplier bonus for 7-day streak consistency
  XP_LEVEL_BASE: 100,
  // Leveling base divider formula: XP_Needed = level * base

  // Environment and Meta
  ENV: typeof PropertiesService !== 'undefined' ? PropertiesService.getScriptProperties().getProperty('ENV') || 'production' : 'development'
};
;// ./src/infrastructure/repositories/GoogleSheetsRepository.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }


// In-memory global database mockup for testing outside of the Google Apps Script runtime.
var memoryDB = new Map();

/**
 * GoogleSheetsRepository.js
 * Base class for all Google Sheets repositories.
 * Handles lock mechanisms and handles fallback to memory store in non-GAS environments.
 */
var _tabName = /*#__PURE__*/new WeakMap();
var GoogleSheetsRepository = /*#__PURE__*/function () {
  function GoogleSheetsRepository(tabName) {
    _classCallCheck(this, GoogleSheetsRepository);
    _classPrivateFieldInitSpec(this, _tabName, void 0);
    _classPrivateFieldSet(_tabName, this, tabName);
    if (!memoryDB.has(tabName)) {
      memoryDB.set(tabName, []);
    }
  }
  return _createClass(GoogleSheetsRepository, [{
    key: "tabName",
    get: function get() {
      return _classPrivateFieldGet(_tabName, this);
    }

    /**
     * Reads all rows from the specified Sheet tab.
     * Performance: No LockService on reads (idempotent, thread-safe — ADR-028).
     * Performance: CacheService layer with 5-min TTL reduces Sheets API calls by ~60%.
     * @returns {Promise<Array<Array<any>>>}
     */
  }, {
    key: "readAllRows",
    value: (function () {
      var _readAllRows = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var cacheKey, cached, ss, sheet, range, lastCol, header, values, serialized, _t, _t2;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              if (!(typeof SpreadsheetApp === 'undefined')) {
                _context.n = 1;
                break;
              }
              return _context.a(2, memoryDB.get(_classPrivateFieldGet(_tabName, this)) || []);
            case 1:
              if (!(typeof CacheService !== 'undefined')) {
                _context.n = 5;
                break;
              }
              cacheKey = "sheet_".concat(_classPrivateFieldGet(_tabName, this));
              _context.p = 2;
              cached = CacheService.getScriptCache().get(cacheKey);
              if (!cached) {
                _context.n = 3;
                break;
              }
              return _context.a(2, JSON.parse(cached));
            case 3:
              _context.n = 5;
              break;
            case 4:
              _context.p = 4;
              _t = _context.v;
            case 5:
              _context.p = 5;
              // No lock needed for reads — reads are idempotent (ADR-028)
              ss = SpreadsheetApp.openById(SystemConfiguration.DATABASE_SPREADSHEET_ID);
              sheet = ss.getSheetByName(_classPrivateFieldGet(_tabName, this));
              if (!sheet) {
                sheet = ss.insertSheet(_classPrivateFieldGet(_tabName, this));
              }
              range = sheet.getDataRange();
              if (!(range.getNumRows() <= 1)) {
                _context.n = 7;
                break;
              }
              lastCol = sheet.getLastColumn();
              if (!(lastCol === 0)) {
                _context.n = 6;
                break;
              }
              return _context.a(2, []);
            case 6:
              header = sheet.getRange(1, 1, 1, lastCol).getValues();
              return _context.a(2, []);
            case 7:
              values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues(); // Populate L4 Cache (5 minutes = 300 seconds)
              if (typeof CacheService !== 'undefined') {
                try {
                  serialized = JSON.stringify(values); // CacheService limit: 100KB per key. Skip cache for oversized data.
                  if (serialized.length < 100000) {
                    CacheService.getScriptCache().put("sheet_".concat(_classPrivateFieldGet(_tabName, this)), serialized, 300);
                  }
                } catch (e) {
                  // Cache write failed (size limit exceeded) — non-critical, continue
                }
              }
              return _context.a(2, values);
            case 8:
              _context.p = 8;
              _t2 = _context.v;
              throw new Error("Erro ao ler planilha [".concat(_classPrivateFieldGet(_tabName, this), "]: ").concat(_t2.message));
            case 9:
              return _context.a(2);
          }
        }, _callee, this, [[5, 8], [2, 4]]);
      }));
      function readAllRows() {
        return _readAllRows.apply(this, arguments);
      }
      return readAllRows;
    }()
    /**
     * Appends or updates rows.
     * @param {Array<any>} rowArray
     * @param {string} idColumnValue Unique identifier value to update existing, or append if new
     * @param {number} idColIndex 0-indexed column position of the ID
     */
    )
  }, {
    key: "writeRow",
    value: (function () {
      var _writeRow = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(rowArray, idColumnValue) {
        var idColIndex,
          data,
          index,
          lock,
          ss,
          sheet,
          lastRow,
          rowIndexToUpdate,
          ids,
          i,
          _args2 = arguments,
          _t3;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              idColIndex = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 0;
              if (!(typeof SpreadsheetApp === 'undefined')) {
                _context2.n = 1;
                break;
              }
              data = memoryDB.get(_classPrivateFieldGet(_tabName, this));
              index = data.findIndex(function (row) {
                return row[idColIndex] === idColumnValue;
              });
              if (index >= 0) {
                data[index] = rowArray;
              } else {
                data.push(rowArray);
              }
              return _context2.a(2);
            case 1:
              lock = LockService.getScriptLock();
              _context2.p = 2;
              lock.waitLock(10000);
              ss = SpreadsheetApp.openById(SystemConfiguration.DATABASE_SPREADSHEET_ID);
              sheet = ss.getSheetByName(_classPrivateFieldGet(_tabName, this));
              if (!sheet) {
                sheet = ss.insertSheet(_classPrivateFieldGet(_tabName, this));
              }
              lastRow = sheet.getLastRow();
              rowIndexToUpdate = -1;
              if (!(lastRow > 1)) {
                _context2.n = 5;
                break;
              }
              ids = sheet.getRange(2, idColIndex + 1, lastRow - 1, 1).getValues();
              i = 0;
            case 3:
              if (!(i < ids.length)) {
                _context2.n = 5;
                break;
              }
              if (!(ids[i][0] === idColumnValue)) {
                _context2.n = 4;
                break;
              }
              rowIndexToUpdate = i + 2; // +2 offset (1-indexed and header row)
              return _context2.a(3, 5);
            case 4:
              i++;
              _context2.n = 3;
              break;
            case 5:
              if (rowIndexToUpdate >= 2) {
                // Update existing row
                sheet.getRange(rowIndexToUpdate, 1, 1, rowArray.length).setValues([rowArray]);
              } else {
                // Append new row
                sheet.appendRow(rowArray);
              }
              SpreadsheetApp.flush(); // Force immediate commit

              // Performance: Invalidate read cache after write to ensure consistency
              if (typeof CacheService !== 'undefined') {
                try {
                  CacheService.getScriptCache().remove("sheet_".concat(_classPrivateFieldGet(_tabName, this)));
                } catch (e) {
                  // Non-critical — cache will expire naturally via TTL
                }
              }
              _context2.n = 7;
              break;
            case 6:
              _context2.p = 6;
              _t3 = _context2.v;
              throw new Error("Erro ao gravar na planilha [".concat(_classPrivateFieldGet(_tabName, this), "]: ").concat(_t3.message));
            case 7:
              _context2.p = 7;
              lock.releaseLock();
              return _context2.f(7);
            case 8:
              return _context2.a(2);
          }
        }, _callee2, this, [[2, 6, 7, 8]]);
      }));
      function writeRow(_x, _x2) {
        return _writeRow.apply(this, arguments);
      }
      return writeRow;
    }())
  }]);
}();
;// ./src/application/repositories/PacienteRepositoryInterface.js
function PacienteRepositoryInterface_typeof(o) { "@babel/helpers - typeof"; return PacienteRepositoryInterface_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, PacienteRepositoryInterface_typeof(o); }
function PacienteRepositoryInterface_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return PacienteRepositoryInterface_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (PacienteRepositoryInterface_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, PacienteRepositoryInterface_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, PacienteRepositoryInterface_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), PacienteRepositoryInterface_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", PacienteRepositoryInterface_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), PacienteRepositoryInterface_regeneratorDefine2(u), PacienteRepositoryInterface_regeneratorDefine2(u, o, "Generator"), PacienteRepositoryInterface_regeneratorDefine2(u, n, function () { return this; }), PacienteRepositoryInterface_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (PacienteRepositoryInterface_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function PacienteRepositoryInterface_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } PacienteRepositoryInterface_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { PacienteRepositoryInterface_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, PacienteRepositoryInterface_regeneratorDefine2(e, r, n, t); }
function PacienteRepositoryInterface_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function PacienteRepositoryInterface_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { PacienteRepositoryInterface_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { PacienteRepositoryInterface_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function PacienteRepositoryInterface_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function PacienteRepositoryInterface_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, PacienteRepositoryInterface_toPropertyKey(o.key), o); } }
function PacienteRepositoryInterface_createClass(e, r, t) { return r && PacienteRepositoryInterface_defineProperties(e.prototype, r), t && PacienteRepositoryInterface_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function PacienteRepositoryInterface_toPropertyKey(t) { var i = PacienteRepositoryInterface_toPrimitive(t, "string"); return "symbol" == PacienteRepositoryInterface_typeof(i) ? i : i + ""; }
function PacienteRepositoryInterface_toPrimitive(t, r) { if ("object" != PacienteRepositoryInterface_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != PacienteRepositoryInterface_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * PacienteRepositoryInterface.js
 * Interface (Contract) for Paciente persistence operations.
 * Must be implemented by specific database adapters in the Infrastructure layer.
 */
var PacienteRepositoryInterface = /*#__PURE__*/(/* unused pure expression or super */ null && (function () {
  function PacienteRepositoryInterface() {
    PacienteRepositoryInterface_classCallCheck(this, PacienteRepositoryInterface);
  }
  return PacienteRepositoryInterface_createClass(PacienteRepositoryInterface, [{
    key: "findById",
    value: function () {
      var _findById = PacienteRepositoryInterface_asyncToGenerator(/*#__PURE__*/PacienteRepositoryInterface_regenerator().m(function _callee(id) {
        return PacienteRepositoryInterface_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              throw new Error('Método findById não implementado.');
            case 1:
              return _context.a(2);
          }
        }, _callee);
      }));
      function findById(_x) {
        return _findById.apply(this, arguments);
      }
      return findById;
    }()
  }, {
    key: "findByEmail",
    value: function () {
      var _findByEmail = PacienteRepositoryInterface_asyncToGenerator(/*#__PURE__*/PacienteRepositoryInterface_regenerator().m(function _callee2(email) {
        return PacienteRepositoryInterface_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              throw new Error('Método findByEmail não implementado.');
            case 1:
              return _context2.a(2);
          }
        }, _callee2);
      }));
      function findByEmail(_x2) {
        return _findByEmail.apply(this, arguments);
      }
      return findByEmail;
    }()
  }, {
    key: "save",
    value: function () {
      var _save = PacienteRepositoryInterface_asyncToGenerator(/*#__PURE__*/PacienteRepositoryInterface_regenerator().m(function _callee3(paciente) {
        return PacienteRepositoryInterface_regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              throw new Error('Método save não implementado.');
            case 1:
              return _context3.a(2);
          }
        }, _callee3);
      }));
      function save(_x3) {
        return _save.apply(this, arguments);
      }
      return save;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = PacienteRepositoryInterface_asyncToGenerator(/*#__PURE__*/PacienteRepositoryInterface_regenerator().m(function _callee4(paciente) {
        return PacienteRepositoryInterface_regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              throw new Error('Método update não implementado.');
            case 1:
              return _context4.a(2);
          }
        }, _callee4);
      }));
      function update(_x4) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }]);
}()));
// EXTERNAL MODULE: ./src/infrastructure/repositories/PacienteMapper.js
var PacienteMapper = __webpack_require__(395);
// EXTERNAL MODULE: ./src/infrastructure/repositories/GoogleSheetsColumns.js
var GoogleSheetsColumns = __webpack_require__(499);
;// ./src/infrastructure/repositories/GoogleSheetsPacienteRepository.js
function GoogleSheetsPacienteRepository_typeof(o) { "@babel/helpers - typeof"; return GoogleSheetsPacienteRepository_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, GoogleSheetsPacienteRepository_typeof(o); }
function GoogleSheetsPacienteRepository_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return GoogleSheetsPacienteRepository_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (GoogleSheetsPacienteRepository_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, GoogleSheetsPacienteRepository_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, GoogleSheetsPacienteRepository_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), GoogleSheetsPacienteRepository_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", GoogleSheetsPacienteRepository_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), GoogleSheetsPacienteRepository_regeneratorDefine2(u), GoogleSheetsPacienteRepository_regeneratorDefine2(u, o, "Generator"), GoogleSheetsPacienteRepository_regeneratorDefine2(u, n, function () { return this; }), GoogleSheetsPacienteRepository_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (GoogleSheetsPacienteRepository_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function GoogleSheetsPacienteRepository_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } GoogleSheetsPacienteRepository_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { GoogleSheetsPacienteRepository_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, GoogleSheetsPacienteRepository_regeneratorDefine2(e, r, n, t); }
function GoogleSheetsPacienteRepository_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function GoogleSheetsPacienteRepository_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { GoogleSheetsPacienteRepository_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { GoogleSheetsPacienteRepository_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function GoogleSheetsPacienteRepository_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function GoogleSheetsPacienteRepository_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, GoogleSheetsPacienteRepository_toPropertyKey(o.key), o); } }
function GoogleSheetsPacienteRepository_createClass(e, r, t) { return r && GoogleSheetsPacienteRepository_defineProperties(e.prototype, r), t && GoogleSheetsPacienteRepository_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function GoogleSheetsPacienteRepository_toPropertyKey(t) { var i = GoogleSheetsPacienteRepository_toPrimitive(t, "string"); return "symbol" == GoogleSheetsPacienteRepository_typeof(i) ? i : i + ""; }
function GoogleSheetsPacienteRepository_toPrimitive(t, r) { if ("object" != GoogleSheetsPacienteRepository_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != GoogleSheetsPacienteRepository_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == GoogleSheetsPacienteRepository_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }




var GoogleSheetsPacienteRepository = /*#__PURE__*/function (_GoogleSheetsReposito) {
  function GoogleSheetsPacienteRepository() {
    GoogleSheetsPacienteRepository_classCallCheck(this, GoogleSheetsPacienteRepository);
    return _callSuper(this, GoogleSheetsPacienteRepository, ['Pacientes']);
  }
  _inherits(GoogleSheetsPacienteRepository, _GoogleSheetsReposito);
  return GoogleSheetsPacienteRepository_createClass(GoogleSheetsPacienteRepository, [{
    key: "findById",
    value: function () {
      var _findById = GoogleSheetsPacienteRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsPacienteRepository_regenerator().m(function _callee(id) {
        var rows, row;
        return GoogleSheetsPacienteRepository_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.readAllRows();
            case 1:
              rows = _context.v;
              row = rows.find(function (r) {
                return r[GoogleSheetsColumns/* SheetColumns */.$.PACIENTE.ID] === id;
              });
              if (row) {
                _context.n = 2;
                break;
              }
              return _context.a(2, null);
            case 2:
              return _context.a(2, PacienteMapper.PacienteMapper.toDomain(row));
          }
        }, _callee, this);
      }));
      function findById(_x) {
        return _findById.apply(this, arguments);
      }
      return findById;
    }()
  }, {
    key: "findByEmail",
    value: function () {
      var _findByEmail = GoogleSheetsPacienteRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsPacienteRepository_regenerator().m(function _callee2(email) {
        var rows, cleanEmail, row;
        return GoogleSheetsPacienteRepository_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return this.readAllRows();
            case 1:
              rows = _context2.v;
              cleanEmail = email.trim().toLowerCase();
              row = rows.find(function (r) {
                return r[GoogleSheetsColumns/* SheetColumns */.$.PACIENTE.EMAIL] && r[GoogleSheetsColumns/* SheetColumns */.$.PACIENTE.EMAIL].trim().toLowerCase() === cleanEmail;
              });
              if (row) {
                _context2.n = 2;
                break;
              }
              return _context2.a(2, null);
            case 2:
              return _context2.a(2, PacienteMapper.PacienteMapper.toDomain(row));
          }
        }, _callee2, this);
      }));
      function findByEmail(_x2) {
        return _findByEmail.apply(this, arguments);
      }
      return findByEmail;
    }()
  }, {
    key: "save",
    value: function () {
      var _save = GoogleSheetsPacienteRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsPacienteRepository_regenerator().m(function _callee3(paciente) {
        var row;
        return GoogleSheetsPacienteRepository_regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              row = PacienteMapper.PacienteMapper.toRow(paciente);
              _context3.n = 1;
              return this.writeRow(row, paciente.id.value, 0);
            case 1:
              return _context3.a(2);
          }
        }, _callee3, this);
      }));
      function save(_x3) {
        return _save.apply(this, arguments);
      }
      return save;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = GoogleSheetsPacienteRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsPacienteRepository_regenerator().m(function _callee4(paciente) {
        return GoogleSheetsPacienteRepository_regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              _context4.n = 1;
              return this.save(paciente);
            case 1:
              return _context4.a(2);
          }
        }, _callee4, this);
      }));
      function update(_x4) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }]);
}(GoogleSheetsRepository);
;// ./src/application/repositories/CheckinRepositoryInterface.js
function CheckinRepositoryInterface_typeof(o) { "@babel/helpers - typeof"; return CheckinRepositoryInterface_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, CheckinRepositoryInterface_typeof(o); }
function CheckinRepositoryInterface_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return CheckinRepositoryInterface_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (CheckinRepositoryInterface_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, CheckinRepositoryInterface_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, CheckinRepositoryInterface_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), CheckinRepositoryInterface_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", CheckinRepositoryInterface_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), CheckinRepositoryInterface_regeneratorDefine2(u), CheckinRepositoryInterface_regeneratorDefine2(u, o, "Generator"), CheckinRepositoryInterface_regeneratorDefine2(u, n, function () { return this; }), CheckinRepositoryInterface_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (CheckinRepositoryInterface_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function CheckinRepositoryInterface_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } CheckinRepositoryInterface_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { CheckinRepositoryInterface_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, CheckinRepositoryInterface_regeneratorDefine2(e, r, n, t); }
function CheckinRepositoryInterface_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function CheckinRepositoryInterface_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { CheckinRepositoryInterface_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { CheckinRepositoryInterface_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function CheckinRepositoryInterface_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function CheckinRepositoryInterface_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, CheckinRepositoryInterface_toPropertyKey(o.key), o); } }
function CheckinRepositoryInterface_createClass(e, r, t) { return r && CheckinRepositoryInterface_defineProperties(e.prototype, r), t && CheckinRepositoryInterface_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function CheckinRepositoryInterface_toPropertyKey(t) { var i = CheckinRepositoryInterface_toPrimitive(t, "string"); return "symbol" == CheckinRepositoryInterface_typeof(i) ? i : i + ""; }
function CheckinRepositoryInterface_toPrimitive(t, r) { if ("object" != CheckinRepositoryInterface_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != CheckinRepositoryInterface_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * CheckinRepositoryInterface.js
 * Interface (Contract) for CheckIn persistence operations.
 */
var CheckinRepositoryInterface = /*#__PURE__*/(/* unused pure expression or super */ null && (function () {
  function CheckinRepositoryInterface() {
    CheckinRepositoryInterface_classCallCheck(this, CheckinRepositoryInterface);
  }
  return CheckinRepositoryInterface_createClass(CheckinRepositoryInterface, [{
    key: "findById",
    value: function () {
      var _findById = CheckinRepositoryInterface_asyncToGenerator(/*#__PURE__*/CheckinRepositoryInterface_regenerator().m(function _callee(id) {
        return CheckinRepositoryInterface_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              throw new Error('Método findById não implementado.');
            case 1:
              return _context.a(2);
          }
        }, _callee);
      }));
      function findById(_x) {
        return _findById.apply(this, arguments);
      }
      return findById;
    }()
  }, {
    key: "findByPacienteId",
    value: function () {
      var _findByPacienteId = CheckinRepositoryInterface_asyncToGenerator(/*#__PURE__*/CheckinRepositoryInterface_regenerator().m(function _callee2(pacienteId) {
        return CheckinRepositoryInterface_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              throw new Error('Método findByPacienteId não implementado.');
            case 1:
              return _context2.a(2);
          }
        }, _callee2);
      }));
      function findByPacienteId(_x2) {
        return _findByPacienteId.apply(this, arguments);
      }
      return findByPacienteId;
    }()
  }, {
    key: "findByInterval",
    value: function () {
      var _findByInterval = CheckinRepositoryInterface_asyncToGenerator(/*#__PURE__*/CheckinRepositoryInterface_regenerator().m(function _callee3(pacienteId, startDate, endDate) {
        return CheckinRepositoryInterface_regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              throw new Error('Método findByInterval não implementado.');
            case 1:
              return _context3.a(2);
          }
        }, _callee3);
      }));
      function findByInterval(_x3, _x4, _x5) {
        return _findByInterval.apply(this, arguments);
      }
      return findByInterval;
    }()
  }, {
    key: "save",
    value: function () {
      var _save = CheckinRepositoryInterface_asyncToGenerator(/*#__PURE__*/CheckinRepositoryInterface_regenerator().m(function _callee4(checkin) {
        return CheckinRepositoryInterface_regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              throw new Error('Método save não implementado.');
            case 1:
              return _context4.a(2);
          }
        }, _callee4);
      }));
      function save(_x6) {
        return _save.apply(this, arguments);
      }
      return save;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = CheckinRepositoryInterface_asyncToGenerator(/*#__PURE__*/CheckinRepositoryInterface_regenerator().m(function _callee5(checkin) {
        return CheckinRepositoryInterface_regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              throw new Error('Método update não implementado.');
            case 1:
              return _context5.a(2);
          }
        }, _callee5);
      }));
      function update(_x7) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }]);
}()));
// EXTERNAL MODULE: ./src/infrastructure/repositories/CheckinMapper.js
var CheckinMapper = __webpack_require__(263);
;// ./src/infrastructure/repositories/GoogleSheetsCheckinRepository.js
function GoogleSheetsCheckinRepository_typeof(o) { "@babel/helpers - typeof"; return GoogleSheetsCheckinRepository_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, GoogleSheetsCheckinRepository_typeof(o); }
function GoogleSheetsCheckinRepository_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return GoogleSheetsCheckinRepository_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (GoogleSheetsCheckinRepository_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, GoogleSheetsCheckinRepository_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, GoogleSheetsCheckinRepository_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), GoogleSheetsCheckinRepository_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", GoogleSheetsCheckinRepository_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), GoogleSheetsCheckinRepository_regeneratorDefine2(u), GoogleSheetsCheckinRepository_regeneratorDefine2(u, o, "Generator"), GoogleSheetsCheckinRepository_regeneratorDefine2(u, n, function () { return this; }), GoogleSheetsCheckinRepository_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (GoogleSheetsCheckinRepository_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function GoogleSheetsCheckinRepository_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } GoogleSheetsCheckinRepository_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { GoogleSheetsCheckinRepository_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, GoogleSheetsCheckinRepository_regeneratorDefine2(e, r, n, t); }
function GoogleSheetsCheckinRepository_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function GoogleSheetsCheckinRepository_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { GoogleSheetsCheckinRepository_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { GoogleSheetsCheckinRepository_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function GoogleSheetsCheckinRepository_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function GoogleSheetsCheckinRepository_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, GoogleSheetsCheckinRepository_toPropertyKey(o.key), o); } }
function GoogleSheetsCheckinRepository_createClass(e, r, t) { return r && GoogleSheetsCheckinRepository_defineProperties(e.prototype, r), t && GoogleSheetsCheckinRepository_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function GoogleSheetsCheckinRepository_toPropertyKey(t) { var i = GoogleSheetsCheckinRepository_toPrimitive(t, "string"); return "symbol" == GoogleSheetsCheckinRepository_typeof(i) ? i : i + ""; }
function GoogleSheetsCheckinRepository_toPrimitive(t, r) { if ("object" != GoogleSheetsCheckinRepository_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != GoogleSheetsCheckinRepository_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function GoogleSheetsCheckinRepository_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && GoogleSheetsCheckinRepository_setPrototypeOf(t, e); }
function GoogleSheetsCheckinRepository_setPrototypeOf(t, e) { return GoogleSheetsCheckinRepository_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, GoogleSheetsCheckinRepository_setPrototypeOf(t, e); }
function GoogleSheetsCheckinRepository_callSuper(t, o, e) { return o = GoogleSheetsCheckinRepository_getPrototypeOf(o), GoogleSheetsCheckinRepository_possibleConstructorReturn(t, GoogleSheetsCheckinRepository_isNativeReflectConstruct() ? Reflect.construct(o, e || [], GoogleSheetsCheckinRepository_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function GoogleSheetsCheckinRepository_possibleConstructorReturn(t, e) { if (e && ("object" == GoogleSheetsCheckinRepository_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return GoogleSheetsCheckinRepository_assertThisInitialized(t); }
function GoogleSheetsCheckinRepository_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function GoogleSheetsCheckinRepository_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (GoogleSheetsCheckinRepository_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function GoogleSheetsCheckinRepository_getPrototypeOf(t) { return GoogleSheetsCheckinRepository_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, GoogleSheetsCheckinRepository_getPrototypeOf(t); }




var GoogleSheetsCheckinRepository = /*#__PURE__*/function (_GoogleSheetsReposito) {
  function GoogleSheetsCheckinRepository() {
    GoogleSheetsCheckinRepository_classCallCheck(this, GoogleSheetsCheckinRepository);
    return GoogleSheetsCheckinRepository_callSuper(this, GoogleSheetsCheckinRepository, ['Check_Ins']);
  }
  GoogleSheetsCheckinRepository_inherits(GoogleSheetsCheckinRepository, _GoogleSheetsReposito);
  return GoogleSheetsCheckinRepository_createClass(GoogleSheetsCheckinRepository, [{
    key: "findById",
    value: function () {
      var _findById = GoogleSheetsCheckinRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsCheckinRepository_regenerator().m(function _callee(id) {
        var rows, row;
        return GoogleSheetsCheckinRepository_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.readAllRows();
            case 1:
              rows = _context.v;
              row = rows.find(function (r) {
                return r[GoogleSheetsColumns/* SheetColumns */.$.CHECKIN.ID] === id;
              });
              if (row) {
                _context.n = 2;
                break;
              }
              return _context.a(2, null);
            case 2:
              return _context.a(2, CheckinMapper.CheckinMapper.toDomain(row));
          }
        }, _callee, this);
      }));
      function findById(_x) {
        return _findById.apply(this, arguments);
      }
      return findById;
    }()
  }, {
    key: "findByPacienteId",
    value: function () {
      var _findByPacienteId = GoogleSheetsCheckinRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsCheckinRepository_regenerator().m(function _callee2(pacienteId) {
        var rows, matches;
        return GoogleSheetsCheckinRepository_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return this.readAllRows();
            case 1:
              rows = _context2.v;
              matches = rows.filter(function (r) {
                return r[GoogleSheetsColumns/* SheetColumns */.$.CHECKIN.PACIENTE_ID] === pacienteId;
              });
              return _context2.a(2, matches.map(function (r) {
                return CheckinMapper.CheckinMapper.toDomain(r);
              }));
          }
        }, _callee2, this);
      }));
      function findByPacienteId(_x2) {
        return _findByPacienteId.apply(this, arguments);
      }
      return findByPacienteId;
    }()
  }, {
    key: "findByInterval",
    value: function () {
      var _findByInterval = GoogleSheetsCheckinRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsCheckinRepository_regenerator().m(function _callee3(pacienteId, startDate, endDate) {
        var rows, startMs, endMs, matches;
        return GoogleSheetsCheckinRepository_regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return this.readAllRows();
            case 1:
              rows = _context3.v;
              startMs = startDate.getTime();
              endMs = endDate.getTime();
              matches = rows.filter(function (r) {
                if (r[GoogleSheetsColumns/* SheetColumns */.$.CHECKIN.PACIENTE_ID] !== pacienteId) return false;
                var prescritaTime = new Date(r[GoogleSheetsColumns/* SheetColumns */.$.CHECKIN.DATA_HORA_PRESCRITA]).getTime();
                return prescritaTime >= startMs && prescritaTime <= endMs;
              });
              return _context3.a(2, matches.map(function (r) {
                return CheckinMapper.CheckinMapper.toDomain(r);
              }));
          }
        }, _callee3, this);
      }));
      function findByInterval(_x3, _x4, _x5) {
        return _findByInterval.apply(this, arguments);
      }
      return findByInterval;
    }()
  }, {
    key: "save",
    value: function () {
      var _save = GoogleSheetsCheckinRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsCheckinRepository_regenerator().m(function _callee4(checkin) {
        var row;
        return GoogleSheetsCheckinRepository_regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              row = CheckinMapper.CheckinMapper.toRow(checkin);
              _context4.n = 1;
              return this.writeRow(row, checkin.id.value, 0);
            case 1:
              return _context4.a(2);
          }
        }, _callee4, this);
      }));
      function save(_x6) {
        return _save.apply(this, arguments);
      }
      return save;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = GoogleSheetsCheckinRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsCheckinRepository_regenerator().m(function _callee5(checkin) {
        return GoogleSheetsCheckinRepository_regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              _context5.n = 1;
              return this.save(checkin);
            case 1:
              return _context5.a(2);
          }
        }, _callee5, this);
      }));
      function update(_x7) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }]);
}(GoogleSheetsRepository);
;// ./src/application/repositories/ProtocoloRepositoryInterface.js
function ProtocoloRepositoryInterface_typeof(o) { "@babel/helpers - typeof"; return ProtocoloRepositoryInterface_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, ProtocoloRepositoryInterface_typeof(o); }
function ProtocoloRepositoryInterface_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return ProtocoloRepositoryInterface_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (ProtocoloRepositoryInterface_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, ProtocoloRepositoryInterface_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, ProtocoloRepositoryInterface_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), ProtocoloRepositoryInterface_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", ProtocoloRepositoryInterface_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), ProtocoloRepositoryInterface_regeneratorDefine2(u), ProtocoloRepositoryInterface_regeneratorDefine2(u, o, "Generator"), ProtocoloRepositoryInterface_regeneratorDefine2(u, n, function () { return this; }), ProtocoloRepositoryInterface_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (ProtocoloRepositoryInterface_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function ProtocoloRepositoryInterface_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } ProtocoloRepositoryInterface_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { ProtocoloRepositoryInterface_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, ProtocoloRepositoryInterface_regeneratorDefine2(e, r, n, t); }
function ProtocoloRepositoryInterface_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function ProtocoloRepositoryInterface_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { ProtocoloRepositoryInterface_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { ProtocoloRepositoryInterface_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ProtocoloRepositoryInterface_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function ProtocoloRepositoryInterface_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, ProtocoloRepositoryInterface_toPropertyKey(o.key), o); } }
function ProtocoloRepositoryInterface_createClass(e, r, t) { return r && ProtocoloRepositoryInterface_defineProperties(e.prototype, r), t && ProtocoloRepositoryInterface_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function ProtocoloRepositoryInterface_toPropertyKey(t) { var i = ProtocoloRepositoryInterface_toPrimitive(t, "string"); return "symbol" == ProtocoloRepositoryInterface_typeof(i) ? i : i + ""; }
function ProtocoloRepositoryInterface_toPrimitive(t, r) { if ("object" != ProtocoloRepositoryInterface_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != ProtocoloRepositoryInterface_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * ProtocoloRepositoryInterface.js
 * Interface (Contract) for Protocolo and Suplemento read/write operations.
 */
var ProtocoloRepositoryInterface = /*#__PURE__*/(/* unused pure expression or super */ null && (function () {
  function ProtocoloRepositoryInterface() {
    ProtocoloRepositoryInterface_classCallCheck(this, ProtocoloRepositoryInterface);
  }
  return ProtocoloRepositoryInterface_createClass(ProtocoloRepositoryInterface, [{
    key: "findById",
    value: function () {
      var _findById = ProtocoloRepositoryInterface_asyncToGenerator(/*#__PURE__*/ProtocoloRepositoryInterface_regenerator().m(function _callee(id) {
        return ProtocoloRepositoryInterface_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              throw new Error('Método findById não implementado.');
            case 1:
              return _context.a(2);
          }
        }, _callee);
      }));
      function findById(_x) {
        return _findById.apply(this, arguments);
      }
      return findById;
    }()
  }, {
    key: "save",
    value: function () {
      var _save = ProtocoloRepositoryInterface_asyncToGenerator(/*#__PURE__*/ProtocoloRepositoryInterface_regenerator().m(function _callee2(protocolo) {
        return ProtocoloRepositoryInterface_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              throw new Error('Método save não implementado.');
            case 1:
              return _context2.a(2);
          }
        }, _callee2);
      }));
      function save(_x2) {
        return _save.apply(this, arguments);
      }
      return save;
    }()
  }, {
    key: "findSuplementoById",
    value: function () {
      var _findSuplementoById = ProtocoloRepositoryInterface_asyncToGenerator(/*#__PURE__*/ProtocoloRepositoryInterface_regenerator().m(function _callee3(suplementoId) {
        return ProtocoloRepositoryInterface_regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              throw new Error('Método findSuplementoById não implementado.');
            case 1:
              return _context3.a(2);
          }
        }, _callee3);
      }));
      function findSuplementoById(_x3) {
        return _findSuplementoById.apply(this, arguments);
      }
      return findSuplementoById;
    }()
  }, {
    key: "findSuplementosByProtocoloId",
    value: function () {
      var _findSuplementosByProtocoloId = ProtocoloRepositoryInterface_asyncToGenerator(/*#__PURE__*/ProtocoloRepositoryInterface_regenerator().m(function _callee4(protocoloId) {
        return ProtocoloRepositoryInterface_regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              throw new Error('Método findSuplementosByProtocoloId não implementado.');
            case 1:
              return _context4.a(2);
          }
        }, _callee4);
      }));
      function findSuplementosByProtocoloId(_x4) {
        return _findSuplementosByProtocoloId.apply(this, arguments);
      }
      return findSuplementosByProtocoloId;
    }()
  }]);
}()));
// EXTERNAL MODULE: ./src/domain/valueObjects/UUID.js
var UUID = __webpack_require__(744);
;// ./src/domain/entities/Suplemento.js
function Suplemento_typeof(o) { "@babel/helpers - typeof"; return Suplemento_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Suplemento_typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function Suplemento_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function Suplemento_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, Suplemento_toPropertyKey(o.key), o); } }
function Suplemento_createClass(e, r, t) { return r && Suplemento_defineProperties(e.prototype, r), t && Suplemento_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function Suplemento_toPropertyKey(t) { var i = Suplemento_toPrimitive(t, "string"); return "symbol" == Suplemento_typeof(i) ? i : i + ""; }
function Suplemento_toPrimitive(t, r) { if ("object" != Suplemento_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Suplemento_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateMethodInitSpec(e, a) { Suplemento_checkPrivateRedeclaration(e, a), a.add(e); }
function Suplemento_classPrivateFieldInitSpec(e, t, a) { Suplemento_checkPrivateRedeclaration(e, t), t.set(e, a); }
function Suplemento_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function Suplemento_classPrivateFieldGet(s, a) { return s.get(Suplemento_assertClassBrand(s, a)); }
function Suplemento_classPrivateFieldSet(s, a, r) { return s.set(Suplemento_assertClassBrand(s, a), r), r; }
function Suplemento_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }


/**
 * Suplemento.js
 * Domain Entity representing a prescribed clinical supplement.
 */
var _id = /*#__PURE__*/new WeakMap();
var _protocoloId = /*#__PURE__*/new WeakMap();
var _nome = /*#__PURE__*/new WeakMap();
var _dosagem = /*#__PURE__*/new WeakMap();
var _horarios = /*#__PURE__*/new WeakMap();
var _instrucoes = /*#__PURE__*/new WeakMap();
var _Suplemento_brand = /*#__PURE__*/new WeakSet();
var Suplemento = /*#__PURE__*/function () {
  function Suplemento(_ref) {
    var id = _ref.id,
      protocoloId = _ref.protocoloId,
      nome = _ref.nome,
      dosagem = _ref.dosagem,
      _horarios2 = _ref.horarios,
      instrucoes = _ref.instrucoes;
    Suplemento_classCallCheck(this, Suplemento);
    _classPrivateMethodInitSpec(this, _Suplemento_brand);
    Suplemento_classPrivateFieldInitSpec(this, _id, void 0);
    Suplemento_classPrivateFieldInitSpec(this, _protocoloId, void 0);
    Suplemento_classPrivateFieldInitSpec(this, _nome, void 0);
    Suplemento_classPrivateFieldInitSpec(this, _dosagem, void 0);
    Suplemento_classPrivateFieldInitSpec(this, _horarios, void 0);
    // Array of "HH:MM" strings
    Suplemento_classPrivateFieldInitSpec(this, _instrucoes, void 0);
    if (!(id instanceof UUID/* UUID */.k)) throw new Error('ID do Suplemento deve ser UUID.');
    if (!(protocoloId instanceof UUID/* UUID */.k)) throw new Error('ID do Protocolo do Suplemento deve ser UUID.');
    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
      throw new Error('Nome do suplemento não pode ser vazio.');
    }
    if (!dosagem || typeof dosagem !== 'string') {
      throw new Error('Dosagem do suplemento inválida.');
    }
    if (!Array.isArray(_horarios2) || _horarios2.length === 0) {
      throw new Error('Suplemento deve possuir pelo menos um horário prescrito.');
    }
    Suplemento_assertClassBrand(_Suplemento_brand, this, _validateHorarios).call(this, _horarios2);
    Suplemento_classPrivateFieldSet(_id, this, id);
    Suplemento_classPrivateFieldSet(_protocoloId, this, protocoloId);
    Suplemento_classPrivateFieldSet(_nome, this, nome.trim());
    Suplemento_classPrivateFieldSet(_dosagem, this, dosagem.trim());
    Suplemento_classPrivateFieldSet(_horarios, this, Object.freeze(_toConsumableArray(_horarios2))); // Immutable array
    Suplemento_classPrivateFieldSet(_instrucoes, this, (instrucoes || '').trim());
  }
  return Suplemento_createClass(Suplemento, [{
    key: "id",
    get: function get() {
      return Suplemento_classPrivateFieldGet(_id, this);
    }
  }, {
    key: "protocoloId",
    get: function get() {
      return Suplemento_classPrivateFieldGet(_protocoloId, this);
    }
  }, {
    key: "nome",
    get: function get() {
      return Suplemento_classPrivateFieldGet(_nome, this);
    }
  }, {
    key: "dosagem",
    get: function get() {
      return Suplemento_classPrivateFieldGet(_dosagem, this);
    }
  }, {
    key: "horarios",
    get: function get() {
      return Suplemento_classPrivateFieldGet(_horarios, this);
    }
  }, {
    key: "instrucoes",
    get: function get() {
      return Suplemento_classPrivateFieldGet(_instrucoes, this);
    }
  }]);
}();
function _validateHorarios(horarios) {
  var timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  var _iterator = _createForOfIteratorHelper(horarios),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var h = _step.value;
      if (typeof h !== 'string' || !timeRegex.test(h)) {
        throw new Error("Hor\xE1rio de prescri\xE7\xE3o inv\xE1lido (formato esperado HH:MM): ".concat(h));
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
;// ./src/domain/entities/Protocolo.js
function Protocolo_typeof(o) { "@babel/helpers - typeof"; return Protocolo_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Protocolo_typeof(o); }
function Protocolo_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function Protocolo_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, Protocolo_toPropertyKey(o.key), o); } }
function Protocolo_createClass(e, r, t) { return r && Protocolo_defineProperties(e.prototype, r), t && Protocolo_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function Protocolo_toPropertyKey(t) { var i = Protocolo_toPrimitive(t, "string"); return "symbol" == Protocolo_typeof(i) ? i : i + ""; }
function Protocolo_toPrimitive(t, r) { if ("object" != Protocolo_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Protocolo_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Protocolo_classPrivateFieldInitSpec(e, t, a) { Protocolo_checkPrivateRedeclaration(e, t), t.set(e, a); }
function Protocolo_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function Protocolo_classPrivateFieldGet(s, a) { return s.get(Protocolo_assertClassBrand(s, a)); }
function Protocolo_classPrivateFieldSet(s, a, r) { return s.set(Protocolo_assertClassBrand(s, a), r), r; }
function Protocolo_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }



/**
 * Protocolo.js
 * Domain Aggregate Root representing a clinical treatment protocol.
 */
var Protocolo_id = /*#__PURE__*/new WeakMap();
var Protocolo_nome = /*#__PURE__*/new WeakMap();
var _suplementos = /*#__PURE__*/new WeakMap();
var _duracaoDias = /*#__PURE__*/new WeakMap();
var Protocolo = /*#__PURE__*/function () {
  function Protocolo(_ref) {
    var id = _ref.id,
      nome = _ref.nome,
      suplementos = _ref.suplementos,
      duracaoDias = _ref.duracaoDias;
    Protocolo_classCallCheck(this, Protocolo);
    Protocolo_classPrivateFieldInitSpec(this, Protocolo_id, void 0);
    Protocolo_classPrivateFieldInitSpec(this, Protocolo_nome, void 0);
    Protocolo_classPrivateFieldInitSpec(this, _suplementos, void 0);
    // Array of Suplemento entities
    Protocolo_classPrivateFieldInitSpec(this, _duracaoDias, void 0);
    if (!(id instanceof UUID/* UUID */.k)) throw new Error('ID do Protocolo deve ser UUID.');
    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
      throw new Error('Nome do protocolo não pode ser vazio.');
    }
    if (!Number.isInteger(duracaoDias) || duracaoDias <= 0 || duracaoDias > 365) {
      throw new Error('A duração do protocolo deve ser entre 1 e 365 dias.');
    }
    Protocolo_classPrivateFieldSet(Protocolo_id, this, id);
    Protocolo_classPrivateFieldSet(Protocolo_nome, this, nome.trim());
    Protocolo_classPrivateFieldSet(_suplementos, this, Array.isArray(suplementos) ? suplementos : []);
    Protocolo_classPrivateFieldSet(_duracaoDias, this, duracaoDias);
  }
  return Protocolo_createClass(Protocolo, [{
    key: "id",
    get: function get() {
      return Protocolo_classPrivateFieldGet(Protocolo_id, this);
    }
  }, {
    key: "nome",
    get: function get() {
      return Protocolo_classPrivateFieldGet(Protocolo_nome, this);
    }
  }, {
    key: "suplementos",
    get: function get() {
      return Protocolo_classPrivateFieldGet(_suplementos, this);
    }
  }, {
    key: "duracaoDias",
    get: function get() {
      return Protocolo_classPrivateFieldGet(_duracaoDias, this);
    }
  }, {
    key: "adicionarSuplemento",
    value: function adicionarSuplemento(suplemento) {
      if (!(suplemento instanceof Suplemento)) {
        throw new Error('O item adicionado deve ser uma instância de Suplemento.');
      }
      // Prevent duplicates
      var alreadyExists = Protocolo_classPrivateFieldGet(_suplementos, this).some(function (s) {
        return s.id.equals(suplemento.id);
      });
      if (alreadyExists) {
        throw new Error('Este suplemento já faz parte do protocolo.');
      }
      Protocolo_classPrivateFieldGet(_suplementos, this).push(suplemento);
    }
  }]);
}();
;// ./src/infrastructure/repositories/GoogleSheetsProtocoloRepository.js
function GoogleSheetsProtocoloRepository_typeof(o) { "@babel/helpers - typeof"; return GoogleSheetsProtocoloRepository_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, GoogleSheetsProtocoloRepository_typeof(o); }
function GoogleSheetsProtocoloRepository_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = GoogleSheetsProtocoloRepository_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function GoogleSheetsProtocoloRepository_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return GoogleSheetsProtocoloRepository_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? GoogleSheetsProtocoloRepository_arrayLikeToArray(r, a) : void 0; } }
function GoogleSheetsProtocoloRepository_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function GoogleSheetsProtocoloRepository_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return GoogleSheetsProtocoloRepository_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (GoogleSheetsProtocoloRepository_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, GoogleSheetsProtocoloRepository_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, GoogleSheetsProtocoloRepository_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), GoogleSheetsProtocoloRepository_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", GoogleSheetsProtocoloRepository_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), GoogleSheetsProtocoloRepository_regeneratorDefine2(u), GoogleSheetsProtocoloRepository_regeneratorDefine2(u, o, "Generator"), GoogleSheetsProtocoloRepository_regeneratorDefine2(u, n, function () { return this; }), GoogleSheetsProtocoloRepository_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (GoogleSheetsProtocoloRepository_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function GoogleSheetsProtocoloRepository_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } GoogleSheetsProtocoloRepository_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { GoogleSheetsProtocoloRepository_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, GoogleSheetsProtocoloRepository_regeneratorDefine2(e, r, n, t); }
function GoogleSheetsProtocoloRepository_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function GoogleSheetsProtocoloRepository_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { GoogleSheetsProtocoloRepository_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { GoogleSheetsProtocoloRepository_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function GoogleSheetsProtocoloRepository_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function GoogleSheetsProtocoloRepository_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, GoogleSheetsProtocoloRepository_toPropertyKey(o.key), o); } }
function GoogleSheetsProtocoloRepository_createClass(e, r, t) { return r && GoogleSheetsProtocoloRepository_defineProperties(e.prototype, r), t && GoogleSheetsProtocoloRepository_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function GoogleSheetsProtocoloRepository_toPropertyKey(t) { var i = GoogleSheetsProtocoloRepository_toPrimitive(t, "string"); return "symbol" == GoogleSheetsProtocoloRepository_typeof(i) ? i : i + ""; }
function GoogleSheetsProtocoloRepository_toPrimitive(t, r) { if ("object" != GoogleSheetsProtocoloRepository_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != GoogleSheetsProtocoloRepository_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function GoogleSheetsProtocoloRepository_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && GoogleSheetsProtocoloRepository_setPrototypeOf(t, e); }
function GoogleSheetsProtocoloRepository_setPrototypeOf(t, e) { return GoogleSheetsProtocoloRepository_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, GoogleSheetsProtocoloRepository_setPrototypeOf(t, e); }
function GoogleSheetsProtocoloRepository_callSuper(t, o, e) { return o = GoogleSheetsProtocoloRepository_getPrototypeOf(o), GoogleSheetsProtocoloRepository_possibleConstructorReturn(t, GoogleSheetsProtocoloRepository_isNativeReflectConstruct() ? Reflect.construct(o, e || [], GoogleSheetsProtocoloRepository_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function GoogleSheetsProtocoloRepository_possibleConstructorReturn(t, e) { if (e && ("object" == GoogleSheetsProtocoloRepository_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return GoogleSheetsProtocoloRepository_assertThisInitialized(t); }
function GoogleSheetsProtocoloRepository_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function GoogleSheetsProtocoloRepository_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (GoogleSheetsProtocoloRepository_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function GoogleSheetsProtocoloRepository_getPrototypeOf(t) { return GoogleSheetsProtocoloRepository_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, GoogleSheetsProtocoloRepository_getPrototypeOf(t); }
function GoogleSheetsProtocoloRepository_classPrivateFieldInitSpec(e, t, a) { GoogleSheetsProtocoloRepository_checkPrivateRedeclaration(e, t), t.set(e, a); }
function GoogleSheetsProtocoloRepository_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function GoogleSheetsProtocoloRepository_classPrivateFieldGet(s, a) { return s.get(GoogleSheetsProtocoloRepository_assertClassBrand(s, a)); }
function GoogleSheetsProtocoloRepository_classPrivateFieldSet(s, a, r) { return s.set(GoogleSheetsProtocoloRepository_assertClassBrand(s, a), r), r; }
function GoogleSheetsProtocoloRepository_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }





var _suplementosSheet = /*#__PURE__*/new WeakMap();
var GoogleSheetsProtocoloRepository = /*#__PURE__*/function (_GoogleSheetsReposito) {
  function GoogleSheetsProtocoloRepository() {
    var _this;
    GoogleSheetsProtocoloRepository_classCallCheck(this, GoogleSheetsProtocoloRepository);
    _this = GoogleSheetsProtocoloRepository_callSuper(this, GoogleSheetsProtocoloRepository, ['Protocolos']);
    GoogleSheetsProtocoloRepository_classPrivateFieldInitSpec(_this, _suplementosSheet, void 0);
    GoogleSheetsProtocoloRepository_classPrivateFieldSet(_suplementosSheet, _this, new GoogleSheetsRepository('Suplementos'));
    return _this;
  }
  GoogleSheetsProtocoloRepository_inherits(GoogleSheetsProtocoloRepository, _GoogleSheetsReposito);
  return GoogleSheetsProtocoloRepository_createClass(GoogleSheetsProtocoloRepository, [{
    key: "findById",
    value: function () {
      var _findById = GoogleSheetsProtocoloRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsProtocoloRepository_regenerator().m(function _callee(id) {
        var pRows, pRow, sRows, supMatches, suplementos;
        return GoogleSheetsProtocoloRepository_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.readAllRows();
            case 1:
              pRows = _context.v;
              pRow = pRows.find(function (r) {
                return r[0] === id;
              });
              if (pRow) {
                _context.n = 2;
                break;
              }
              return _context.a(2, null);
            case 2:
              _context.n = 3;
              return GoogleSheetsProtocoloRepository_classPrivateFieldGet(_suplementosSheet, this).readAllRows();
            case 3:
              sRows = _context.v;
              supMatches = sRows.filter(function (r) {
                return r[1] === id;
              });
              suplementos = supMatches.map(function (r) {
                var horariosArray = [];
                try {
                  horariosArray = typeof r[4] === 'string' ? JSON.parse(r[4]) : r[4];
                } catch (e) {
                  horariosArray = [];
                }
                return new Suplemento({
                  id: new UUID/* UUID */.k(r[0]),
                  protocoloId: new UUID/* UUID */.k(r[1]),
                  nome: r[2],
                  dosagem: r[3],
                  horarios: horariosArray,
                  instrucoes: r[5]
                });
              });
              return _context.a(2, new Protocolo({
                id: new UUID/* UUID */.k(pRow[0]),
                nome: pRow[1],
                suplementos: suplementos,
                duracaoDias: Number(pRow[2])
              }));
          }
        }, _callee, this);
      }));
      function findById(_x) {
        return _findById.apply(this, arguments);
      }
      return findById;
    }()
  }, {
    key: "findSuplementoById",
    value: function () {
      var _findSuplementoById = GoogleSheetsProtocoloRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsProtocoloRepository_regenerator().m(function _callee2(suplementoId) {
        var sRows, r, horariosArray;
        return GoogleSheetsProtocoloRepository_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return GoogleSheetsProtocoloRepository_classPrivateFieldGet(_suplementosSheet, this).readAllRows();
            case 1:
              sRows = _context2.v;
              r = sRows.find(function (row) {
                return row[0] === suplementoId;
              });
              if (r) {
                _context2.n = 2;
                break;
              }
              return _context2.a(2, null);
            case 2:
              horariosArray = [];
              try {
                horariosArray = typeof r[4] === 'string' ? JSON.parse(r[4]) : r[4];
              } catch (e) {
                horariosArray = [];
              }
              return _context2.a(2, new Suplemento({
                id: new UUID/* UUID */.k(r[0]),
                protocoloId: new UUID/* UUID */.k(r[1]),
                nome: r[2],
                dosagem: r[3],
                horarios: horariosArray,
                instrucoes: r[5]
              }));
          }
        }, _callee2, this);
      }));
      function findSuplementoById(_x2) {
        return _findSuplementoById.apply(this, arguments);
      }
      return findSuplementoById;
    }()
  }, {
    key: "save",
    value: function () {
      var _save = GoogleSheetsProtocoloRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsProtocoloRepository_regenerator().m(function _callee3(protocolo) {
        var pRow, _iterator, _step, suplemento, sRow, _t;
        return GoogleSheetsProtocoloRepository_regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              // 1. Save Protocol info
              pRow = [protocolo.id.value, protocolo.nome, protocolo.duracaoDias];
              _context3.n = 1;
              return this.writeRow(pRow, protocolo.id.value, 0);
            case 1:
              // 2. Save each supplement
              _iterator = GoogleSheetsProtocoloRepository_createForOfIteratorHelper(protocolo.suplementos);
              _context3.p = 2;
              _iterator.s();
            case 3:
              if ((_step = _iterator.n()).done) {
                _context3.n = 5;
                break;
              }
              suplemento = _step.value;
              sRow = [suplemento.id.value, suplemento.protocoloId.value, suplemento.nome, suplemento.dosagem, JSON.stringify(suplemento.horarios), suplemento.instrucoes];
              _context3.n = 4;
              return GoogleSheetsProtocoloRepository_classPrivateFieldGet(_suplementosSheet, this).writeRow(sRow, suplemento.id.value, 0);
            case 4:
              _context3.n = 3;
              break;
            case 5:
              _context3.n = 7;
              break;
            case 6:
              _context3.p = 6;
              _t = _context3.v;
              _iterator.e(_t);
            case 7:
              _context3.p = 7;
              _iterator.f();
              return _context3.f(7);
            case 8:
              return _context3.a(2);
          }
        }, _callee3, this, [[2, 6, 7, 8]]);
      }));
      function save(_x3) {
        return _save.apply(this, arguments);
      }
      return save;
    }()
  }, {
    key: "findSuplementosByProtocoloId",
    value: function () {
      var _findSuplementosByProtocoloId = GoogleSheetsProtocoloRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsProtocoloRepository_regenerator().m(function _callee4(protocoloId) {
        var p;
        return GoogleSheetsProtocoloRepository_regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              _context4.n = 1;
              return this.findById(protocoloId);
            case 1:
              p = _context4.v;
              return _context4.a(2, p ? p.suplementos : []);
          }
        }, _callee4, this);
      }));
      function findSuplementosByProtocoloId(_x4) {
        return _findSuplementosByProtocoloId.apply(this, arguments);
      }
      return findSuplementosByProtocoloId;
    }()
  }]);
}(GoogleSheetsRepository);
;// ./src/application/repositories/GamificacaoRepositoryInterface.js
function GamificacaoRepositoryInterface_typeof(o) { "@babel/helpers - typeof"; return GamificacaoRepositoryInterface_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, GamificacaoRepositoryInterface_typeof(o); }
function GamificacaoRepositoryInterface_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return GamificacaoRepositoryInterface_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (GamificacaoRepositoryInterface_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, GamificacaoRepositoryInterface_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, GamificacaoRepositoryInterface_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), GamificacaoRepositoryInterface_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", GamificacaoRepositoryInterface_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), GamificacaoRepositoryInterface_regeneratorDefine2(u), GamificacaoRepositoryInterface_regeneratorDefine2(u, o, "Generator"), GamificacaoRepositoryInterface_regeneratorDefine2(u, n, function () { return this; }), GamificacaoRepositoryInterface_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (GamificacaoRepositoryInterface_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function GamificacaoRepositoryInterface_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } GamificacaoRepositoryInterface_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { GamificacaoRepositoryInterface_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, GamificacaoRepositoryInterface_regeneratorDefine2(e, r, n, t); }
function GamificacaoRepositoryInterface_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function GamificacaoRepositoryInterface_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { GamificacaoRepositoryInterface_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { GamificacaoRepositoryInterface_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function GamificacaoRepositoryInterface_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function GamificacaoRepositoryInterface_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, GamificacaoRepositoryInterface_toPropertyKey(o.key), o); } }
function GamificacaoRepositoryInterface_createClass(e, r, t) { return r && GamificacaoRepositoryInterface_defineProperties(e.prototype, r), t && GamificacaoRepositoryInterface_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function GamificacaoRepositoryInterface_toPropertyKey(t) { var i = GamificacaoRepositoryInterface_toPrimitive(t, "string"); return "symbol" == GamificacaoRepositoryInterface_typeof(i) ? i : i + ""; }
function GamificacaoRepositoryInterface_toPrimitive(t, r) { if ("object" != GamificacaoRepositoryInterface_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != GamificacaoRepositoryInterface_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * GamificacaoRepositoryInterface.js
 * Interface (Contract) for Gamificacao stats persistence operations.
 */
var GamificacaoRepositoryInterface = /*#__PURE__*/(/* unused pure expression or super */ null && (function () {
  function GamificacaoRepositoryInterface() {
    GamificacaoRepositoryInterface_classCallCheck(this, GamificacaoRepositoryInterface);
  }
  return GamificacaoRepositoryInterface_createClass(GamificacaoRepositoryInterface, [{
    key: "findByPacienteId",
    value: function () {
      var _findByPacienteId = GamificacaoRepositoryInterface_asyncToGenerator(/*#__PURE__*/GamificacaoRepositoryInterface_regenerator().m(function _callee(pacienteId) {
        return GamificacaoRepositoryInterface_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              throw new Error('Método findByPacienteId não implementado.');
            case 1:
              return _context.a(2);
          }
        }, _callee);
      }));
      function findByPacienteId(_x) {
        return _findByPacienteId.apply(this, arguments);
      }
      return findByPacienteId;
    }()
  }, {
    key: "save",
    value: function () {
      var _save = GamificacaoRepositoryInterface_asyncToGenerator(/*#__PURE__*/GamificacaoRepositoryInterface_regenerator().m(function _callee2(gamificacao) {
        return GamificacaoRepositoryInterface_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              throw new Error('Método save não implementado.');
            case 1:
              return _context2.a(2);
          }
        }, _callee2);
      }));
      function save(_x2) {
        return _save.apply(this, arguments);
      }
      return save;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = GamificacaoRepositoryInterface_asyncToGenerator(/*#__PURE__*/GamificacaoRepositoryInterface_regenerator().m(function _callee3(gamificacao) {
        return GamificacaoRepositoryInterface_regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              throw new Error('Método update não implementado.');
            case 1:
              return _context3.a(2);
          }
        }, _callee3);
      }));
      function update(_x3) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }]);
}()));
// EXTERNAL MODULE: ./src/domain/entities/Gamificacao.js
var Gamificacao = __webpack_require__(855);
;// ./src/infrastructure/repositories/GoogleSheetsGamificacaoRepository.js
function GoogleSheetsGamificacaoRepository_typeof(o) { "@babel/helpers - typeof"; return GoogleSheetsGamificacaoRepository_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, GoogleSheetsGamificacaoRepository_typeof(o); }
function GoogleSheetsGamificacaoRepository_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return GoogleSheetsGamificacaoRepository_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (GoogleSheetsGamificacaoRepository_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, GoogleSheetsGamificacaoRepository_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, GoogleSheetsGamificacaoRepository_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), GoogleSheetsGamificacaoRepository_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", GoogleSheetsGamificacaoRepository_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), GoogleSheetsGamificacaoRepository_regeneratorDefine2(u), GoogleSheetsGamificacaoRepository_regeneratorDefine2(u, o, "Generator"), GoogleSheetsGamificacaoRepository_regeneratorDefine2(u, n, function () { return this; }), GoogleSheetsGamificacaoRepository_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (GoogleSheetsGamificacaoRepository_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function GoogleSheetsGamificacaoRepository_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } GoogleSheetsGamificacaoRepository_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { GoogleSheetsGamificacaoRepository_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, GoogleSheetsGamificacaoRepository_regeneratorDefine2(e, r, n, t); }
function GoogleSheetsGamificacaoRepository_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function GoogleSheetsGamificacaoRepository_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { GoogleSheetsGamificacaoRepository_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { GoogleSheetsGamificacaoRepository_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function GoogleSheetsGamificacaoRepository_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function GoogleSheetsGamificacaoRepository_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, GoogleSheetsGamificacaoRepository_toPropertyKey(o.key), o); } }
function GoogleSheetsGamificacaoRepository_createClass(e, r, t) { return r && GoogleSheetsGamificacaoRepository_defineProperties(e.prototype, r), t && GoogleSheetsGamificacaoRepository_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function GoogleSheetsGamificacaoRepository_toPropertyKey(t) { var i = GoogleSheetsGamificacaoRepository_toPrimitive(t, "string"); return "symbol" == GoogleSheetsGamificacaoRepository_typeof(i) ? i : i + ""; }
function GoogleSheetsGamificacaoRepository_toPrimitive(t, r) { if ("object" != GoogleSheetsGamificacaoRepository_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != GoogleSheetsGamificacaoRepository_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function GoogleSheetsGamificacaoRepository_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && GoogleSheetsGamificacaoRepository_setPrototypeOf(t, e); }
function GoogleSheetsGamificacaoRepository_setPrototypeOf(t, e) { return GoogleSheetsGamificacaoRepository_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, GoogleSheetsGamificacaoRepository_setPrototypeOf(t, e); }
function GoogleSheetsGamificacaoRepository_callSuper(t, o, e) { return o = GoogleSheetsGamificacaoRepository_getPrototypeOf(o), GoogleSheetsGamificacaoRepository_possibleConstructorReturn(t, GoogleSheetsGamificacaoRepository_isNativeReflectConstruct() ? Reflect.construct(o, e || [], GoogleSheetsGamificacaoRepository_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function GoogleSheetsGamificacaoRepository_possibleConstructorReturn(t, e) { if (e && ("object" == GoogleSheetsGamificacaoRepository_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return GoogleSheetsGamificacaoRepository_assertThisInitialized(t); }
function GoogleSheetsGamificacaoRepository_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function GoogleSheetsGamificacaoRepository_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (GoogleSheetsGamificacaoRepository_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function GoogleSheetsGamificacaoRepository_getPrototypeOf(t) { return GoogleSheetsGamificacaoRepository_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, GoogleSheetsGamificacaoRepository_getPrototypeOf(t); }





var GoogleSheetsGamificacaoRepository = /*#__PURE__*/function (_GoogleSheetsReposito) {
  function GoogleSheetsGamificacaoRepository() {
    GoogleSheetsGamificacaoRepository_classCallCheck(this, GoogleSheetsGamificacaoRepository);
    return GoogleSheetsGamificacaoRepository_callSuper(this, GoogleSheetsGamificacaoRepository, ['Gamificacao']);
  }
  GoogleSheetsGamificacaoRepository_inherits(GoogleSheetsGamificacaoRepository, _GoogleSheetsReposito);
  return GoogleSheetsGamificacaoRepository_createClass(GoogleSheetsGamificacaoRepository, [{
    key: "findByPacienteId",
    value: function () {
      var _findByPacienteId = GoogleSheetsGamificacaoRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsGamificacaoRepository_regenerator().m(function _callee(pacienteId) {
        var rows, row, achievements;
        return GoogleSheetsGamificacaoRepository_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.readAllRows();
            case 1:
              rows = _context.v;
              row = rows.find(function (r) {
                return r[GoogleSheetsColumns/* SheetColumns */.$.GAMIFICACAO.PACIENTE_ID] === pacienteId;
              });
              if (row) {
                _context.n = 2;
                break;
              }
              return _context.a(2, null);
            case 2:
              achievements = [];
              try {
                achievements = typeof row[GoogleSheetsColumns/* SheetColumns */.$.GAMIFICACAO.CONQUISTAS] === 'string' ? JSON.parse(row[GoogleSheetsColumns/* SheetColumns */.$.GAMIFICACAO.CONQUISTAS]) : row[GoogleSheetsColumns/* SheetColumns */.$.GAMIFICACAO.CONQUISTAS];
              } catch (e) {
                achievements = [];
              }
              return _context.a(2, new Gamificacao.Gamificacao({
                id: new UUID/* UUID */.k(row[GoogleSheetsColumns/* SheetColumns */.$.GAMIFICACAO.ID]),
                pacienteId: new UUID/* UUID */.k(row[GoogleSheetsColumns/* SheetColumns */.$.GAMIFICACAO.PACIENTE_ID]),
                xpTotal: Number(row[GoogleSheetsColumns/* SheetColumns */.$.GAMIFICACAO.XP_TOTAL]),
                streakAtual: Number(row[GoogleSheetsColumns/* SheetColumns */.$.GAMIFICACAO.STREAK_ATUAL]),
                maiorStreak: Number(row[GoogleSheetsColumns/* SheetColumns */.$.GAMIFICACAO.MAIOR_STREAK]),
                conquistas: achievements
              }));
          }
        }, _callee, this);
      }));
      function findByPacienteId(_x) {
        return _findByPacienteId.apply(this, arguments);
      }
      return findByPacienteId;
    }()
  }, {
    key: "save",
    value: function () {
      var _save = GoogleSheetsGamificacaoRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsGamificacaoRepository_regenerator().m(function _callee2(gamificacao) {
        var row;
        return GoogleSheetsGamificacaoRepository_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              row = [];
              row[GoogleSheetsColumns/* SheetColumns */.$.GAMIFICACAO.ID] = gamificacao.id.value;
              row[GoogleSheetsColumns/* SheetColumns */.$.GAMIFICACAO.PACIENTE_ID] = gamificacao.pacienteId.value;
              row[GoogleSheetsColumns/* SheetColumns */.$.GAMIFICACAO.XP_TOTAL] = gamificacao.xpTotal;
              row[GoogleSheetsColumns/* SheetColumns */.$.GAMIFICACAO.STREAK_ATUAL] = gamificacao.streakAtual;
              row[GoogleSheetsColumns/* SheetColumns */.$.GAMIFICACAO.MAIOR_STREAK] = gamificacao.maiorStreak;
              row[GoogleSheetsColumns/* SheetColumns */.$.GAMIFICACAO.CONQUISTAS] = JSON.stringify(gamificacao.conquistas);
              _context2.n = 1;
              return this.writeRow(row, gamificacao.id.value, 0);
            case 1:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function save(_x2) {
        return _save.apply(this, arguments);
      }
      return save;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = GoogleSheetsGamificacaoRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsGamificacaoRepository_regenerator().m(function _callee3(gamificacao) {
        return GoogleSheetsGamificacaoRepository_regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return this.save(gamificacao);
            case 1:
              return _context3.a(2);
          }
        }, _callee3, this);
      }));
      function update(_x3) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }]);
}(GoogleSheetsRepository);
;// ./src/infrastructure/repositories/GoogleSheetsPermissaoRepository.js
function GoogleSheetsPermissaoRepository_typeof(o) { "@babel/helpers - typeof"; return GoogleSheetsPermissaoRepository_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, GoogleSheetsPermissaoRepository_typeof(o); }
function GoogleSheetsPermissaoRepository_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return GoogleSheetsPermissaoRepository_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (GoogleSheetsPermissaoRepository_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, GoogleSheetsPermissaoRepository_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, GoogleSheetsPermissaoRepository_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), GoogleSheetsPermissaoRepository_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", GoogleSheetsPermissaoRepository_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), GoogleSheetsPermissaoRepository_regeneratorDefine2(u), GoogleSheetsPermissaoRepository_regeneratorDefine2(u, o, "Generator"), GoogleSheetsPermissaoRepository_regeneratorDefine2(u, n, function () { return this; }), GoogleSheetsPermissaoRepository_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (GoogleSheetsPermissaoRepository_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function GoogleSheetsPermissaoRepository_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } GoogleSheetsPermissaoRepository_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { GoogleSheetsPermissaoRepository_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, GoogleSheetsPermissaoRepository_regeneratorDefine2(e, r, n, t); }
function GoogleSheetsPermissaoRepository_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function GoogleSheetsPermissaoRepository_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { GoogleSheetsPermissaoRepository_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { GoogleSheetsPermissaoRepository_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function GoogleSheetsPermissaoRepository_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function GoogleSheetsPermissaoRepository_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, GoogleSheetsPermissaoRepository_toPropertyKey(o.key), o); } }
function GoogleSheetsPermissaoRepository_createClass(e, r, t) { return r && GoogleSheetsPermissaoRepository_defineProperties(e.prototype, r), t && GoogleSheetsPermissaoRepository_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function GoogleSheetsPermissaoRepository_toPropertyKey(t) { var i = GoogleSheetsPermissaoRepository_toPrimitive(t, "string"); return "symbol" == GoogleSheetsPermissaoRepository_typeof(i) ? i : i + ""; }
function GoogleSheetsPermissaoRepository_toPrimitive(t, r) { if ("object" != GoogleSheetsPermissaoRepository_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != GoogleSheetsPermissaoRepository_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function GoogleSheetsPermissaoRepository_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && GoogleSheetsPermissaoRepository_setPrototypeOf(t, e); }
function GoogleSheetsPermissaoRepository_setPrototypeOf(t, e) { return GoogleSheetsPermissaoRepository_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, GoogleSheetsPermissaoRepository_setPrototypeOf(t, e); }
function GoogleSheetsPermissaoRepository_callSuper(t, o, e) { return o = GoogleSheetsPermissaoRepository_getPrototypeOf(o), GoogleSheetsPermissaoRepository_possibleConstructorReturn(t, GoogleSheetsPermissaoRepository_isNativeReflectConstruct() ? Reflect.construct(o, e || [], GoogleSheetsPermissaoRepository_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function GoogleSheetsPermissaoRepository_possibleConstructorReturn(t, e) { if (e && ("object" == GoogleSheetsPermissaoRepository_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return GoogleSheetsPermissaoRepository_assertThisInitialized(t); }
function GoogleSheetsPermissaoRepository_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function GoogleSheetsPermissaoRepository_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (GoogleSheetsPermissaoRepository_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function GoogleSheetsPermissaoRepository_getPrototypeOf(t) { return GoogleSheetsPermissaoRepository_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, GoogleSheetsPermissaoRepository_getPrototypeOf(t); }

var GoogleSheetsPermissaoRepository = /*#__PURE__*/function (_GoogleSheetsReposito) {
  function GoogleSheetsPermissaoRepository() {
    GoogleSheetsPermissaoRepository_classCallCheck(this, GoogleSheetsPermissaoRepository);
    return GoogleSheetsPermissaoRepository_callSuper(this, GoogleSheetsPermissaoRepository, ['PermissoesRetroativas']);
  }
  GoogleSheetsPermissaoRepository_inherits(GoogleSheetsPermissaoRepository, _GoogleSheetsReposito);
  return GoogleSheetsPermissaoRepository_createClass(GoogleSheetsPermissaoRepository, [{
    key: "findActiveByPacienteId",
    value: function () {
      var _findActiveByPacienteId = GoogleSheetsPermissaoRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsPermissaoRepository_regenerator().m(function _callee(pacienteId) {
        var rows, now, activePerm;
        return GoogleSheetsPermissaoRepository_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.readAllRows();
            case 1:
              rows = _context.v;
              now = new Date().getTime(); // Find a permission for the patient that has status ACTIVE and has not expired
              activePerm = rows.find(function (r) {
                if (r[1] !== pacienteId) return false;
                if (r[6] !== 'ATIVA') return false;
                var expTime = new Date(r[5]).getTime();
                return expTime > now;
              });
              if (activePerm) {
                _context.n = 2;
                break;
              }
              return _context.a(2, null);
            case 2:
              return _context.a(2, {
                id: activePerm[0],
                pacienteId: activePerm[1],
                horasLiberadas: Number(activePerm[2]),
                motivo: activePerm[3],
                operadorId: activePerm[4],
                expiraEm: activePerm[5],
                status: activePerm[6],
                createdAt: activePerm[7]
              });
          }
        }, _callee, this);
      }));
      function findActiveByPacienteId(_x) {
        return _findActiveByPacienteId.apply(this, arguments);
      }
      return findActiveByPacienteId;
    }()
  }, {
    key: "save",
    value: function () {
      var _save = GoogleSheetsPermissaoRepository_asyncToGenerator(/*#__PURE__*/GoogleSheetsPermissaoRepository_regenerator().m(function _callee2(permissao) {
        var row;
        return GoogleSheetsPermissaoRepository_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              row = [permissao.id, permissao.pacienteId, permissao.horasLiberadas, permissao.motivo, permissao.operadorId, permissao.expiraEm, permissao.status, permissao.createdAt];
              _context2.n = 1;
              return this.writeRow(row, permissao.id, 0);
            case 1:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function save(_x2) {
        return _save.apply(this, arguments);
      }
      return save;
    }()
  }]);
}(GoogleSheetsRepository);
;// ./src/infrastructure/services/BcryptGasService.js
function BcryptGasService_typeof(o) { "@babel/helpers - typeof"; return BcryptGasService_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, BcryptGasService_typeof(o); }
function BcryptGasService_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return BcryptGasService_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (BcryptGasService_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, BcryptGasService_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, BcryptGasService_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), BcryptGasService_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", BcryptGasService_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), BcryptGasService_regeneratorDefine2(u), BcryptGasService_regeneratorDefine2(u, o, "Generator"), BcryptGasService_regeneratorDefine2(u, n, function () { return this; }), BcryptGasService_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (BcryptGasService_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function BcryptGasService_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } BcryptGasService_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { BcryptGasService_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, BcryptGasService_regeneratorDefine2(e, r, n, t); }
function BcryptGasService_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function BcryptGasService_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { BcryptGasService_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { BcryptGasService_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function BcryptGasService_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function BcryptGasService_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, BcryptGasService_toPropertyKey(o.key), o); } }
function BcryptGasService_createClass(e, r, t) { return r && BcryptGasService_defineProperties(e.prototype, r), t && BcryptGasService_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function BcryptGasService_toPropertyKey(t) { var i = BcryptGasService_toPrimitive(t, "string"); return "symbol" == BcryptGasService_typeof(i) ? i : i + ""; }
function BcryptGasService_toPrimitive(t, r) { if ("object" != BcryptGasService_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != BcryptGasService_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function BcryptGasService_classPrivateMethodInitSpec(e, a) { BcryptGasService_checkPrivateRedeclaration(e, a), a.add(e); }
function BcryptGasService_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function BcryptGasService_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
var _BcryptGasService_brand = /*#__PURE__*/new WeakSet();
/**
 * BcryptGasService.js
 * Cryptography Service adapted for Google Apps Script.
 * Implements iterated key-stretching (PBKDF2-like) to resist brute-force attacks.
 * 
 * Security: Uses 1024 iterations (equivalent to bcrypt cost factor 10) of SHA-256
 * to make hash computation intentionally slow. This is NOT a single-pass SHA-256.
 * 
 * OWASP Reference: A02:2021 – Cryptographic Failures
 * CWE: CWE-916 – Use of Password Hash With Insufficient Computational Effort (MITIGATED)
 */
var BcryptGasService = /*#__PURE__*/function () {
  function BcryptGasService() {
    BcryptGasService_classCallCheck(this, BcryptGasService);
    /**
     * Iterated key-stretching: applies SHA-256 repeatedly (2^costFactor times).
     * This makes brute-force attacks ~1024x slower than single-pass SHA-256.
     * @param {string} password
     * @param {string} salt
     * @param {number} iterations
     * @returns {Promise<string>} Base64 encoded final hash
     */
    BcryptGasService_classPrivateMethodInitSpec(this, _BcryptGasService_brand);
  }
  return BcryptGasService_createClass(BcryptGasService, [{
    key: "hash",
    value: (
    /**
     * Generates a secure hash from a plain text password with iterated key-stretching.
     * @param {string} password 
     * @returns {Promise<string>} Hash in bcrypt format ($2b$10$...)
     */
    function () {
      var _hash = BcryptGasService_asyncToGenerator(/*#__PURE__*/BcryptGasService_regenerator().m(function _callee(password) {
        var salt, hashBase64, cleanHash;
        return BcryptGasService_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              if (password) {
                _context.n = 1;
                break;
              }
              throw new Error('Senha vazia não pode ser hasheada.');
            case 1:
              // 1. Generate a cryptographically strong salt (22 characters)
              salt = BcryptGasService_assertClassBrand(_BcryptGasService_brand, this, _generateSecureSalt).call(this, 22); // 2. Perform iterated key-stretching (PBKDF2-like approach)
              _context.n = 2;
              return BcryptGasService_assertClassBrand(_BcryptGasService_brand, this, _iteratedHash).call(this, password, salt, _ITERATIONS._);
            case 2:
              hashBase64 = _context.v;
              // 3. Format to standard Bcrypt signature structure: $2b$10$[22-char salt][31-char hash]
              cleanHash = hashBase64.replace(/[^A-Za-z0-9./]/g, '').substring(0, 31).padEnd(31, 'x');
              return _context.a(2, "$2b$10$".concat(salt).concat(cleanHash));
          }
        }, _callee, this);
      }));
      function hash(_x) {
        return _hash.apply(this, arguments);
      }
      return hash;
    }()
    /**
     * Compares a plain text password against a saved hash using constant-time comparison.
     * @param {string} password 
     * @param {string} hash 
     * @returns {Promise<boolean>}
     */
    )
  }, {
    key: "compare",
    value: (function () {
      var _compare = BcryptGasService_asyncToGenerator(/*#__PURE__*/BcryptGasService_regenerator().m(function _callee2(password, hash) {
        var salt, savedHashPart, calculatedHashBase64, cleanCalculated;
        return BcryptGasService_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (!(!password || !hash)) {
                _context2.n = 1;
                break;
              }
              return _context2.a(2, false);
            case 1:
              if (!(!hash.startsWith('$2b$10$') || hash.length !== 60)) {
                _context2.n = 2;
                break;
              }
              return _context2.a(2, false);
            case 2:
              salt = hash.substring(7, 29); // 22 characters salt
              savedHashPart = hash.substring(29); // 31 characters hash
              _context2.n = 3;
              return BcryptGasService_assertClassBrand(_BcryptGasService_brand, this, _iteratedHash).call(this, password, salt, _ITERATIONS._);
            case 3:
              calculatedHashBase64 = _context2.v;
              cleanCalculated = calculatedHashBase64.replace(/[^A-Za-z0-9./]/g, '').substring(0, 31).padEnd(31, 'x'); // Security: Constant-time comparison to prevent timing attacks (CWE-208)
              return _context2.a(2, BcryptGasService_assertClassBrand(_BcryptGasService_brand, this, _constantTimeEquals).call(this, savedHashPart, cleanCalculated));
          }
        }, _callee2, this);
      }));
      function compare(_x2, _x3) {
        return _compare.apply(this, arguments);
      }
      return compare;
    }())
  }]);
}();
function _iteratedHash(_x4, _x5, _x6) {
  return _iteratedHash2.apply(this, arguments);
}
function _iteratedHash2() {
  _iteratedHash2 = BcryptGasService_asyncToGenerator(/*#__PURE__*/BcryptGasService_regenerator().m(function _callee3(password, salt, iterations) {
    var result, i;
    return BcryptGasService_regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          result = password + salt;
          i = 0;
        case 1:
          if (!(i < iterations)) {
            _context3.n = 4;
            break;
          }
          _context3.n = 2;
          return BcryptGasService_assertClassBrand(_BcryptGasService_brand, this, _sha).call(this, result + salt);
        case 2:
          result = _context3.v;
        case 3:
          i++;
          _context3.n = 1;
          break;
        case 4:
          return _context3.a(2, result);
      }
    }, _callee3, this);
  }));
  return _iteratedHash2.apply(this, arguments);
}
/**
 * Generates a cryptographically secure salt.
 * Uses crypto.getRandomValues when available, with Math.random fallback.
 * @param {number} length
 * @returns {string}
 */
function _generateSecureSalt(length) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./';
  var salt = '';

  // Prefer Web Crypto API for CSPRNG (CWE-330 mitigation)
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
    var randomBytes = new Uint8Array(length);
    globalThis.crypto.getRandomValues(randomBytes);
    for (var i = 0; i < length; i++) {
      salt += chars.charAt(randomBytes[i] % chars.length);
    }
  } else {
    // Apps Script fallback: use Utilities.getUuid() as entropy source
    if (typeof Utilities !== 'undefined') {
      var uuid = Utilities.getUuid().replace(/-/g, '');
      for (var _i = 0; _i < length; _i++) {
        salt += chars.charAt(uuid.charCodeAt(_i % uuid.length) % chars.length);
      }
    } else {
      // Last resort: Math.random (only for tests)
      for (var _i2 = 0; _i2 < length; _i2++) {
        salt += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
  }
  return salt;
}
/**
 * Constant-time string comparison to prevent timing attacks.
 * Always compares all characters regardless of mismatches. (CWE-208)
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function _constantTimeEquals(a, b) {
  if (a.length !== b.length) return false;
  var result = 0;
  for (var i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
/**
 * Secure SHA-256 wrapper.
 */
function _sha(_x7) {
  return _sha2.apply(this, arguments);
}
function _sha2() {
  _sha2 = BcryptGasService_asyncToGenerator(/*#__PURE__*/BcryptGasService_regenerator().m(function _callee4(input) {
    var rawDigest, msgUint8, hashBuffer, hashArray, binary;
    return BcryptGasService_regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          if (!(typeof Utilities !== 'undefined' && typeof Utilities.computeDigest === 'function')) {
            _context4.n = 1;
            break;
          }
          // Google Apps Script native crypto digest
          rawDigest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input, Utilities.Charset.UTF_8);
          return _context4.a(2, Utilities.base64Encode(rawDigest));
        case 1:
          // Standard Web Crypto API (Node.js and Browser)
          msgUint8 = new TextEncoder().encode(input);
          _context4.n = 2;
          return globalThis.crypto.subtle.digest('SHA-256', msgUint8);
        case 2:
          hashBuffer = _context4.v;
          // Convert ArrayBuffer to Base64
          hashArray = Array.from(new Uint8Array(hashBuffer));
          binary = hashArray.map(function (b) {
            return String.fromCharCode(b);
          }).join('');
          return _context4.a(2, btoa(binary));
      }
    }, _callee4);
  }));
  return _sha2.apply(this, arguments);
}
var _COST_FACTOR = {
  _: 10
};
// 2^10 = 1024 iterations
var _ITERATIONS = {
  _: Math.pow(2, _COST_FACTOR._)
};
;// ./src/infrastructure/services/TokenService.js
function TokenService_typeof(o) { "@babel/helpers - typeof"; return TokenService_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, TokenService_typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || TokenService_unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function TokenService_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return TokenService_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? TokenService_arrayLikeToArray(r, a) : void 0; } }
function TokenService_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = TokenService_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function TokenService_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function TokenService_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, TokenService_toPropertyKey(o.key), o); } }
function TokenService_createClass(e, r, t) { return r && TokenService_defineProperties(e.prototype, r), t && TokenService_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function TokenService_toPropertyKey(t) { var i = TokenService_toPrimitive(t, "string"); return "symbol" == TokenService_typeof(i) ? i : i + ""; }
function TokenService_toPrimitive(t, r) { if ("object" != TokenService_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != TokenService_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function TokenService_classPrivateMethodInitSpec(e, a) { TokenService_checkPrivateRedeclaration(e, a), a.add(e); }
function TokenService_classPrivateFieldInitSpec(e, t, a) { TokenService_checkPrivateRedeclaration(e, t), t.set(e, a); }
function TokenService_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function TokenService_classPrivateFieldGet(s, a) { return s.get(TokenService_assertClassBrand(s, a)); }
function TokenService_classPrivateFieldSet(s, a, r) { return s.set(TokenService_assertClassBrand(s, a), r), r; }
function TokenService_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
var _secret = /*#__PURE__*/new WeakMap();
var _TokenService_brand = /*#__PURE__*/new WeakSet();
/**
 * TokenService.js
 * JSON Web Token (JWT) generator and validator using native Apps Script Utilities
 * or Node.js fallbacks.
 * 
 * Security: Fail-closed design — if no crypto backend is available, token 
 * operations will throw instead of returning predictable signatures (CWE-327).
 */
var TokenService = /*#__PURE__*/function () {
  function TokenService() {
    TokenService_classCallCheck(this, TokenService);
    TokenService_classPrivateMethodInitSpec(this, _TokenService_brand);
    TokenService_classPrivateFieldInitSpec(this, _secret, void 0);
    // Read secret from script properties
    TokenService_classPrivateFieldSet(_secret, this, typeof PropertiesService !== 'undefined' ? PropertiesService.getScriptProperties().getProperty('JWT_SECRET') : process.env.JWT_SECRET);
    if (!TokenService_classPrivateFieldGet(_secret, this)) {
      throw new Error('JWT_SECRET não configurado no ambiente.');
    }
  }

  /**
   * Generates a signed token.
   * @param {object} payload 
   * @returns {string} token
   */
  return TokenService_createClass(TokenService, [{
    key: "generate",
    value: function generate(payload) {
      var header = {
        alg: 'HS256',
        typ: 'JWT'
      };
      var extendedPayload = _objectSpread(_objectSpread({}, payload), {}, {
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 120 * 60 // 2 hours expiration
      });
      var encodedHeader = TokenService_assertClassBrand(_TokenService_brand, this, _base64UrlEncode).call(this, JSON.stringify(header));
      var encodedPayload = TokenService_assertClassBrand(_TokenService_brand, this, _base64UrlEncode).call(this, JSON.stringify(extendedPayload));
      var signature = TokenService_assertClassBrand(_TokenService_brand, this, _hmacSha).call(this, "".concat(encodedHeader, ".").concat(encodedPayload), TokenService_classPrivateFieldGet(_secret, this));
      return "".concat(encodedHeader, ".").concat(encodedPayload, ".").concat(signature);
    }

    /**
     * Validates a token signature and checks expiration.
     * @param {string} token 
     * @returns {object|null} parsed payload or null if invalid
     */
  }, {
    key: "validate",
    value: function validate(token) {
      if (!token || typeof token !== 'string') return null;
      var parts = token.split('.');
      if (parts.length !== 3) return null;
      var _parts = _slicedToArray(parts, 3),
        header = _parts[0],
        payload = _parts[1],
        signature = _parts[2];
      var computedSignature = TokenService_assertClassBrand(_TokenService_brand, this, _hmacSha).call(this, "".concat(header, ".").concat(payload), TokenService_classPrivateFieldGet(_secret, this));
      if (signature !== computedSignature) {
        return null; // Signature mismatch
      }
      try {
        var decodedPayload = JSON.parse(TokenService_assertClassBrand(_TokenService_brand, this, _base64UrlDecode).call(this, payload));
        var nowSeconds = Math.floor(Date.now() / 1000);
        if (decodedPayload.exp && decodedPayload.exp < nowSeconds) {
          return null; // Expired
        }
        return decodedPayload;
      } catch (e) {
        return null;
      }
    }
  }]);
}();
function _base64UrlEncode(str) {
  var base64 = '';
  if (typeof Utilities !== 'undefined') {
    base64 = Utilities.base64Encode(str, Utilities.Charset.UTF_8);
  } else {
    base64 = btoa(unescape(encodeURIComponent(str)));
  }
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function _base64UrlDecode(str) {
  var base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  if (typeof Utilities !== 'undefined') {
    var decodedBytes = Utilities.base64Decode(base64, Utilities.Charset.UTF_8);
    return Utilities.newBlob(decodedBytes).getDataAsString();
  } else {
    return decodeURIComponent(escape(atob(base64)));
  }
}
function _base64UrlEncodeBytes(bytes) {
  var base64 = '';
  if (typeof Utilities !== 'undefined') {
    base64 = Utilities.base64Encode(bytes);
  } else {
    // Buffer to base64 for node
    base64 = Buffer.from(bytes).toString('base64');
  }
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
/**
 * Generates HMAC SHA256 signature using GAS native utilities or Node.js crypto fallback
 * @param {string} data 
 * @param {string} secret 
 * @returns {string} base64Url encoded signature
 */
function _hmacSha(data, secret) {
  if (typeof Utilities !== 'undefined') {
    var signature = Utilities.computeHmacSha256Signature(data, secret);
    return TokenService_assertClassBrand(_TokenService_brand, this, _base64UrlEncodeBytes).call(this, signature);
  }

  // Node.js fallback for local testing (uses dynamic import to prevent GAS crash)
  if (typeof process !== 'undefined') {
    var crypto = __webpack_require__(798);
    var hmac = crypto.createHmac('sha256', secret);
    hmac.update(data);
    var signatureBuffer = hmac.digest();
    return TokenService_assertClassBrand(_TokenService_brand, this, _base64UrlEncodeBytes).call(this, signatureBuffer);
  }
  throw new Error('No cryptographic utility available.');
}
var tokenService = new TokenService();
;// ./src/application/useCases/LoginUseCase.js
function LoginUseCase_typeof(o) { "@babel/helpers - typeof"; return LoginUseCase_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, LoginUseCase_typeof(o); }
function LoginUseCase_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return LoginUseCase_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (LoginUseCase_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, LoginUseCase_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, LoginUseCase_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), LoginUseCase_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", LoginUseCase_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), LoginUseCase_regeneratorDefine2(u), LoginUseCase_regeneratorDefine2(u, o, "Generator"), LoginUseCase_regeneratorDefine2(u, n, function () { return this; }), LoginUseCase_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (LoginUseCase_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function LoginUseCase_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } LoginUseCase_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { LoginUseCase_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, LoginUseCase_regeneratorDefine2(e, r, n, t); }
function LoginUseCase_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function LoginUseCase_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { LoginUseCase_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { LoginUseCase_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function LoginUseCase_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function LoginUseCase_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, LoginUseCase_toPropertyKey(o.key), o); } }
function LoginUseCase_createClass(e, r, t) { return r && LoginUseCase_defineProperties(e.prototype, r), t && LoginUseCase_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function LoginUseCase_toPropertyKey(t) { var i = LoginUseCase_toPrimitive(t, "string"); return "symbol" == LoginUseCase_typeof(i) ? i : i + ""; }
function LoginUseCase_toPrimitive(t, r) { if ("object" != LoginUseCase_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != LoginUseCase_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function LoginUseCase_classPrivateFieldInitSpec(e, t, a) { LoginUseCase_checkPrivateRedeclaration(e, t), t.set(e, a); }
function LoginUseCase_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function LoginUseCase_classPrivateFieldGet(s, a) { return s.get(LoginUseCase_assertClassBrand(s, a)); }
function LoginUseCase_classPrivateFieldSet(s, a, r) { return s.set(LoginUseCase_assertClassBrand(s, a), r), r; }
function LoginUseCase_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }

var _pacienteRepository = /*#__PURE__*/new WeakMap();
var _criptografiaService = /*#__PURE__*/new WeakMap();
var _tokenService = /*#__PURE__*/new WeakMap();
var LoginUseCase = /*#__PURE__*/function () {
  function LoginUseCase(pacienteRepository, criptografiaService, tokenService) {
    LoginUseCase_classCallCheck(this, LoginUseCase);
    LoginUseCase_classPrivateFieldInitSpec(this, _pacienteRepository, void 0);
    LoginUseCase_classPrivateFieldInitSpec(this, _criptografiaService, void 0);
    LoginUseCase_classPrivateFieldInitSpec(this, _tokenService, void 0);
    LoginUseCase_classPrivateFieldSet(_pacienteRepository, this, pacienteRepository);
    LoginUseCase_classPrivateFieldSet(_criptografiaService, this, criptografiaService);
    LoginUseCase_classPrivateFieldSet(_tokenService, this, tokenService);
  }

  /**
   * Authenticates a user (Patient or Administrator).
   * @param {object} input DTO (email, senha)
   * @returns {Promise<object>} output DTO (token, role, userId, nome)
   */
  return LoginUseCase_createClass(LoginUseCase, [{
    key: "execute",
    value: (function () {
      var _execute = LoginUseCase_asyncToGenerator(/*#__PURE__*/LoginUseCase_regenerator().m(function _callee(_ref) {
        var email, senha, cleanEmail, adminEmail, adminPassHash, isMatch, _token, paciente, passwordMatch, token;
        return LoginUseCase_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              email = _ref.email, senha = _ref.senha;
              if (!(!email || !senha)) {
                _context.n = 1;
                break;
              }
              throw new Error('E-mail e senha são obrigatórios.');
            case 1:
              cleanEmail = email.trim().toLowerCase(); // 1. Check for Admin Login
              // Read admin email from secure config
              adminEmail = typeof PropertiesService !== 'undefined' ? PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL') : null;
              if (!(adminEmail && cleanEmail === adminEmail.toLowerCase().trim())) {
                _context.n = 5;
                break;
              }
              // Read admin password hash from secure config
              adminPassHash = typeof PropertiesService !== 'undefined' ? PropertiesService.getScriptProperties().getProperty('ADMIN_PASS_HASH') : null;
              if (adminPassHash) {
                _context.n = 2;
                break;
              }
              throw new Error('Ambiente não configurado para acesso administrativo.');
            case 2:
              _context.n = 3;
              return LoginUseCase_classPrivateFieldGet(_criptografiaService, this).compare(senha, adminPassHash);
            case 3:
              isMatch = _context.v;
              if (isMatch) {
                _context.n = 4;
                break;
              }
              throw new Error('Credenciais inválidas.');
            case 4:
              _token = LoginUseCase_classPrivateFieldGet(_tokenService, this).generate({
                userId: 'admin_root',
                email: cleanEmail,
                role: 'ADMIN'
              });
              return _context.a(2, {
                token: _token,
                role: 'ADMIN',
                userId: 'admin_root',
                nome: 'Clínico Administrador'
              });
            case 5:
              _context.n = 6;
              return LoginUseCase_classPrivateFieldGet(_pacienteRepository, this).findByEmail(cleanEmail);
            case 6:
              paciente = _context.v;
              if (paciente) {
                _context.n = 7;
                break;
              }
              throw new Error('Credenciais inválidas.');
            case 7:
              // Check domain permissions (inactive, suspended, date expiration)
              paciente.validarStatusPermissaoLogin();

              // Verify Password
              _context.n = 8;
              return LoginUseCase_classPrivateFieldGet(_criptografiaService, this).compare(senha, paciente.senhaHash.value);
            case 8:
              passwordMatch = _context.v;
              if (passwordMatch) {
                _context.n = 9;
                break;
              }
              throw new Error('Credenciais inválidas.');
            case 9:
              // Generate Session Token
              token = LoginUseCase_classPrivateFieldGet(_tokenService, this).generate({
                userId: paciente.id.value,
                email: paciente.email.value,
                role: 'PACIENTE'
              });
              return _context.a(2, {
                token: token,
                role: 'PACIENTE',
                userId: paciente.id.value,
                nome: paciente.nome
              });
          }
        }, _callee, this);
      }));
      function execute(_x) {
        return _execute.apply(this, arguments);
      }
      return execute;
    }())
  }]);
}();
// EXTERNAL MODULE: ./src/domain/entities/PacienteFactory.js
var PacienteFactory = __webpack_require__(148);
;// ./src/domain/events/PacienteCriadoEvent.js
function PacienteCriadoEvent_typeof(o) { "@babel/helpers - typeof"; return PacienteCriadoEvent_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, PacienteCriadoEvent_typeof(o); }
function PacienteCriadoEvent_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function PacienteCriadoEvent_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, PacienteCriadoEvent_toPropertyKey(o.key), o); } }
function PacienteCriadoEvent_createClass(e, r, t) { return r && PacienteCriadoEvent_defineProperties(e.prototype, r), t && PacienteCriadoEvent_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function PacienteCriadoEvent_toPropertyKey(t) { var i = PacienteCriadoEvent_toPrimitive(t, "string"); return "symbol" == PacienteCriadoEvent_typeof(i) ? i : i + ""; }
function PacienteCriadoEvent_toPrimitive(t, r) { if ("object" != PacienteCriadoEvent_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != PacienteCriadoEvent_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function PacienteCriadoEvent_classPrivateFieldInitSpec(e, t, a) { PacienteCriadoEvent_checkPrivateRedeclaration(e, t), t.set(e, a); }
function PacienteCriadoEvent_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function PacienteCriadoEvent_classPrivateFieldGet(s, a) { return s.get(PacienteCriadoEvent_assertClassBrand(s, a)); }
function PacienteCriadoEvent_classPrivateFieldSet(s, a, r) { return s.set(PacienteCriadoEvent_assertClassBrand(s, a), r), r; }
function PacienteCriadoEvent_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
var _paciente = /*#__PURE__*/new WeakMap();
var _senhaTemporaria = /*#__PURE__*/new WeakMap();
var _occurredOn = /*#__PURE__*/new WeakMap();
/**
 * PacienteCriadoEvent.js
 * Domain Event triggered when a new Paciente is registered.
 */
var PacienteCriadoEvent = /*#__PURE__*/function () {
  function PacienteCriadoEvent(paciente, senhaTemporaria) {
    PacienteCriadoEvent_classCallCheck(this, PacienteCriadoEvent);
    PacienteCriadoEvent_classPrivateFieldInitSpec(this, _paciente, void 0);
    PacienteCriadoEvent_classPrivateFieldInitSpec(this, _senhaTemporaria, void 0);
    PacienteCriadoEvent_classPrivateFieldInitSpec(this, _occurredOn, void 0);
    PacienteCriadoEvent_classPrivateFieldSet(_paciente, this, paciente);
    PacienteCriadoEvent_classPrivateFieldSet(_senhaTemporaria, this, senhaTemporaria);
    PacienteCriadoEvent_classPrivateFieldSet(_occurredOn, this, new Date());
  }
  return PacienteCriadoEvent_createClass(PacienteCriadoEvent, [{
    key: "paciente",
    get: function get() {
      return PacienteCriadoEvent_classPrivateFieldGet(_paciente, this);
    }
  }, {
    key: "senhaTemporaria",
    get: function get() {
      return PacienteCriadoEvent_classPrivateFieldGet(_senhaTemporaria, this);
    }
  }, {
    key: "occurredOn",
    get: function get() {
      return PacienteCriadoEvent_classPrivateFieldGet(_occurredOn, this);
    }
  }]);
}();
;// ./src/domain/events/DomainEventDispatcher.js
function DomainEventDispatcher_typeof(o) { "@babel/helpers - typeof"; return DomainEventDispatcher_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, DomainEventDispatcher_typeof(o); }
function DomainEventDispatcher_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = DomainEventDispatcher_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function DomainEventDispatcher_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return DomainEventDispatcher_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? DomainEventDispatcher_arrayLikeToArray(r, a) : void 0; } }
function DomainEventDispatcher_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function DomainEventDispatcher_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function DomainEventDispatcher_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, DomainEventDispatcher_toPropertyKey(o.key), o); } }
function DomainEventDispatcher_createClass(e, r, t) { return r && DomainEventDispatcher_defineProperties(e.prototype, r), t && DomainEventDispatcher_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function DomainEventDispatcher_toPropertyKey(t) { var i = DomainEventDispatcher_toPrimitive(t, "string"); return "symbol" == DomainEventDispatcher_typeof(i) ? i : i + ""; }
function DomainEventDispatcher_toPrimitive(t, r) { if ("object" != DomainEventDispatcher_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != DomainEventDispatcher_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function DomainEventDispatcher_classPrivateFieldInitSpec(e, t, a) { DomainEventDispatcher_checkPrivateRedeclaration(e, t), t.set(e, a); }
function DomainEventDispatcher_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function DomainEventDispatcher_classPrivateFieldGet(s, a) { return s.get(DomainEventDispatcher_assertClassBrand(s, a)); }
function DomainEventDispatcher_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
var _handlers = /*#__PURE__*/new WeakMap();
/**
 * DomainEventDispatcher.js
 * In-memory publisher/subscriber for decoupling domain actions from collateral effects (such as emails or logging).
 */
var DomainEventDispatcher = /*#__PURE__*/function () {
  function DomainEventDispatcher() {
    DomainEventDispatcher_classCallCheck(this, DomainEventDispatcher);
    DomainEventDispatcher_classPrivateFieldInitSpec(this, _handlers, new Map());
  }
  return DomainEventDispatcher_createClass(DomainEventDispatcher, [{
    key: "register",
    value: function register(eventName, handler) {
      if (!DomainEventDispatcher_classPrivateFieldGet(_handlers, this).has(eventName)) {
        DomainEventDispatcher_classPrivateFieldGet(_handlers, this).set(eventName, []);
      }
      DomainEventDispatcher_classPrivateFieldGet(_handlers, this).get(eventName).push(handler);
    }
  }, {
    key: "dispatch",
    value: function dispatch(event) {
      var eventName = event.constructor.name;
      if (DomainEventDispatcher_classPrivateFieldGet(_handlers, this).has(eventName)) {
        var handlers = DomainEventDispatcher_classPrivateFieldGet(_handlers, this).get(eventName);
        var _iterator = DomainEventDispatcher_createForOfIteratorHelper(handlers),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var handler = _step.value;
            try {
              handler(event);
            } catch (error) {
              // Prevent side-effect exceptions from breaking the main transaction flow
              if (typeof console !== 'undefined') {
                console.error("Erro ao processar evento de dom\xEDnio [".concat(eventName, "]:"), error);
              }
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      DomainEventDispatcher_classPrivateFieldGet(_handlers, this).clear();
    }
  }]);
}();

// Global default singleton instance
var eventDispatcher = new DomainEventDispatcher();
;// ./src/application/useCases/CriarPacienteUseCase.js
function CriarPacienteUseCase_typeof(o) { "@babel/helpers - typeof"; return CriarPacienteUseCase_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, CriarPacienteUseCase_typeof(o); }
function CriarPacienteUseCase_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return CriarPacienteUseCase_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (CriarPacienteUseCase_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, CriarPacienteUseCase_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, CriarPacienteUseCase_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), CriarPacienteUseCase_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", CriarPacienteUseCase_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), CriarPacienteUseCase_regeneratorDefine2(u), CriarPacienteUseCase_regeneratorDefine2(u, o, "Generator"), CriarPacienteUseCase_regeneratorDefine2(u, n, function () { return this; }), CriarPacienteUseCase_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (CriarPacienteUseCase_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function CriarPacienteUseCase_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } CriarPacienteUseCase_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { CriarPacienteUseCase_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, CriarPacienteUseCase_regeneratorDefine2(e, r, n, t); }
function CriarPacienteUseCase_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function CriarPacienteUseCase_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { CriarPacienteUseCase_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { CriarPacienteUseCase_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function CriarPacienteUseCase_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function CriarPacienteUseCase_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, CriarPacienteUseCase_toPropertyKey(o.key), o); } }
function CriarPacienteUseCase_createClass(e, r, t) { return r && CriarPacienteUseCase_defineProperties(e.prototype, r), t && CriarPacienteUseCase_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function CriarPacienteUseCase_toPropertyKey(t) { var i = CriarPacienteUseCase_toPrimitive(t, "string"); return "symbol" == CriarPacienteUseCase_typeof(i) ? i : i + ""; }
function CriarPacienteUseCase_toPrimitive(t, r) { if ("object" != CriarPacienteUseCase_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != CriarPacienteUseCase_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function CriarPacienteUseCase_classPrivateMethodInitSpec(e, a) { CriarPacienteUseCase_checkPrivateRedeclaration(e, a), a.add(e); }
function CriarPacienteUseCase_classPrivateFieldInitSpec(e, t, a) { CriarPacienteUseCase_checkPrivateRedeclaration(e, t), t.set(e, a); }
function CriarPacienteUseCase_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function CriarPacienteUseCase_classPrivateFieldGet(s, a) { return s.get(CriarPacienteUseCase_assertClassBrand(s, a)); }
function CriarPacienteUseCase_classPrivateFieldSet(s, a, r) { return s.set(CriarPacienteUseCase_assertClassBrand(s, a), r), r; }
function CriarPacienteUseCase_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }



var CriarPacienteUseCase_pacienteRepository = /*#__PURE__*/new WeakMap();
var CriarPacienteUseCase_criptografiaService = /*#__PURE__*/new WeakMap();
var _CriarPacienteUseCase_brand = /*#__PURE__*/new WeakSet();
var CriarPacienteUseCase = /*#__PURE__*/function () {
  function CriarPacienteUseCase(pacienteRepository, criptografiaService) {
    CriarPacienteUseCase_classCallCheck(this, CriarPacienteUseCase);
    /**
     * Generates a cryptographically secure temporary password.
     * Uses Web Crypto API when available (CWE-330 mitigation).
     */
    CriarPacienteUseCase_classPrivateMethodInitSpec(this, _CriarPacienteUseCase_brand);
    CriarPacienteUseCase_classPrivateFieldInitSpec(this, CriarPacienteUseCase_pacienteRepository, void 0);
    CriarPacienteUseCase_classPrivateFieldInitSpec(this, CriarPacienteUseCase_criptografiaService, void 0);
    CriarPacienteUseCase_classPrivateFieldSet(CriarPacienteUseCase_pacienteRepository, this, pacienteRepository);
    CriarPacienteUseCase_classPrivateFieldSet(CriarPacienteUseCase_criptografiaService, this, criptografiaService);
  }

  /**
   * Executes the creation of a new patient.
   * @param {object} input DTO (nome, email, telefone, dataInicio, dataFim)
   * @returns {Promise<object>} output DTO (id, email, senhaTemporaria)
   */
  return CriarPacienteUseCase_createClass(CriarPacienteUseCase, [{
    key: "execute",
    value: (function () {
      var _execute = CriarPacienteUseCase_asyncToGenerator(/*#__PURE__*/CriarPacienteUseCase_regenerator().m(function _callee(_ref) {
        var nome, email, telefone, dataInicio, dataFim, existingPaciente, tempPassword, senhaHashString, paciente;
        return CriarPacienteUseCase_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              nome = _ref.nome, email = _ref.email, telefone = _ref.telefone, dataInicio = _ref.dataInicio, dataFim = _ref.dataFim;
              if (!(!nome || !email || !telefone || !dataInicio || !dataFim)) {
                _context.n = 1;
                break;
              }
              throw new Error('Todos os campos obrigatórios devem ser fornecidos.');
            case 1:
              _context.n = 2;
              return CriarPacienteUseCase_classPrivateFieldGet(CriarPacienteUseCase_pacienteRepository, this).findByEmail(email);
            case 2:
              existingPaciente = _context.v;
              if (!existingPaciente) {
                _context.n = 3;
                break;
              }
              throw new Error('Já existe um paciente cadastrado com este e-mail.');
            case 3:
              // 3. Generate secure temporary password
              tempPassword = CriarPacienteUseCase_assertClassBrand(_CriarPacienteUseCase_brand, this, _generateTempPassword).call(this);
              _context.n = 4;
              return CriarPacienteUseCase_classPrivateFieldGet(CriarPacienteUseCase_criptografiaService, this).hash(tempPassword);
            case 4:
              senhaHashString = _context.v;
              // 4. Instantiate Patient via Domain Factory (handles VOs and domain validations)
              paciente = PacienteFactory/* PacienteFactory */.S.createNew({
                nome: nome,
                email: email,
                telefone: telefone,
                senhaHashString: senhaHashString,
                dataInicio: dataInicio,
                dataFim: dataFim
              }); // 5. Persist patient to storage
              _context.n = 5;
              return CriarPacienteUseCase_classPrivateFieldGet(CriarPacienteUseCase_pacienteRepository, this).save(paciente);
            case 5:
              // 6. Dispatch Domain Event for collateral actions (like sending email)
              eventDispatcher.dispatch(new PacienteCriadoEvent(paciente, tempPassword));

              // 7. Return safe Output DTO
              return _context.a(2, {
                id: paciente.id.value,
                email: paciente.email.value,
                senhaTemporaria: tempPassword
              });
          }
        }, _callee, this);
      }));
      function execute(_x) {
        return _execute.apply(this, arguments);
      }
      return execute;
    }())
  }]);
}();
function _generateTempPassword() {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  var pass = '';
  var length = 14; // 14 chars for higher entropy

  // Prefer CSPRNG (crypto.getRandomValues)
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
    var randomBytes = new Uint8Array(length);
    globalThis.crypto.getRandomValues(randomBytes);
    for (var i = 0; i < length; i++) {
      pass += chars.charAt(randomBytes[i] % chars.length);
    }
  } else {
    // Fallback for GAS: use Utilities.getUuid() as entropy seed
    if (typeof Utilities !== 'undefined') {
      var uuid = Utilities.getUuid().replace(/-/g, '');
      for (var _i = 0; _i < length; _i++) {
        pass += chars.charAt(uuid.charCodeAt(_i % uuid.length) % chars.length);
      }
    } else {
      for (var _i2 = 0; _i2 < length; _i2++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
  }
  return pass;
}
// EXTERNAL MODULE: ./src/domain/entities/CheckIn.js
var CheckIn = __webpack_require__(240);
;// ./src/domain/events/CheckinRealizadoEvent.js
function CheckinRealizadoEvent_typeof(o) { "@babel/helpers - typeof"; return CheckinRealizadoEvent_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, CheckinRealizadoEvent_typeof(o); }
function CheckinRealizadoEvent_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function CheckinRealizadoEvent_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, CheckinRealizadoEvent_toPropertyKey(o.key), o); } }
function CheckinRealizadoEvent_createClass(e, r, t) { return r && CheckinRealizadoEvent_defineProperties(e.prototype, r), t && CheckinRealizadoEvent_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function CheckinRealizadoEvent_toPropertyKey(t) { var i = CheckinRealizadoEvent_toPrimitive(t, "string"); return "symbol" == CheckinRealizadoEvent_typeof(i) ? i : i + ""; }
function CheckinRealizadoEvent_toPrimitive(t, r) { if ("object" != CheckinRealizadoEvent_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != CheckinRealizadoEvent_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function CheckinRealizadoEvent_classPrivateFieldInitSpec(e, t, a) { CheckinRealizadoEvent_checkPrivateRedeclaration(e, t), t.set(e, a); }
function CheckinRealizadoEvent_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function CheckinRealizadoEvent_classPrivateFieldGet(s, a) { return s.get(CheckinRealizadoEvent_assertClassBrand(s, a)); }
function CheckinRealizadoEvent_classPrivateFieldSet(s, a, r) { return s.set(CheckinRealizadoEvent_assertClassBrand(s, a), r), r; }
function CheckinRealizadoEvent_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
var _checkin = /*#__PURE__*/new WeakMap();
var CheckinRealizadoEvent_occurredOn = /*#__PURE__*/new WeakMap();
/**
 * CheckinRealizadoEvent.js
 * Domain Event triggered when a patient completes a check-in.
 */
var CheckinRealizadoEvent = /*#__PURE__*/function () {
  function CheckinRealizadoEvent(checkin) {
    CheckinRealizadoEvent_classCallCheck(this, CheckinRealizadoEvent);
    CheckinRealizadoEvent_classPrivateFieldInitSpec(this, _checkin, void 0);
    CheckinRealizadoEvent_classPrivateFieldInitSpec(this, CheckinRealizadoEvent_occurredOn, void 0);
    CheckinRealizadoEvent_classPrivateFieldSet(_checkin, this, checkin);
    CheckinRealizadoEvent_classPrivateFieldSet(CheckinRealizadoEvent_occurredOn, this, new Date());
  }
  return CheckinRealizadoEvent_createClass(CheckinRealizadoEvent, [{
    key: "checkin",
    get: function get() {
      return CheckinRealizadoEvent_classPrivateFieldGet(_checkin, this);
    }
  }, {
    key: "occurredOn",
    get: function get() {
      return CheckinRealizadoEvent_classPrivateFieldGet(CheckinRealizadoEvent_occurredOn, this);
    }
  }]);
}();
;// ./src/application/useCases/RegistrarCheckinUseCase.js
function RegistrarCheckinUseCase_typeof(o) { "@babel/helpers - typeof"; return RegistrarCheckinUseCase_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, RegistrarCheckinUseCase_typeof(o); }
function RegistrarCheckinUseCase_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return RegistrarCheckinUseCase_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (RegistrarCheckinUseCase_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, RegistrarCheckinUseCase_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, RegistrarCheckinUseCase_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), RegistrarCheckinUseCase_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", RegistrarCheckinUseCase_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), RegistrarCheckinUseCase_regeneratorDefine2(u), RegistrarCheckinUseCase_regeneratorDefine2(u, o, "Generator"), RegistrarCheckinUseCase_regeneratorDefine2(u, n, function () { return this; }), RegistrarCheckinUseCase_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (RegistrarCheckinUseCase_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function RegistrarCheckinUseCase_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } RegistrarCheckinUseCase_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { RegistrarCheckinUseCase_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, RegistrarCheckinUseCase_regeneratorDefine2(e, r, n, t); }
function RegistrarCheckinUseCase_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function RegistrarCheckinUseCase_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { RegistrarCheckinUseCase_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { RegistrarCheckinUseCase_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function RegistrarCheckinUseCase_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function RegistrarCheckinUseCase_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, RegistrarCheckinUseCase_toPropertyKey(o.key), o); } }
function RegistrarCheckinUseCase_createClass(e, r, t) { return r && RegistrarCheckinUseCase_defineProperties(e.prototype, r), t && RegistrarCheckinUseCase_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function RegistrarCheckinUseCase_toPropertyKey(t) { var i = RegistrarCheckinUseCase_toPrimitive(t, "string"); return "symbol" == RegistrarCheckinUseCase_typeof(i) ? i : i + ""; }
function RegistrarCheckinUseCase_toPrimitive(t, r) { if ("object" != RegistrarCheckinUseCase_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != RegistrarCheckinUseCase_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function RegistrarCheckinUseCase_classPrivateFieldInitSpec(e, t, a) { RegistrarCheckinUseCase_checkPrivateRedeclaration(e, t), t.set(e, a); }
function RegistrarCheckinUseCase_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function RegistrarCheckinUseCase_classPrivateFieldGet(s, a) { return s.get(RegistrarCheckinUseCase_assertClassBrand(s, a)); }
function RegistrarCheckinUseCase_classPrivateFieldSet(s, a, r) { return s.set(RegistrarCheckinUseCase_assertClassBrand(s, a), r), r; }
function RegistrarCheckinUseCase_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }




var RegistrarCheckinUseCase_pacienteRepository = /*#__PURE__*/new WeakMap();
var _protocoloRepository = /*#__PURE__*/new WeakMap();
var _checkinRepository = /*#__PURE__*/new WeakMap();
var _gamificacaoRepository = /*#__PURE__*/new WeakMap();
var RegistrarCheckinUseCase = /*#__PURE__*/function () {
  function RegistrarCheckinUseCase(pacienteRepository, protocoloRepository, checkinRepository, gamificacaoRepository) {
    RegistrarCheckinUseCase_classCallCheck(this, RegistrarCheckinUseCase);
    RegistrarCheckinUseCase_classPrivateFieldInitSpec(this, RegistrarCheckinUseCase_pacienteRepository, void 0);
    RegistrarCheckinUseCase_classPrivateFieldInitSpec(this, _protocoloRepository, void 0);
    RegistrarCheckinUseCase_classPrivateFieldInitSpec(this, _checkinRepository, void 0);
    RegistrarCheckinUseCase_classPrivateFieldInitSpec(this, _gamificacaoRepository, void 0);
    RegistrarCheckinUseCase_classPrivateFieldSet(RegistrarCheckinUseCase_pacienteRepository, this, pacienteRepository);
    RegistrarCheckinUseCase_classPrivateFieldSet(_protocoloRepository, this, protocoloRepository);
    RegistrarCheckinUseCase_classPrivateFieldSet(_checkinRepository, this, checkinRepository);
    RegistrarCheckinUseCase_classPrivateFieldSet(_gamificacaoRepository, this, gamificacaoRepository);
  }

  /**
   * Registers a supplement check-in for a patient.
   * @param {object} input DTO (pacienteId, suplementoId, dataHoraPrescrita, dataHoraRealizada, forceRetroactive)
   */
  return RegistrarCheckinUseCase_createClass(RegistrarCheckinUseCase, [{
    key: "execute",
    value: (function () {
      var _execute = RegistrarCheckinUseCase_asyncToGenerator(/*#__PURE__*/RegistrarCheckinUseCase_regenerator().m(function _callee(_ref) {
        var pacienteId, suplementoId, dataHoraPrescrita, dataHoraRealizada, _ref$forceRetroactive, forceRetroactive, pId, sId, datePrescrita, dateRealizada, paciente, suplemento, intervalStart, intervalEnd, existingCheckins, duplicate, todayStr, prescribedStr, checkin, gamificacao, _yield$import, Gamificacao;
        return RegistrarCheckinUseCase_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              pacienteId = _ref.pacienteId, suplementoId = _ref.suplementoId, dataHoraPrescrita = _ref.dataHoraPrescrita, dataHoraRealizada = _ref.dataHoraRealizada, _ref$forceRetroactive = _ref.forceRetroactive, forceRetroactive = _ref$forceRetroactive === void 0 ? false : _ref$forceRetroactive;
              pId = new UUID/* UUID */.k(pacienteId);
              sId = new UUID/* UUID */.k(suplementoId);
              datePrescrita = new Date(dataHoraPrescrita);
              dateRealizada = dataHoraRealizada ? new Date(dataHoraRealizada) : new Date(); // 1. Fetch and validate patient status
              _context.n = 1;
              return RegistrarCheckinUseCase_classPrivateFieldGet(RegistrarCheckinUseCase_pacienteRepository, this).findById(pId.value);
            case 1:
              paciente = _context.v;
              if (paciente) {
                _context.n = 2;
                break;
              }
              throw new Error('Paciente não encontrado.');
            case 2:
              paciente.validarStatusPermissaoLogin(); // Throws if INACTIVE or SUSPENDED

              // 2. Fetch supplement to verify it exists
              _context.n = 3;
              return RegistrarCheckinUseCase_classPrivateFieldGet(_protocoloRepository, this).findSuplementoById(sId.value);
            case 3:
              suplemento = _context.v;
              if (suplemento) {
                _context.n = 4;
                break;
              }
              throw new Error('Suplemento não cadastrado no protocolo.');
            case 4:
              // 3. Prevent duplicate check-ins for the same prescribed slot
              intervalStart = new Date(datePrescrita.getTime() - 60000);
              intervalEnd = new Date(datePrescrita.getTime() + 60000);
              _context.n = 5;
              return RegistrarCheckinUseCase_classPrivateFieldGet(_checkinRepository, this).findByInterval(pId.value, intervalStart, intervalEnd);
            case 5:
              existingCheckins = _context.v;
              duplicate = existingCheckins.some(function (c) {
                return c.suplementoId.equals(sId);
              });
              if (!duplicate) {
                _context.n = 6;
                break;
              }
              throw new Error('Check-in já registrado para esta dose e horário.');
            case 6:
              // 4. Check for retroactive blocks (midnight rule)
              todayStr = new Date().toDateString();
              prescribedStr = datePrescrita.toDateString();
              if (!(prescribedStr !== todayStr && !forceRetroactive)) {
                _context.n = 7;
                break;
              }
              throw new Error('Não é possível realizar check-ins retroativos de dias anteriores sem liberação do clínico.');
            case 7:
              // 5. Instantiate Check-in
              checkin = new CheckIn/* CheckIn */._({
                id: UUID/* UUID */.k.generate(),
                pacienteId: pId,
                suplementoId: sId,
                dataHoraPrescrita: datePrescrita,
                dataHoraRealizada: null,
                status: CheckIn/* StatusCheckin */.C.PENDENTE,
                retroativo: forceRetroactive
              }); // 6. Process Ingestion & window tolerance (within the Entity boundary)
              // Default tolerance window is 60 minutes.
              checkin.confirmIngestion(dateRealizada, 60, forceRetroactive);

              // 7. Save Check-in
              _context.n = 8;
              return RegistrarCheckinUseCase_classPrivateFieldGet(_checkinRepository, this).save(checkin);
            case 8:
              _context.n = 9;
              return RegistrarCheckinUseCase_classPrivateFieldGet(_gamificacaoRepository, this).findByPacienteId(pId.value);
            case 9:
              gamificacao = _context.v;
              if (gamificacao) {
                _context.n = 11;
                break;
              }
              _context.n = 10;
              return Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 855));
            case 10:
              _yield$import = _context.v;
              Gamificacao = _yield$import.Gamificacao;
              gamificacao = new Gamificacao({
                id: UUID/* UUID */.k.generate(),
                pacienteId: pId,
                xpTotal: 0,
                streakAtual: 0,
                maiorStreak: 0,
                conquistas: []
              });
              _context.n = 11;
              return RegistrarCheckinUseCase_classPrivateFieldGet(_gamificacaoRepository, this).save(gamificacao);
            case 11:
              gamificacao.creditarCheckin(checkin.status);
              if (checkin.status === CheckIn/* StatusCheckin */.C.CONCLUIDO) {
                gamificacao.incrementarStreak();
              } else {
                gamificacao.resetarStreak();
              }
              _context.n = 12;
              return RegistrarCheckinUseCase_classPrivateFieldGet(_gamificacaoRepository, this).update(gamificacao);
            case 12:
              // 9. Dispatch event
              eventDispatcher.dispatch(new CheckinRealizadoEvent(checkin));
              return _context.a(2, {
                checkinId: checkin.id.value,
                status: checkin.status,
                streak: gamificacao.streakAtual,
                xpGanho: checkin.status === CheckIn/* StatusCheckin */.C.CONCLUIDO ? 10 : 5,
                xpTotal: gamificacao.xpTotal
              });
          }
        }, _callee, this);
      }));
      function execute(_x) {
        return _execute.apply(this, arguments);
      }
      return execute;
    }())
  }]);
}();
;// ./src/application/useCases/LiberarEdicaoRetroativaUseCase.js
function LiberarEdicaoRetroativaUseCase_typeof(o) { "@babel/helpers - typeof"; return LiberarEdicaoRetroativaUseCase_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, LiberarEdicaoRetroativaUseCase_typeof(o); }
function LiberarEdicaoRetroativaUseCase_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return LiberarEdicaoRetroativaUseCase_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (LiberarEdicaoRetroativaUseCase_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, LiberarEdicaoRetroativaUseCase_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, LiberarEdicaoRetroativaUseCase_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), LiberarEdicaoRetroativaUseCase_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", LiberarEdicaoRetroativaUseCase_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), LiberarEdicaoRetroativaUseCase_regeneratorDefine2(u), LiberarEdicaoRetroativaUseCase_regeneratorDefine2(u, o, "Generator"), LiberarEdicaoRetroativaUseCase_regeneratorDefine2(u, n, function () { return this; }), LiberarEdicaoRetroativaUseCase_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (LiberarEdicaoRetroativaUseCase_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function LiberarEdicaoRetroativaUseCase_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } LiberarEdicaoRetroativaUseCase_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { LiberarEdicaoRetroativaUseCase_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, LiberarEdicaoRetroativaUseCase_regeneratorDefine2(e, r, n, t); }
function LiberarEdicaoRetroativaUseCase_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function LiberarEdicaoRetroativaUseCase_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { LiberarEdicaoRetroativaUseCase_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { LiberarEdicaoRetroativaUseCase_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function LiberarEdicaoRetroativaUseCase_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function LiberarEdicaoRetroativaUseCase_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, LiberarEdicaoRetroativaUseCase_toPropertyKey(o.key), o); } }
function LiberarEdicaoRetroativaUseCase_createClass(e, r, t) { return r && LiberarEdicaoRetroativaUseCase_defineProperties(e.prototype, r), t && LiberarEdicaoRetroativaUseCase_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function LiberarEdicaoRetroativaUseCase_toPropertyKey(t) { var i = LiberarEdicaoRetroativaUseCase_toPrimitive(t, "string"); return "symbol" == LiberarEdicaoRetroativaUseCase_typeof(i) ? i : i + ""; }
function LiberarEdicaoRetroativaUseCase_toPrimitive(t, r) { if ("object" != LiberarEdicaoRetroativaUseCase_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != LiberarEdicaoRetroativaUseCase_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function LiberarEdicaoRetroativaUseCase_classPrivateFieldInitSpec(e, t, a) { LiberarEdicaoRetroativaUseCase_checkPrivateRedeclaration(e, t), t.set(e, a); }
function LiberarEdicaoRetroativaUseCase_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function LiberarEdicaoRetroativaUseCase_classPrivateFieldGet(s, a) { return s.get(LiberarEdicaoRetroativaUseCase_assertClassBrand(s, a)); }
function LiberarEdicaoRetroativaUseCase_classPrivateFieldSet(s, a, r) { return s.set(LiberarEdicaoRetroativaUseCase_assertClassBrand(s, a), r), r; }
function LiberarEdicaoRetroativaUseCase_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }

var LiberarEdicaoRetroativaUseCase_pacienteRepository = /*#__PURE__*/new WeakMap();
var _permissaoRepository = /*#__PURE__*/new WeakMap();
var LiberarEdicaoRetroativaUseCase = /*#__PURE__*/function () {
  function LiberarEdicaoRetroativaUseCase(pacienteRepository, permissaoRepository) {
    LiberarEdicaoRetroativaUseCase_classCallCheck(this, LiberarEdicaoRetroativaUseCase);
    LiberarEdicaoRetroativaUseCase_classPrivateFieldInitSpec(this, LiberarEdicaoRetroativaUseCase_pacienteRepository, void 0);
    LiberarEdicaoRetroativaUseCase_classPrivateFieldInitSpec(this, _permissaoRepository, void 0);
    LiberarEdicaoRetroativaUseCase_classPrivateFieldSet(LiberarEdicaoRetroativaUseCase_pacienteRepository, this, pacienteRepository);
    LiberarEdicaoRetroativaUseCase_classPrivateFieldSet(_permissaoRepository, this, permissaoRepository);
  }

  /**
   * Concedes retroactive check-in permission for a patient.
   * @param {object} input DTO (pacienteId, horasLiberadas, motivo, operadorId)
   */
  return LiberarEdicaoRetroativaUseCase_createClass(LiberarEdicaoRetroativaUseCase, [{
    key: "execute",
    value: (function () {
      var _execute = LiberarEdicaoRetroativaUseCase_asyncToGenerator(/*#__PURE__*/LiberarEdicaoRetroativaUseCase_regenerator().m(function _callee(_ref) {
        var pacienteId, horasLiberadas, motivo, operadorId, paciente, expiraEm, permissaoId, permissao;
        return LiberarEdicaoRetroativaUseCase_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              pacienteId = _ref.pacienteId, horasLiberadas = _ref.horasLiberadas, motivo = _ref.motivo, operadorId = _ref.operadorId;
              if (!(!pacienteId || !horasLiberadas || !motivo || !operadorId)) {
                _context.n = 1;
                break;
              }
              throw new Error('Todos os campos de entrada são obrigatórios.');
            case 1:
              if (!(horasLiberadas <= 0 || horasLiberadas > 72)) {
                _context.n = 2;
                break;
              }
              throw new Error('Janela de liberação deve ser entre 1 e 72 horas.');
            case 2:
              if (!(typeof motivo !== 'string' || motivo.trim().length < 10)) {
                _context.n = 3;
                break;
              }
              throw new Error('Motivo clínico da liberação deve possuir pelo menos 10 caracteres.');
            case 3:
              _context.n = 4;
              return LiberarEdicaoRetroativaUseCase_classPrivateFieldGet(LiberarEdicaoRetroativaUseCase_pacienteRepository, this).findById(pacienteId);
            case 4:
              paciente = _context.v;
              if (paciente) {
                _context.n = 5;
                break;
              }
              throw new Error('Paciente não encontrado.');
            case 5:
              expiraEm = new Date();
              expiraEm.setHours(expiraEm.getHours() + horasLiberadas);
              permissaoId = UUID/* UUID */.k.generate();
              permissao = {
                id: permissaoId.value,
                pacienteId: pacienteId,
                horasLiberadas: horasLiberadas,
                motivo: motivo.trim(),
                operadorId: operadorId,
                expiraEm: expiraEm.toISOString(),
                status: 'ATIVA',
                createdAt: new Date().toISOString()
              };
              _context.n = 6;
              return LiberarEdicaoRetroativaUseCase_classPrivateFieldGet(_permissaoRepository, this).save(permissao);
            case 6:
              return _context.a(2, {
                permissaoId: permissao.id,
                expiraEm: permissao.expiraEm
              });
          }
        }, _callee, this);
      }));
      function execute(_x) {
        return _execute.apply(this, arguments);
      }
      return execute;
    }())
  }]);
}();
;// ./src/application/useCases/GerarDashboardUseCase.js
function GerarDashboardUseCase_typeof(o) { "@babel/helpers - typeof"; return GerarDashboardUseCase_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, GerarDashboardUseCase_typeof(o); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(GerarDashboardUseCase_typeof(e) + " is not iterable"); }
function GerarDashboardUseCase_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return GerarDashboardUseCase_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (GerarDashboardUseCase_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, GerarDashboardUseCase_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, GerarDashboardUseCase_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), GerarDashboardUseCase_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", GerarDashboardUseCase_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), GerarDashboardUseCase_regeneratorDefine2(u), GerarDashboardUseCase_regeneratorDefine2(u, o, "Generator"), GerarDashboardUseCase_regeneratorDefine2(u, n, function () { return this; }), GerarDashboardUseCase_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (GerarDashboardUseCase_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function GerarDashboardUseCase_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } GerarDashboardUseCase_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { GerarDashboardUseCase_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, GerarDashboardUseCase_regeneratorDefine2(e, r, n, t); }
function GerarDashboardUseCase_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = GerarDashboardUseCase_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function GerarDashboardUseCase_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return GerarDashboardUseCase_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? GerarDashboardUseCase_arrayLikeToArray(r, a) : void 0; } }
function GerarDashboardUseCase_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function GerarDashboardUseCase_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function GerarDashboardUseCase_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { GerarDashboardUseCase_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { GerarDashboardUseCase_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function GerarDashboardUseCase_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function GerarDashboardUseCase_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, GerarDashboardUseCase_toPropertyKey(o.key), o); } }
function GerarDashboardUseCase_createClass(e, r, t) { return r && GerarDashboardUseCase_defineProperties(e.prototype, r), t && GerarDashboardUseCase_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function GerarDashboardUseCase_toPropertyKey(t) { var i = GerarDashboardUseCase_toPrimitive(t, "string"); return "symbol" == GerarDashboardUseCase_typeof(i) ? i : i + ""; }
function GerarDashboardUseCase_toPrimitive(t, r) { if ("object" != GerarDashboardUseCase_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != GerarDashboardUseCase_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function GerarDashboardUseCase_classPrivateFieldInitSpec(e, t, a) { GerarDashboardUseCase_checkPrivateRedeclaration(e, t), t.set(e, a); }
function GerarDashboardUseCase_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function GerarDashboardUseCase_classPrivateFieldGet(s, a) { return s.get(GerarDashboardUseCase_assertClassBrand(s, a)); }
function GerarDashboardUseCase_classPrivateFieldSet(s, a, r) { return s.set(GerarDashboardUseCase_assertClassBrand(s, a), r), r; }
function GerarDashboardUseCase_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }


var GerarDashboardUseCase_pacienteRepository = /*#__PURE__*/new WeakMap();
var GerarDashboardUseCase_protocoloRepository = /*#__PURE__*/new WeakMap();
var GerarDashboardUseCase_checkinRepository = /*#__PURE__*/new WeakMap();
var GerarDashboardUseCase_gamificacaoRepository = /*#__PURE__*/new WeakMap();
var GerarDashboardUseCase = /*#__PURE__*/function () {
  function GerarDashboardUseCase(pacienteRepository, protocoloRepository, checkinRepository, gamificacaoRepository) {
    GerarDashboardUseCase_classCallCheck(this, GerarDashboardUseCase);
    GerarDashboardUseCase_classPrivateFieldInitSpec(this, GerarDashboardUseCase_pacienteRepository, void 0);
    GerarDashboardUseCase_classPrivateFieldInitSpec(this, GerarDashboardUseCase_protocoloRepository, void 0);
    GerarDashboardUseCase_classPrivateFieldInitSpec(this, GerarDashboardUseCase_checkinRepository, void 0);
    GerarDashboardUseCase_classPrivateFieldInitSpec(this, GerarDashboardUseCase_gamificacaoRepository, void 0);
    GerarDashboardUseCase_classPrivateFieldSet(GerarDashboardUseCase_pacienteRepository, this, pacienteRepository);
    GerarDashboardUseCase_classPrivateFieldSet(GerarDashboardUseCase_protocoloRepository, this, protocoloRepository);
    GerarDashboardUseCase_classPrivateFieldSet(GerarDashboardUseCase_checkinRepository, this, checkinRepository);
    GerarDashboardUseCase_classPrivateFieldSet(GerarDashboardUseCase_gamificacaoRepository, this, gamificacaoRepository);
  }

  /**
   * Generates consolidation metrics for a patient.
   * @param {object} input DTO (pacienteId, dataInicio, dataFim)
   */
  return GerarDashboardUseCase_createClass(GerarDashboardUseCase, [{
    key: "execute",
    value: (function () {
      var _execute = GerarDashboardUseCase_asyncToGenerator(/*#__PURE__*/GerarDashboardUseCase_regenerator().m(function _callee(_ref) {
        var pacienteId, dataInicio, dataFim, pId, start, end, diffTime, diffDays, paciente, protocolo, checkins, totalPrescrito, historicoAgrupadoPorSuplemento, _iterator, _step, _loop, totalConsumido, totalAtrasado, totalRealizado, totalPerdido, taxaAdesaoGeral, gamificacao, _t, _t2;
        return GerarDashboardUseCase_regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              pacienteId = _ref.pacienteId, dataInicio = _ref.dataInicio, dataFim = _ref.dataFim;
              pId = new UUID/* UUID */.k(pacienteId);
              start = new Date(dataInicio);
              end = new Date(dataFim); // Limit period to 90 days for performance reasons on GAS
              diffTime = Math.abs(end - start);
              diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (!(diffDays > 90)) {
                _context2.n = 1;
                break;
              }
              throw new Error('Período de consulta do dashboard não pode exceder 90 dias.');
            case 1:
              _context2.n = 2;
              return GerarDashboardUseCase_classPrivateFieldGet(GerarDashboardUseCase_pacienteRepository, this).findById(pId.value);
            case 2:
              paciente = _context2.v;
              if (paciente) {
                _context2.n = 3;
                break;
              }
              throw new Error('Paciente não encontrado.');
            case 3:
              if (paciente.protocoloId) {
                _context2.n = 4;
                break;
              }
              return _context2.a(2, {
                pacienteNome: paciente.nome,
                taxaAdesaoGeral: 0,
                totalPrescrito: 0,
                totalConsumido: 0,
                totalAtrasado: 0,
                totalPerdido: 0,
                historicoAgrupadoPorSuplemento: []
              });
            case 4:
              _context2.n = 5;
              return GerarDashboardUseCase_classPrivateFieldGet(GerarDashboardUseCase_protocoloRepository, this).findById(paciente.protocoloId.value);
            case 5:
              protocolo = _context2.v;
              if (protocolo) {
                _context2.n = 6;
                break;
              }
              throw new Error('Protocolo clínico associado não encontrado.');
            case 6:
              _context2.n = 7;
              return GerarDashboardUseCase_classPrivateFieldGet(GerarDashboardUseCase_checkinRepository, this).findByInterval(pId.value, start, end);
            case 7:
              checkins = _context2.v;
              // Calculate prescribed slots in the period
              totalPrescrito = 0;
              historicoAgrupadoPorSuplemento = [];
              _iterator = GerarDashboardUseCase_createForOfIteratorHelper(protocolo.suplementos);
              _context2.p = 8;
              _loop = /*#__PURE__*/GerarDashboardUseCase_regenerator().m(function _loop() {
                var suplemento, timesPerDay, dosesPrescritas, supCheckins, consumidos, atrasados, totalConsumidos, perdidos, taxaAdesao;
                return GerarDashboardUseCase_regenerator().w(function (_context) {
                  while (1) switch (_context.n) {
                    case 0:
                      suplemento = _step.value;
                      timesPerDay = suplemento.horarios.length; // Doses prescribed for this supplement = days * timesPerDay
                      dosesPrescritas = diffDays * timesPerDay;
                      totalPrescrito += dosesPrescritas;

                      // Filter check-ins for this supplement
                      supCheckins = checkins.filter(function (c) {
                        return c.suplementoId.equals(suplemento.id);
                      });
                      consumidos = supCheckins.filter(function (c) {
                        return c.status === CheckIn/* StatusCheckin */.C.CONCLUIDO;
                      }).length;
                      atrasados = supCheckins.filter(function (c) {
                        return c.status === CheckIn/* StatusCheckin */.C.ATRASADO;
                      }).length;
                      totalConsumidos = consumidos + atrasados;
                      perdidos = Math.max(0, dosesPrescritas - totalConsumidos);
                      taxaAdesao = dosesPrescritas > 0 ? Math.round(totalConsumidos / dosesPrescritas * 100) : 0;
                      historicoAgrupadoPorSuplemento.push({
                        suplementoId: suplemento.id.value,
                        nome: suplemento.nome,
                        dosagem: suplemento.dosagem,
                        prescrito: dosesPrescritas,
                        consumido: consumidos,
                        atrasado: atrasados,
                        perdido: perdidos,
                        taxaAdesao: taxaAdesao
                      });
                    case 1:
                      return _context.a(2);
                  }
                }, _loop);
              });
              _iterator.s();
            case 9:
              if ((_step = _iterator.n()).done) {
                _context2.n = 11;
                break;
              }
              return _context2.d(_regeneratorValues(_loop()), 10);
            case 10:
              _context2.n = 9;
              break;
            case 11:
              _context2.n = 13;
              break;
            case 12:
              _context2.p = 12;
              _t = _context2.v;
              _iterator.e(_t);
            case 13:
              _context2.p = 13;
              _iterator.f();
              return _context2.f(13);
            case 14:
              totalConsumido = checkins.filter(function (c) {
                return c.status === CheckIn/* StatusCheckin */.C.CONCLUIDO;
              }).length;
              totalAtrasado = checkins.filter(function (c) {
                return c.status === CheckIn/* StatusCheckin */.C.ATRASADO;
              }).length;
              totalRealizado = totalConsumido + totalAtrasado;
              totalPerdido = Math.max(0, totalPrescrito - totalRealizado);
              taxaAdesaoGeral = totalPrescrito > 0 ? Math.round(totalRealizado / totalPrescrito * 100) : 0;
              if (!GerarDashboardUseCase_classPrivateFieldGet(GerarDashboardUseCase_gamificacaoRepository, this)) {
                _context2.n = 16;
                break;
              }
              _context2.n = 15;
              return GerarDashboardUseCase_classPrivateFieldGet(GerarDashboardUseCase_gamificacaoRepository, this).findByPacienteId(pacienteId);
            case 15:
              _t2 = _context2.v;
              _context2.n = 17;
              break;
            case 16:
              _t2 = null;
            case 17:
              gamificacao = _t2;
              return _context2.a(2, {
                pacienteNome: paciente.nome,
                taxaAdesaoGeral: taxaAdesaoGeral,
                totalPrescrito: totalPrescrito,
                totalConsumido: totalConsumido,
                totalAtrasado: totalAtrasado,
                totalPerdido: totalPerdido,
                historicoAgrupadoPorSuplemento: historicoAgrupadoPorSuplemento,
                gamificacao: gamificacao ? {
                  xpTotal: gamificacao.xpTotal,
                  streakAtual: gamificacao.streakAtual,
                  conquistas: gamificacao.conquistas
                } : null
              });
          }
        }, _callee, this, [[8, 12, 13, 14]]);
      }));
      function execute(_x) {
        return _execute.apply(this, arguments);
      }
      return execute;
    }())
  }]);
}();
// EXTERNAL MODULE: ./src/domain/entities/Paciente.js
var Paciente = __webpack_require__(344);
;// ./src/application/useCases/ListarPacientesUseCase.js
function ListarPacientesUseCase_typeof(o) { "@babel/helpers - typeof"; return ListarPacientesUseCase_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, ListarPacientesUseCase_typeof(o); }
function ListarPacientesUseCase_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return ListarPacientesUseCase_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (ListarPacientesUseCase_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, ListarPacientesUseCase_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, ListarPacientesUseCase_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), ListarPacientesUseCase_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", ListarPacientesUseCase_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), ListarPacientesUseCase_regeneratorDefine2(u), ListarPacientesUseCase_regeneratorDefine2(u, o, "Generator"), ListarPacientesUseCase_regeneratorDefine2(u, n, function () { return this; }), ListarPacientesUseCase_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (ListarPacientesUseCase_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function ListarPacientesUseCase_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } ListarPacientesUseCase_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { ListarPacientesUseCase_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, ListarPacientesUseCase_regeneratorDefine2(e, r, n, t); }
function ListarPacientesUseCase_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function ListarPacientesUseCase_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { ListarPacientesUseCase_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { ListarPacientesUseCase_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ListarPacientesUseCase_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function ListarPacientesUseCase_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, ListarPacientesUseCase_toPropertyKey(o.key), o); } }
function ListarPacientesUseCase_createClass(e, r, t) { return r && ListarPacientesUseCase_defineProperties(e.prototype, r), t && ListarPacientesUseCase_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function ListarPacientesUseCase_toPropertyKey(t) { var i = ListarPacientesUseCase_toPrimitive(t, "string"); return "symbol" == ListarPacientesUseCase_typeof(i) ? i : i + ""; }
function ListarPacientesUseCase_toPrimitive(t, r) { if ("object" != ListarPacientesUseCase_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != ListarPacientesUseCase_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function ListarPacientesUseCase_classPrivateFieldInitSpec(e, t, a) { ListarPacientesUseCase_checkPrivateRedeclaration(e, t), t.set(e, a); }
function ListarPacientesUseCase_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function ListarPacientesUseCase_classPrivateFieldGet(s, a) { return s.get(ListarPacientesUseCase_assertClassBrand(s, a)); }
function ListarPacientesUseCase_classPrivateFieldSet(s, a, r) { return s.set(ListarPacientesUseCase_assertClassBrand(s, a), r), r; }
function ListarPacientesUseCase_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }

var ListarPacientesUseCase_pacienteRepository = /*#__PURE__*/new WeakMap();
var ListarPacientesUseCase_checkinRepository = /*#__PURE__*/new WeakMap();
var ListarPacientesUseCase = /*#__PURE__*/function () {
  function ListarPacientesUseCase(pacienteRepository, checkinRepository) {
    ListarPacientesUseCase_classCallCheck(this, ListarPacientesUseCase);
    ListarPacientesUseCase_classPrivateFieldInitSpec(this, ListarPacientesUseCase_pacienteRepository, void 0);
    ListarPacientesUseCase_classPrivateFieldInitSpec(this, ListarPacientesUseCase_checkinRepository, void 0);
    ListarPacientesUseCase_classPrivateFieldSet(ListarPacientesUseCase_pacienteRepository, this, pacienteRepository);
    ListarPacientesUseCase_classPrivateFieldSet(ListarPacientesUseCase_checkinRepository, this, checkinRepository);
  }

  /**
   * Retrieves a list of all patients and their general adherence rate.
   * @returns {Promise<Array>} Array of patient objects for the dashboard
   */
  return ListarPacientesUseCase_createClass(ListarPacientesUseCase, [{
    key: "execute",
    value: (function () {
      var _execute = ListarPacientesUseCase_asyncToGenerator(/*#__PURE__*/ListarPacientesUseCase_regenerator().m(function _callee() {
        var rows, _yield$import, PacienteMapper, pacientes, checkinsRows, _yield$import2, CheckinMapper, checkins;
        return ListarPacientesUseCase_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return ListarPacientesUseCase_classPrivateFieldGet(ListarPacientesUseCase_pacienteRepository, this).readAllRows();
            case 1:
              rows = _context.v;
              _context.n = 2;
              return Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 395));
            case 2:
              _yield$import = _context.v;
              PacienteMapper = _yield$import.PacienteMapper;
              pacientes = rows.map(function (r) {
                return PacienteMapper.toDomain(r);
              }).filter(function (p) {
                return p !== null;
              });
              _context.n = 3;
              return ListarPacientesUseCase_classPrivateFieldGet(ListarPacientesUseCase_checkinRepository, this).readAllRows();
            case 3:
              checkinsRows = _context.v;
              _context.n = 4;
              return Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 263));
            case 4:
              _yield$import2 = _context.v;
              CheckinMapper = _yield$import2.CheckinMapper;
              checkins = checkinsRows.map(function (r) {
                return CheckinMapper.toDomain(r);
              }).filter(function (c) {
                return c !== null;
              }); // 2. Map patient stats
              return _context.a(2, pacientes.map(function (paciente) {
                // Calculate overall adherence rate
                var pacienteCheckins = checkins.filter(function (c) {
                  return c.pacienteId.equals(paciente.id);
                });
                var consumido = pacienteCheckins.filter(function (c) {
                  return c.status === 'CONCLUIDO';
                }).length;
                var atrasado = pacienteCheckins.filter(function (c) {
                  return c.status === 'ATRASADO';
                }).length;
                var realizado = consumido + atrasado;
                var total = pacienteCheckins.length;
                var rate = total > 0 ? Math.round(realizado / total * 100) : 0;
                return {
                  id: paciente.id.value,
                  nome: paciente.nome,
                  email: paciente.email.value,
                  rate: rate
                };
              }));
          }
        }, _callee, this);
      }));
      function execute() {
        return _execute.apply(this, arguments);
      }
      return execute;
    }())
  }]);
}();
;// ./src/infrastructure/ioc/AppModule.js
function AppModule_typeof(o) { "@babel/helpers - typeof"; return AppModule_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, AppModule_typeof(o); }
function AppModule_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function AppModule_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, AppModule_toPropertyKey(o.key), o); } }
function AppModule_createClass(e, r, t) { return r && AppModule_defineProperties(e.prototype, r), t && AppModule_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function AppModule_toPropertyKey(t) { var i = AppModule_toPrimitive(t, "string"); return "symbol" == AppModule_typeof(i) ? i : i + ""; }
function AppModule_toPrimitive(t, r) { if ("object" != AppModule_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != AppModule_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }














/**
 * AppModule (IoC Container)
 * 
 * Centraliza a instanciação de todas as dependências do sistema.
 * Implementa um padrão Service Locator simples (Singleton) para injeção de dependência.
 */
var Container = /*#__PURE__*/function () {
  function Container() {
    AppModule_classCallCheck(this, Container);
    this.services = {};
    this.useCases = {};
  }
  return AppModule_createClass(Container, [{
    key: "getServices",
    value: function getServices() {
      if (!this.services.initialized) {
        // Repositories
        this.services.pacienteRepository = new GoogleSheetsPacienteRepository();
        this.services.checkinRepository = new GoogleSheetsCheckinRepository();
        this.services.protocoloRepository = new GoogleSheetsProtocoloRepository();
        this.services.gamificacaoRepository = new GoogleSheetsGamificacaoRepository();
        this.services.permissaoRepository = new GoogleSheetsPermissaoRepository();

        // Infrastructure Services
        this.services.criptografiaService = new BcryptGasService();
        this.services.tokenService = new TokenService();
        this.services.initialized = true;
      }
      return this.services;
    }
  }, {
    key: "getUseCases",
    value: function getUseCases() {
      if (!this.useCases.initialized) {
        var s = this.getServices();
        this.useCases.loginUseCase = new LoginUseCase(s.pacienteRepository, s.criptografiaService, s.tokenService);
        this.useCases.criarPacienteUseCase = new CriarPacienteUseCase(s.pacienteRepository, s.criptografiaService);
        this.useCases.registrarCheckinUseCase = new RegistrarCheckinUseCase(s.pacienteRepository, s.protocoloRepository, s.checkinRepository, s.gamificacaoRepository);
        this.useCases.liberarEdicaoRetroativaUseCase = new LiberarEdicaoRetroativaUseCase(s.pacienteRepository, s.permissaoRepository);
        this.useCases.gerarDashboardUseCase = new GerarDashboardUseCase(s.pacienteRepository, s.protocoloRepository, s.checkinRepository, s.gamificacaoRepository);
        this.useCases.listarPacientesUseCase = new ListarPacientesUseCase(s.pacienteRepository, s.checkinRepository);
        this.useCases.initialized = true;
      }
      return this.useCases;
    }
  }]);
}();
var AppModule = new Container();
;// ./src/infrastructure/controllers/GasRouter.js
function GasRouter_typeof(o) { "@babel/helpers - typeof"; return GasRouter_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, GasRouter_typeof(o); }
function GasRouter_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return GasRouter_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (GasRouter_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, GasRouter_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, GasRouter_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), GasRouter_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", GasRouter_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), GasRouter_regeneratorDefine2(u), GasRouter_regeneratorDefine2(u, o, "Generator"), GasRouter_regeneratorDefine2(u, n, function () { return this; }), GasRouter_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (GasRouter_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function GasRouter_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } GasRouter_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { GasRouter_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, GasRouter_regeneratorDefine2(e, r, n, t); }
function GasRouter_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function GasRouter_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { GasRouter_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { GasRouter_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function GasRouter_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function GasRouter_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, GasRouter_toPropertyKey(o.key), o); } }
function GasRouter_createClass(e, r, t) { return r && GasRouter_defineProperties(e.prototype, r), t && GasRouter_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function GasRouter_toPropertyKey(t) { var i = GasRouter_toPrimitive(t, "string"); return "symbol" == GasRouter_typeof(i) ? i : i + ""; }
function GasRouter_toPrimitive(t, r) { if ("object" != GasRouter_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != GasRouter_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/**
 * GasRouter.js
 * 
 * Implementa o Padrão Command / Router Pattern para evitar God Objects.
 * Mapeia as ações (actions) recebidas no payload para seus respectivos manipuladores.
 */
var GasRouter = /*#__PURE__*/function () {
  function GasRouter() {
    GasRouter_classCallCheck(this, GasRouter);
  }
  return GasRouter_createClass(GasRouter, null, [{
    key: "getHandlers",
    value: function getHandlers() {
      var useCases = AppModule.getUseCases();
      var services = AppModule.getServices();
      return {
        'login': function () {
          var _login = GasRouter_asyncToGenerator(/*#__PURE__*/GasRouter_regenerator().m(function _callee(payload) {
            return GasRouter_regenerator().w(function (_context) {
              while (1) switch (_context.n) {
                case 0:
                  _context.n = 1;
                  return useCases.loginUseCase.execute({
                    email: payload.email,
                    senha: payload.rawSenha // Passed separately to avoid logging
                  });
                case 1:
                  return _context.a(2, _context.v);
              }
            }, _callee);
          }));
          function login(_x) {
            return _login.apply(this, arguments);
          }
          return login;
        }(),
        'criarPaciente': function () {
          var _criarPaciente = GasRouter_asyncToGenerator(/*#__PURE__*/GasRouter_regenerator().m(function _callee2(payload) {
            return GasRouter_regenerator().w(function (_context2) {
              while (1) switch (_context2.n) {
                case 0:
                  GasRouter._verifyAdminToken(payload.token, services.tokenService);
                  _context2.n = 1;
                  return useCases.criarPacienteUseCase.execute({
                    nome: payload.nome,
                    email: payload.email,
                    telefone: payload.telefone,
                    dataInicio: payload.dataInicio,
                    dataFim: payload.dataFim
                  });
                case 1:
                  return _context2.a(2, _context2.v);
              }
            }, _callee2);
          }));
          function criarPaciente(_x2) {
            return _criarPaciente.apply(this, arguments);
          }
          return criarPaciente;
        }(),
        'registrarCheckin': function () {
          var _registrarCheckin = GasRouter_asyncToGenerator(/*#__PURE__*/GasRouter_regenerator().m(function _callee3(payload) {
            var user;
            return GasRouter_regenerator().w(function (_context3) {
              while (1) switch (_context3.n) {
                case 0:
                  user = GasRouter._verifyToken(payload.token, services.tokenService);
                  _context3.n = 1;
                  return useCases.registrarCheckinUseCase.execute({
                    pacienteId: user.role === 'ADMIN' ? payload.pacienteId : user.userId,
                    suplementoId: payload.suplementoId,
                    dataHoraPrescrita: payload.dataHoraPrescrita,
                    dataHoraRealizada: payload.dataHoraRealizada,
                    forceRetroactive: payload.forceRetroactive || false
                  });
                case 1:
                  return _context3.a(2, _context3.v);
              }
            }, _callee3);
          }));
          function registrarCheckin(_x3) {
            return _registrarCheckin.apply(this, arguments);
          }
          return registrarCheckin;
        }(),
        'liberarEdicaoRetroativa': function () {
          var _liberarEdicaoRetroativa = GasRouter_asyncToGenerator(/*#__PURE__*/GasRouter_regenerator().m(function _callee4(payload) {
            var adminUser;
            return GasRouter_regenerator().w(function (_context4) {
              while (1) switch (_context4.n) {
                case 0:
                  adminUser = GasRouter._verifyAdminToken(payload.token, services.tokenService);
                  _context4.n = 1;
                  return useCases.liberarEdicaoRetroativaUseCase.execute({
                    pacienteId: payload.pacienteId,
                    horasLiberadas: Number(payload.horasLiberadas),
                    motivo: payload.motivo,
                    operadorId: adminUser.userId
                  });
                case 1:
                  return _context4.a(2, _context4.v);
              }
            }, _callee4);
          }));
          function liberarEdicaoRetroativa(_x4) {
            return _liberarEdicaoRetroativa.apply(this, arguments);
          }
          return liberarEdicaoRetroativa;
        }(),
        'gerarDashboard': function () {
          var _gerarDashboard = GasRouter_asyncToGenerator(/*#__PURE__*/GasRouter_regenerator().m(function _callee5(payload) {
            var authUser;
            return GasRouter_regenerator().w(function (_context5) {
              while (1) switch (_context5.n) {
                case 0:
                  authUser = GasRouter._verifyToken(payload.token, services.tokenService);
                  _context5.n = 1;
                  return useCases.gerarDashboardUseCase.execute({
                    pacienteId: authUser.role === 'ADMIN' ? payload.pacienteId : authUser.userId,
                    dataInicio: payload.dataInicio,
                    dataFim: payload.dataFim
                  });
                case 1:
                  return _context5.a(2, _context5.v);
              }
            }, _callee5);
          }));
          function gerarDashboard(_x5) {
            return _gerarDashboard.apply(this, arguments);
          }
          return gerarDashboard;
        }(),
        'listarPacientes': function () {
          var _listarPacientes = GasRouter_asyncToGenerator(/*#__PURE__*/GasRouter_regenerator().m(function _callee6(payload) {
            return GasRouter_regenerator().w(function (_context6) {
              while (1) switch (_context6.n) {
                case 0:
                  GasRouter._verifyAdminToken(payload.token, services.tokenService);
                  _context6.n = 1;
                  return useCases.listarPacientesUseCase.execute();
                case 1:
                  return _context6.a(2, _context6.v);
              }
            }, _callee6);
          }));
          function listarPacientes(_x6) {
            return _listarPacientes.apply(this, arguments);
          }
          return listarPacientes;
        }()
      };
    }

    /**
     * Executa uma ação roteada.
     */
  }, {
    key: "route",
    value: (function () {
      var _route = GasRouter_asyncToGenerator(/*#__PURE__*/GasRouter_regenerator().m(function _callee7(action, payload) {
        var handlers, handler;
        return GasRouter_regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              handlers = GasRouter.getHandlers();
              handler = handlers[action];
              if (handler) {
                _context7.n = 1;
                break;
              }
              throw new Error("A\xE7\xE3o desconhecida ou inv\xE1lida: ".concat(action));
            case 1:
              _context7.n = 2;
              return handler(payload);
            case 2:
              return _context7.a(2, _context7.v);
          }
        }, _callee7);
      }));
      function route(_x7, _x8) {
        return _route.apply(this, arguments);
      }
      return route;
    }() // Helpers de verificação de token transferidos para cá para manter o controlador limpo.
    )
  }, {
    key: "_verifyToken",
    value: function _verifyToken(token, tokenService) {
      var decoded = tokenService.validate(token);
      if (!decoded) {
        throw new Error('Token de sessão expirado ou inválido. Faça login novamente.');
      }
      return decoded;
    }
  }, {
    key: "_verifyAdminToken",
    value: function _verifyAdminToken(token, tokenService) {
      var decoded = GasRouter._verifyToken(token, tokenService);
      if (decoded.role !== 'ADMIN') {
        throw new Error('Acesso negado. Ação restrita a administradores.');
      }
      return decoded;
    }
  }]);
}();
;// ./src/infrastructure/middlewares/RateLimiter.js
function RateLimiter_typeof(o) { "@babel/helpers - typeof"; return RateLimiter_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, RateLimiter_typeof(o); }
function RateLimiter_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function RateLimiter_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, RateLimiter_toPropertyKey(o.key), o); } }
function RateLimiter_createClass(e, r, t) { return r && RateLimiter_defineProperties(e.prototype, r), t && RateLimiter_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function RateLimiter_toPropertyKey(t) { var i = RateLimiter_toPrimitive(t, "string"); return "symbol" == RateLimiter_typeof(i) ? i : i + ""; }
function RateLimiter_toPrimitive(t, r) { if ("object" != RateLimiter_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != RateLimiter_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function RateLimiter_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
/**
 * RateLimiter.js
 * Proteção contra ataques de força bruta, scraping e DoS.
 * Módulo 20: Reimplementado usando CacheService para persistência entre execuções no GAS.
 */

var RateLimiter = /*#__PURE__*/function () {
  function RateLimiter() {
    RateLimiter_classCallCheck(this, RateLimiter);
  }
  return RateLimiter_createClass(RateLimiter, null, [{
    key: "check",
    value:
    /**
     * Verifica se uma chave pode realizar uma ação.
     * @param {string} key - Identificador único (IP, email, sessão)
     * @returns {object} { allowed: boolean, remaining: number, lockedUntilISO?: string }
     */
    function check(key) {
      if (!key) return {
        allowed: true,
        remaining: RateLimiter_assertClassBrand(RateLimiter, this, _MAX_ATTEMPTS)._
      };
      var cache = _getCache.call(RateLimiter);
      if (!cache) return {
        allowed: true,
        remaining: RateLimiter_assertClassBrand(RateLimiter, this, _MAX_ATTEMPTS)._
      };
      var cacheKey = "".concat(RateLimiter_assertClassBrand(RateLimiter, this, _PREFIX)._).concat(key);
      var recordStr = cache.get(cacheKey);
      if (recordStr) {
        try {
          var record = JSON.parse(recordStr);
          if (record.lockedUntil) {
            var now = Date.now();
            if (now < record.lockedUntil) {
              return {
                allowed: false,
                remaining: 0,
                lockedUntilISO: new Date(record.lockedUntil).toISOString()
              };
            } else {
              // Lock expired, reset
              cache.remove(cacheKey);
              return {
                allowed: true,
                remaining: RateLimiter_assertClassBrand(RateLimiter, this, _MAX_ATTEMPTS)._
              };
            }
          }
          if (record.failures >= RateLimiter_assertClassBrand(RateLimiter, this, _MAX_ATTEMPTS)._) {
            // Should have been locked, enforce lock
            var lockedUntil = Date.now() + RateLimiter_assertClassBrand(RateLimiter, this, _LOCKOUT_MINUTES)._ * 60 * 1000;
            record.lockedUntil = lockedUntil;
            cache.put(cacheKey, JSON.stringify(record), RateLimiter_assertClassBrand(RateLimiter, this, _LOCKOUT_MINUTES)._ * 60);
            return {
              allowed: false,
              remaining: 0,
              lockedUntilISO: new Date(lockedUntil).toISOString()
            };
          }
          return {
            allowed: true,
            remaining: Math.max(0, RateLimiter_assertClassBrand(RateLimiter, this, _MAX_ATTEMPTS)._ - record.failures)
          };
        } catch (e) {
          // Parse error, reset
        }
      }
      return {
        allowed: true,
        remaining: RateLimiter_assertClassBrand(RateLimiter, this, _MAX_ATTEMPTS)._
      };
    }

    /**
     * Registra uma falha associada à chave. Incrementa as falhas.
     * @param {string} key 
     */
  }, {
    key: "recordFailure",
    value: function recordFailure(key) {
      if (!key) return;
      var cache = _getCache.call(RateLimiter);
      if (!cache) return;
      var cacheKey = "".concat(RateLimiter_assertClassBrand(RateLimiter, this, _PREFIX)._).concat(key);
      var recordStr = cache.get(cacheKey);
      var record = {
        failures: 0
      };
      if (recordStr) {
        try {
          record = JSON.parse(recordStr);
        } catch (e) {}
      }
      record.failures += 1;
      if (record.failures >= RateLimiter_assertClassBrand(RateLimiter, this, _MAX_ATTEMPTS)._) {
        record.lockedUntil = Date.now() + RateLimiter_assertClassBrand(RateLimiter, this, _LOCKOUT_MINUTES)._ * 60 * 1000;
      }

      // Keep record in cache for at least lockout time + some buffer
      var cacheTimeSecs = RateLimiter_assertClassBrand(RateLimiter, this, _LOCKOUT_MINUTES)._ * 60 + 300;
      cache.put(cacheKey, JSON.stringify(record), cacheTimeSecs);
    }

    /**
     * Reseta o contador após sucesso, limpando a chave no CacheService.
     * @param {string} key 
     */
  }, {
    key: "recordSuccess",
    value: function recordSuccess(key) {
      if (!key) return;
      var cache = _getCache.call(RateLimiter);
      if (cache) {
        cache.remove("".concat(RateLimiter_assertClassBrand(RateLimiter, this, _PREFIX)._).concat(key));
      }
    }
  }]);
}();
function _getCache() {
  return typeof CacheService !== 'undefined' ? CacheService.getScriptCache() : null;
}
var _PREFIX = {
  _: 'RATE_LIMIT_'
};
var _MAX_ATTEMPTS = {
  _: SystemConfiguration.MAX_LOGIN_ATTEMPTS || 5
};
var _LOCKOUT_MINUTES = {
  _: SystemConfiguration.LOGIN_LOCKOUT_MINUTES || 15
};
;// ./src/shared/utils/InputSanitizer.js
function InputSanitizer_slicedToArray(r, e) { return InputSanitizer_arrayWithHoles(r) || InputSanitizer_iterableToArrayLimit(r, e) || InputSanitizer_unsupportedIterableToArray(r, e) || InputSanitizer_nonIterableRest(); }
function InputSanitizer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function InputSanitizer_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return InputSanitizer_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? InputSanitizer_arrayLikeToArray(r, a) : void 0; } }
function InputSanitizer_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function InputSanitizer_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function InputSanitizer_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function InputSanitizer_typeof(o) { "@babel/helpers - typeof"; return InputSanitizer_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, InputSanitizer_typeof(o); }
function InputSanitizer_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function InputSanitizer_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, InputSanitizer_toPropertyKey(o.key), o); } }
function InputSanitizer_createClass(e, r, t) { return r && InputSanitizer_defineProperties(e.prototype, r), t && InputSanitizer_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function InputSanitizer_toPropertyKey(t) { var i = InputSanitizer_toPrimitive(t, "string"); return "symbol" == InputSanitizer_typeof(i) ? i : i + ""; }
function InputSanitizer_toPrimitive(t, r) { if ("object" != InputSanitizer_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != InputSanitizer_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * InputSanitizer.js
 * Centralized input sanitization utility to prevent XSS, HTML injection,
 * and Google Sheets formula injection attacks.
 * 
 * Security Layer: Shared Utility (used by Controllers and Validators)
 * OWASP Reference: A03:2021 – Injection
 */
var InputSanitizer = /*#__PURE__*/function () {
  function InputSanitizer() {
    InputSanitizer_classCallCheck(this, InputSanitizer);
  }
  return InputSanitizer_createClass(InputSanitizer, null, [{
    key: "escapeHtml",
    value:
    /**
     * Sanitizes a string by escaping HTML entities.
     * Prevents XSS when values are rendered in the frontend.
     * @param {string} input - Raw user input
     * @returns {string} Sanitized string
     */
    function escapeHtml(input) {
      if (typeof input !== 'string') return '';
      return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
    }

    /**
     * Prevents Google Sheets formula injection.
     * Attackers may send strings starting with =, +, -, @ or TAB
     * that execute as formulas when written to a cell.
     * @param {string} input - Raw user input
     * @returns {string} Safe string for Sheets persistence
     */
  }, {
    key: "sanitizeForSheets",
    value: function sanitizeForSheets(input) {
      if (typeof input !== 'string') return '';
      var trimmed = input.trim();
      // Prefix dangerous leading characters with a single quote to neutralize formula execution
      if (/^[=+\-@\t\r]/.test(trimmed)) {
        return "'".concat(trimmed);
      }
      return trimmed;
    }

    /**
     * Strips all HTML tags from a string.
     * Used for fields that must never contain markup (names, addresses).
     * @param {string} input - Raw user input
     * @returns {string} Plain text
     */
  }, {
    key: "stripTags",
    value: function stripTags(input) {
      if (typeof input !== 'string') return '';
      return input.replace(/<[^>]*>/g, '');
    }

    /**
     * Sanitizes an entire DTO object recursively.
     * Applies escapeHtml and sanitizeForSheets to all string fields.
     * @param {object} dto - Data Transfer Object with user-provided fields
     * @returns {object} Sanitized DTO
     */
  }, {
    key: "sanitizeDTO",
    value: function sanitizeDTO(dto) {
      if (!dto || InputSanitizer_typeof(dto) !== 'object') return {};
      var sanitized = {};
      // Security: Block prototype pollution keys (CWE-1321)
      var BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
      for (var _i = 0, _Object$entries = Object.entries(dto); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = InputSanitizer_slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];
        if (BLOCKED_KEYS.has(key)) continue;
        if (typeof value === 'string') {
          sanitized[key] = InputSanitizer.sanitizeForSheets(InputSanitizer.escapeHtml(InputSanitizer.stripTags(value)));
        } else if (InputSanitizer_typeof(value) === 'object' && value !== null && !Array.isArray(value)) {
          sanitized[key] = InputSanitizer.sanitizeDTO(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    }

    /**
     * Validates that a value is a safe, non-empty string within length limits.
     * @param {string} input - Raw user input
     * @param {number} maxLength - Maximum allowed character count
     * @returns {boolean}
     */
  }, {
    key: "isValidLength",
    value: function isValidLength(input) {
      var maxLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
      return typeof input === 'string' && input.trim().length > 0 && input.length <= maxLength;
    }
  }]);
}();
;// ./src/shared/logging/AuditLogger.js
function AuditLogger_typeof(o) { "@babel/helpers - typeof"; return AuditLogger_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, AuditLogger_typeof(o); }
function AuditLogger_toConsumableArray(r) { return AuditLogger_arrayWithoutHoles(r) || AuditLogger_iterableToArray(r) || AuditLogger_unsupportedIterableToArray(r) || AuditLogger_nonIterableSpread(); }
function AuditLogger_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function AuditLogger_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return AuditLogger_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? AuditLogger_arrayLikeToArray(r, a) : void 0; } }
function AuditLogger_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function AuditLogger_arrayWithoutHoles(r) { if (Array.isArray(r)) return AuditLogger_arrayLikeToArray(r); }
function AuditLogger_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function AuditLogger_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function AuditLogger_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, AuditLogger_toPropertyKey(o.key), o); } }
function AuditLogger_createClass(e, r, t) { return r && AuditLogger_defineProperties(e.prototype, r), t && AuditLogger_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function AuditLogger_toPropertyKey(t) { var i = AuditLogger_toPrimitive(t, "string"); return "symbol" == AuditLogger_typeof(i) ? i : i + ""; }
function AuditLogger_toPrimitive(t, r) { if ("object" != AuditLogger_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != AuditLogger_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * AuditLogger.js
 * Centralized audit trail service that records all security-relevant events
 * and data mutations for LGPD compliance and forensic analysis.
 * 
 * Security Layer: Infrastructure / Observability
 * Compliance: LGPD Art. 37 (Registro de Tratamento), OWASP A09:2021 – Logging & Monitoring Failures
 * 
 * Architecture Note: Writes to the 'Auditoria' sheet tab. When migrating to
 * PostgreSQL, replace GoogleSheetsAuditWriter with PostgresAuditWriter
 * while keeping this service's interface intact.
 */

var AuditLogger = /*#__PURE__*/function () {
  function AuditLogger() {
    AuditLogger_classCallCheck(this, AuditLogger);
  }
  return AuditLogger_createClass(AuditLogger, null, [{
    key: "log",
    value:
    /**
     * Records an audit event in the persistent audit trail.
     * @param {object} params
     * @param {string} params.operadorId - UUID of the user performing the action
     * @param {string} params.tabela - Target entity/table name
     * @param {string} params.registroId - UUID of the affected record
     * @param {string} params.tipoAcao - Action type: CREATE, UPDATE, DELETE, READ, LOGIN, LOGOUT, EXPORT
     * @param {object} [params.dadosAntigos] - Previous values (for UPDATE/DELETE)
     * @param {object} [params.dadosNovos] - New values (for CREATE/UPDATE)
     * @param {string} [params.ip] - Client IP address (when available)
     * @param {string} [params.dispositivo] - User-Agent string
     * @param {string} [params.motivo] - Human-readable justification
     */
    function log(_ref) {
      var operadorId = _ref.operadorId,
        tabela = _ref.tabela,
        registroId = _ref.registroId,
        tipoAcao = _ref.tipoAcao,
        _ref$dadosAntigos = _ref.dadosAntigos,
        dadosAntigos = _ref$dadosAntigos === void 0 ? null : _ref$dadosAntigos,
        _ref$dadosNovos = _ref.dadosNovos,
        dadosNovos = _ref$dadosNovos === void 0 ? null : _ref$dadosNovos,
        _ref$ip = _ref.ip,
        ip = _ref$ip === void 0 ? 'N/A' : _ref$ip,
        _ref$dispositivo = _ref.dispositivo,
        dispositivo = _ref$dispositivo === void 0 ? 'N/A' : _ref$dispositivo,
        _ref$motivo = _ref.motivo,
        motivo = _ref$motivo === void 0 ? '' : _ref$motivo;
      var entry = {
        id: UUID/* UUID */.k.generate().value,
        timestamp: new Date().toISOString(),
        operadorId: operadorId || 'SYSTEM',
        tabela: tabela,
        registroId: registroId || 'N/A',
        tipoAcao: tipoAcao,
        dadosAntigos: dadosAntigos ? JSON.stringify(dadosAntigos) : '',
        dadosNovos: dadosNovos ? JSON.stringify(dadosNovos) : '',
        ip: ip,
        dispositivo: dispositivo,
        motivo: motivo
      };

      // Persist to Google Sheets 'Auditoria' tab
      if (typeof SpreadsheetApp !== 'undefined') {
        try {
          var ssId = typeof PropertiesService !== 'undefined' ? PropertiesService.getScriptProperties().getProperty('DATABASE_SPREADSHEET_ID') : null;
          if (ssId) {
            var ss = SpreadsheetApp.openById(ssId);
            var sheet = ss.getSheetByName('Auditoria');
            if (!sheet) {
              sheet = ss.insertSheet('Auditoria');
              sheet.getRange(1, 1, 1, 11).setValues([['id', 'timestamp', 'operadorId', 'tabela', 'registroId', 'tipoAcao', 'dadosAntigos', 'dadosNovos', 'ip', 'dispositivo', 'motivo']]);
            }
            sheet.appendRow([entry.id, entry.timestamp, entry.operadorId, entry.tabela, entry.registroId, entry.tipoAcao, entry.dadosAntigos, entry.dadosNovos, entry.ip, entry.dispositivo, entry.motivo]);
          }
        } catch (auditError) {
          // Audit logging must never crash the main operation (fail-open for logging)
          if (typeof console !== 'undefined') {
            console.error('AuditLogger: Falha ao registrar auditoria:', auditError.message);
          }
        }
      }

      // In-memory fallback for tests and local development
      if (!_memoryLog._) {
        _memoryLog._ = [];
      }
      _memoryLog._.push(entry);
      return entry;
    }

    /** @type {Array} */
  }, {
    key: "getMemoryLog",
    value:
    /**
     * Returns the in-memory log entries (for testing and local dev only).
     * @returns {Array}
     */
    function getMemoryLog() {
      return AuditLogger_toConsumableArray(_memoryLog._ || []);
    }

    /**
     * Clears in-memory log (for test suite resets).
     */
  }, {
    key: "clearMemoryLog",
    value: function clearMemoryLog() {
      _memoryLog._ = [];
    }

    /**
     * Logs a security-specific event (login attempts, failures, anomalies).
     * @param {string} eventType - SECURITY_LOGIN_SUCCESS, SECURITY_LOGIN_FAILURE, SECURITY_LOCKOUT, SECURITY_TOKEN_EXPIRED
     * @param {string} userId
     * @param {object} [metadata]
     */
  }, {
    key: "logSecurityEvent",
    value: function logSecurityEvent(eventType, userId) {
      var metadata = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return AuditLogger.log({
        operadorId: userId || 'ANONYMOUS',
        tabela: 'Sessoes',
        registroId: metadata.sessionId || 'N/A',
        tipoAcao: eventType,
        dadosNovos: metadata,
        ip: metadata.ip || 'N/A',
        dispositivo: metadata.userAgent || 'N/A',
        motivo: metadata.motivo || eventType
      });
    }
  }]);
}();
var _memoryLog = {
  _: []
};
;// ./src/infrastructure/controllers/GasController.js
function GasController_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return GasController_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (GasController_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, GasController_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, GasController_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), GasController_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", GasController_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), GasController_regeneratorDefine2(u), GasController_regeneratorDefine2(u, o, "Generator"), GasController_regeneratorDefine2(u, n, function () { return this; }), GasController_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (GasController_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function GasController_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } GasController_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { GasController_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, GasController_regeneratorDefine2(e, r, n, t); }
function GasController_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function GasController_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { GasController_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { GasController_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }





/**
 * GasController.js
 * 
 * Controlador principal / Front Controller do Google Apps Script.
 * Refatorado na Sprint 2 para delegar responsabilidades, focando apenas
 * em parsing HTTP, sanitização, controle de taxa e roteamento genérico.
 */
function handlePost(_x) {
  return _handlePost.apply(this, arguments);
}

/**
 * Format GAS HTTP Response output.
 */
function _handlePost() {
  _handlePost = GasController_asyncToGenerator(/*#__PURE__*/GasController_regenerator().m(function _callee(e) {
    var responseData, statusCode, MAX_PAYLOAD_BYTES, rawPayload, payload, action, loginKey, rateCheck, safeMessage, _t, _t2;
    return GasController_regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          statusCode = 200;
          _context.p = 1;
          if (!(!e || !e.postData || !e.postData.contents)) {
            _context.n = 2;
            break;
          }
          throw new Error('Corpo de requisição POST ausente ou inválido.');
        case 2:
          // Defesa em Profundidade: Rejeita payloads gigantes (CWE-400)
          MAX_PAYLOAD_BYTES = 10240; // 10 KB
          if (!(e.postData.contents.length > MAX_PAYLOAD_BYTES)) {
            _context.n = 3;
            break;
          }
          throw new Error('Payload excede o tamanho máximo permitido.');
        case 3:
          rawPayload = JSON.parse(e.postData.contents); // Defesa em Profundidade: Sanitização Anti-XSS e Formula Injection
          payload = InputSanitizer.sanitizeDTO(rawPayload);
          action = payload.action;
          if (!(!action || typeof action !== 'string' || action.length > 50)) {
            _context.n = 4;
            break;
          }
          throw new Error('Ação inválida ou não especificada.');
        case 4:
          if (!(action === 'login')) {
            _context.n = 9;
            break;
          }
          loginKey = (payload.email || '').toLowerCase().trim();
          rateCheck = RateLimiter.check(loginKey);
          if (rateCheck.allowed) {
            _context.n = 5;
            break;
          }
          AuditLogger.logSecurityEvent('SECURITY_LOCKOUT', loginKey, {
            motivo: 'Tentativas de login excedidas'
          });
          throw new Error("Conta bloqueada temporariamente. Tente novamente ap\xF3s ".concat(rateCheck.lockedUntilISO, "."));
        case 5:
          _context.p = 5;
          // Pass the raw password via a hidden property to bypass sanitization which might corrupt it
          payload.rawSenha = rawPayload.senha;
          _context.n = 6;
          return GasRouter.route(action, payload);
        case 6:
          responseData = _context.v;
          RateLimiter.recordSuccess(loginKey);
          AuditLogger.logSecurityEvent('SECURITY_LOGIN_SUCCESS', loginKey);
          _context.n = 8;
          break;
        case 7:
          _context.p = 7;
          _t = _context.v;
          RateLimiter.recordFailure(loginKey);
          AuditLogger.logSecurityEvent('SECURITY_LOGIN_FAILURE', loginKey, {
            motivo: _t.message
          });
          throw _t;
        case 8:
          _context.n = 11;
          break;
        case 9:
          _context.n = 10;
          return GasRouter.route(action, payload);
        case 10:
          responseData = _context.v;
        case 11:
          _context.n = 13;
          break;
        case 12:
          _context.p = 12;
          _t2 = _context.v;
          statusCode = _t2.message.includes('não autorizado') || _t2.message.includes('Token') || _t2.message.includes('bloqueada') ? 401 : 400;

          // Evita vazamento de stack traces internos
          safeMessage = statusCode === 401 ? _t2.message : 'Erro ao processar a requisição. Verifique os dados e tente novamente.';
          responseData = {
            error: true,
            message: safeMessage
          };
        case 13:
          return _context.a(2, formatGasResponse(responseData, statusCode));
      }
    }, _callee, null, [[5, 7], [1, 12]]);
  }));
  return _handlePost.apply(this, arguments);
}
function formatGasResponse(data, statusCode) {
  var output = typeof ContentService !== 'undefined' ? ContentService.createTextOutput(JSON.stringify({
    statusCode: statusCode,
    data: data
  })) : JSON.stringify({
    statusCode: statusCode,
    data: data
  });
  if (typeof output !== 'string') {
    output.setMimeType(ContentService.MimeType.JSON);
  }
  return output;
}
;// ./src/infrastructure/persistence/DatabaseSetup.js
function DatabaseSetup_typeof(o) { "@babel/helpers - typeof"; return DatabaseSetup_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, DatabaseSetup_typeof(o); }
function DatabaseSetup_slicedToArray(r, e) { return DatabaseSetup_arrayWithHoles(r) || DatabaseSetup_iterableToArrayLimit(r, e) || DatabaseSetup_unsupportedIterableToArray(r, e) || DatabaseSetup_nonIterableRest(); }
function DatabaseSetup_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function DatabaseSetup_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return DatabaseSetup_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? DatabaseSetup_arrayLikeToArray(r, a) : void 0; } }
function DatabaseSetup_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function DatabaseSetup_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function DatabaseSetup_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function DatabaseSetup_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function DatabaseSetup_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, DatabaseSetup_toPropertyKey(o.key), o); } }
function DatabaseSetup_createClass(e, r, t) { return r && DatabaseSetup_defineProperties(e.prototype, r), t && DatabaseSetup_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function DatabaseSetup_toPropertyKey(t) { var i = DatabaseSetup_toPrimitive(t, "string"); return "symbol" == DatabaseSetup_typeof(i) ? i : i + ""; }
function DatabaseSetup_toPrimitive(t, r) { if ("object" != DatabaseSetup_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != DatabaseSetup_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/**
 * DatabaseSetup.js
 * Infrastructure utility to automatically initialize and configure 
 * all required Google Sheets tabs and headers on the target Spreadsheet.
 */
var DatabaseSetup = /*#__PURE__*/function () {
  function DatabaseSetup() {
    DatabaseSetup_classCallCheck(this, DatabaseSetup);
  }
  return DatabaseSetup_createClass(DatabaseSetup, null, [{
    key: "initializeDatabase",
    value:
    /**
     * Automatically initializes the database sheets tabs and write headers.
     * Safe to call repeatedly (idempotent).
     */
    function initializeDatabase() {
      if (typeof SpreadsheetApp === 'undefined') {
        if (typeof console !== 'undefined') {
          console.log('Ambiente local/teste: inicialização física do Google Sheets ignorada.');
        }
        return;
      }
      var ssId = SystemConfiguration.DATABASE_SPREADSHEET_ID;
      if (!ssId || ssId === 'SANDBOX_SPREADSHEET_ID_DEFAULT') {
        throw new Error('DATABASE_SPREADSHEET_ID não está configurado nas propriedades do script.');
      }
      var ss = SpreadsheetApp.openById(ssId);

      // Define all required sheets and their corresponding headers
      var schema = {
        'Pacientes': ['id', 'protocoloId', 'nome', 'email', 'telefone', 'senhaHash', 'status', 'dataInicio', 'dataFim', 'deletedAt'],
        'Protocolos': ['id', 'nome', 'duracaoDias'],
        'Suplementos': ['id', 'protocoloId', 'nome', 'dosagem', 'horarios', 'instrucoes'],
        'Check_Ins': ['id', 'pacienteId', 'suplementoId', 'dtPrescrita', 'dtRealizada', 'status', 'retroativo'],
        'PermissoesRetroativas': ['id', 'pacienteId', 'horasLiberadas', 'motivo', 'operadorId', 'expiraEm', 'status', 'createdAt'],
        'Gamificacao': ['id', 'pacienteId', 'xpTotal', 'streakAtual', 'maiorStreak', 'conquistas'],
        'Auditoria': ['id', 'timestamp', 'operadorId', 'tabela', 'registroId', 'tipoAcao', 'dadosAntigos', 'dadosNovos', 'ip', 'dispositivo', 'motivo']
      };
      for (var _i = 0, _Object$entries = Object.entries(schema); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = DatabaseSetup_slicedToArray(_Object$entries[_i], 2),
          tabName = _Object$entries$_i[0],
          headers = _Object$entries$_i[1];
        var sheet = ss.getSheetByName(tabName);
        if (!sheet) {
          sheet = ss.insertSheet(tabName);
          if (typeof console !== 'undefined') {
            console.log("Criando aba f\xEDsica: [".concat(tabName, "]"));
          }
        }

        // Check if header needs to be written
        var lastRow = sheet.getLastRow();
        if (lastRow === 0) {
          // Write header row
          sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
          // Format header row (bold & slate background styling for premium spreadsheet appearance)
          sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1E293B').setFontColor('#FFFFFF');

          // Auto-fit columns layout
          sheet.autoResizeColumns(1, headers.length);
        }
      }
      SpreadsheetApp.flush();
      if (typeof console !== 'undefined') {
        console.log('Inicialização do banco de dados concluída com sucesso!');
      }
    }
  }]);
}();
;// ./src/app/main.js



/**
 * doPost(e)
 * Global entrypoint for Google Apps Script WebApp POST requests.
 */
__webpack_require__.g.doPost = function (e) {
  return handlePost(e);
};

/**
 * doGet(e)
 * Global entrypoint for Google Apps Script WebApp GET requests.
 * Used for status checking and health check verification.
 */
__webpack_require__.g.doGet = function (e) {
  var status = {
    app: 'Acompanhamento Clínico Integrativo API',
    status: 'ONLINE',
    timestamp: new Date().toISOString(),
    environment: typeof PropertiesService !== 'undefined' ? 'Google Apps Script' : 'Node Sandbox'
  };
  if (typeof ContentService !== 'undefined') {
    return ContentService.createTextOutput(JSON.stringify(status)).setMimeType(ContentService.MimeType.JSON);
  }
  return JSON.stringify(status);
};

/**
 * setup()
 * Manual trigger function to initialize the spreadsheet database structure.
 * Clinical administrators run this function once from the GAS Editor after deployment.
 */
__webpack_require__.g.setup = function () {
  DatabaseSetup.initializeDatabase();
};
})();

/******/ })()
;