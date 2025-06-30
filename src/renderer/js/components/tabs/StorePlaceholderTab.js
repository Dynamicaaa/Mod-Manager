const StorePlaceholderTab = Vue.component("ddmm-store-placeholder-tab", {
    "template": `
<div class="page-content sayonika-store">
    <!-- Header Section -->
    <div class="store-header">
        <div class="store-title">
            <h1><i class="fas fa-store"></i> {{_('renderer.tab_store.title')}}</h1>
            <p>{{_('renderer.tab_store.subtitle')}}</p>
        </div>
        <div class="store-actions">
            <div class="search-container">
                <input type="text" v-model="searchQuery" @input="searchMods" :placeholder="_('renderer.tab_store.search_placeholder')" class="search-input">
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
            <label>{{_('renderer.tab_store.filters.category')}}</label>
            <select v-model="selectedCategory" @change="loadMods">
                <option value="">{{_('renderer.tab_store.filters.all_categories')}}</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{category.name}}
                </option>
            </select>
        </div>
        <div class="filter-group">
            <label>{{_('renderer.tab_store.filters.sort_by')}}</label>
            <select v-model="sortBy" @change="onSortChange">
                <option value="created_at">{{_('renderer.tab_store.filters.date_created')}}</option>
                <option value="updated_at">{{_('renderer.tab_store.filters.date_updated')}}</option>
                <option value="downloads">{{_('renderer.tab_store.filters.downloads')}}</option>
                <option value="rating">{{_('renderer.tab_store.filters.rating')}}</option>
                <option value="title">{{_('renderer.tab_store.filters.title')}}</option>
            </select>
        </div>
        <div class="filter-group">
            <label>{{_('renderer.tab_store.filters.order')}}</label>
            <select v-model="sortOrder" @change="onSortChange">
                <option value="desc">{{_('renderer.tab_store.filters.descending')}}</option>
                <option value="asc">{{_('renderer.tab_store.filters.ascending')}}</option>
            </select>
        </div>
        <div class="filter-group">
            <label>
                <input type="checkbox" v-model="showFeatured" @change="loadMods"> {{_('renderer.tab_store.filters.featured_only')}}
            </label>
        </div>
        <div class="filter-group translation-group">
            <label>
                <input type="checkbox" v-model="enableTranslation" @change="onTranslationToggle" :disabled="translationInProgress"> {{_('renderer.tab_store.filters.translate_content')}}
                <i v-if="translationInProgress" class="fas fa-spinner fa-spin" style="margin-left: 8px; color: #007acc;"></i>
            </label>
            <select v-if="enableTranslation" v-model="translationLanguage" @change="onTranslationLanguageChange" :disabled="translationInProgress" style="margin-left: 8px;">
                <option value="auto">{{_('renderer.tab_store.filters.auto_detect')}}</option>
                <option v-for="(langName, langCode) in availableTranslationLanguages" :key="langCode" :value="langCode">
                    {{langName}}
                </option>
            </select>
        </div>
    </div>

    <!-- Scrollable Content Area -->
    <div class="store-content">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
            <i class="fas fa-spinner fa-spin"></i>
            <p>{{_('renderer.tab_store.loading')}}</p>
        </div>

        <!-- Error State -->
        <div v-if="error && !loading" class="error-container">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>{{_('renderer.tab_store.error_title')}}</h3>
            <p>{{error}}</p>
            <button class="btn-retry" @click="loadMods">
                <i class="fas fa-redo"></i> {{_('renderer.tab_store.retry_button')}}
            </button>
        </div>

        <!-- Offline State -->
        <div v-if="connectionStatus === 'offline' && !loading" class="offline-container">
            <i class="fas fa-wifi-slash"></i>
            <h3>{{_('renderer.tab_store.offline_title')}}</h3>
            <p>{{offlineMessage || _('renderer.tab_store.offline_message')}}</p>
            <button class="btn-retry" @click="checkConnection">
                <i class="fas fa-sync"></i> {{_('renderer.tab_store.check_connection')}}
            </button>
        </div>

        <!-- Maintenance State Banner (non-blocking) -->
        <div v-if="connectionStatus === 'maintenance' && !loading" class="maintenance-banner">
            <i class="fas fa-tools"></i>
            <span>{{_('renderer.tab_store.maintenance_banner')}}</span>
            <button class="btn-banner-dismiss" @click="dismissMaintenanceBanner">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <!-- Mods Grid -->
        <div v-if="!loading && !error" class="mods-grid">
        <div v-if="mods.length === 0" class="no-mods">
            <i class="fas fa-search"></i>
            <h3>{{_('renderer.tab_store.no_mods_title')}}</h3>
            <p>{{_('renderer.tab_store.no_mods_message')}}</p>
        </div>

        <div v-for="mod in mods" :key="mod.id" :class="['mod-card', { 'nsfw': mod.is_nsfw }]" @click="showModDetails(mod)">
            <div class="mod-thumbnail">
                <img :src="getModThumbnail(mod)" :alt="mod.title" @error="handleImageError">
                <div v-if="mod.is_featured" class="featured-badge">
                    <i class="fas fa-star"></i> {{_('renderer.tab_store.mod_card.featured')}}
                </div>
                <div v-if="mod.is_nsfw" class="nsfw-badge">
                    <i class="fas fa-exclamation-triangle"></i> {{_('renderer.tab_store.mod_card.mature')}}
                </div>
            </div>
            <div class="mod-info">
                <h3 class="mod-title">{{mod.title}}</h3>
                <p class="mod-author">{{_('renderer.tab_store.mod_card.by_author', mod.author_username)}}</p>
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
                    {{isDownloading(mod.id) ? _('renderer.tab_store.mod_card.downloading') : _('renderer.tab_store.mod_card.download')}}
                </button>
            </div>
        </div>
    </div>

        <!-- Pagination -->
        <div v-if="!loading && !error && totalPages > 1" class="pagination">
            <button :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">
                <i class="fas fa-chevron-left"></i> {{_('renderer.tab_store.pagination.previous')}}
            </button>
            <span class="page-info">{{_('renderer.tab_store.pagination.page_info', currentPage, totalPages)}}</span>
            <button :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)">
                {{_('renderer.tab_store.pagination.next')}} <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    </div>

    <!-- Login Modal -->
    <div v-if="showLoginModal" class="modal-overlay" @click="closeLogin">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>{{_('renderer.tab_store.login.title')}}</h2>
                <button class="modal-close" @click="closeLogin">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="login-options">
                    <button class="btn-oauth discord" @click="loginWithDiscord">
                        <i class="fab fa-discord"></i> {{_('renderer.tab_store.login.discord')}}
                    </button>
                    <button class="btn-oauth github" @click="loginWithGitHub">
                        <i class="fab fa-github"></i> {{_('renderer.tab_store.login.github')}}
                    </button>
                </div>
                <div class="divider">
                    <span>{{_('renderer.tab_store.login.or')}}</span>
                </div>
                <form @submit.prevent="loginWithCredentials" class="credential-login">
                    <div class="form-group">
                        <label>{{_('renderer.tab_store.login.username_label')}}</label>
                        <input type="text" v-model="loginForm.username" :placeholder="_('renderer.tab_store.login.username_placeholder')" required>
                        <small class="input-help">{{_('renderer.tab_store.login.username_help')}}</small>
                    </div>
                    <div class="form-group">
                        <label>{{_('renderer.tab_store.login.password_label')}}</label>
                        <input type="password" v-model="loginForm.password" required>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" v-model="loginForm.rememberMe"> {{_('renderer.tab_store.login.remember_me')}}
                        </label>
                    </div>
                    <button type="submit" class="btn-submit" :disabled="loggingIn">
                        <i :class="loggingIn ? 'fas fa-spinner fa-spin' : 'fas fa-sign-in-alt'"></i>
                        {{loggingIn ? _('renderer.tab_store.login.logging_in') : _('renderer.tab_store.login.login_button')}}
                    </button>
                </form>
                <div class="register-link">
                    <p>{{_('renderer.tab_store.login.register_link')}}</p>
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
                        <i class="fas fa-exclamation-triangle"></i> {{_('renderer.tab_store.mod_card.mature')}}
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
                            <h3>{{_('renderer.tab_store.mod_card.screenshots', selectedMod.screenshots.length)}}</h3>
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
                                <span>{{_('renderer.tab_store.mod_card.downloads_count', formatNumber(selectedMod.download_count))}}</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-tag"></i>
                                <span>{{_('renderer.tab_store.mod_card.version', selectedMod.version)}}</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-user"></i>
                                <span>{{_('renderer.tab_store.mod_card.by_author', selectedMod.author_username)}}</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-calendar"></i>
                                <span>{{formatDate(selectedMod.created_at)}}</span>
                            </div>
                        </div>
                        <button class="btn-download-large" :disabled="isDownloading(selectedMod.id)" @click="downloadMod(selectedMod)">
                            <i :class="isDownloading(selectedMod.id) ? 'fas fa-spinner fa-spin' : 'fas fa-download'"></i>
                            {{isDownloading(selectedMod.id) ? _('renderer.tab_store.mod_card.downloading') : _('renderer.tab_store.mod_card.download_mod')}}
                        </button>
                    </div>
                    <div class="mod-details-right">
                        <div class="mod-description">
                            <h3>{{_('renderer.tab_store.mod_card.description')}}</h3>
                            <div v-html="formatDescription(selectedMod.description)"></div>
                        </div>
                        <div v-if="selectedMod.tags && selectedMod.tags.length > 0" class="mod-tags-section">
                            <h3>{{_('renderer.tab_store.mod_card.tags')}}</h3>
                            <div class="tags-list">
                                <span v-for="tag in selectedMod.tags" :key="tag" class="tag">{{tag}}</span>
                            </div>
                        </div>
                        <div v-if="selectedMod.requirements && Object.keys(selectedMod.requirements).length > 0" class="mod-requirements">
                            <h3>{{_('renderer.tab_store.mod_card.requirements')}}</h3>
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
        return {        // Store configuration
        "storeUrl": "https://sayonika.dynamicaaa.me", // Default to community Sayonika instance

        // Connection state
        "isOnline": navigator.onLine,
        "connectionStatus": "checking", // "checking", "online", "offline", "maintenance"
        "lastConnectionCheck": null,
        "connectionCheckInterval": null,
        "offlineMessage": "You are currently offline. The Sayonika Store requires an internet connection to browse and download mods.",

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

        // Translation system
        "enableTranslation": false,
        "translationLanguage": "auto", // Target language for translation
        "originalContent": {}, // Store original content for translation
        "availableTranslationLanguages": {}, // Dynamic list from available program languages
        "translationRequestTimes": [], // Track request times for rate limiting
        "translationInProgress": false, // Track if translation is currently running

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
                    return this.getFallbackTranslation(key, ...args);
                }
            }
            return this.getFallbackTranslation(key, ...args);
        },

        "getFallbackTranslation": function(key, ...args) {
            const fallbacks = {
                "renderer.tab_store.title": "Sayonika Store",
                "renderer.tab_store.subtitle": "Discover and download DDLC mods",
                "renderer.tab_store.search_placeholder": "Search mods...",
                "renderer.tab_store.loading": "Loading mods...",
                "renderer.tab_store.error_title": "Connection Error",
                "renderer.tab_store.retry_button": "Retry",
                "renderer.tab_store.offline_title": "Offline",
                "renderer.tab_store.offline_message": "You are currently offline. Please check your internet connection and try again.",
                "renderer.tab_store.check_connection": "Check Connection",
                "renderer.tab_store.maintenance_banner": "Authentication services are temporarily unavailable due to maintenance. You can still browse mods but cannot login or register.",
                "renderer.tab_store.no_mods_title": "No mods found",
                "renderer.tab_store.no_mods_message": "Try adjusting your search or filters",
                "renderer.tab_store.filters.category": "Category:",
                "renderer.tab_store.filters.all_categories": "All Categories",
                "renderer.tab_store.filters.sort_by": "Sort by:",
                "renderer.tab_store.filters.date_created": "Date Created",
                "renderer.tab_store.filters.date_updated": "Date Updated",
                "renderer.tab_store.filters.downloads": "Downloads",
                "renderer.tab_store.filters.rating": "Rating",
                "renderer.tab_store.filters.title": "Title",
                "renderer.tab_store.filters.order": "Order:",
                "renderer.tab_store.filters.descending": "Descending",
                "renderer.tab_store.filters.ascending": "Ascending",
                "renderer.tab_store.filters.featured_only": "Featured Only",
                "renderer.tab_store.filters.translate_content": "Translate Content",
                "renderer.tab_store.filters.auto_detect": "Auto-detect",
                "renderer.tab_store.mod_card.featured": "Featured",
                "renderer.tab_store.mod_card.mature": "Mature",
                "renderer.tab_store.mod_card.by_author": "by {0}",
                "renderer.tab_store.mod_card.download": "Download",
                "renderer.tab_store.mod_card.downloading": "Downloading...",
                "renderer.tab_store.mod_card.download_mod": "Download Mod",
                "renderer.tab_store.mod_card.downloads_count": "{0} downloads",
                "renderer.tab_store.mod_card.version": "Version {0}",
                "renderer.tab_store.mod_card.screenshots": "Screenshots ({0})",
                "renderer.tab_store.mod_card.description": "Description",
                "renderer.tab_store.mod_card.tags": "Tags",
                "renderer.tab_store.mod_card.requirements": "Requirements",
                "renderer.tab_store.pagination.previous": "Previous",
                "renderer.tab_store.pagination.next": "Next",
                "renderer.tab_store.pagination.page_info": "Page {0} of {1}",
                "renderer.tab_store.login.title": "Login to Sayonika",
                "renderer.tab_store.login.discord": "Login with Discord",
                "renderer.tab_store.login.github": "Login with GitHub",
                "renderer.tab_store.login.or": "or",
                "renderer.tab_store.login.username_label": "Username or Email:",
                "renderer.tab_store.login.username_placeholder": "Enter username or email address",
                "renderer.tab_store.login.username_help": "You can use either your username or email address to log in",
                "renderer.tab_store.login.password_label": "Password:",
                "renderer.tab_store.login.remember_me": "Remember me",
                "renderer.tab_store.login.login_button": "Login",
                "renderer.tab_store.login.logging_in": "Logging in...",
                "renderer.tab_store.login.register_link": "Don't have an account? Register here",
                "renderer.tab_store.login.success": "Successfully logged in!",
                "renderer.tab_store.login.failed": "Login failed: {0}",
                "renderer.tab_store.translation.enabled": "Translation enabled. Content will be translated when available.",
                "renderer.tab_store.translation.disabled": "Translation disabled.",
                "renderer.tab_store.translation.language_changed": "Translation language changed to {0}"
            };

            let translation = fallbacks[key] || key;

            // Handle string interpolation for fallback translations
            if (args.length > 0) {
                translation = translation.replace(/{(\d+)}/g, (match, index) => {
                    const argIndex = parseInt(index);
                    return args[argIndex] !== undefined ? args[argIndex] : match;
                });
            }

            return translation;
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
            // Check if we're in maintenance mode
            if (this.connectionStatus === 'maintenance') {
                this.showNotification('Authentication is currently unavailable due to maintenance mode. You can still browse and download mods.', 'warning');
                return;
            }
            
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
                        this.showNotification(this._('renderer.tab_store.login.success'), 'success');
                    } else {
                        // Handle validation errors
                        if (result.errors && Array.isArray(result.errors)) {
                            const errorMessages = result.errors.map(err => err.msg).join(', ');
                            this.showNotification(this._('renderer.tab_store.login.failed', errorMessages), 'error');
                        } else {
                            let errorMessage = result.error || 'Login failed';

                            // Provide more helpful error messages
                            if (errorMessage === 'Invalid credentials') {
                                errorMessage = `Invalid ${inputType} or password. Please check your credentials and try again.`;
                            }

                            this.showNotification(this._('renderer.tab_store.login.failed', errorMessage), 'error');
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
                    this.showNotification(this._('renderer.tab_store.login.success'), 'success');
                } else {
                    // Handle validation errors
                    if (data.errors && Array.isArray(data.errors)) {
                        const errorMessages = data.errors.map(err => err.msg).join(', ');
                        this.showNotification(this._('renderer.tab_store.login.failed', errorMessages), 'error');
                    } else {
                        let errorMessage = data.error || 'Login failed';

                        // Provide more helpful error messages
                        if (errorMessage === 'Invalid credentials') {
                            errorMessage = `Invalid ${inputType} or password. Please check your credentials and try again.`;
                        }

                        this.showNotification(this._('renderer.tab_store.login.failed', errorMessage), 'error');
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
            // Check if we're in maintenance mode
            if (this.connectionStatus === 'maintenance') {
                this.showNotification('Authentication is currently unavailable due to maintenance mode.', 'warning');
                return;
            }
            
            window.open(`${this.storeUrl}/auth/discord`, '_blank', 'width=500,height=600');
            this.closeLogin();
            // Listen for auth completion
            this.listenForAuthCompletion();
        },

        "loginWithGitHub": function() {
            // Check if we're in maintenance mode
            if (this.connectionStatus === 'maintenance') {
                this.showNotification('Authentication is currently unavailable due to maintenance mode.', 'warning');
                return;
            }
            
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



        // Connection and status checking methods
        "checkConnection": async function() {
            console.log('Checking connection status...');
            this.connectionStatus = "checking";
            
            // Check basic internet connectivity first
            if (!navigator.onLine) {
                console.log('Navigator reports offline');
                this.connectionStatus = "offline";
                this.isOnline = false;
                return false;
            }

            try {
                // Use SayonikaConfig if available for sophisticated checking
                if (typeof window.SayonikaConfig !== 'undefined') {
                    // Test connection to store
                    const isConnected = await window.SayonikaConfig.testStoreConnection(this.storeUrl);
                    if (!isConnected) {
                        console.log('Store connection test failed');
                        this.connectionStatus = "offline";
                        this.isOnline = false;
                        return false;
                    }

                    // Check for maintenance mode
                    const maintenanceStatus = await window.SayonikaConfig.checkMaintenanceMode(this.storeUrl);
                    if (maintenanceStatus.isInMaintenance) {
                        console.log('Store is in maintenance mode');
                        this.connectionStatus = "maintenance";
                        this.isOnline = false;
                        return false;
                    }
                } else {
                    // Fallback: simple connectivity test
                    const response = await fetch(`${this.storeUrl}/api/categories`, {
                        method: 'HEAD',
                        timeout: 5000
                    });

                    if (!response.ok) {
                        if (response.status === 503) {
                            this.connectionStatus = "maintenance";
                        } else {
                            this.connectionStatus = "offline";
                        }
                        this.isOnline = false;
                        return false;
                    }
                }

                console.log('Connection check successful');
                this.connectionStatus = "online";
                this.isOnline = true;
                this.lastConnectionCheck = Date.now();
                return true;

            } catch (error) {
                console.error('Connection check failed:', error);
                this.connectionStatus = "offline";
                this.isOnline = false;
                return false;
            }
        },

        "startConnectionMonitoring": function() {
            // Set up periodic connection checking (every 30 seconds)
            this.connectionCheckInterval = setInterval(async () => {
                if (this.connectionStatus !== "online") {
                    await this.checkConnection();
                }
            }, 30000);

            // Listen for online/offline events
            window.addEventListener('online', async () => {
                console.log('Browser detected online status');
                await this.checkConnection();
                if (this.isOnline) {
                    this.loadMods();
                }
            });

            window.addEventListener('offline', () => {
                console.log('Browser detected offline status');
                this.connectionStatus = "offline";
                this.isOnline = false;
            });
        },

        "stopConnectionMonitoring": function() {
            if (this.connectionCheckInterval) {
                clearInterval(this.connectionCheckInterval);
                this.connectionCheckInterval = null;
            }
        },

        // Translation methods
        "onTranslationToggle": function() {
            if (this.enableTranslation) {
                this.showNotification('Translation enabled. Content will be translated when available.', 'info');
                this.translateExistingContent();
            } else {
                this.showNotification('Translation disabled.', 'info');
                this.restoreOriginalContent();
            }
        },

        "onTranslationLanguageChange": function() {
            if (this.enableTranslation) {
                this.showNotification(`Translation language changed to ${this.getLanguageName(this.translationLanguage)}`, 'info');
                this.translateExistingContent();
            }
        },

        "getLanguageName": function(code) {
            const languages = {
                'auto': 'Auto-detect',
                'es': 'Spanish',
                'es-419': 'Spanish (Latin America)',
                'fr': 'French', 
                'fr-FR': 'French (France)',
                'de': 'German',
                'de-DE': 'German (Germany)',
                'it': 'Italian',
                'it-IT': 'Italian (Italy)',
                'pt': 'Portuguese',
                'pt-BR': 'Portuguese (Brazil)',
                'ru': 'Russian',
                'ja': 'Japanese',
                'ko': 'Korean',
                'zh': 'Chinese',
                'zh-CN': 'Chinese (Simplified)',
                'zh-TW': 'Chinese (Traditional)',
                'ar': 'Arabic',
                'hi': 'Hindi',
                'cs': 'Czech',
                'da': 'Danish',
                'fi': 'Finnish',
                'hu': 'Hungarian',
                'nb': 'Norwegian (Bokmål)',
                'nl': 'Dutch',
                'pl': 'Polish',
                'sv': 'Swedish',
                'tr': 'Turkish',
                'en-US': 'English (US)'
            };
            return languages[code] || code;
        },

        "loadAvailableTranslationLanguages": function() {
            try {
                // Get available languages from the program
                if (typeof ddmm !== 'undefined' && ddmm.getAvailableLanguages) {
                    const programLanguages = ddmm.getAvailableLanguages();
                    
                    if (programLanguages && typeof programLanguages === 'object') {
                        // Convert program languages to translation format
                        const translationLanguages = {};
                        
                        for (const [langCode, langInfo] of Object.entries(programLanguages)) {
                            // Convert language codes to LibreTranslate API compatible codes
                            let apiCode = langCode;
                            
                            // Map specific codes to LibreTranslate language codes
                            const codeMapping = {
                                'en-US': 'en',
                                'en-US': 'en',
                                'es-419': 'es',
                                'fr-FR': 'fr',
                                'de-DE': 'de',
                                'it-IT': 'it',
                                'pt-BR': 'pt',
                                'zh-CN': 'zh',
                                'zh-TW': 'zh',
                                'nb': 'no', // Norwegian Bokmål -> Norwegian
                                'ja': 'ja',
                                'ko': 'ko',
                                'ru': 'ru',
                                'ar': 'ar',
                                'hi': 'hi',
                                'cs': 'cs',
                                'da': 'da',
                                'fi': 'fi',
                                'hu': 'hu',
                                'nl': 'nl',
                                'pl': 'pl',
                                'sv': 'sv',
                                'tr': 'tr'
                            };
                            
                            if (codeMapping[langCode]) {
                                apiCode = codeMapping[langCode];
                            } else {
                                // Extract base language code (e.g., 'en' from 'en-US')
                                apiCode = langCode.split('-')[0];
                            }
                            
                            // Skip English since content is already in English
                            if (apiCode !== 'en') {
                                // Use proper language names
                                const languageNames = {
                                    'es': 'Spanish',
                                    'fr': 'French',
                                    'de': 'German',
                                    'it': 'Italian',
                                    'pt': 'Portuguese',
                                    'ru': 'Russian',
                                    'ja': 'Japanese',
                                    'ko': 'Korean',
                                    'zh': 'Chinese (Simplified)',
                                    'zh-TW': 'Chinese (Traditional)',
                                    'ar': 'Arabic',
                                    'hi': 'Hindi',
                                    'cs': 'Czech',
                                    'da': 'Danish',
                                    'fi': 'Finnish',
                                    'hu': 'Hungarian',
                                    'no': 'Norwegian',
                                    'nl': 'Dutch',
                                    'pl': 'Polish',
                                    'sv': 'Swedish',
                                    'tr': 'Turkish'
                                };
                                
                                const displayName = languageNames[apiCode] || 
                                                   (langInfo && langInfo.nativeName) || 
                                                   (langInfo && langInfo.name) || 
                                                   apiCode;
                                
                                translationLanguages[apiCode] = displayName;
                            }
                        }
                        
                        this.availableTranslationLanguages = translationLanguages;
                        console.log('Loaded translation languages from program:', translationLanguages);
                        
                        // Set auto-detect to current program language if not already set
                        if (this.translationLanguage === 'auto') {
                            this.setAutoDetectLanguage();
                        }
                        
                        return;
                    }
                }
            } catch (error) {
                console.warn('Failed to load program languages for translation:', error);
            }
            
            // Fallback to LibreTranslate supported languages
            this.availableTranslationLanguages = {
                'es': 'Spanish',
                'fr': 'French',
                'de': 'German',
                'it': 'Italian',
                'pt': 'Portuguese',
                'ru': 'Russian',
                'ja': 'Japanese',
                'ko': 'Korean',
                'zh': 'Chinese',
                'ar': 'Arabic',
                'hi': 'Hindi',
                'cs': 'Czech',
                'da': 'Danish',
                'fi': 'Finnish',
                'hu': 'Hungarian',
                'no': 'Norwegian',
                'nl': 'Dutch',
                'pl': 'Polish',
                'sv': 'Swedish',
                'tr': 'Turkish'
            };
        },

        "setAutoDetectLanguage": function() {
            try {
                // Get current program language
                let currentLang = 'en';
                
                if (typeof ddmm !== 'undefined' && ddmm.config) {
                    currentLang = ddmm.config.readConfigValue("language") || "en-US";
                }
                
                // Convert to LibreTranslate API format
                const codeMapping = {
                    'en-US': 'en',
                    'en-US': 'en',
                    'es-419': 'es',
                    'fr-FR': 'fr',
                    'de-DE': 'de',
                    'it-IT': 'it',
                    'pt-BR': 'pt',
                    'zh-CN': 'zh',
                    'zh-TW': 'zh',
                    'nb': 'no',
                    'ja': 'ja',
                    'ko': 'ko',
                    'ru': 'ru',
                    'ar': 'ar',
                    'hi': 'hi',
                    'cs': 'cs',
                    'da': 'da',
                    'fi': 'fi',
                    'hu': 'hu',
                    'nl': 'nl',
                    'pl': 'pl',
                    'sv': 'sv',
                    'tr': 'tr'
                };
                
                const apiCode = codeMapping[currentLang] || currentLang.split('-')[0];
                
                // Only set if it's not English (since content is already in English)
                if (apiCode !== 'en' && this.availableTranslationLanguages[apiCode]) {
                    this.translationLanguage = apiCode;
                    console.log('Auto-detect set translation language to:', apiCode, 'based on program language:', currentLang);
                }
            } catch (error) {
                console.warn('Failed to set auto-detect language:', error);
            }
        },

        "checkAndEnableTranslationByDefault": function() {
            try {
                // Get current program language
                let currentLang = 'en';
                
                if (typeof ddmm !== 'undefined' && ddmm.config) {
                    currentLang = ddmm.config.readConfigValue("language") || "en-US";
                }
                
                // Convert to API format to check if it's non-English
                const codeMapping = {
                    'en-US': 'en',
                    'en-US': 'en',
                    'es-419': 'es',
                    'fr-FR': 'fr',
                    'de-DE': 'de',
                    'it-IT': 'it',
                    'pt-BR': 'pt',
                    'zh-CN': 'zh',
                    'zh-TW': 'zh',
                    'nb': 'no',
                    'ja': 'ja',
                    'ko': 'ko',
                    'ru': 'ru',
                    'ar': 'ar',
                    'hi': 'hi',
                    'cs': 'cs',
                    'da': 'da',
                    'fi': 'fi',
                    'hu': 'hu',
                    'nl': 'nl',
                    'pl': 'pl',
                    'sv': 'sv',
                    'tr': 'tr'
                };
                
                const apiCode = codeMapping[currentLang] || currentLang.split('-')[0];
                
                // If language is not English and translation is available, enable it by default
                if (apiCode !== 'en' && this.availableTranslationLanguages[apiCode]) {
                    this.enableTranslation = true;
                    this.translationLanguage = apiCode;
                    console.log('Auto-enabled translation for non-English language:', apiCode, 'based on program language:', currentLang);
                    
                    // Show a notification to inform the user
                    this.showNotification(`Translation enabled automatically for ${this.getLanguageName(apiCode)}. You can disable it in the store filters.`, 'info');
                }
            } catch (error) {
                console.warn('Failed to check and enable translation by default:', error);
            }
        },

        "onTranslationToggle": async function() {
            if (this.enableTranslation) {
                // Load available languages and set auto-detect
                this.loadAvailableTranslationLanguages();
                this.setAutoDetectLanguage();    
                
                // Check if we have content to translate
                if (this.mods.length === 0) {
                    this.showNotification('No content available to translate. Load some mods first.', 'warning');
                    return;
                }
                
                try {
                    // Translate existing content
                    await this.translateExistingContent();
                    this.showNotification(this._('renderer.tab_store.translation.enabled'), 'success');
                } catch (error) {
                    console.error('Translation failed:', error);
                    this.showNotification('Translation failed due to rate limits or API issues. Please try again later.', 'error');
                    this.enableTranslation = false; // Disable on failure
                }
            } else {
                // Restore original content
                this.restoreOriginalContent();
                this.showNotification(this._('renderer.tab_store.translation.disabled'), 'info');
            }
        },

        "onTranslationLanguageChange": async function() {
            if (this.enableTranslation) {
                if (this.translationLanguage === 'auto') {
                    this.setAutoDetectLanguage();
                }
                
                try {
                    await this.translateExistingContent();
                    const langName = this.availableTranslationLanguages[this.translationLanguage] || this.translationLanguage;
                    this.showNotification(this._('renderer.tab_store.translation.language_changed', langName), 'success');
                } catch (error) {
                    console.error('Translation language change failed:', error);
                    this.showNotification('Translation failed due to rate limits or API issues. Please try again later.', 'error');
                }
            }
        },

        "translateText": async function(text, targetLang = null) {
            if (!text || text.trim().length === 0) {
                return text;
            }

            const target = targetLang || this.translationLanguage;
            if (target === 'auto') {
                return text; // Don't translate with auto-detect as target
            }

            try {
                // Rate limiting: wait if we've made too many requests recently
                await this.rateLimitCheck();

                // Use Google Translate API via translate.googleapis.com (free tier)
                const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
                
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; DDMM-Store/1.0)',
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Translation API error: ${response.status}`);
                }

                const data = await response.json();
                
                // Google Translate returns an array structure
                if (data && data[0] && data[0][0] && data[0][0][0]) {
                    // Combine all translation segments
                    let translatedText = '';
                    for (const segment of data[0]) {
                        if (segment && segment[0]) {
                            translatedText += segment[0];
                        }
                    }
                    return translatedText || text;
                } else {
                    throw new Error('Translation failed: Invalid response format');
                }
            } catch (error) {
                console.warn('Translation failed:', error);
                return text; // Return original text on failure
            }
        },

        "translateLongText": async function(text, target) {
            // LibreTranslate can handle longer texts better than MyMemory
            // Split text into sentences or logical chunks (up to 5000 chars)
            const sentences = text.split(/(?<=[.!?])\s+/);
            const chunks = [];
            let currentChunk = '';

            for (const sentence of sentences) {
                if ((currentChunk + sentence).length > 4000) {
                    if (currentChunk) {
                        chunks.push(currentChunk.trim());
                        currentChunk = sentence;
                    } else {
                        // Single sentence is too long, split by words
                        const words = sentence.split(' ');
                        let wordChunk = '';
                        for (const word of words) {
                            if ((wordChunk + ' ' + word).length > 4000) {
                                if (wordChunk) {
                                    chunks.push(wordChunk.trim());
                                    wordChunk = word;
                                } else {
                                    // Single word is too long, just use first 4000 chars
                                    chunks.push(word.substring(0, 4000));
                                    wordChunk = word.substring(4000);
                                }
                            } else {
                                wordChunk += (wordChunk ? ' ' : '') + word;
                            }
                        }
                        if (wordChunk) {
                            currentChunk = wordChunk;
                        }
                    }
                } else {
                    currentChunk += (currentChunk ? ' ' : '') + sentence;
                }
            }

            if (currentChunk) {
                chunks.push(currentChunk.trim());
            }

            // Translate each chunk with delays
            const translatedChunks = [];
            for (let i = 0; i < chunks.length; i++) {
                if (i > 0) {
                    // Add delay between chunks to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 800));
                }
                const translatedChunk = await this.translateText(chunks[i], target);
                translatedChunks.push(translatedChunk);
            }

            return translatedChunks.join(' ');
        },

        "rateLimitCheck": async function() {
            // LibreTranslate rate limiting: track requests and add delays
            if (!this.translationRequestTimes) {
                this.translationRequestTimes = [];
            }

            const now = Date.now();
            // Remove requests older than 1 minute
            this.translationRequestTimes = this.translationRequestTimes.filter(time => now - time < 60000);

            // If we've made more than 5 requests in the last minute, wait (LibreTranslate is more restrictive)
            if (this.translationRequestTimes.length >= 5) {
                const oldestRequest = Math.min(...this.translationRequestTimes);
                const waitTime = 60000 - (now - oldestRequest) + 100; // Add 100ms buffer
                if (waitTime > 0) {
                    console.log(`Rate limiting: waiting ${waitTime}ms for LibreTranslate`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }

            // Record this request
            this.translationRequestTimes.push(now);
        },

        "translateExistingContent": async function() {
            if (!this.enableTranslation || this.mods.length === 0) {
                return;
            }

            if (this.translationInProgress) {
                this.showNotification('Translation is already in progress. Please wait...', 'warning');
                return;
            }

            console.log('Translating existing content...');
            this.translationInProgress = true;
            
            try {
                // Show progress notification
                const totalMods = this.mods.length;
                let translatedCount = 0;
                
                this.showNotification(`Starting translation of ${totalMods} mods...`, 'info');
                
                // Translate mod content sequentially to avoid rate limits
                for (let i = 0; i < this.mods.length; i++) {
                    const mod = this.mods[i];
                    
                    if (!this.originalContent[mod.id]) {
                        // Store original content first
                        this.originalContent[mod.id] = {
                            title: mod.title,
                            description: mod.description,
                            short_description: mod.short_description
                        };
                    }

                    try {
                        // Translate title (usually short, safe to translate)
                        if (mod.title) {
                            mod.title = await this.translateText(this.originalContent[mod.id].title);
                        }

                        // Translate short description first (usually shorter)
                        if (mod.short_description) {
                            mod.short_description = await this.translateText(this.originalContent[mod.id].short_description);
                        }

                        // Translate full description (might be long)
                        if (mod.description) {
                            mod.description = await this.translateText(this.originalContent[mod.id].description);
                        }

                        translatedCount++;
                        
                        // Update progress every 5 mods or on last mod
                        if (translatedCount % 5 === 0 || translatedCount === totalMods) {
                            this.showNotification(`Translation progress: ${translatedCount}/${totalMods} mods completed`, 'info');
                            // Force Vue to update the display
                            this.$forceUpdate();
                        }

                        // Delay between mods to avoid overwhelming the API (LibreTranslate needs more time)
                        if (i < this.mods.length - 1) {
                            await new Promise(resolve => setTimeout(resolve, 1500));
                        }
                    } catch (error) {
                        console.warn(`Failed to translate content for mod ${mod.id}:`, error);
                        // Continue with next mod even if this one failed
                    }

                    // Check if translation was disabled during the process
                    if (!this.enableTranslation) {
                        console.log('Translation was disabled during processing, stopping...');
                        break;
                    }
                }

                // Final update
                this.$forceUpdate();
                
                if (this.enableTranslation) {
                    this.showNotification(`Translation completed! ${translatedCount}/${totalMods} mods translated successfully.`, 'success');
                }
            } catch (error) {
                console.error('Translation process failed:', error);
                this.showNotification('Translation failed due to API errors. Please try again later.', 'error');
                throw error; // Re-throw to be handled by caller
            } finally {
                this.translationInProgress = false;
            }
        },

        "restoreOriginalContent": function() {
            if (this.mods.length === 0) {
                return;
            }

            console.log('Restoring original content...');
            
            for (let mod of this.mods) {
                if (this.originalContent[mod.id]) {
                    mod.title = this.originalContent[mod.id].title;
                    mod.description = this.originalContent[mod.id].description;
                    mod.short_description = this.originalContent[mod.id].short_description;
                }
            }

            // Force Vue to update the display
            this.$forceUpdate();
        },

        // Data loading methods
        "loadMods": async function() {
            // Check connection first
            if (!this.isOnline) {
                const connectionAvailable = await this.checkConnection();
                if (!connectionAvailable) {
                    this.loading = false;
                    return;
                }
            }

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

                // Store original content and translate if enabled
                if (this.enableTranslation) {
                    await this.translateExistingContent();
                }

            } catch (error) {
                console.error('Failed to load mods:', error);
                this.error = `Failed to connect to Sayonika store: ${error.message}`;
                this.mods = [];
                
                // Update connection status based on error
                if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
                    this.connectionStatus = "offline";
                    this.isOnline = false;
                }
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

        "dismissMaintenanceBanner": function() {
            // Temporarily hide the maintenance banner by setting connection status to online
            // This allows users to dismiss the banner while still being in maintenance mode
            if (this.connectionStatus === 'maintenance') {
                this.connectionStatus = 'online';
                this.showNotification('Maintenance banner dismissed. Note: Authentication features remain unavailable during maintenance.', 'info');
            }
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
                'https://sayonika.dynamicaaa.me',
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

        // Initialize translation languages
        this.loadAvailableTranslationLanguages();

        // Check if we should enable translation by default for non-English languages
        // this.checkAndEnableTranslationByDefault();

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

        // Start connection monitoring
        this.startConnectionMonitoring();

        // Load available translation languages
        this.loadAvailableTranslationLanguages();

        // Initial connection check
        await this.checkConnection();

        // Load initial data only if online
        if (this.isOnline) {
            await Promise.all([
                this.loadCategories(),
                this.loadMods()
            ]);
        }

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
        // Clean up event listeners and intervals
        this.stopConnectionMonitoring();
        document.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('resize', this.handleResize);
    }
});