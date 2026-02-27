// Supabase 配置文件
// 请将以下配置替换为你自己的 Supabase 项目配置

const SUPABASE_URL = 'https://aqqdk1bqkqazaomrphs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_nJFN25ZUU9WZTKYO5dCiyQ__emLoYXb';

// 初始化 Supabase 客户端
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
