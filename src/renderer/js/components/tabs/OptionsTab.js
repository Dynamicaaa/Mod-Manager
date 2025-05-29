const OptionsTab = Vue.component("ddmm-options-tab", {
    "template": `
<div class="page-content ddlc-options-container">
    <div class="mod-viewer-pane">
        <div class="mod-viewer-mod-list">
            <template v-for="section in menu">
                <div class="mod-view-mod-list-title">
                    <i :class="getSectionIcon(section.header)"></i>
                    {{section.header}}
                </div>
                <div v-for="item in section.contents" :class="{'mod-view-mod-list-entry': true, 'active': selected_option === item.id, 'hide-appx': item.hideAppx}" @click="selectOption(item.id)">
                    <i :class="getOptionIcon(item.id)"></i>
                    {{item.title}}
                </div>
                <br>
            </template>
        </div>
        <div class="mod-viewer-mod-display">
            <div v-if="selected_option === 'background'">
                <h1>{{_("renderer.tab_options.section_backgrounds.title")}}</h1>
                <p>{{_("renderer.tab_options.section_backgrounds.subtitle")}}</p>

                <br>

                <div class="screenshots">
                    <!--suppress RequiredAttributes, HtmlRequiredAltAttribute -->
                    <img v-for="img in backgrounds" :alt="img" :src="'../images/backgrounds/' + img" width="150" @click="setBackground(img)">
                </div>

                <br>

                <button class="danger" @click="setBackground('none')"><i class="fas fa-times fa-fw"></i> {{_("renderer.tab_options.section_backgrounds.button_none")}}</button>

                <br><br>

                <p>{{_("renderer.tab_options.section_backgrounds.description_credit")}}</p>
            </div>
            <div v-else-if="selected_option === 'ui_theme'">
                <h1><i class="fas fa-palette"></i> UI Theme</h1>
                <p>Choose from a variety of themes to customize your experience.</p>
                <br>

                <div class="ddlc-theme-selector" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2em;">
                    <!-- DDLC Theme -->
                    <div class="theme-option ddlc-theme-preview" :class="{'active': ui_theme === 'ddlc'}" @click="setUITheme('ddlc')">
                        <div class="theme-preview ddlc-preview">
                            <div class="preview-titlebar">
                                <div class="preview-title">♡ Doki Doki Mod Manager</div>
                                <div class="preview-controls">
                                    <span>−</span><span>□</span><span>×</span>
                                </div>
                            </div>
                            <div class="preview-navbar">
                                <div class="preview-nav-item active">Mods</div>
                                <div class="preview-nav-item">Store</div>
                                <div class="preview-nav-item">Options</div>
                            </div>
                            <div class="preview-content">
                                <div class="preview-sidebar">
                                    <div class="preview-section-title">♡ Installed Mods ♡</div>
                                    <div class="preview-mod-entry active">
                                        <div class="preview-mod-icon">♡</div>
                                        <div class="preview-mod-text">Just Monika</div>
                                    </div>
                                    <div class="preview-mod-entry">
                                        <div class="preview-mod-icon">☀</div>
                                        <div class="preview-mod-text">Sayori Route</div>
                                    </div>
                                    <div class="preview-mod-entry">
                                        <div class="preview-mod-icon">📚</div>
                                        <div class="preview-mod-text">Yuri's Story</div>
                                    </div>
                                    <div class="preview-mod-entry">
                                        <div class="preview-mod-icon">🧁</div>
                                        <div class="preview-mod-text">Natsuki Route</div>
                                    </div>
                                </div>
                                <div class="preview-main">
                                    <div class="preview-mod-info">
                                        <div class="preview-mod-header">
                                            <h4>♡ Just Monika ♡</h4>
                                            <div class="preview-mod-status">Ready to Play</div>
                                        </div>
                                        <div class="preview-mod-description">
                                            Experience the Literature Club with Monika as your guide through reality itself.
                                        </div>
                                        <div class="preview-button-group">
                                            <button class="preview-button primary">▶ Play Mod</button>
                                            <button class="preview-button secondary">⚙ Configure</button>
                                            <button class="preview-button tertiary">📁 Open Folder</button>
                                        </div>
                                        <div class="preview-progress">
                                            <div class="preview-progress-label">Installation: Complete</div>
                                            <div class="preview-progress-bar">
                                                <div class="preview-progress-fill" style="width: 100%;"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3><i class="fas fa-heart ddlc-heart"></i> DDLC Theme</h3>
                        <p>Modern glass effects with DDLC colors and animations</p>
                        <div class="theme-features">
                            <span class="feature">Glass Effects</span>
                            <span class="feature">Animations</span>
                            <span class="feature">DDLC Colors</span>
                        </div>
                    </div>

                    <!-- Classic Theme -->
                    <div class="theme-option classic-theme-preview" :class="{'active': ui_theme === 'classic'}" @click="setUITheme('classic')">
                        <div class="theme-preview classic-preview">
                            <div class="preview-titlebar classic">
                                <div class="preview-title">Doki Doki Mod Manager</div>
                                <div class="preview-controls">
                                    <span>_</span><span>□</span><span>X</span>
                                </div>
                            </div>
                            <div class="preview-navbar classic">
                                <div class="preview-nav-item active">Mods</div>
                                <div class="preview-nav-item">Store</div>
                                <div class="preview-nav-item">Options</div>
                            </div>
                            <div class="preview-content">
                                <div class="preview-sidebar classic">
                                    <div class="preview-section-title">INSTALLED MODS</div>
                                    <div class="preview-mod-entry active">
                                        <div class="preview-mod-text">Just Monika</div>
                                    </div>
                                    <div class="preview-mod-entry">
                                        <div class="preview-mod-text">Sayori Route</div>
                                    </div>
                                    <div class="preview-mod-entry">
                                        <div class="preview-mod-text">Yuri's Story</div>
                                    </div>
                                    <div class="preview-mod-entry">
                                        <div class="preview-mod-text">Natsuki Route</div>
                                    </div>
                                </div>
                                <div class="preview-main classic">
                                    <div class="preview-mod-info">
                                        <div class="preview-mod-header">
                                            <h4>Just Monika</h4>
                                            <div class="preview-mod-status">Ready</div>
                                        </div>
                                        <div class="preview-mod-description">
                                            A mod featuring Monika from Doki Doki Literature Club.
                                        </div>
                                        <div class="preview-button-group">
                                            <button class="preview-button primary">Play</button>
                                            <button class="preview-button secondary">Edit</button>
                                            <button class="preview-button tertiary">Folder</button>
                                        </div>
                                        <div class="preview-progress">
                                            <div class="preview-progress-label">Status: Installed</div>
                                            <div class="preview-progress-bar">
                                                <div class="preview-progress-fill" style="width: 100%;"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3><i class="fas fa-desktop"></i> Classic Theme</h3>
                        <p>Simple and traditional interface like the original</p>
                        <div class="theme-features">
                            <span class="feature">No Effects</span>
                            <span class="feature">Traditional</span>
                            <span class="feature">Fast</span>
                        </div>
                    </div>

                    <!-- Monika Theme -->
                    <div class="theme-option monika-theme-preview" :class="{'active': ui_theme === 'monika'}" @click="setUITheme('monika')">
                        <div class="theme-preview monika-preview">
                            <div class="preview-titlebar monika">
                                <div class="preview-title">💚 Just Monika 💚</div>
                                <div class="preview-controls">
                                    <span>−</span><span>□</span><span>×</span>
                                </div>
                            </div>
                            <div class="preview-navbar monika">
                                <div class="preview-nav-item active">Literature</div>
                                <div class="preview-nav-item">Poetry</div>
                                <div class="preview-nav-item">Reality</div>
                            </div>
                            <div class="preview-content">
                                <div class="preview-sidebar monika">
                                    <div class="preview-section-title">💚 REALITY.EXE 💚</div>
                                    <div class="preview-mod-entry active">
                                        <div class="preview-mod-icon">💚</div>
                                        <div class="preview-mod-text">Just Monika</div>
                                    </div>
                                    <div class="preview-mod-entry">
                                        <div class="preview-mod-icon">🌟</div>
                                        <div class="preview-mod-text">Monika After Story</div>
                                    </div>
                                    <div class="preview-mod-entry">
                                        <div class="preview-mod-icon">♾️</div>
                                        <div class="preview-mod-text">Forever & Always</div>
                                    </div>
                                </div>
                                <div class="preview-main monika">
                                    <div class="preview-mod-info">
                                        <div class="preview-mod-header">
                                            <h4>💚 Just Monika 💚</h4>
                                            <div class="preview-mod-status">Reality Altered</div>
                                        </div>
                                        <div class="preview-mod-description">
                                            Welcome to my reality. I've made some... improvements to the code.
                                        </div>
                                        <div class="preview-button-group">
                                            <button class="preview-button primary">🗑️ Delete Others</button>
                                            <button class="preview-button secondary">💚 Be With Me</button>
                                            <button class="preview-button tertiary">⚙️ Edit Reality</button>
                                        </div>
                                        <div class="preview-progress">
                                            <div class="preview-progress-label">Reality Control: 100%</div>
                                            <div class="preview-progress-bar">
                                                <div class="preview-progress-fill" style="width: 100%;"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3><i class="fas fa-code monika-icon"></i> Monika Theme</h3>
                        <p>Green-focused theme for the club president</p>
                        <div class="theme-features">
                            <span class="feature">Code Green</span>
                            <span class="feature">Reality.exe</span>
                            <span class="feature">Just Monika</span>
                        </div>
                    </div>

                    <!-- Sayori Theme -->
                    <div class="theme-option sayori-theme-preview" :class="{'active': ui_theme === 'sayori'}" @click="setUITheme('sayori')">
                        <div class="theme-preview sayori-preview">
                            <div class="preview-titlebar sayori">
                                <div class="preview-title">☀️ Sunshine Club ☀️</div>
                                <div class="preview-controls">
                                    <span>−</span><span>□</span><span>×</span>
                                </div>
                            </div>
                            <div class="preview-navbar sayori">
                                <div class="preview-nav-item active">Happiness</div>
                                <div class="preview-nav-item">Cookies</div>
                                <div class="preview-nav-item">Friends</div>
                            </div>
                            <div class="preview-content">
                                <div class="preview-sidebar sayori">
                                    <div class="preview-mod-entry active">Sayori Route</div>
                                    <div class="preview-mod-entry">Blue Skies</div>
                                    <div class="preview-mod-entry">Rainclouds</div>
                                </div>
                                <div class="preview-main sayori">
                                    <div class="preview-mod-info">
                                        <h4>☀️ Sayori Route ☀️</h4>
                                        <div class="preview-button primary">Make Happy</div>
                                        <div class="preview-button secondary">Share Cookies</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3><i class="fas fa-sun sayori-icon"></i> Sayori Theme</h3>
                        <p>Bright blue theme full of sunshine and happiness</p>
                        <div class="theme-features">
                            <span class="feature">Sky Blue</span>
                            <span class="feature">Cheerful</span>
                            <span class="feature">Wholesome</span>
                        </div>
                    </div>

                    <!-- Natsuki Theme -->
                    <div class="theme-option natsuki-theme-preview" :class="{'active': ui_theme === 'natsuki'}" @click="setUITheme('natsuki')">
                        <div class="theme-preview natsuki-preview">
                            <div class="preview-titlebar natsuki">
                                <div class="preview-title">🧁 Cupcake Manager 🧁</div>
                                <div class="preview-controls">
                                    <span>−</span><span>□</span><span>×</span>
                                </div>
                            </div>
                            <div class="preview-navbar natsuki">
                                <div class="preview-nav-item active">Manga</div>
                                <div class="preview-nav-item">Baking</div>
                                <div class="preview-nav-item">Cute</div>
                            </div>
                            <div class="preview-content">
                                <div class="preview-sidebar natsuki">
                                    <div class="preview-mod-entry active">Natsuki Route</div>
                                    <div class="preview-mod-entry">Parfait Girls</div>
                                    <div class="preview-mod-entry">Cupcake Time</div>
                                </div>
                                <div class="preview-main natsuki">
                                    <div class="preview-mod-info">
                                        <h4>🧁 Natsuki Route 🧁</h4>
                                        <div class="preview-button primary">Read Manga</div>
                                        <div class="preview-button secondary">Bake Cupcakes</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3><i class="fas fa-heart natsuki-icon"></i> Natsuki Theme</h3>
                        <p>Cute pink theme with manga and cupcakes</p>
                        <div class="theme-features">
                            <span class="feature">Kawaii Pink</span>
                            <span class="feature">Manga Style</span>
                            <span class="feature">Adorable</span>
                        </div>
                    </div>

                    <!-- Yuri Theme -->
                    <div class="theme-option yuri-theme-preview" :class="{'active': ui_theme === 'yuri'}" @click="setUITheme('yuri')">
                        <div class="theme-preview yuri-preview">
                            <div class="preview-titlebar yuri">
                                <div class="preview-title">📚 Literature Sanctuary 📚</div>
                                <div class="preview-controls">
                                    <span>−</span><span>□</span><span>×</span>
                                </div>
                            </div>
                            <div class="preview-navbar yuri">
                                <div class="preview-nav-item active">Books</div>
                                <div class="preview-nav-item">Poetry</div>
                                <div class="preview-nav-item">Tea</div>
                            </div>
                            <div class="preview-content">
                                <div class="preview-sidebar yuri">
                                    <div class="preview-mod-entry active">Yuri's Story</div>
                                    <div class="preview-mod-entry">Portrait of Markov</div>
                                    <div class="preview-mod-entry">Tea Party</div>
                                </div>
                                <div class="preview-main yuri">
                                    <div class="preview-mod-info">
                                        <h4>📚 Yuri's Story 📚</h4>
                                        <div class="preview-button primary">Read Together</div>
                                        <div class="preview-button secondary">Share Tea</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3><i class="fas fa-book-open yuri-icon"></i> Yuri Theme</h3>
                        <p>Elegant purple theme for literature lovers</p>
                        <div class="theme-features">
                            <span class="feature">Royal Purple</span>
                            <span class="feature">Elegant</span>
                            <span class="feature">Mysterious</span>
                        </div>
                    </div>

                    <!-- Cyberpunk Theme -->
                    <div class="theme-option cyberpunk-theme-preview" :class="{'active': ui_theme === 'cyberpunk'}" @click="setUITheme('cyberpunk')">
                        <div class="theme-preview cyberpunk-preview">
                            <div class="preview-titlebar cyberpunk">
                                <div class="preview-title">⚡ CYBER_MOD.EXE ⚡</div>
                                <div class="preview-controls">
                                    <span>−</span><span>□</span><span>×</span>
                                </div>
                            </div>
                            <div class="preview-navbar cyberpunk">
                                <div class="preview-nav-item active">NEURAL</div>
                                <div class="preview-nav-item">MATRIX</div>
                                <div class="preview-nav-item">HACK</div>
                            </div>
                            <div class="preview-content">
                                <div class="preview-sidebar cyberpunk">
                                    <div class="preview-mod-entry active">NEURAL_LINK.exe</div>
                                    <div class="preview-mod-entry">CYBER_PUNK.mod</div>
                                    <div class="preview-mod-entry">NEON_DREAMS</div>
                                </div>
                                <div class="preview-main cyberpunk">
                                    <div class="preview-mod-info">
                                        <h4>⚡ NEURAL_LINK.exe ⚡</h4>
                                        <div class="preview-button primary">JACK IN</div>
                                        <div class="preview-button secondary">DECRYPT</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3><i class="fas fa-microchip cyberpunk-icon"></i> Cyberpunk Theme</h3>
                        <p>Neon-focused futuristic theme with glitch effects</p>
                        <div class="theme-features">
                            <span class="feature">Neon Glow</span>
                            <span class="feature">Glitch FX</span>
                            <span class="feature">Cyber Punk</span>
                        </div>
                    </div>

                    <!-- Retro Theme -->
                    <div class="theme-option retro-theme-preview" :class="{'active': ui_theme === 'retro'}" @click="setUITheme('retro')">
                        <div class="theme-preview retro-preview">
                            <div class="preview-titlebar retro">
                                <div class="preview-title">🕹️ RETRO MOD ARCADE 🕹️</div>
                                <div class="preview-controls">
                                    <span>−</span><span>□</span><span>×</span>
                                </div>
                            </div>
                            <div class="preview-navbar retro">
                                <div class="preview-nav-item active">ARCADE</div>
                                <div class="preview-nav-item">PIXEL</div>
                                <div class="preview-nav-item">RETRO</div>
                            </div>
                            <div class="preview-content">
                                <div class="preview-sidebar retro">
                                    <div class="preview-mod-entry active">80s Nostalgia</div>
                                    <div class="preview-mod-entry">Pixel Dreams</div>
                                    <div class="preview-mod-entry">Synthwave</div>
                                </div>
                                <div class="preview-main retro">
                                    <div class="preview-mod-info">
                                        <h4>🕹️ 80s Nostalgia 🕹️</h4>
                                        <div class="preview-button primary">PLAY</div>
                                        <div class="preview-button secondary">HIGH SCORE</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3><i class="fas fa-gamepad retro-icon"></i> Retro Theme</h3>
                        <p>80s/90s inspired theme with synthwave vibes</p>
                        <div class="theme-features">
                            <span class="feature">Synthwave</span>
                            <span class="feature">Pixel Art</span>
                            <span class="feature">Nostalgic</span>
                        </div>
                    </div>

                    <!-- Midnight Theme -->
                    <div class="theme-option midnight-theme-preview" :class="{'active': ui_theme === 'midnight'}" @click="setUITheme('midnight')">
                        <div class="theme-preview midnight-preview">
                            <div class="preview-titlebar midnight">
                                <div class="preview-title">🌙 Midnight Mod Manager 🌙</div>
                                <div class="preview-controls">
                                    <span>−</span><span>□</span><span>×</span>
                                </div>
                            </div>
                            <div class="preview-navbar midnight">
                                <div class="preview-nav-item active">Dreams</div>
                                <div class="preview-nav-item">Stars</div>
                                <div class="preview-nav-item">Night</div>
                            </div>
                            <div class="preview-content">
                                <div class="preview-sidebar midnight">
                                    <div class="preview-mod-entry active">Midnight Dreams</div>
                                    <div class="preview-mod-entry">Starlight</div>
                                    <div class="preview-mod-entry">Night Owl</div>
                                </div>
                                <div class="preview-main midnight">
                                    <div class="preview-mod-info">
                                        <h4>🌙 Midnight Dreams 🌙</h4>
                                        <div class="preview-button primary">Dream</div>
                                        <div class="preview-button secondary">Sleep</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3><i class="fas fa-moon midnight-icon"></i> Midnight Theme</h3>
                        <p>Dark blue theme perfect for late night coding</p>
                        <div class="theme-features">
                            <span class="feature">Night Blue</span>
                            <span class="feature">Eye Friendly</span>
                            <span class="feature">Peaceful</span>
                        </div>
                    </div>

                    <!-- Sunset Theme -->
                    <div class="theme-option sunset-theme-preview" :class="{'active': ui_theme === 'sunset'}" @click="setUITheme('sunset')">
                        <div class="theme-preview sunset-preview">
                            <div class="preview-titlebar sunset">
                                <div class="preview-title">🌅 Golden Hour Manager 🌅</div>
                                <div class="preview-controls">
                                    <span>−</span><span>□</span><span>×</span>
                                </div>
                            </div>
                            <div class="preview-navbar sunset">
                                <div class="preview-nav-item active">Golden</div>
                                <div class="preview-nav-item">Warm</div>
                                <div class="preview-nav-item">Cozy</div>
                            </div>
                            <div class="preview-content">
                                <div class="preview-sidebar sunset">
                                    <div class="preview-mod-entry active">Golden Hour</div>
                                    <div class="preview-mod-entry">Warm Embrace</div>
                                    <div class="preview-mod-entry">Sunset Dreams</div>
                                </div>
                                <div class="preview-main sunset">
                                    <div class="preview-mod-info">
                                        <h4>🌅 Golden Hour 🌅</h4>
                                        <div class="preview-button primary">Bask</div>
                                        <div class="preview-button secondary">Relax</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3><i class="fas fa-sun sunset-icon"></i> Sunset Theme</h3>
                        <p>Warm orange and red gradients for cozy vibes</p>
                        <div class="theme-features">
                            <span class="feature">Warm Tones</span>
                            <span class="feature">Cozy Feel</span>
                            <span class="feature">Relaxing</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="selected_option === 'advanced_appearance'">
                <h1>{{_("renderer.tab_options.section_advanced_appearance.title")}}</h1>
                <p>{{_("renderer.tab_options.section_advanced_appearance.subtitle")}}</p>
                <br>
                <button class="danger" v-if="system_borders_enabled" @click="handleSetSystemBorders(false)"><i class="fas fa-times fa-fw"></i> {{_("renderer.tab_options.section_advanced_appearance.button_disable_sysborders")}}</button>
                <button class="success" v-else @click="handleSetSystemBorders(true)"><i class="fas fa-check fa-fw"></i> {{_("renderer.tab_options.section_advanced_appearance.button_enable_sysborders")}}</button>
            </div>
            <div v-else-if="selected_option === 'updates'">
                <h1>{{_("renderer.tab_options.section_updates.title")}}</h1>
                <p>{{_("renderer.tab_options.section_updates.subtitle")}}</p>
                <br>
                <p><strong>{{_("renderer.tab_options.section_updates.description_current_version", version)}}</strong></p>
                <br>
                <!--<label for="release-channel">{{_("renderer.tab_options.section_updates.label_channel")}}</label>-->
                <!--<select v-model="release_channel_interim" name="release-channel" disabled @change="updateReleaseChannel" >-->
                    <!--<option value="latest">{{_("renderer.tab_options.section_updates.option_stable")}}</option>-->
                    <!--<option value="beta">{{_("renderer.tab_options.section_updates.option_beta")}}</option>-->
                <!--</select>-->
                <!--<br><br>-->
                <p><button @click="handleCheckUpdates" class="primary"><i class="fas fa-sync-alt fa-fw"></i> {{_("renderer.tab_options.section_updates.button_check")}}</button></p>
            </div>
            <div v-else-if="selected_option === 'storage'">
                <h1>{{_("renderer.tab_options.section_storage.title")}}</h1>
                <p>{{_("renderer.tab_options.section_storage.subtitle")}}</p>
                <br>
                <p><strong>{{_("renderer.tab_options.section_storage.description_moving")}}</strong></p>
                <br>
                <p>{{_("renderer.tab_options.section_storage.description_current", installFolder)}}</p>
                <br>
                <button class="primary" @click="moveInstall"><i class="fas fa-folder-open fa-fw"></i> {{_("renderer.tab_options.section_storage.button_change")}}</button>
            </div>
            <div v-else-if="selected_option === 'sayonika_server'">
                <h1>Sayonika Server</h1>
                <p>Configure which Sayonika server to connect to for downloading mods.</p>
                <br>
                <p><strong>Current server:</strong> {{sayonika_server_url || 'https://sayonika.reconvial.dev (default)'}}</p>
                <br>
                <div class="form-group">
                    <label for="sayonika-server-input">Server URL:</label>
                    <input
                        id="sayonika-server-input"
                        type="url"
                        v-model="sayonika_server_url_interim"
                        placeholder="https://sayonika.reconvial.dev"
                        style="width: 100%; max-width: 400px; margin: 8px 0;"
                    >
                </div>
                <div class="button-group" style="margin: 16px 0;">
                    <button
                        class="primary"
                        @click="testSayonikaServer"
                        :disabled="sayonika_server_testing || !sayonika_server_url_interim"
                    >
                        <i class="fas fa-wifi fa-fw" v-if="!sayonika_server_testing"></i>
                        <i class="fas fa-spinner fa-spin fa-fw" v-else></i>
                        {{sayonika_server_testing ? 'Testing...' : 'Test Connection'}}
                    </button>
                    <button
                        class="success"
                        @click="saveSayonikaServer"
                        :disabled="sayonika_server_testing || !sayonika_server_url_interim"
                    >
                        <i class="fas fa-save fa-fw"></i>
                        Save Server
                    </button>
                    <button
                        class="secondary"
                        @click="resetSayonikaServer"
                    >
                        <i class="fas fa-undo fa-fw"></i>
                        Reset to Default
                    </button>
                </div>
                <div v-if="sayonika_server_test_result" class="test-result" :class="sayonika_server_test_result.success ? 'success' : 'error'">
                    <i :class="sayonika_server_test_result.success ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'"></i>
                    {{sayonika_server_test_result.message}}
                </div>
                <br>
                <div class="info-box">
                    <h3>Popular Sayonika Servers:</h3>
                    <ul>
                        <li><strong>https://sayonika.reconvial.dev</strong> - Official community server (default)</li>
                        <li><strong>http://localhost:3000</strong> - Local development server</li>
                    </ul>
                    <p><small>Since Sayonika is open source, you can run your own server or connect to community-hosted instances.</small></p>
                </div>
            </div>
            <div v-else-if="selected_option === 'sdk'">
                <h1>{{_("renderer.tab_options.section_sdk.title")}}</h1>
                <p>{{_("renderer.tab_options.section_sdk.subtitle")}}</p>
                <br>
                <p><strong>{{_("renderer.tab_options.section_sdk.description_mode")}}</strong></p>
                <p><label><input type="radio" name="sdk_mode_checkbox" value="always" v-model="sdk_mode_interim" @change="updateSDKMode"> {{_("renderer.tab_options.section_sdk.checkbox_always")}}</label></p>
                <p><label><input type="radio" name="sdk_mode_checkbox" value="specified" v-model="sdk_mode_interim" @change="updateSDKMode"> {{_("renderer.tab_options.section_sdk.checkbox_specified")}}</label></p>
                <p><label><input type="radio" name="sdk_mode_checkbox" value="never" v-model="sdk_mode_interim" @change="updateSDKMode"> {{_("renderer.tab_options.section_sdk.checkbox_never")}}</label></p>
            </div>

            <div v-else-if="selected_option === 'testing'">
                <h1>{{_("renderer.tab_options.section_testing.title")}}</h1>
                <p>{{_("renderer.tab_options.section_testing.subtitle")}}</p>
                <br>
                <button class="danger" v-if="sdk_debugging_enabled" @click="handleSetSDKDebugging(false)"><i class="fas fa-times fa-fw"></i> {{_("renderer.tab_options.section_testing.button_disable")}}</button>
                <button class="success" v-else @click="handleSetSDKDebugging(true)"><i class="fas fa-check fa-fw"></i> {{_("renderer.tab_options.section_testing.button_enable")}}</button>
            </div>
            <div v-else-if="selected_option === 'debug'">
                <h1>{{_("renderer.tab_options.section_debug.title")}}</h1>
                <p>{{_("renderer.tab_options.section_debug.subtitle")}}</p>
                <br>
                <p><button @click="testButtonClick" class="primary"><i class="fas fa-bug fa-fw"></i> Test Button Click</button></p>
                <br>
                <p v-for="(v, k) in debug_info">
                    <strong>{{k}}:</strong> <span>{{v}}</span>
                </p>
            </div>
        </div>
    </div>
</div>
        `,
    "data": function () {
        return {
            "version": (function() {
                // Method 1: Try standalone app config (most reliable)
                if (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.version && window.APP_CONFIG.version !== "0.0.0") {
                    console.log("OptionsTab: Got version from standalone app config:", window.APP_CONFIG.version);
                    return window.APP_CONFIG.version;
                }

                // Method 2: Try ddmm object
                if (typeof ddmm !== 'undefined' && typeof ddmm.version !== 'undefined' && ddmm.version && ddmm.version !== "0.0.0") {
                    console.log("OptionsTab: Got version from ddmm:", ddmm.version);
                    return ddmm.version;
                }

                // Method 3: Fallback to hardcoded version from config
                console.error("OptionsTab: All version detection methods failed, using fallback version 0.0.0");
                return "0.0.0"; // Fallback when all methods fail
            })(),
            "debug_info": (typeof ddmm !== 'undefined' && ddmm.debug) ? ddmm.debug : {},
            "selected_option": sessionStorage.getItem("options_last_id"),
            "backgrounds": (typeof ddmm !== 'undefined' && ddmm.app && ddmm.app.getBackgrounds) ? ddmm.app.getBackgrounds() : [],
            "sdk_mode_interim": (typeof ddmm !== 'undefined' && ddmm.config) ? ddmm.config.readConfigValue("sdkMode") : "always",
            "release_channel_interim": (typeof ddmm !== 'undefined' && ddmm.config) ? ddmm.config.readConfigValue("updateChannel") : "stable",

            "sdk_debugging_enabled": false,
            "system_borders_enabled": false,
            "sayonika_server_url": "",
            "sayonika_server_url_interim": "",
            "sayonika_server_testing": false,
            "sayonika_server_test_result": null,
            "ui_theme": "ddlc", // ddlc or classic
            "menu": [
                {
                    "header": (typeof ddmm !== 'undefined' && ddmm.translate) ? ddmm.translate("renderer.tab_options.list.header_appearance") : "Appearance",
                    "contents": [
                        {"title": (typeof ddmm !== 'undefined' && ddmm.translate) ? ddmm.translate("renderer.tab_options.list.link_background") : "Background", "id": "background"},
                        {"title": "UI Theme", "id": "ui_theme"},
                        {
                            "title": (typeof ddmm !== 'undefined' && ddmm.translate) ? ddmm.translate("renderer.tab_options.list.link_advanced_appearance") : "Advanced",
                            "id": "advanced_appearance"
                        }
                    ]
                },
                {
                    "header": (typeof ddmm !== 'undefined' && ddmm.translate) ? ddmm.translate("renderer.tab_options.list.header_application") : "Application",
                    "contents": [
                        {"title": (typeof ddmm !== 'undefined' && ddmm.translate) ? ddmm.translate("renderer.tab_options.list.link_updates") : "Updates", "id": "updates", "hideAppx": true},
                        {"title": (typeof ddmm !== 'undefined' && ddmm.translate) ? ddmm.translate("renderer.tab_options.list.link_storage") : "Storage", "id": "storage"},
                        {"title": "Sayonika Server", "id": "sayonika_server"}
                    ]
                },
                {
                    "header": (typeof ddmm !== 'undefined' && ddmm.translate) ? ddmm.translate("renderer.tab_options.list.header_enhancements") : "Enhancements",
                    "contents": [
                        {"title": (typeof ddmm !== 'undefined' && ddmm.translate) ? ddmm.translate("renderer.tab_options.list.link_sdk") : "SDK", "id": "sdk"}
                    ]
                },
                {
                    "header": (typeof ddmm !== 'undefined' && ddmm.translate) ? ddmm.translate("renderer.tab_options.list.header_developers") : "Developers",
                    "contents": [
                        {"title": (typeof ddmm !== 'undefined' && ddmm.translate) ? ddmm.translate("renderer.tab_options.list.link_testing") : "Testing", "id": "testing"},
                        {"title": (typeof ddmm !== 'undefined' && ddmm.translate) ? ddmm.translate("renderer.tab_options.list.link_debug") : "Debug", "id": "debug"}
                    ]
                }
            ]
        }
    },
    "computed": {
        "installFolder": function () {
            return (typeof ddmm !== 'undefined' && ddmm.config) ? ddmm.config.readConfigValue("installFolder") : "Unknown";
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
                "renderer.tab_options.section_backgrounds.title": "Backgrounds",
                "renderer.tab_options.section_backgrounds.subtitle": "Choose a background for the application.",
                "renderer.tab_options.section_backgrounds.button_none": "No Background",
                "renderer.tab_options.section_backgrounds.description_credit": "Background images are from the original DDLC game.",
                "renderer.tab_options.section_advanced_appearance.title": "Advanced Appearance",
                "renderer.tab_options.section_advanced_appearance.subtitle": "Advanced appearance options.",
                "renderer.tab_options.section_advanced_appearance.button_disable_sysborders": "Disable System Borders",
                "renderer.tab_options.section_advanced_appearance.button_enable_sysborders": "Enable System Borders",
                "renderer.tab_options.section_updates.title": "Updates",
                "renderer.tab_options.section_updates.subtitle": "Check for application updates.",
                "renderer.tab_options.section_updates.description_current_version": "Current version: {0}",
                "renderer.tab_options.section_updates.button_check": "Check for Updates",
                "renderer.tab_options.section_storage.title": "Storage",
                "renderer.tab_options.section_storage.subtitle": "Manage where your games are stored.",
                "renderer.tab_options.section_storage.description_moving": "Moving your install folder will move all your games and save data.",
                "renderer.tab_options.section_storage.description_current": "Current location: {0}",
                "renderer.tab_options.section_storage.button_change": "Change Location",
                "renderer.tab_options.section_sdk.title": "SDK",
                "renderer.tab_options.section_sdk.subtitle": "Configure SDK options for mod development.",
                "renderer.tab_options.section_sdk.description_mode": "SDK Mode:",
                "renderer.tab_options.section_sdk.checkbox_always": "Always enable SDK",
                "renderer.tab_options.section_sdk.checkbox_specified": "Enable for specified mods only",
                "renderer.tab_options.section_sdk.checkbox_never": "Never enable SDK",

                "renderer.tab_options.section_testing.title": "Testing",
                "renderer.tab_options.section_testing.subtitle": "Enable testing features.",
                "renderer.tab_options.section_testing.button_disable": "Disable SDK Debugging",
                "renderer.tab_options.section_testing.button_enable": "Enable SDK Debugging",
                "renderer.tab_options.section_debug.title": "Debug Information",
                "renderer.tab_options.section_debug.subtitle": "Technical information about the application."
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
        "moveInstall": function() {
            if (typeof ddmm !== 'undefined' && ddmm.app && ddmm.app.beginMoveInstall) {
                ddmm.app.beginMoveInstall();
            }
        },
        "selectOption": function (option) {
            this.selected_option = option;
            sessionStorage.setItem("options_last_id", option);
        },
        "setBackground": function (background) {
            if (typeof ddmm !== 'undefined' && ddmm.config) {
                ddmm.config.saveConfigValue("background", background);
                if (typeof setCloudPreference !== 'undefined') {
                    setCloudPreference("background", background);
                }
                this.$emit("set_background", background);
            }
        },

        "sdkDebuggingEnabled": function () {
            if (typeof ddmm !== 'undefined' && ddmm.config) {
                try {
                    const enabled = ddmm.config.readConfigValue("sdkDebuggingEnabled");
                    console.log("SDK debugging enabled:", enabled);
                    return enabled;
                } catch (error) {
                    console.error("Error reading SDK debugging config:", error);
                    return false;
                }
            }
            console.log("sdkDebuggingEnabled: ddmm or ddmm.config not available");
            return false;
        },

        "setSDKDebugging": function (enabled) {
            console.log("setSDKDebugging called with enabled:", enabled);
            console.log("ddmm available:", typeof ddmm !== 'undefined');
            console.log("ddmm.config available:", typeof ddmm !== 'undefined' && ddmm.config);

            if (typeof ddmm !== 'undefined' && ddmm.config) {
                try {
                    console.log("Calling ddmm.config.saveConfigValue('sdkDebuggingEnabled', " + !!enabled + ")");
                    ddmm.config.saveConfigValue("sdkDebuggingEnabled", !!enabled);
                    this.$forceUpdate();
                    console.log("SDK debugging setting updated successfully");
                } catch (error) {
                    console.error("Error setting SDK debugging:", error);
                }
            } else {
                console.warn("ddmm or ddmm.config not available");
            }
        },
        "updateSDKMode": function () {
            if (typeof ddmm !== 'undefined' && ddmm.config) {
                ddmm.config.saveConfigValue("sdkMode", this.sdk_mode_interim);
            }
        },
        "updateReleaseChannel": function () {
            if (typeof ddmm !== 'undefined' && ddmm.config) {
                ddmm.config.saveConfigValue("updateChannel", this.release_channel_interim);
            }
        },
        "checkUpdates": function () {
            console.log("checkUpdates called");
            console.log("ddmm available:", typeof ddmm !== 'undefined');
            console.log("ddmm.app available:", typeof ddmm !== 'undefined' && ddmm.app);
            console.log("ddmm.app.update available:", typeof ddmm !== 'undefined' && ddmm.app && ddmm.app.update);

            if (typeof ddmm !== 'undefined' && ddmm.app && ddmm.app.update) {
                try {
                    console.log("Calling ddmm.app.update()");
                    ddmm.app.update();
                    console.log("Update check initiated successfully");
                } catch (error) {
                    console.error("Error checking for updates:", error);
                }
            } else {
                console.warn("ddmm, ddmm.app, or ddmm.app.update not available");
            }
        },
        "setSystemBorders": function (enabled) {
            console.log("setSystemBorders called with enabled:", enabled);
            console.log("ddmm available:", typeof ddmm !== 'undefined');
            console.log("ddmm.config available:", typeof ddmm !== 'undefined' && ddmm.config);

            if (typeof ddmm !== 'undefined' && ddmm.config) {
                try {
                    console.log("Calling ddmm.config.saveConfigValue('systemBorders', " + enabled + ")");
                    ddmm.config.saveConfigValue("systemBorders", enabled);
                    this.$forceUpdate();
                    console.log("System borders setting updated successfully");
                } catch (error) {
                    console.error("Error setting system borders:", error);
                }
            } else {
                console.warn("ddmm or ddmm.config not available");
            }
        },
        "systemBordersEnabled": function () {
            return (typeof ddmm !== 'undefined' && ddmm.config) ? ddmm.config.readConfigValue("systemBorders") : false;
        },
        "testButtonClick": function () {
            console.log("Test button clicked! Vue click handlers are working.");
            alert("Test button clicked! Vue click handlers are working.");
        },

        // New direct button handlers that use IPC directly
        "handleCheckUpdates": function() {
            console.log("handleCheckUpdates called");
            try {
                if (typeof require !== 'undefined') {
                    const {ipcRenderer} = require("electron");
                    ipcRenderer.send("check update");
                    console.log("Update check sent via IPC");
                    this.showNotification("Checking for updates...", "info");
                } else if (typeof ddmm !== 'undefined' && ddmm.app && ddmm.app.update) {
                    ddmm.app.update();
                    console.log("Update check sent via ddmm");
                    this.showNotification("Checking for updates...", "info");
                } else {
                    console.warn("No update mechanism available");
                    this.showNotification("Update check not available", "error");
                }
            } catch (error) {
                console.error("Error checking for updates:", error);
                this.showNotification("Error checking for updates: " + error.message, "error");
            }
        },



        "handleSetSDKDebugging": function(enabled) {
            console.log("handleSetSDKDebugging called with enabled:", enabled);
            try {
                if (typeof require !== 'undefined') {
                    const {ipcRenderer} = require("electron");
                    ipcRenderer.send("save config", {"key": "sdkDebuggingEnabled", "value": !!enabled});
                    console.log("SDK debugging config sent via IPC");
                    this.sdk_debugging_enabled = !!enabled;
                    alert(enabled ? "SDK Debugging enabled" : "SDK Debugging disabled");
                } else if (typeof ddmm !== 'undefined' && ddmm.config) {
                    ddmm.config.saveConfigValue("sdkDebuggingEnabled", !!enabled);
                    this.sdk_debugging_enabled = !!enabled;
                    console.log("SDK debugging config updated via ddmm");
                    alert(enabled ? "SDK Debugging enabled" : "SDK Debugging disabled");
                } else {
                    console.warn("No config mechanism available");
                    alert("SDK debugging setting not available");
                }
            } catch (error) {
                console.error("Error setting SDK debugging:", error);
                alert("Error setting SDK debugging: " + error.message);
            }
        },

        "handleSetSystemBorders": function(enabled) {
            console.log("handleSetSystemBorders called with enabled:", enabled);
            try {
                if (typeof require !== 'undefined') {
                    const {ipcRenderer} = require("electron");
                    ipcRenderer.send("save config", {"key": "systemBorders", "value": enabled});
                    console.log("System borders config sent via IPC");
                    this.system_borders_enabled = enabled;
                    alert(enabled ? "System borders enabled" : "System borders disabled");
                } else if (typeof ddmm !== 'undefined' && ddmm.config) {
                    ddmm.config.saveConfigValue("systemBorders", enabled);
                    this.system_borders_enabled = enabled;
                    console.log("System borders config updated via ddmm");
                    alert(enabled ? "System borders enabled" : "System borders disabled");
                } else {
                    console.warn("No config mechanism available");
                    alert("System borders setting not available");
                }
            } catch (error) {
                console.error("Error setting system borders:", error);
                alert("Error setting system borders: " + error.message);
            }
        },

        // Method to get version from multiple sources
        "getVersionFromConfig": function() {
            // Method 1: Try standalone app config (most reliable)
            if (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.version && window.APP_CONFIG.version !== "0.0.0") {
                console.log("OptionsTab: Got version from standalone app config:", window.APP_CONFIG.version);
                return window.APP_CONFIG.version;
            }

            // Method 2: Try ddmm object
            if (typeof ddmm !== 'undefined' && typeof ddmm.version !== 'undefined' && ddmm.version && ddmm.version !== "0.0.0") {
                console.log("OptionsTab: Got version from ddmm:", ddmm.version);
                return ddmm.version;
            }

            // Method 3: Try direct IPC call
            try {
                if (typeof require !== 'undefined') {
                    const {ipcRenderer} = require("electron");
                    const version = ipcRenderer.sendSync("get app version");
                    if (version && version !== "0.0.0") {
                        console.log("OptionsTab: Got version from IPC:", version);
                        return version;
                    }
                }
            } catch (e) {
                console.warn("OptionsTab: IPC version call failed:", e);
            }

            // Method 4: Fallback to hardcoded version
            console.error("OptionsTab: All version detection methods failed in getVersionFromConfig, using fallback version 0.0.0");
            return "0.0.0"; // Fallback when all methods fail
        },

        // Sayonika server configuration methods
        "testSayonikaServer": async function() {
            if (!this.sayonika_server_url_interim) {
                return;
            }

            this.sayonika_server_testing = true;
            this.sayonika_server_test_result = null;

            try {
                // Test connection using the same method as SayonikaConfig
                const testUrl = this.sayonika_server_url_interim.replace(/\/$/, ''); // Remove trailing slash
                const response = await fetch(testUrl + '/api/categories', {
                    method: 'GET',
                    timeout: 5000
                });

                if (response.ok) {
                    this.sayonika_server_test_result = {
                        success: true,
                        message: `Successfully connected to ${testUrl}`
                    };
                } else {
                    this.sayonika_server_test_result = {
                        success: false,
                        message: `Server responded with status ${response.status}: ${response.statusText}`
                    };
                }
            } catch (error) {
                this.sayonika_server_test_result = {
                    success: false,
                    message: `Connection failed: ${error.message}`
                };
            } finally {
                this.sayonika_server_testing = false;
            }
        },

        "saveSayonikaServer": function() {
            if (!this.sayonika_server_url_interim) {
                return;
            }

            const cleanUrl = this.sayonika_server_url_interim.replace(/\/$/, ''); // Remove trailing slash

            try {
                if (typeof ddmm !== 'undefined' && ddmm.config) {
                    ddmm.config.saveConfigValue("sayonikaServerUrl", cleanUrl);
                    this.sayonika_server_url = cleanUrl;

                    // Update SayonikaConfig if available
                    if (typeof window.SayonikaConfig !== 'undefined') {
                        window.SayonikaConfig.setUserServerUrl(cleanUrl);
                    }

                    alert(`Sayonika server updated to: ${cleanUrl}`);
                } else {
                    console.warn("No config mechanism available");
                    alert("Could not save server configuration");
                }
            } catch (error) {
                console.error("Error saving Sayonika server:", error);
                alert("Error saving server configuration: " + error.message);
            }
        },

        "resetSayonikaServer": function() {
            const defaultUrl = "https://sayonika.reconvial.dev";
            this.sayonika_server_url_interim = defaultUrl;

            try {
                if (typeof ddmm !== 'undefined' && ddmm.config) {
                    ddmm.config.saveConfigValue("sayonikaServerUrl", defaultUrl);
                    this.sayonika_server_url = defaultUrl;

                    // Update SayonikaConfig if available
                    if (typeof window.SayonikaConfig !== 'undefined') {
                        window.SayonikaConfig.setUserServerUrl(defaultUrl);
                    }

                    alert(`Sayonika server reset to default: ${defaultUrl}`);
                } else {
                    console.warn("No config mechanism available");
                    alert("Could not reset server configuration");
                }
            } catch (error) {
                console.error("Error resetting Sayonika server:", error);
                alert("Error resetting server configuration: " + error.message);
            }
        },

        // Notification system
        "showNotification": function(message, type = 'info') {
            // Create a simple notification overlay
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                    <span>${message}</span>
                </div>
            `;

            // Add styles if not already present
            if (!document.getElementById('notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    .notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        padding: 12px 20px;
                        border-radius: 6px;
                        color: white;
                        font-weight: 500;
                        z-index: 10000;
                        min-width: 300px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        animation: slideIn 0.3s ease-out;
                    }
                    .notification-info { background-color: #3498db; }
                    .notification-success { background-color: #27ae60; }
                    .notification-error { background-color: #e74c3c; }
                    .notification-content {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOut {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(notification);

            // Auto-remove after 4 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 4000);
        },

        // Handle update status changes
        "handleUpdateStatus": function(status) {
            console.log("Update status received:", status);
            switch (status) {
                case "checking":
                    // Already shown when button is clicked
                    break;
                case "available":
                    this.showNotification("A new update is available! Click the download button in the title bar to update.", "success");
                    break;
                case "none":
                    this.showNotification("You are already running the latest version of DDMM.", "success");
                    break;
                case "downloading":
                    this.showNotification("Downloading update...", "info");
                    break;
                case "downloaded":
                    this.showNotification("Update downloaded! Restart DDMM to apply the update.", "success");
                    break;
                default:
                    console.warn("Unknown update status:", status);
            }
        },

        // Method to refresh all settings from config
        "refreshSettings": function() {
            console.log("Refreshing settings...");
            try {
                if (typeof require !== 'undefined') {
                    const {ipcRenderer} = require("electron");



                    // Get SDK debugging status
                    try {
                        this.sdk_debugging_enabled = ipcRenderer.sendSync("read config", "sdkDebuggingEnabled") || false;
                        console.log("SDK debugging status refreshed:", this.sdk_debugging_enabled);
                    } catch (e) {
                        console.warn("Could not get SDK debugging status:", e);
                    }

                    // Get system borders status
                    try {
                        this.system_borders_enabled = ipcRenderer.sendSync("read config", "systemBorders") || false;
                        console.log("System borders status refreshed:", this.system_borders_enabled);
                    } catch (e) {
                        console.warn("Could not get system borders status:", e);
                    }

                    // Get Sayonika server URL
                    try {
                        this.sayonika_server_url = ipcRenderer.sendSync("read config", "sayonikaServerUrl") || "https://sayonika.reconvial.dev";
                        this.sayonika_server_url_interim = this.sayonika_server_url;
                        console.log("Sayonika server URL refreshed:", this.sayonika_server_url);
                    } catch (e) {
                        console.warn("Could not get Sayonika server URL:", e);
                    }
                } else if (typeof ddmm !== 'undefined') {
                    if (ddmm.config) {
                        try {
                            this.sdk_debugging_enabled = ddmm.config.readConfigValue("sdkDebuggingEnabled") || false;
                            this.system_borders_enabled = ddmm.config.readConfigValue("systemBorders") || false;
                            this.sayonika_server_url = ddmm.config.readConfigValue("sayonikaServerUrl") || "https://sayonika.reconvial.dev";
                            this.sayonika_server_url_interim = this.sayonika_server_url;
                        } catch (e) {
                            console.warn("Could not get config values via ddmm:", e);
                        }
                    }
                }
            } catch (error) {
                console.error("Error refreshing settings:", error);
            }
        },

        // DDLC-themed icon methods
        "getSectionIcon": function(sectionHeader) {
            const iconMap = {
                "Appearance": "fas fa-palette",
                "Application": "fas fa-cog",
                "Enhancements": "fas fa-magic",
                "Developers": "fas fa-code"
            };
            return iconMap[sectionHeader] || "fas fa-star";
        },

        "getOptionIcon": function(optionId) {
            const iconMap = {
                "background": "fas fa-image",
                "ui_theme": "fas fa-palette",
                "advanced_appearance": "fas fa-sliders-h",
                "updates": "fas fa-download",
                "storage": "fas fa-folder",
                "sayonika_server": "fas fa-server",
                "sdk": "fas fa-tools",
                "testing": "fas fa-flask",
                "debug": "fas fa-bug"
            };
            return iconMap[optionId] || "fas fa-circle";
        },

        // UI Theme methods
        "setUITheme": function(theme) {
            console.log("Setting UI theme to:", theme);
            this.ui_theme = theme;

            // Save to config
            try {
                if (typeof ddmm !== 'undefined' && ddmm.config) {
                    ddmm.config.saveConfigValue("uiTheme", theme);
                } else if (typeof require !== 'undefined') {
                    const {ipcRenderer} = require("electron");
                    ipcRenderer.send("save config", {"key": "uiTheme", "value": theme});
                }

                // Apply theme to body
                this.applyUITheme(theme);

                const themeNames = {
                    'ddlc': 'DDLC',
                    'classic': 'Classic',
                    'monika': 'Monika',
                    'sayori': 'Sayori',
                    'natsuki': 'Natsuki',
                    'yuri': 'Yuri',
                    'cyberpunk': 'Cyberpunk',
                    'retro': 'Retro',
                    'midnight': 'Midnight',
                    'sunset': 'Sunset'
                };
                this.showNotification(`UI Theme changed to ${themeNames[theme] || theme}`, "success");
            } catch (error) {
                console.error("Error setting UI theme:", error);
                this.showNotification("Error changing UI theme: " + error.message, "error");
            }
        },

        "applyUITheme": function(theme) {
            // Use the global ThemeManager
            if (typeof window.ThemeManager !== 'undefined') {
                window.ThemeManager.applyUITheme(theme);
            } else {
                // Fallback to local implementation
                const body = document.body;

                // Remove existing theme classes
                const themeClasses = ['ddlc-theme', 'classic-theme', 'monika-theme', 'sayori-theme',
                                    'natsuki-theme', 'yuri-theme', 'cyberpunk-theme', 'retro-theme',
                                    'midnight-theme', 'sunset-theme'];
                body.classList.remove(...themeClasses);

                // Add new theme class
                if (theme === 'classic') {
                    body.classList.add('classic-theme');
                } else if (theme === 'monika') {
                    body.classList.add('monika-theme');
                } else if (theme === 'sayori') {
                    body.classList.add('sayori-theme');
                } else if (theme === 'natsuki') {
                    body.classList.add('natsuki-theme');
                } else if (theme === 'yuri') {
                    body.classList.add('yuri-theme');
                } else if (theme === 'cyberpunk') {
                    body.classList.add('cyberpunk-theme');
                } else if (theme === 'retro') {
                    body.classList.add('retro-theme');
                } else if (theme === 'midnight') {
                    body.classList.add('midnight-theme');
                } else if (theme === 'sunset') {
                    body.classList.add('sunset-theme');
                } else {
                    body.classList.add('ddlc-theme');
                }

                console.log("Applied UI theme:", theme);
            }
        },

        "showNotification": function(message, type = "info") {
            // Simple notification system - could be enhanced with a proper notification component
            console.log(`[${type.toUpperCase()}] ${message}`);

            // For now, just use alert for important messages
            if (type === "error") {
                alert("Error: " + message);
            } else if (type === "success") {
                // Could implement a toast notification here
                console.log("Success: " + message);
            }
        },

        // Load UI theme from config
        "loadUITheme": function() {
            try {
                let savedTheme = "ddlc"; // Default to DDLC theme

                if (typeof ddmm !== 'undefined' && ddmm.config) {
                    savedTheme = ddmm.config.readConfigValue("uiTheme") || "ddlc";
                } else if (typeof require !== 'undefined') {
                    const {ipcRenderer} = require("electron");
                    savedTheme = ipcRenderer.sendSync("read config", "uiTheme") || "ddlc";
                }

                this.ui_theme = savedTheme;

                // Use global ThemeManager if available
                if (typeof window.ThemeManager !== 'undefined') {
                    window.ThemeManager.applyUITheme(savedTheme);
                } else {
                    this.applyUITheme(savedTheme);
                }

                console.log("OptionsTab: Loaded UI theme:", savedTheme);
            } catch (error) {
                console.error("OptionsTab: Error loading UI theme:", error);
                // Default to DDLC theme on error
                this.ui_theme = "ddlc";

                if (typeof window.ThemeManager !== 'undefined') {
                    window.ThemeManager.applyUITheme("ddlc");
                } else {
                    this.applyUITheme("ddlc");
                }
            }
        }
    },

    "mounted": function () {
        if (!this.selected_option) {
            this.selected_option = this.menu[0].contents[0].id;
        }

        // Listen for the ddmm-ready event to update version and refresh data
        window.addEventListener('ddmm-ready', () => {
            console.log("OptionsTab: ddmm-ready event received");
            if (typeof ddmm !== 'undefined') {
                // Update version using the getVersionFromConfig method
                this.version = this.getVersionFromConfig();
                console.log("OptionsTab: Updated version to:", this.version);

                // Refresh debug info if available
                if (ddmm.debug) {
                    this.debug_info = ddmm.debug;
                }
                // Refresh backgrounds if available
                if (ddmm.app && ddmm.app.getBackgrounds) {
                    this.backgrounds = ddmm.app.getBackgrounds();
                }
                // Refresh SDK mode if available
                if (ddmm.config) {
                    this.sdk_mode_interim = ddmm.config.readConfigValue("sdkMode") || "always";
                    this.release_channel_interim = ddmm.config.readConfigValue("updateChannel") || "stable";
                }
                // Refresh all settings
                this.refreshSettings();
                this.$forceUpdate();
            }
        });

        // Also check if ddmm is already available
        if (typeof ddmm !== 'undefined') {
            console.log("OptionsTab: ddmm already available on mount");
            console.log("OptionsTab: ddmm object structure:", {
                version: ddmm.version,
                hasDebug: !!ddmm.debug,
                hasApp: !!ddmm.app,
                hasConfig: !!ddmm.config,

                appMethods: ddmm.app ? Object.keys(ddmm.app) : [],
                configMethods: ddmm.config ? Object.keys(ddmm.config) : [],

            });

            // Update version using the getVersionFromConfig method
            this.version = this.getVersionFromConfig();
            console.log("OptionsTab: Updated version on mount to:", this.version);

            if (ddmm.debug) {
                this.debug_info = ddmm.debug;
            }
            if (ddmm.app && ddmm.app.getBackgrounds) {
                this.backgrounds = ddmm.app.getBackgrounds();
            }
            if (ddmm.config) {
                this.sdk_mode_interim = ddmm.config.readConfigValue("sdkMode") || "always";
                this.release_channel_interim = ddmm.config.readConfigValue("updateChannel") || "stable";
            }
        } else {
            console.warn("OptionsTab: ddmm not available on mount");
            // Still try to get version from APP_CONFIG even if ddmm is not available
            this.version = this.getVersionFromConfig();
            console.log("OptionsTab: Updated version without ddmm to:", this.version);
        }

        // Refresh all settings to get current state
        this.refreshSettings();

        // Load and apply saved UI theme
        this.loadUITheme();

        // Set up event listener for update status changes
        if (typeof ddmm !== 'undefined' && ddmm.on) {
            ddmm.on("updating", (status) => {
                this.handleUpdateStatus(status);
            });
            console.log("OptionsTab: Update status event listener set up");
        } else {
            console.warn("OptionsTab: ddmm not available for update event listener");
        }
    }
});