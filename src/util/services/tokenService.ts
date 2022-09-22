/**
 * Contains all functions to dealing with JWT.
 */
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const TOKENS_LOCALSTORAGE_KEY = 'tokens';

class NoTokenInStorage extends Error {
  constructor() {
    super('No token stored in local storage');
  }
}

function getTokens(): Tokens | null {
  const tokensJson = localStorage.getItem(TOKENS_LOCALSTORAGE_KEY);
  if (!tokensJson) {
    return null;
  }
  const tokens = JSON.parse(tokensJson) as Tokens;
  return tokens;
}

function removeTokens() {
  localStorage.removeItem(TOKENS_LOCALSTORAGE_KEY);
}

function setTokens(tokens: Tokens) {
  localStorage.setItem(TOKENS_LOCALSTORAGE_KEY, JSON.stringify(tokens));
}

function getLocalRefreshToken() {
  const tokens = getTokens();
  return tokens && tokens.refreshToken ? tokens.refreshToken : 'xx';
}

function getLocalAccessToken() {
  const tokens = getTokens();
  return tokens && tokens.accessToken ? tokens.accessToken : 'xx';
}

function updateAccessToken(accessToken: string): void {
  const tokens = getTokens();
  if (!tokens) {
    throw new NoTokenInStorage();
  }
  tokens.accessToken = accessToken;
  localStorage.setItem(TOKENS_LOCALSTORAGE_KEY, JSON.stringify(tokens));
}

const TokenService = {
  getTokens,
  setTokens,
  getLocalAccessToken,
  getLocalRefreshToken,
  updateAccessToken,
  removeTokens,
};

export default TokenService;
