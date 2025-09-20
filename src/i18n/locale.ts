export const defaultLocale = (() => {
    const [main] = navigator.language.toLowerCase().split('-')

    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (main) {
        case 'fr':
        case 'ja':
        case 'ko':
        case 'pt':
        case 'zh':
            return main
        default:
            return 'en'
    }
})()
