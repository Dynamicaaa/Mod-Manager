const StorePlaceholderTab = Vue.component("ddmm-store-placeholder-tab", {
    "template": `
<div class="page-content sayonika-store">
    <!-- Header Section -->
    <div class="store-header">
        <div class="store-title">
            <h1><i class="fas fa-store"></i> Sayonika Store</h1>
            <p>Discover and download DDLC mods</p>
        </div>
        <div class="store-actions">
            <div class="search-container">
                <input type="text" v-model="searchQuery" @input="searchMods" placeholder="Search mods..." class="search-input">
                <i class="fas fa-search search-icon"></i>
            </div>
            <div class="auth-section">
                <template v-if="user">
                    <div class="user-info">
                        <img :src="getUserAvatar(user)" class="user-avatar" :alt="user.username" @error="handleAvatarError">
                        <span class="username">{{user.display_name || user.username}}</span>
                        <button class="btn-logout" @click="logout">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </template>
            </div>
        </div>
    </div>

    <!-- Filters Section -->
    <div class="store-filters">
        <div class="filter-group">
            <label>Category:</label>
            <select v-model="selectedCategory" @change="loadMods">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{category.name}}
                </option>
            </select>
        </div>
        <div class="filter-group">
            <label>Sort by:</label>
            <select v-model="sortBy" @change="onSortChange">
                <option value="created_at">Date Created</option>
                <option value="updated_at">Date Updated</option>
                <option value="downloads">Downloads</option>
                <option value="rating">Rating</option>
                <option value="title">Title</option>
            </select>
        </div>
        <div class="filter-group">
            <label>Order:</label>
            <select v-model="sortOrder" @change="onSortChange">
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
            </select>
        </div>
        <div class="filter-group">
            <label>
                <input type="checkbox" v-model="showFeatured" @change="loadMods"> Featured Only
            </label>
        </div>
    </div>

    <!-- Scrollable Content Area -->
    <div class="store-content">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading mods...</p>
        </div>

        <!-- Error State -->
        <div v-if="error && !loading" class="error-container">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Connection Error</h3>
            <p>{{error}}</p>
            <button class="btn-retry" @click="loadMods">
                <i class="fas fa-redo"></i> Retry
            </button>
        </div>

        <!-- Mods Grid -->
        <div v-if="!loading && !error" class="mods-grid">
        <div v-if="mods.length === 0" class="no-mods">
            <i class="fas fa-search"></i>
            <h3>No mods found</h3>
            <p>Try adjusting your search or filters</p>
        </div>

        <div v-for="mod in mods" :key="mod.id" :class="['mod-card', { 'nsfw': mod.is_nsfw }]" @click="showModDetails(mod)">
            <div class="mod-thumbnail">
                <img :src="getModThumbnail(mod)" :alt="mod.title" @error="handleImageError">
                <div v-if="mod.is_featured" class="featured-badge">
                    <i class="fas fa-star"></i> Featured
                </div>
                <div v-if="mod.is_nsfw" class="nsfw-badge">
                    <i class="fas fa-exclamation-triangle"></i> Mature
                </div>
            </div>
            <div class="mod-info">
                <h3 class="mod-title">{{mod.title}}</h3>
                <p class="mod-author">by {{mod.author_username}}</p>
                <p class="mod-description">{{mod.short_description || mod.description}}</p>
                <div class="mod-stats">
                    <span class="downloads">
                        <i class="fas fa-download"></i> {{formatNumber(mod.download_count)}}
                    </span>
                    <span class="version">
                        <i class="fas fa-tag"></i> v{{mod.version}}
                    </span>
                    <span class="date">
                        <i class="fas fa-calendar"></i> {{formatDate(mod.created_at)}}
                    </span>
                </div>
                <div class="mod-tags" v-if="mod.tags && mod.tags.length > 0">
                    <span v-for="tag in mod.tags.slice(0, 3)" :key="tag" class="tag">{{tag}}</span>
                </div>
            </div>
            <div class="mod-actions">
                <button class="btn-download" :disabled="isDownloading(mod.id)" @click.stop="downloadMod(mod)">
                    <i :class="isDownloading(mod.id) ? 'fas fa-spinner fa-spin' : 'fas fa-download'"></i>
                    {{isDownloading(mod.id) ? 'Downloading...' : 'Download'}}
                </button>
            </div>
        </div>
    </div>

        <!-- Pagination -->
        <div v-if="!loading && !error && totalPages > 1" class="pagination">
            <button :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">
                <i class="fas fa-chevron-left"></i> Previous
            </button>
            <span class="page-info">Page {{currentPage}} of {{totalPages}}</span>
            <button :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)">
                Next <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    </div>

    <!-- Login Modal -->
    <div v-if="showLoginModal" class="modal-overlay" @click="closeLogin">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>Login to Sayonika</h2>
                <button class="modal-close" @click="closeLogin">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="login-options">
                    <button class="btn-oauth discord" @click="loginWithDiscord">
                        <i class="fab fa-discord"></i> Login with Discord
                    </button>
                    <button class="btn-oauth github" @click="loginWithGitHub">
                        <i class="fab fa-github"></i> Login with GitHub
                    </button>
                </div>
                <div class="divider">
                    <span>or</span>
                </div>
                <form @submit.prevent="loginWithCredentials" class="credential-login">
                    <div class="form-group">
                        <label>Username or Email:</label>
                        <input type="text" v-model="loginForm.username" placeholder="Enter username or email address" required>
                        <small class="input-help">You can use either your username or email address to log in</small>
                    </div>
                    <div class="form-group">
                        <label>Password:</label>
                        <input type="password" v-model="loginForm.password" required>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" v-model="loginForm.rememberMe"> Remember me
                        </label>
                    </div>
                    <button type="submit" class="btn-submit" :disabled="loggingIn">
                        <i :class="loggingIn ? 'fas fa-spinner fa-spin' : 'fas fa-sign-in-alt'"></i>
                        {{loggingIn ? 'Logging in...' : 'Login'}}
                    </button>
                </form>
                <div class="register-link">
                    <p>Don't have an account? <a href="#" @click="openRegister">Register here</a></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Mod Details Modal -->
    <div v-if="selectedMod" class="modal-overlay" @click="closeModDetails">
        <div class="modal-content mod-details-modal" @click.stop>
            <div class="modal-header">
                <h2>
                    {{selectedMod.title}}
                    <span v-if="selectedMod.is_nsfw" class="nsfw-indicator">
                        <i class="fas fa-exclamation-triangle"></i> Mature
                    </span>
                </h2>
                <button class="modal-close" @click="closeModDetails">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="mod-details-content">
                    <div class="mod-details-left">
                        <img :src="getModThumbnail(selectedMod)" :alt="selectedMod.title" class="mod-details-image">

                        <!-- Screenshots Gallery -->
                        <div v-if="selectedMod.screenshots && selectedMod.screenshots.length > 0" class="mod-screenshots-section">
                            <h3>Screenshots ({{selectedMod.screenshots.length}})</h3>
                            <div class="mod-screenshots-gallery">
                                <div
                                    v-for="(screenshot, index) in selectedMod.screenshots"
                                    :key="index"
                                    class="screenshot-thumbnail"
                                    @click="openScreenshotModal(screenshot, index)"
                                >
                                    <img :src="getScreenshotUrl(screenshot)" :alt="'Screenshot ' + (index + 1)" loading="lazy">
                                    <div class="screenshot-overlay">
                                        <i class="fas fa-search-plus"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mod-details-stats">
                            <div class="stat">
                                <i class="fas fa-download"></i>
                                <span>{{formatNumber(selectedMod.download_count)}} downloads</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-tag"></i>
                                <span>Version {{selectedMod.version}}</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-user"></i>
                                <span>by {{selectedMod.author_username}}</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-calendar"></i>
                                <span>{{formatDate(selectedMod.created_at)}}</span>
                            </div>
                        </div>
                        <button class="btn-download-large" :disabled="isDownloading(selectedMod.id)" @click="downloadMod(selectedMod)">
                            <i :class="isDownloading(selectedMod.id) ? 'fas fa-spinner fa-spin' : 'fas fa-download'"></i>
                            {{isDownloading(selectedMod.id) ? 'Downloading...' : 'Download Mod'}}
                        </button>
                    </div>
                    <div class="mod-details-right">
                        <div class="mod-description">
                            <h3>Description</h3>
                            <div v-html="formatDescription(selectedMod.description)"></div>
                        </div>
                        <div v-if="selectedMod.tags && selectedMod.tags.length > 0" class="mod-tags-section">
                            <h3>Tags</h3>
                            <div class="tags-list">
                                <span v-for="tag in selectedMod.tags" :key="tag" class="tag">{{tag}}</span>
                            </div>
                        </div>
                        <div v-if="selectedMod.requirements && Object.keys(selectedMod.requirements).length > 0" class="mod-requirements">
                            <h3>Requirements</h3>
                            <ul>
                                <li v-for="(value, key) in selectedMod.requirements" :key="key">
                                    {{key}}: {{value}}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Screenshot Modal -->
    <div v-if="screenshotModal.show" class="modal-overlay screenshot-modal-overlay" @click="closeScreenshotModal">
        <div class="modal-content screenshot-modal-content" @click.stop>
            <div class="screenshot-modal-header">
                <h3>Screenshot {{screenshotModal.currentIndex + 1}} of {{screenshotModal.screenshots.length}}</h3>
                <button class="modal-close" @click="closeScreenshotModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="screenshot-modal-body">
                <div class="screenshot-navigation">
                    <button
                        v-if="screenshotModal.screenshots.length > 1"
                        class="screenshot-nav-btn prev"
                        @click="previousScreenshot"
                        :disabled="screenshotModal.currentIndex === 0"
                    >
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <img
                        :src="getScreenshotUrl(screenshotModal.screenshots[screenshotModal.currentIndex])"
                        :alt="'Screenshot ' + (screenshotModal.currentIndex + 1)"
                        class="screenshot-modal-image"
                    >
                    <button
                        v-if="screenshotModal.screenshots.length > 1"
                        class="screenshot-nav-btn next"
                        @click="nextScreenshot"
                        :disabled="screenshotModal.currentIndex === screenshotModal.screenshots.length - 1"
                    >
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div v-if="screenshotModal.screenshots.length > 1" class="screenshot-indicators">
                    <span
                        v-for="(screenshot, index) in screenshotModal.screenshots"
                        :key="index"
                        class="screenshot-indicator"
                        :class="{ active: index === screenshotModal.currentIndex }"
                        @click="goToScreenshot(index)"
                    ></span>
                </div>
            </div>
        </div>
    </div>
</div>
        `,
    "data": function () {
        return {
            // Store configuration
            "storeUrl": "https://sayonika.reconvial.dev", // Default to community Sayonika instance

            // Authentication
            "user": null,
            "showLoginModal": false,
            "loggingIn": false,
            "loginForm": {
                "username": "", // Can be username or email
                "password": "",
                "rememberMe": false
            },

            // Mods data
            "mods": [],
            "categories": [],
            "loading": true,
            "error": null,

            // Filters and search
            "searchQuery": "",
            "selectedCategory": "",
            "sortBy": "created_at",
            "sortOrder": "desc",
            "showFeatured": false,
            "searchTimeout": null,

            // Pagination
            "currentPage": 1,
            "totalPages": 1,
            "modsPerPage": 20,

            // UI state
            "selectedMod": null,
            "downloadingMods": new Set(),
            "filterHeight": 0, // Track filter bar height for dynamic spacing

            // Screenshot modal
            "screenshotModal": {
                "show": false,
                "screenshots": [],
                "currentIndex": 0
            },

            // Image caching
            "imageCache": {}
        }
    },
    "computed": {
        "apiUrl": function() {
            return this.storeUrl + "/api";
        }
    },
    "methods": {
        "_": function(key, ...args) {
            if (typeof ddmm !== 'undefined' && ddmm.translate) {
                try {
                    return ddmm.translate(key, ...args);
                } catch (e) {
                    console.warn("Translation failed for", key, e);
                    return key;
                }
            }
            return key;
        },

        // Authentication methods
        "checkAuthStatus": async function() {
            // Use the centralized authentication manager if available
            if (typeof window.SayonikaAuth !== 'undefined') {
                const user = await window.SayonikaAuth.checkAuthStatus();
                this.user = user;
                return user;
            }

            // Fallback to local implementation
            try {
                const response = await fetch(`${this.apiUrl}/auth/status`, {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.authenticated && data.user) {
                        this.user = data.user;
                        // Store last successful auth check time
                        localStorage.setItem('sayonika_last_auth_check', Date.now().toString());
                    } else {
                        this.user = null;
                        localStorage.removeItem('sayonika_last_auth_check');
                    }
                } else {
                    this.user = null;
                    localStorage.removeItem('sayonika_last_auth_check');
                }
            } catch (error) {
                console.error('Auth status check failed:', error);
                this.user = null;
                localStorage.removeItem('sayonika_last_auth_check');
            }
        },

        "validateSessionOnStartup": async function() {
            // Use the centralized authentication manager if available
            if (typeof window.SayonikaAuth !== 'undefined') {
                const user = await window.SayonikaAuth.validateSessionOnStartup();
                this.user = user;
                return user;
            }

            // Fallback to local implementation
            const lastAuthCheck = localStorage.getItem('sayonika_last_auth_check');
            if (lastAuthCheck) {
                const timeSinceLastCheck = Date.now() - parseInt(lastAuthCheck);
                const fiveMinutes = 5 * 60 * 1000;

                if (timeSinceLastCheck < fiveMinutes) {
                    console.log('Recent auth check found, skipping validation');
                    return;
                }
            }

            // Perform fresh auth status check
            console.log('Validating Sayonika session on startup...');
            await this.checkAuthStatus();

            if (this.user) {
                console.log('Sayonika session is valid for user:', this.user.username);
            } else {
                console.log('No valid Sayonika session found');
            }
        },

        "showLogin": function() {
            this.showLoginModal = true;
            this.loginForm = {
                username: "",
                password: "",
                rememberMe: false
            };
        },

        "closeLogin": function() {
            this.showLoginModal = false;
            this.loggingIn = false;
        },

        "loginWithCredentials": async function() {
            this.loggingIn = true;
            try {
                // Validate input
                if (!this.loginForm.username || !this.loginForm.password) {
                    this.showNotification('Please enter both username/email and password', 'error');
                    return;
                }

                const trimmedUsername = this.loginForm.username.trim();

                // Detect if input is email or username for better logging
                const isEmail = trimmedUsername.includes('@');
                const inputType = isEmail ? 'email' : 'username';

                const loginData = {
                    username: trimmedUsername, // Can be username or email
                    password: this.loginForm.password,
                    remember: this.loginForm.rememberMe
                };

                console.log('Attempting login with:', {
                    [inputType]: loginData.username,
                    password: '***',
                    remember: loginData.remember
                });

                // Use the centralized authentication manager if available
                if (typeof window.SayonikaAuth !== 'undefined') {
                    const result = await window.SayonikaAuth.login(loginData);

                    if (result.success) {
                        this.user = result.user;
                        this.closeLogin();
                        this.showNotification('Successfully logged in!', 'success');
                    } else {
                        // Handle validation errors
                        if (result.errors && Array.isArray(result.errors)) {
                            const errorMessages = result.errors.map(err => err.msg).join(', ');
                            this.showNotification(`Login failed: ${errorMessages}`, 'error');
                        } else {
                            let errorMessage = result.error || 'Login failed';

                            // Provide more helpful error messages
                            if (errorMessage === 'Invalid credentials') {
                                errorMessage = `Invalid ${inputType} or password. Please check your credentials and try again.`;
                            }

                            this.showNotification(`Login failed: ${errorMessage}`, 'error');
                        }
                    }
                    return;
                }

                // Fallback to local implementation
                const response = await fetch(`${this.apiUrl}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': `DokiDokiModManager/${(typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.version) ? window.APP_CONFIG.version : '0.0.0'} (Sayonika Integration)`
                    },
                    credentials: 'include',
                    body: JSON.stringify(loginData)
                });

                const data = await response.json();

                if (response.ok) {
                    this.user = data.user;
                    this.closeLogin();
                    this.showNotification('Successfully logged in!', 'success');
                } else {
                    // Handle validation errors
                    if (data.errors && Array.isArray(data.errors)) {
                        const errorMessages = data.errors.map(err => err.msg).join(', ');
                        this.showNotification(`Login failed: ${errorMessages}`, 'error');
                    } else {
                        let errorMessage = data.error || 'Login failed';

                        // Provide more helpful error messages
                        if (errorMessage === 'Invalid credentials') {
                            errorMessage = `Invalid ${inputType} or password. Please check your credentials and try again.`;
                        }

                        this.showNotification(`Login failed: ${errorMessage}`, 'error');
                    }
                    console.error('Login failed with status:', response.status, 'Data:', data);
                }
            } catch (error) {
                console.error('Login error:', error);
                this.showNotification('Login failed. Please try again.', 'error');
            } finally {
                this.loggingIn = false;
            }
        },

        "loginWithDiscord": function() {
            window.open(`${this.storeUrl}/auth/discord`, '_blank', 'width=500,height=600');
            this.closeLogin();
            // Listen for auth completion
            this.listenForAuthCompletion();
        },

        "loginWithGitHub": function() {
            window.open(`${this.storeUrl}/auth/github`, '_blank', 'width=500,height=600');
            this.closeLogin();
            // Listen for auth completion
            this.listenForAuthCompletion();
        },

        "listenForAuthCompletion": function() {
            // Poll for auth status changes
            const checkAuth = setInterval(async () => {
                await this.checkAuthStatus();
                if (this.user) {
                    clearInterval(checkAuth);
                    this.showNotification('Successfully logged in!', 'success');
                }
            }, 1000);

            // Stop checking after 30 seconds
            setTimeout(() => {
                clearInterval(checkAuth);
            }, 30000);
        },

        "openRegister": function() {
            // Open Sayonika registration page in external browser
            if (typeof ddmm !== 'undefined' && ddmm.app && ddmm.app.openURL) {
                ddmm.app.openURL(`${this.storeUrl}/register`);
            } else {
                window.open(`${this.storeUrl}/register`, '_blank');
            }
            this.closeLogin();
        },

        "logout": async function() {
            // Use the centralized authentication manager if available
            if (typeof window.SayonikaAuth !== 'undefined') {
                await window.SayonikaAuth.logout();
                this.user = null;
                this.showNotification('Successfully logged out!', 'success');
                return;
            }

            // Fallback to local implementation
            try {
                await fetch(`${this.apiUrl}/auth/logout`, {
                    method: 'POST',
                    credentials: 'include'
                });

                this.user = null;
                this.showNotification('Successfully logged out!', 'success');
            } catch (error) {
                console.error('Logout error:', error);
                this.showNotification('Logout failed', 'error');
            }
        },



        // Data loading methods
        "loadMods": async function() {
            this.loading = true;
            this.error = null;

            try {
                const params = new URLSearchParams({
                    page: this.currentPage,
                    per_page: this.modsPerPage,
                    sort: this.sortBy,
                    order: this.sortOrder
                });

                if (this.searchQuery) {
                    params.append('search', this.searchQuery);
                }
                if (this.selectedCategory) {
                    params.append('category', this.selectedCategory);
                }
                if (this.showFeatured) {
                    params.append('featured', 'true');
                }

                const response = await fetch(`${this.apiUrl}/mods?${params}`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                this.mods = data.mods || [];

                // Handle both old and new pagination response formats
                if (data.pagination) {
                    this.totalPages = data.pagination.total_pages || 1;
                } else {
                    // Fallback for old format
                    this.totalPages = Math.ceil((data.total || 0) / this.modsPerPage);
                }
            } catch (error) {
                console.error('Failed to load mods:', error);
                this.error = `Failed to connect to Sayonika store: ${error.message}`;
                this.mods = [];
            } finally {
                this.loading = false;
                // Ensure proper layout after content loads
                this.$nextTick(() => {
                    this.ensureModVisibility();
                });
            }
        },

        "loadCategories": async function() {
            try {
                const response = await fetch(`${this.apiUrl}/categories`, {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    this.categories = data || [];
                }
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        },

        "searchMods": function() {
            // Debounce search
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            this.searchTimeout = setTimeout(() => {
                this.currentPage = 1;
                this.loadMods();
            }, 500);
        },

        "changePage": function(page) {
            this.currentPage = page;
            this.loadMods();
        },

        "onSortChange": function() {
            // Reset to first page when sorting changes
            this.currentPage = 1;
            this.loadMods();
            // Update layout after sort change
            this.$nextTick(() => {
                this.updateFilterHeight();
            });
        },

        // Mod interaction methods
        "showModDetails": function(mod) {
            this.selectedMod = mod;
        },

        "closeModDetails": function() {
            this.selectedMod = null;
        },

        // Screenshot modal methods
        "openScreenshotModal": function(screenshot, index) {
            if (this.selectedMod && this.selectedMod.screenshots) {
                this.screenshotModal.screenshots = this.selectedMod.screenshots;
                this.screenshotModal.currentIndex = index;
                this.screenshotModal.show = true;

                // Prevent body scrolling when modal is open
                document.body.style.overflow = 'hidden';
            }
        },

        "closeScreenshotModal": function() {
            this.screenshotModal.show = false;
            this.screenshotModal.screenshots = [];
            this.screenshotModal.currentIndex = 0;

            // Restore body scrolling
            document.body.style.overflow = '';
        },

        "nextScreenshot": function() {
            if (this.screenshotModal.currentIndex < this.screenshotModal.screenshots.length - 1) {
                this.screenshotModal.currentIndex++;
            }
        },

        "previousScreenshot": function() {
            if (this.screenshotModal.currentIndex > 0) {
                this.screenshotModal.currentIndex--;
            }
        },

        "goToScreenshot": function(index) {
            this.screenshotModal.currentIndex = index;
        },

        "getScreenshotUrl": function(screenshot) {
            if (!screenshot) return '';

            // If it's already a full URL, return as-is
            if (screenshot.startsWith('http')) {
                return screenshot;
            }

            // If it's a relative path, prepend the store URL
            return this.storeUrl + screenshot;
        },

        "downloadMod": async function(mod) {
            if (this.isDownloading(mod.id)) {
                return;
            }

            // Check if mod is NSFW and show warning
            if (mod.is_nsfw) {
                this.showNSFWWarning(mod);
                return;
            }

            this.startDownload(mod);
        },

        "startDownload": async function(mod) {
            this.downloadingMods.add(mod.id);

            try {
                // Get download URL from Sayonika
                const downloadUrl = `${this.apiUrl}/mods/${mod.id}/download`;

                // Use DDMM's download functionality
                if (typeof ddmm !== 'undefined' && ddmm.mods && ddmm.mods.download) {
                    ddmm.mods.download(downloadUrl);
                    this.showNotification(`Downloading ${mod.title}...`, 'info');
                } else {
                    // Fallback: open download URL
                    window.open(downloadUrl, '_blank');
                }
            } catch (error) {
                console.error('Download failed:', error);
                this.showNotification(`Failed to download ${mod.title}`, 'error');
            } finally {
                // Remove from downloading set after a delay
                setTimeout(() => {
                    this.downloadingMods.delete(mod.id);
                }, 3000);
            }
        },

        "showNSFWWarning": function(mod) {
            const modal = document.createElement('div');
            modal.className = 'nsfw-warning-modal';
            modal.innerHTML = `
                <div class="nsfw-warning-overlay">
                    <div class="nsfw-warning-dialog">
                        <div class="nsfw-warning-header">
                            <h3>
                                <i class="fas fa-exclamation-triangle"></i>
                                Mature Content Warning
                            </h3>
                            <button class="nsfw-warning-close">&times;</button>
                        </div>
                        <div class="nsfw-warning-body">
                            <p><strong>This mod contains mature/NSFW content.</strong></p>
                            <p>The mod "${mod.title}" has been marked as containing adult themes, explicit content, or mature subject matter.</p>
                            <p>By proceeding with the download, you confirm that:</p>
                            <ul>
                                <li>You are of legal age to view such content in your jurisdiction</li>
                                <li>You understand the nature of the content you are downloading</li>
                                <li>You accept responsibility for your decision to download this content</li>
                            </ul>
                            <p><strong>Do you wish to continue with the download?</strong></p>
                        </div>
                        <div class="nsfw-warning-footer">
                            <button class="btn btn-secondary nsfw-cancel">Cancel</button>
                            <button class="btn btn-danger nsfw-confirm">Continue Download</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Event listeners
            const closeModal = () => {
                document.body.removeChild(modal);
            };

            modal.querySelector('.nsfw-warning-close').addEventListener('click', closeModal);
            modal.querySelector('.nsfw-cancel').addEventListener('click', closeModal);
            modal.querySelector('.nsfw-confirm').addEventListener('click', () => {
                closeModal();
                this.startDownload(mod);
            });

            // Close on overlay click
            modal.querySelector('.nsfw-warning-overlay').addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    closeModal();
                }
            });

            // ESC key to close
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        },

        "isDownloading": function(modId) {
            return this.downloadingMods.has(modId);
        },

        // Utility methods
        "getUserAvatar": function(user) {
            if (user && user.id) {
                // Check if we have a cached data URL
                const cacheKey = `avatar_${user.id}`;
                if (this.imageCache && this.imageCache[cacheKey]) {
                    return this.imageCache[cacheKey];
                }

                // Check if we're already fetching this image
                const fetchingKey = `fetching_${cacheKey}`;
                if (this.imageCache && this.imageCache[fetchingKey]) {
                    // Return default while fetching
                    return '../images/default-avatar.svg';
                }

                // Get the API URL
                let apiUrl;
                if (typeof window.SayonikaConfig !== 'undefined') {
                    apiUrl = window.SayonikaConfig.getAvatarUrl(user.id, '64', this.storeUrl);
                } else {
                    apiUrl = `${this.storeUrl}/api/images/avatar/${user.id}?size=64`;
                }

                // Mark as fetching and start background fetch
                if (!this.imageCache) {
                    this.imageCache = {};
                }
                this.imageCache[fetchingKey] = true;
                this.fetchImageAsDataUrl(apiUrl, cacheKey);

                // Return default avatar while loading
                return '../images/default-avatar.svg';
            }
            // Fallback to local default avatar only if no user ID
            return '../images/default-avatar.svg';
        },

        "getModThumbnail": function(mod) {
            if (mod && mod.id) {
                // Check if we have a cached data URL
                const cacheKey = `thumbnail_${mod.id}`;
                if (this.imageCache && this.imageCache[cacheKey]) {
                    return this.imageCache[cacheKey];
                }

                // Check if we're already fetching this image
                const fetchingKey = `fetching_${cacheKey}`;
                if (this.imageCache && this.imageCache[fetchingKey]) {
                    // Return default while fetching
                    return '../images/default-mod-thumbnail.svg';
                }

                // Get the API URL
                let apiUrl;
                if (typeof window.SayonikaConfig !== 'undefined') {
                    apiUrl = window.SayonikaConfig.getThumbnailUrl(mod.id, '300x200', this.storeUrl);
                } else {
                    apiUrl = `${this.storeUrl}/api/images/thumbnail/${mod.id}?size=300x200`;
                }

                // Mark as fetching and start background fetch
                if (!this.imageCache) {
                    this.imageCache = {};
                }
                this.imageCache[fetchingKey] = true;
                this.fetchImageAsDataUrl(apiUrl, cacheKey);

                // Return default thumbnail while loading
                return '../images/default-mod-thumbnail.svg';
            }
            // Fallback to local default thumbnail only if no mod ID
            return '../images/default-mod-thumbnail.svg';
        },

        "handleImageError": function(event) {
            // Since we now use default images while loading, this should rarely trigger
            // But if it does, ensure we're showing the default thumbnail
            const currentSrc = event.target.src;
            console.warn('Failed to load mod thumbnail:', currentSrc);

            if (!currentSrc.includes('default-mod-thumbnail.svg')) {
                console.log('Setting fallback thumbnail');
                event.target.src = '../images/default-mod-thumbnail.svg';
            }
        },

        "handleAvatarError": function(event) {
            // Since we now use default images while loading, this should rarely trigger
            // But if it does, ensure we're showing the default avatar
            const currentSrc = event.target.src;
            console.warn('Failed to load user avatar:', currentSrc);

            if (!currentSrc.includes('default-avatar.svg')) {
                console.log('Setting fallback avatar');
                event.target.src = '../images/default-avatar.svg';
            }
        },

        "fetchImageAsDataUrl": async function(url, cacheKey) {
            const fetchingKey = `fetching_${cacheKey}`;

            try {
                console.log(`Fetching image as data URL:`, url);
                const response = await fetch(url, {
                    credentials: 'include'
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const dataUrl = URL.createObjectURL(blob);

                    // Cache the data URL
                    if (!this.imageCache) {
                        this.imageCache = {};
                    }
                    this.imageCache[cacheKey] = dataUrl;

                    // Remove fetching flag
                    delete this.imageCache[fetchingKey];

                    console.log(`Image cached as data URL:`, cacheKey);

                    // Force Vue to re-render by updating a reactive property
                    this.$forceUpdate();

                } else {
                    console.error(`Failed to fetch image:`, response.status, response.statusText, url);
                    // Remove fetching flag on error
                    if (this.imageCache) {
                        delete this.imageCache[fetchingKey];
                    }
                }
            } catch (error) {
                console.error(`Error fetching image:`, error, url);
                // Remove fetching flag on error
                if (this.imageCache) {
                    delete this.imageCache[fetchingKey];
                }
            }
        },



        "formatNumber": function(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            return num.toString();
        },

        "formatDate": function(dateString) {
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString();
            } catch (error) {
                return 'Unknown';
            }
        },

        "formatDescription": function(description) {
            if (!description) return '';

            // Basic HTML sanitization and formatting
            return description
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>');
        },

        "showNotification": function(message, type = 'info') {
            // Use DDMM's notification system if available
            if (typeof ddmm !== 'undefined' && ddmm.app && ddmm.app.showNotification) {
                ddmm.app.showNotification(message, type);
            } else {
                // Fallback to console
                console.log(`[${type.toUpperCase()}] ${message}`);
            }
        },

        "detectStoreUrl": async function() {
            // Use the centralized authentication manager if available
            if (typeof window.SayonikaAuth !== 'undefined') {
                this.storeUrl = await window.SayonikaAuth.detectStoreUrl();
                return;
            }

            // Fallback to local implementation
            if (typeof window.SayonikaConfig !== 'undefined') {
                try {
                    this.storeUrl = await window.SayonikaConfig.detectStoreUrl();
                    console.log('Sayonika store connected:', this.storeUrl);
                    return;
                } catch (error) {
                    console.error('Error using SayonikaConfig:', error);
                }
            }

            // Fallback to manual detection with new default
            const possibleUrls = [
                'https://sayonika.reconvial.dev',
                'http://localhost:3000',
                'http://127.0.0.1:3000'
            ];

            // Try each URL to find a working one
            for (const url of possibleUrls) {
                try {
                    const response = await fetch(url + '/api/categories', {
                        method: 'GET',
                        timeout: 5000
                    });
                    if (response.ok) {
                        this.storeUrl = url;
                        console.log('Using working Sayonika store URL:', this.storeUrl);
                        return;
                    }
                } catch (error) {
                    console.log(`Failed to connect to ${url}:`, error.message);
                }
            }

            // If all fail, use the default
            this.storeUrl = possibleUrls[0];
            console.log('Using default Sayonika store URL (no connection test):', this.storeUrl);
        },

        // Keyboard navigation handler
        "handleKeydown": function(event) {
            if (!this.screenshotModal.show) return;

            switch(event.key) {
                case 'Escape':
                    this.closeScreenshotModal();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    this.previousScreenshot();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    this.nextScreenshot();
                    break;
            }
        },

        // Layout management methods
        "updateFilterHeight": function() {
            // Calculate and store filter bar height for dynamic spacing
            this.$nextTick(() => {
                const filterElement = this.$el.querySelector('.store-filters');
                if (filterElement) {
                    this.filterHeight = filterElement.offsetHeight;
                    this.updateContentSpacing();
                }
            });
        },

        "updateContentSpacing": function() {
            // Ensure content area has proper spacing from filter bar
            const contentElement = this.$el.querySelector('.store-content');
            if (contentElement && this.filterHeight > 0) {
                // Add extra margin based on filter height for responsive layouts
                const extraMargin = Math.max(10, this.filterHeight * 0.1);
                contentElement.style.marginTop = `${extraMargin}px`;
            }
        },

        "handleResize": function() {
            // Update layout when window is resized
            this.updateFilterHeight();
        },

        "ensureModVisibility": function() {
            // Ensure no mod cards are hidden behind filters
            this.$nextTick(() => {
                const modCards = this.$el.querySelectorAll('.mod-card');
                const filterElement = this.$el.querySelector('.store-filters');
                
                if (modCards.length > 0 && filterElement) {
                    const filterRect = filterElement.getBoundingClientRect();
                    const filterBottom = filterRect.bottom;
                    
                    modCards.forEach(card => {
                        const cardRect = card.getBoundingClientRect();
                        if (cardRect.top < filterBottom + 10) {
                            // Card is too close to or behind filter, scroll content down
                            const contentElement = this.$el.querySelector('.store-content');
                            if (contentElement) {
                                const scrollOffset = (filterBottom + 20) - cardRect.top;
                                contentElement.scrollTop = Math.max(0, contentElement.scrollTop - scrollOffset);
                            }
                        }
                    });
                }
            });
        }
    },
    "mounted": async function () {
        console.log("Sayonika Store Tab mounted");

        // Set up authentication state synchronization
        if (typeof window.SayonikaAuth !== 'undefined') {
            // Sync initial state
            this.user = window.SayonikaAuth.getUser();
            this.storeUrl = window.SayonikaAuth.getStoreUrl();

            // Listen for authentication state changes
            window.SayonikaAuth.on('auth-status-changed', (user) => {
                this.user = user;
            });

            window.SayonikaAuth.on('login', (user) => {
                this.user = user;
            });

            window.SayonikaAuth.on('logout', () => {
                this.user = null;
            });
        } else {
            // Fallback: detect store URL and validate session
            this.detectStoreUrl();
            await this.validateSessionOnStartup();
        }

        // Load initial data
        await Promise.all([
            this.loadCategories(),
            this.loadMods()
        ]);

        // Set up layout management
        this.$nextTick(() => {
            this.updateFilterHeight();
            this.ensureModVisibility();
        });

        // Add event listeners
        document.addEventListener('keydown', this.handleKeydown);
        window.addEventListener('resize', this.handleResize);

        // Watch for filter changes that might affect layout
        this.$watch('selectedCategory', () => {
            this.$nextTick(() => {
                this.updateFilterHeight();
                this.ensureModVisibility();
            });
        });

        this.$watch('mods', () => {
            this.$nextTick(() => {
                this.ensureModVisibility();
            });
        });
    },

    "beforeDestroy": function() {
        // Clean up event listeners
        document.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('resize', this.handleResize);
    }
});