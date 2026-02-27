// Supabase 配置文件 - 使用REST API
const SUPABASE_URL = 'https://aqqdk1bqkqazaomrprhs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcWRraWJxa3FhemFvbXJwcmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMTg3NTEsImV4cCI6MjA4NzY5NDc1MX0._1dq5qMkFHV4XW10DtltExeWc8fzlZx6sHxjfDDHz6s';

// REST API 封装
const supabaseClient = {
    storage: {
        from: (bucket) => ({
            upload: async (path, file) => {
                try {
                    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                            'apikey': SUPABASE_ANON_KEY
                        },
                        body: file
                    });
                    if (!response.ok) {
                        const err = await response.json();
                        return { data: null, error: err };
                    }
                    return { data: await response.json(), error: null };
                } catch (e) {
                    return { data: null, error: e };
                }
            },
            getPublicUrl: (path) => {
                return { data: { publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}` } };
            }
        })
    },
    from: (table) => ({
        insert: async (records) => {
            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'apikey': SUPABASE_ANON_KEY,
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(records)
                });
                if (!response.ok) {
                    const err = await response.json();
                    return { error: err };
                }
                return { error: null };
            } catch (e) {
                return { error: e };
            }
        },
        select: async (columns = '*') => {
            const result = {
                order: (col, opts) => result,
                eq: (col, val) => result,
                _execute: async () => {
                    try {
                        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${columns}&order=createdAt.desc`, {
                            headers: {
                                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                                'apikey': SUPABASE_ANON_KEY
                            }
                        });
                        if (!response.ok) {
                            return { data: null, error: await response.json() };
                        }
                        return { data: await response.json(), error: null };
                    } catch (e) {
                        return { data: null, error: e };
                    }
                }
            };
            return await result._execute();
        },
        update: (data) => ({
            eq: async (col, val) => {
                try {
                    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${col}=eq.${val}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                            'apikey': SUPABASE_ANON_KEY
                        },
                        body: JSON.stringify(data)
                    });
                    return { error: response.ok ? null : await response.json() };
                } catch (e) {
                    return { error: e };
                }
            }
        }),
        delete: () => ({
            eq: async (col, val) => {
                try {
                    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${col}=eq.${val}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                            'apikey': SUPABASE_ANON_KEY
                        }
                    });
                    return { error: response.ok ? null : await response.json() };
                } catch (e) {
                    return { error: e };
                }
            }
        })
    })
};

console.log('Supabase REST API 客户端已初始化');
