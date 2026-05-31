export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  provider: "credentials" | "google";
  image?: string;
}

export interface OtpRecord {
  code: string;
  purpose: "signup" | "login" | "reset";
  expiresAt: number;
  attempts: number;
}

export interface ResetTokenRecord {
  userId: string;
  expiresAt: number;
}
