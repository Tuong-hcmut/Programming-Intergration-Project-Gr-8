const Ziggy = {
    url: 'http://localhost',
    port: null,
    defaults: {},
    routes: {
        'sanctum.csrf-cookie': {
            uri: 'sanctum/csrf-cookie',
            methods: ['GET', 'HEAD'],
        },
        dashboard: { uri: 'dashboard', methods: ['GET', 'HEAD'] },
        questions: { uri: 'questions', methods: ['GET', 'HEAD'] },
        'profile.edit': { uri: 'profile', methods: ['GET', 'HEAD'] },
        'profile.update': { uri: 'profile', methods: ['PATCH'] },
        'profile.destroy': { uri: 'profile', methods: ['DELETE'] },
        'question.store': { uri: 'question', methods: ['POST'] },
        'question.show': {
            uri: 'question/{question}',
            methods: ['GET', 'HEAD'],
            parameters: ['question'],
            bindings: { question: 'id' },
        },
        'question.update': {
            uri: 'question/{question}',
            methods: ['PATCH'],
            parameters: ['question'],
            bindings: { question: 'id' },
        },
        'question.delete': {
            uri: 'question/{question}',
            methods: ['DELETE'],
            parameters: ['question'],
            bindings: { question: 'id' },
        },
        'answer.index': {
            uri: 'question/{question}/answer',
            methods: ['GET', 'HEAD'],
            parameters: ['question'],
        },
        'answer.show': {
            uri: 'question/{question}/answer/{answer}',
            methods: ['GET', 'HEAD'],
            parameters: ['question', 'answer'],
            bindings: { question: 'id', answer: 'id' },
        },
        'answer.create': {
            uri: 'question/{question}/answer',
            methods: ['POST'],
            parameters: ['question'],
            bindings: { question: 'id' },
        },
        'question-library': {
            uri: 'question-library',
            methods: ['GET', 'HEAD'],
        },
        'question-library.store': {
            uri: 'question-library',
            methods: ['POST'],
        },
        'question-library.edit': {
            uri: 'question-library/{questionLibrary}',
            methods: ['GET', 'HEAD'],
            parameters: ['questionLibrary'],
            bindings: { questionLibrary: 'uuid' },
        },
        'question-library.update': {
            uri: 'question-library/{questionLibrary}',
            methods: ['PATCH'],
            parameters: ['questionLibrary'],
            bindings: { questionLibrary: 'uuid' },
        },
        register: { uri: 'register', methods: ['GET', 'HEAD'] },
        login: { uri: 'login', methods: ['GET', 'HEAD'] },
        'password.request': {
            uri: 'forgot-password',
            methods: ['GET', 'HEAD'],
        },
        'password.email': { uri: 'forgot-password', methods: ['POST'] },
        'password.reset': {
            uri: 'reset-password/{token}',
            methods: ['GET', 'HEAD'],
            parameters: ['token'],
        },
        'password.store': { uri: 'reset-password', methods: ['POST'] },
        'verification.notice': {
            uri: 'verify-email',
            methods: ['GET', 'HEAD'],
        },
        'verification.verify': {
            uri: 'verify-email/{id}/{hash}',
            methods: ['GET', 'HEAD'],
            parameters: ['id', 'hash'],
        },
        'verification.send': {
            uri: 'email/verification-notification',
            methods: ['POST'],
        },
        'password.confirm': {
            uri: 'confirm-password',
            methods: ['GET', 'HEAD'],
        },
        'password.update': { uri: 'password', methods: ['PUT'] },
        logout: { uri: 'logout', methods: ['POST'] },
        'storage.local': {
            uri: 'storage/{path}',
            methods: ['GET', 'HEAD'],
            wheres: { path: '.*' },
            parameters: ['path'],
        },
    },
};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
    Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };
