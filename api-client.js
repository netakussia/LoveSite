// API Client for Love Site
class LoveSiteAPI {
    constructor() {
        this.baseURL = '/api';
        this.authToken = localStorage.getItem('authToken');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.authToken) {
            config.headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'API Error');
            }
            
            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Public API methods
    async getGreetings() {
        return this.request('/greetings');
    }

    async getPosts() {
        return this.request('/posts');
    }

    async getChatMessages() {
        return this.request('/chat-messages');
    }

    // Admin API methods
    async login(username, password) {
        const data = await this.request('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        this.authToken = data.token;
        localStorage.setItem('authToken', this.authToken);
        return data;
    }

    logout() {
        this.authToken = null;
        localStorage.removeItem('authToken');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.authToken;
    }
}

// Global API instance
window.loveSiteAPI = new LoveSiteAPI();

// Content loader for dynamic content
class ContentLoader {
    constructor() {
        this.api = window.loveSiteAPI;
    }

    async loadGreetings() {
        try {
            const greetings = await this.api.getGreetings();
            this.renderGreetings(greetings);
        } catch (error) {
            console.error('Failed to load greetings:', error);
        }
    }

    async loadPosts() {
        try {
            const posts = await this.api.getPosts();
            this.renderPosts(posts);
        } catch (error) {
            console.error('Failed to load posts:', error);
        }
    }

    async loadChatMessages() {
        try {
            const messages = await this.api.getChatMessages();
            this.renderChatMessages(messages);
        } catch (error) {
            console.error('Failed to load chat messages:', error);
        }
    }

    renderGreetings(greetings) {
        // This will be implemented to replace static greetings
        console.log('Greetings loaded:', greetings);
    }

    renderPosts(posts) {
        // This will be implemented to replace static timeline
        console.log('Posts loaded:', posts);
    }

    renderChatMessages(messages) {
        // This will be implemented to replace static chat messages
        console.log('Chat messages loaded:', messages);
    }
}

// Initialize content loader
window.contentLoader = new ContentLoader();

// Load content when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Load dynamic content
    window.contentLoader.loadGreetings();
    window.contentLoader.loadPosts();
    window.contentLoader.loadChatMessages();
});
