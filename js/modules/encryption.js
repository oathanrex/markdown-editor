/**
 * Encryption Module
 * Handles client-side encryption using Web Crypto API
 */

/**
 * Encryption Manager using Web Crypto API
 */
export class Encryption {
    constructor() {
        this.algorithm = 'AES-GCM';
        this.keyLength = 256;
        this.ivLength = 12;
        this.saltLength = 16;
        this.iterations = 100000;
        this.passphrase = null;
        this.isUnlocked = false;
    }

    /**
     * Check if Web Crypto API is available
     */
    isSupported() {
        return !!(window.crypto && window.crypto.subtle);
    }

    /**
     * Derive a key from passphrase using PBKDF2
     * @param {string} passphrase - User passphrase
     * @param {Uint8Array} salt - Salt for key derivation
     * @returns {Promise<CryptoKey>}
     */
    async deriveKey(passphrase, salt) {
        // Import passphrase as raw key material
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(passphrase),
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        );

        // Derive AES-GCM key using PBKDF2
        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: this.iterations,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: this.algorithm, length: this.keyLength },
            false,
            ['encrypt', 'decrypt']
        );
    }

    /**
     * Set passphrase and derive key
     * @param {string} passphrase - User passphrase
     */
    async setPassphrase(passphrase) {
        if (!passphrase || passphrase.length < 8) {
            throw new Error('Passphrase must be at least 8 characters');
        }
        this.passphrase = passphrase;
        this.isUnlocked = true;
    }

    /**
     * Lock encryption (clear derived key)
     */
    lock() {
        this.passphrase = null;
        this.isUnlocked = false;
    }

    /**
     * Encrypt text
     * @param {string} plaintext - Text to encrypt
     * @returns {Promise<string>} - Base64 encoded encrypted data
     */
    async encrypt(plaintext) {
        if (!this.isUnlocked || !this.passphrase) {
            throw new Error('Encryption not unlocked. Set passphrase first.');
        }

        // Generate random salt and IV per payload
        const salt = crypto.getRandomValues(new Uint8Array(this.saltLength));
        // Generate random IV
        const iv = crypto.getRandomValues(new Uint8Array(this.ivLength));
        const key = await this.deriveKey(this.passphrase, salt);

        // Encrypt
        const encodedText = new TextEncoder().encode(plaintext);
        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: this.algorithm, iv: iv },
            key,
            encodedText
        );

        // Combine salt + iv + ciphertext
        const combined = new Uint8Array(
            salt.length + iv.length + encryptedBuffer.byteLength
        );
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);

        // Return as base64
        return this.arrayBufferToBase64(combined);
    }

    /**
     * Decrypt text
     * @param {string} encryptedBase64 - Base64 encoded encrypted data
     * @param {string} passphrase - Passphrase (optional if already unlocked)
     * @returns {Promise<string>} - Decrypted plaintext
     */
    async decrypt(encryptedBase64, passphrase = null) {
        const combined = this.base64ToArrayBuffer(encryptedBase64);

        // Extract salt, iv, and ciphertext
        const salt = combined.slice(0, this.saltLength);
        const iv = combined.slice(this.saltLength, this.saltLength + this.ivLength);
        const ciphertext = combined.slice(this.saltLength + this.ivLength);

        // Derive key if passphrase provided
        const effectivePassphrase = passphrase || this.passphrase;
        if (!effectivePassphrase) {
            throw new Error('No decryption key available');
        }
        const key = await this.deriveKey(effectivePassphrase, salt);

        // Decrypt
        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: this.algorithm, iv: iv },
            key,
            ciphertext
        );

        return new TextDecoder().decode(decryptedBuffer);
    }

    /**
     * Verify passphrase against encrypted data
     * @param {string} encryptedBase64 - Encrypted data
     * @param {string} passphrase - Passphrase to verify
     * @returns {Promise<boolean>}
     */
    async verifyPassphrase(encryptedBase64, passphrase) {
        try {
            await this.decrypt(encryptedBase64, passphrase);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Generate a random encryption key (for export)
     * @returns {Promise<string>} - Base64 encoded key
     */
    async generateRandomKey() {
        const key = await crypto.subtle.generateKey(
            { name: this.algorithm, length: this.keyLength },
            true,
            ['encrypt', 'decrypt']
        );
        const exported = await crypto.subtle.exportKey('raw', key);
        return this.arrayBufferToBase64(new Uint8Array(exported));
    }

    /**
     * Hash a string (for integrity checks)
     * @param {string} text - Text to hash
     * @returns {Promise<string>} - Hex hash
     */
    async hash(text) {
        const encoded = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Convert ArrayBuffer to Base64 string
     */
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    /**
     * Convert Base64 string to Uint8Array
     */
    base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }
}

