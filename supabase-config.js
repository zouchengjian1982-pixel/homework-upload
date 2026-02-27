// Supabase 配置文件
// 请将以下配置替换为你自己的 Supabase 项目配置

const SUPABASE_URL = 'https://aqqdk1bqkqazaomrprhs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcWRraWJxa3FhemFvbXJwcmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMTg3NTEsImV4cCI6MjA4NzY5NDc1MX0._1dq5qMkFHV4XW10DtltExeWc8fzlZx6sHxjfDDHz6s';

// 初始化 Supabase 客户端
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
