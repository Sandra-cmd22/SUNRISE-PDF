import { createClient } from '@supabase/supabase-js';

// Validar se as variáveis de ambiente estão definidas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não configuradas');
}

// Criar cliente Supabase
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

