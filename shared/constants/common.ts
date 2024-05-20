import { isMobile } from 'react-device-detect';

export const DEFAULT_TOKEN = isMobile ? "Token" : "Select a token";