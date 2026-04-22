// ============================================================
// DEPOIS DISSO, AQUI COMEÇA O CÓDIGO ORIGINAL
// ============================================================
export class NeuroPulseProfile {
    constructor() {
        this.currentUser = null;
        this.isInitialized = false;
        this.storageKeys = {
            CURRENT_USER: 'neuropulse_current_user',
            USER_PROFILE: 'neuropulse_user_profile',
            THEME: 'neuropulse_theme',
            ACHIEVEMENTS: 'neuropulse_achievements',
            PLAYLISTS: 'neuropulse_playlists',
            ACTIVITIES: 'neuropulse_activities'
        };
        this.init();
    }
}
