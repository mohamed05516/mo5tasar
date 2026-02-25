import { createClient } from '@supabase/supabase-js';

// الرابط المستخرج من الصورة الأخيرة
const supabaseUrl = 'https://rykcxpteebirfbvrklfn.supabase.co'; 

// المفتاح المستخرج من الصورة رقم 14 (Publishable key)
const supabaseKey = 'sb_publishable_e6ynvoxdZkUW2DSYqIKF_w_D4Un_NEd'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
