/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html'],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Newsreader"', 'Georgia', 'serif'],
                sans: ['"Inter"', 'system-ui', 'sans-serif'],
            },
            colors: {
                paper:   '#FBFAF8',
                surface: '#FFFFFF',
                ink:     '#1C1917',
                muted:   '#57534E',
                line:    '#E7E5E4',
                royal:   '#1E40AF',
                ochre:   '#B45309',
            },
            maxWidth: {
                '8xl': '88rem',
            },
        },
    },
    plugins: [],
};
