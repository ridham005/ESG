/**
 * EcoSphere Enterprise Security Engine
 * Includes: Rate limiting, XSS/Injection Sanitization, File Validation, Information Leakage Shields
 */

// 1. Rate Limiting Engine (Sliding Window Algorithm)
interface RateLimitRecord {
  timestamps: number[];
  lockedUntil?: number;
}

class RateLimiterService {
  private records: Map<string, RateLimitRecord> = new Map();

  check(action: string, maxRequests: number, windowSeconds: number, lockoutSeconds: number = 60): { allowed: boolean; retryAfter?: number; error?: string } {
    const now = Date.now();
    const record = this.records.get(action) || { timestamps: [] };

    // Check if currently locked out
    if (record.lockedUntil && now < record.lockedUntil) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return {
        allowed: false,
        retryAfter: remainingSeconds,
        error: `Rate limit exceeded. Security cooldown active for ${remainingSeconds} seconds.`
      };
    }

    // Filter out timestamps outside the sliding window
    const windowStart = now - windowSeconds * 1000;
    record.timestamps = record.timestamps.filter(ts => ts > windowStart);

    if (record.timestamps.length >= maxRequests) {
      record.lockedUntil = now + lockoutSeconds * 1000;
      this.records.set(action, record);
      return {
        allowed: false,
        retryAfter: lockoutSeconds,
        error: `Too many attempts. Locked out for ${lockoutSeconds} seconds to prevent abuse.`
      };
    }

    // Register current attempt
    record.timestamps.push(now);
    this.records.set(action, record);
    return { allowed: true };
  }

  reset(action: string): void {
    this.records.delete(action);
  }
}

export const rateLimiter = new RateLimiterService();

// 2. Input Validation & XSS/Injection Sanitizers
export function sanitizeString(input: string, maxLength: number = 500): string {
  if (!input || typeof input !== 'string') return '';
  
  // Trim and limit length
  let sanitized = input.trim().slice(0, maxLength);
  
  // Strip dangerous XSS injection vectors
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/onload\s*=/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onclick\s*=/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  return sanitized;
}

export function validateNumericRange(val: number, min: number, max: number, fallback: number): number {
  if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) return fallback;
  return Math.min(Math.max(val, min), max);
}

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim()) && email.length <= 100;
}

// 3. File Upload Safety Validator
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedName?: string;
}

export function validateUploadFile(file: { name: string; size: number; type: string }): FileValidationResult {
  if (!file || !file.name) {
    return { valid: false, error: 'No file provided.' };
  }

  // File size validation
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'File exceeds maximum permitted size of 5 MB.' };
  }
  if (file.size <= 0) {
    return { valid: false, error: 'Empty files cannot be uploaded.' };
  }

  // MIME type validation
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const allowedExtensions = new Set(['jpg', 'jpeg', 'png', 'webp', 'pdf']);
  
  if (!allowedExtensions.has(ext)) {
    return { valid: false, error: `File extension .${ext} is forbidden. Allowed: JPG, PNG, WEBP, PDF.` };
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    return { valid: false, error: 'Invalid file MIME type detected.' };
  }

  // Prevent path traversal & script injection in filename
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 80);

  return { valid: true, sanitizedName };
}

// 4. Information Leakage Shield & Generic Error Handling
export function sanitizeErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  
  const rawMsg = error instanceof Error ? error.message : String(error);

  // Security Log (Internal only)
  console.error('[EcoSphere Security Shield] Handled Error:', rawMsg);

  // Mask filesystem paths, stack traces, database terms
  if (
    rawMsg.includes('/') ||
    rawMsg.includes('\\') ||
    rawMsg.includes('node_modules') ||
    rawMsg.includes('JSON.parse') ||
    rawMsg.includes('SyntaxError') ||
    rawMsg.includes('TypeError')
  ) {
    return 'Action could not be completed due to a processing restriction. Please verify your inputs and try again.';
  }

  return rawMsg;
}
