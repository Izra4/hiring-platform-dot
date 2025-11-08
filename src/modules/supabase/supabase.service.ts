import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: ReturnType<typeof createClient>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL dan Key harus diisi di .env');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): ReturnType<typeof createClient> {
    return this.supabase;
  }
}
