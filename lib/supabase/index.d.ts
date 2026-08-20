import { Database } from './types'

// 1. Core Schema Shorthand
export type PublicSchema = Database['public']
export type Tables = PublicSchema['Tables']
export type Functions = PublicSchema['Functions']
export type Enums = PublicSchema['Enums']

// 2. Transaction Domain Types
export type Transaction = Tables['transactions']['Row']
export type InsertTransaction = Tables['transactions']['Insert']
export type UpdateTransaction = Tables['transactions']['Update']

// 3. User / Profile Domain Types
export type Profile = Tables['profiles']['Row']
export type InsertProfile = Tables['profiles']['Insert']

export type Pin = Tables['pins']['Row']

export type DecryptedPin = Functions['get_decrypted_pins']['Returns'][number];

// 4. Global Database Enum Helpers (e.g., if you have a 'status' enum)
export type TransactionStatus = Enums['transaction_status']
