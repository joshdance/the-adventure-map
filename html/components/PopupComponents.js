export const LevelSelector = {
    template: `
        <div id="setlevel" 
             :class="{'is-visible': isVisible}"
             :style="[
                 positionStyle,
                 {
                     display: isVisible ? 'block' : 'none',
                     backgroundColor: 'white',
                     border: '1px solid black',
                     padding: '10px',
                     position: 'absolute',
                     zIndex: 1000
                 }
             ]">
            <h2>{{ title }}</h2>
            <a v-for="level in levels" 
               :key="level.value" 
               :data-level="level.value"
               :alt="level.alt"
               @click="selectLevel(level)"
               style="cursor: pointer; display: block; padding: 5px;">
                {{ level.label }}
            </a>
        </div>
    `,
    data() {
        return {
            isVisible: false,
            title: '',
            minSpacing: 6,
            selectedElement: null,
            currentPosition: null
        }
    },
    computed: {
        levels() {
            return [
                { value: '5', label: this.$t('message.data_level_5') },
                { value: '4', label: this.$t('message.data_level_4') },
                { value: '3', label: this.$t('message.data_level_3') },
                { value: '2', label: this.$t('message.data_level_2') },
                { value: '1', label: this.$t('message.data_level_1') },
                { value: '0', label: this.$t('message.data_level_0_alt'), alt: true },
                { value: '0', label: this.$t('message.data_level_0') }
            ]
        },
        positionStyle() {
            if (!this.currentPosition) return {}
            
            let { left, top } = this.currentPosition
            
            // Constrain to viewport
            left = Math.min(
                left,
                document.body.offsetWidth - this.$el.offsetWidth - this.minSpacing
            )
            left = Math.max(left, this.minSpacing)
            
            top = Math.min(
                top,
                document.body.offsetHeight - this.$el.offsetHeight - this.minSpacing
            )
            top = Math.max(top, this.minSpacing)
            
            return {
                left: left + 'px',
                top: top + 'px'
            }
        }
    },
    methods: {
        show(element, id, position) {
            console.log('LevelSelector show called:', {
                element,
                id,
                position,
                isVisible: this.isVisible,
                elementInDOM: document.getElementById('setlevel'),
                componentEl: this.$el
            });
            
            this.selectedElement = element;
            this.title = this.$t(`country_name.${id}`);
            this.currentPosition = position;
            this.isVisible = true;
            
            // Force a DOM update and check visibility
            this.$nextTick(() => {
                console.log('After nextTick:', {
                    isVisible: this.isVisible,
                    elementVisible: this.$el.style.display !== 'none',
                    position: this.$el.style.left,
                    elementInDOM: document.getElementById('setlevel')
                });
            });
        },
        hide() {
            this.isVisible = false
            this.selectedElement = null
            this.currentPosition = null
        },
        selectLevel(level) {
            if (!this.selectedElement) return
            
            this.selectedElement.setAttribute('level', level.value)
            this.selectedElement.setAttribute('alt', level.alt || false)
            
            this.$emit('level-selected')
            this.hide()
        }
    },
    mounted() {
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.$el.contains(e.target)) {
                this.hide()
            }
        })
    }
}

export const LanguageSelector = {
    template: `
        <div id="Set_Lang" v-show="isVisible" :style="positionStyle">
            <a v-for="lang in languages" 
               :key="lang"
               :lang="lang"
               :style="{ background: currentLanguage === lang ? '#aaa' : '#fff' }"
               @click="selectLanguage(lang)">
                {{ lang }}
            </a>
        </div>
    `,
    data() {
        return {
            isVisible: false,
            languages: ['English', '繁體中文', '简体中文', '日本語', 'French', 'Español', 'Danish', 'עברית'],
            minSpacing: 6,
            currentPosition: null
        }
    },
    computed: {
        currentLanguage() {
            return this.$i18n.locale
        },
        positionStyle() {
            if (!this.currentPosition) return {}
            
            let { left, top } = this.currentPosition
            
            left = Math.min(
                left,
                document.body.offsetWidth - this.$el.offsetWidth - this.minSpacing
            )
            left = Math.max(left, this.minSpacing)
            
            top = Math.min(
                top,
                document.body.offsetHeight - this.$el.offsetHeight - this.minSpacing
            )
            top = Math.max(top, this.minSpacing)
            
            return {
                left: left + 'px',
                top: top + 'px'
            }
        }
    },
    methods: {
        show(position) {
            this.currentPosition = position
            this.isVisible = true
        },
        hide() {
            this.isVisible = false
            this.currentPosition = null
        },
        selectLanguage(lang) {
            this.$i18n.locale = lang
            this.$emit('language-selected', lang)
            this.hide()
        }
    },
    mounted() {
        document.addEventListener('click', (e) => {
            if (!this.$el.contains(e.target)) {
                this.hide()
            }
        })
    }
} 