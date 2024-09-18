export const supabase = [
    {
        path: 'supabase',
        files: [
            'client.ts',
            'index.ts',
            'middleware.ts',
            'server.ts',
        ],
    },
    {
        path: 'src/app/api/',
        files: [
            'next_api_endpoint.ts',
        ],
        rename: [
            {
                from: 'next_api_endpoint.ts',
                to: 'route.ts',
            }
        ]
    },
];