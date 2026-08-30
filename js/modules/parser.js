/**
 * Parser Module
 * Handles Markdown parsing with GFM support, emoji, math, and Mermaid
 */

// GitHub octicon "copy" icon for code block headers
const COPY_ICON_SVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>';

/**
 * Markdown Parser with GitHub Flavored Markdown support
 */
export class Parser {
    constructor() {
        // Emoji map (subset - full map would be much larger)
        this.emojiMap = {
            'smile': '😄', 'laughing': '😆', 'blush': '😊', 'smiley': '😃',
            'relaxed': '☺️', 'smirk': '😏', 'heart_eyes': '😍', 'kissing_heart': '😘',
            'kissing_closed_eyes': '😚', 'flushed': '😳', 'relieved': '😌', 'satisfied': '😆',
            'grin': '😁', 'wink': '😉', 'stuck_out_tongue_winking_eye': '😜',
            'stuck_out_tongue_closed_eyes': '😝', 'grinning': '😀', 'kissing': '😗',
            'kissing_smiling_eyes': '😙', 'stuck_out_tongue': '😛', 'sleeping': '😴',
            'worried': '😟', 'frowning': '😦', 'anguished': '😧', 'open_mouth': '😮',
            'grimacing': '😬', 'confused': '😕', 'hushed': '😯', 'expressionless': '😑',
            'unamused': '😒', 'sweat_smile': '😅', 'sweat': '😓', 'disappointed_relieved': '😥',
            'weary': '😩', 'pensive': '😔', 'disappointed': '😞', 'confounded': '😖',
            'fearful': '😨', 'cold_sweat': '😰', 'persevere': '😣', 'cry': '😢',
            'sob': '😭', 'joy': '😂', 'astonished': '😲', 'scream': '😱',
            'tired_face': '😫', 'angry': '😠', 'rage': '😡', 'triumph': '😤',
            'sleepy': '😪', 'yum': '😋', 'mask': '😷', 'sunglasses': '😎',
            'dizzy_face': '😵', 'imp': '👿', 'smiling_imp': '😈', 'neutral_face': '😐',
            'no_mouth': '😶', 'innocent': '😇', 'alien': '👽', 'yellow_heart': '💛',
            'blue_heart': '💙', 'purple_heart': '💜', 'heart': '❤️', 'green_heart': '💚',
            'broken_heart': '💔', 'heartbeat': '💓', 'heartpulse': '💗', 'two_hearts': '💕',
            'revolving_hearts': '💞', 'cupid': '💘', 'sparkling_heart': '💖', 'sparkles': '✨',
            'star': '⭐', 'star2': '🌟', 'dizzy': '💫', 'boom': '💥', 'collision': '💥',
            'anger': '💢', 'exclamation': '❗', 'question': '❓', 'grey_exclamation': '❕',
            'grey_question': '❔', 'zzz': '💤', 'dash': '💨', 'sweat_drops': '💦',
            'notes': '🎶', 'musical_note': '🎵', 'fire': '🔥', 'hankey': '💩',
            'poop': '💩', 'shit': '💩', 'thumbsup': '👍', '+1': '👍', 'thumbsdown': '👎',
            '-1': '👎', 'ok_hand': '👌', 'punch': '👊', 'fist': '✊', 'v': '✌️',
            'wave': '👋', 'hand': '✋', 'raised_hand': '✋', 'open_hands': '👐',
            'point_up': '☝️', 'point_down': '👇', 'point_left': '👈', 'point_right': '👉',
            'raised_hands': '🙌', 'pray': '🙏', 'point_up_2': '👆', 'clap': '👏',
            'muscle': '💪', 'metal': '🤘', 'fu': '🖕', 'runner': '🏃', 'running': '🏃',
            'couple': '👫', 'family': '👪', 'two_men_holding_hands': '👬',
            'two_women_holding_hands': '👭', 'dancer': '💃', 'dancers': '👯',
            'ok_woman': '🙆', 'no_good': '🙅', 'information_desk_person': '💁',
            'raising_hand': '🙋', 'bride_with_veil': '👰', 'person_with_pouting_face': '🙎',
            'person_frowning': '🙍', 'bow': '🙇', 'couplekiss': '💏', 'couple_with_heart': '💑',
            'massage': '💆', 'haircut': '💇', 'nail_care': '💅', 'boy': '👦', 'girl': '👧',
            'woman': '👩', 'man': '👨', 'baby': '👶', 'older_woman': '👵', 'older_man': '👴',
            'cop': '👮', 'angel': '👼', 'princess': '👸', 'guardsman': '💂',
            'rocket': '🚀', 'airplane': '✈️', 'balloon': '🎈', 'tada': '🎉',
            'gift': '🎁', 'christmas_tree': '🎄', 'santa': '🎅', 'camera': '📷',
            'video_camera': '📹', 'computer': '💻', 'tv': '📺', 'iphone': '📱',
            'phone': '☎️', 'telephone': '☎️', 'email': '📧', 'envelope': '✉️',
            'memo': '📝', 'pencil': '📝', 'book': '📖', 'books': '📚',
            'art': '🎨', 'movie_camera': '🎥', 'microphone': '🎤', 'headphones': '🎧',
            'musical_score': '🎼', 'violin': '🎻', 'video_game': '🎮', 'space_invader': '👾',
            'dart': '🎯', 'game_die': '🎲', 'slot_machine': '🎰', 'bowling': '🎳',
            'warning': '⚠️', 'check': '✔️', 'x': '❌', 'heavy_check_mark': '✔️',
            'heavy_multiplication_x': '✖️', 'copyright': '©️', 'registered': '®️',
            'tm': '™️', 'hash': '#️⃣', 'keycap_ten': '🔟', 'zero': '0️⃣', 'one': '1️⃣',
            'two': '2️⃣', 'three': '3️⃣', 'four': '4️⃣', 'five': '5️⃣', 'six': '6️⃣',
            'seven': '7️⃣', 'eight': '8️⃣', 'nine': '9️⃣', 'arrow_up': '⬆️',
            'arrow_down': '⬇️', 'arrow_left': '⬅️', 'arrow_right': '➡️',
            'white_check_mark': '✅', 'clock1': '🕐', 'clock2': '🕑', 'clock3': '🕒',
            /* --- Extended GitHub shortcodes (gemoji) --- */
            'thinking': '🤔', 'nerd_face': '🤓', 'hugging_face': '🤗', 'upside_down_face': '🙃',
            'rolling_eyes': '🙄', 'exploding_head': '🤯', 'zany_face': '🤪', 'woozy_face': '🥴',
            'pleading_face': '🥺', 'drooling_face': '🤤', 'nauseated_face': '🤢', 'vomiting_face': '🤮',
            'sneezing_face': '🤧', 'hot_face': '🥵', 'cold_face': '🥶', 'partying_face': '🥳',
            'money_mouth_face': '🤑', 'zipper_mouth_face': '🤐', 'raised_eyebrow': '🤨', 'lying_face': '🤥',
            'hand_over_mouth': '🤭', 'shushing_face': '🤫', 'face_with_monocle': '🧐', 'slightly_smiling_face': '🙂',
            'sun_with_face': '🌞', 'crescent_moon': '🌙', 'new_moon': '🌑', 'full_moon': '🌕',
            'earth_africa': '🌍', 'earth_americas': '🌎', 'earth_asia': '🌏', 'sunny': '☀️',
            'partly_sunny': '⛅', 'cloud': '☁️', 'rainbow': '🌈', 'zap': '⚡',
            'snowflake': '❄️', 'snowman': '⛄', 'ocean': '🌊', 'seedling': '🌱',
            'herb': '🌿', 'cactus': '🌵', 'palm_tree': '🌴', 'evergreen_tree': '🌲',
            'deciduous_tree': '🌳', 'bouquet': '💐', 'cherry_blossom': '🌸', 'rose': '🌹',
            'hibiscus': '🌺', 'sunflower': '🌻', 'tulip': '🌷', 'blossom': '🌼',
            'four_leaf_clover': '🍀', 'maple_leaf': '🍁', 'fallen_leaf': '🍂', 'leaves': '🍃',
            'dog': '🐶', 'cat': '🐱', 'mouse': '🐭', 'hamster': '🐹',
            'rabbit': '🐰', 'fox_face': '🦊', 'bear': '🐻', 'panda_face': '🐼',
            'koala': '🐨', 'tiger': '🐯', 'lion': '🦁', 'cow': '🐮',
            'pig': '🐷', 'frog': '🐸', 'monkey_face': '🐵', 'monkey': '🐒',
            'chicken': '🐔', 'penguin': '🐧', 'bird': '🐦', 'baby_chick': '🐤',
            'eagle': '🦅', 'duck': '🦆', 'owl': '🦉', 'wolf': '🐺',
            'boar': '🐗', 'horse': '🐴', 'unicorn': '🦄', 'bee': '🐝',
            'bug': '🐛', 'butterfly': '🦋', 'snail': '🐌', 'beetle': '🐞',
            'ant': '🐜', 'spider': '🕷️', 'scorpion': '🦂', 'crab': '🦀',
            'snake': '🐍', 'turtle': '🐢', 'tropical_fish': '🐠', 'fish': '🐟',
            'blowfish': '🐡', 'dolphin': '🐬', 'shark': '🦈', 'whale': '🐳',
            'octopus': '🐙', 'shell': '🐚', 'coffee': '☕', 'tea': '🍵',
            'beer': '🍺', 'beers': '🍻', 'cocktail': '🍸', 'tropical_drink': '🍹',
            'wine_glass': '🍷', 'pizza': '🍕', 'hamburger': '🍔', 'fries': '🍟',
            'hotdog': '🌭', 'taco': '🌮', 'burrito': '🌯', 'apple': '🍎',
            'green_apple': '🍏', 'banana': '🍌', 'grapes': '🍇', 'watermelon': '🍉',
            'strawberry': '🍓', 'cherries': '🍒', 'peach': '🍑', 'mango': '🥭',
            'pineapple': '🍍', 'coconut': '🥥', 'avocado': '🥑', 'carrot': '🥕',
            'corn': '🌽', 'hot_pepper': '🌶️', 'cucumber': '🥒', 'mushroom': '🍄',
            'peanuts': '🥜', 'bread': '🍞', 'croissant': '🥐', 'pretzel': '🥨',
            'cheese': '🧀', 'egg': '🥚', 'bacon': '🥓', 'pancakes': '🥞',
            'cake': '🍰', 'birthday': '🎂', 'cupcake': '🧁', 'cookie': '🍪',
            'doughnut': '🍩', 'chocolate_bar': '🍫', 'candy': '🍬', 'lollipop': '🍭',
            'ice_cream': '🍨', 'icecream': '🍦', 'popcorn': '🍿', 'ramen': '🍜',
            'spaghetti': '🍝', 'sushi': '🍣', 'curry': '🍛', 'rice': '🍚',
            'rice_ball': '🍙', 'shipit': '🐿️', 'eyes': '👀', 'eye': '👁️',
            'brain': '🧠', 'lips': '👄', 'ear': '👂', 'nose': '👃',
            'footprints': '👣', 'speaking_head': '🗣️', 'thought_balloon': '💭', 'speech_balloon': '💬',
            'bust_in_silhouette': '👤', 'busts_in_silhouette': '👥', 'bulb': '💡', 'flashlight': '🔦',
            'candle': '🕯️', 'wastebasket': '🗑️', 'lock': '🔒', 'unlock': '🔓',
            'lock_with_ink_pen': '🔏', 'closed_lock_with_key': '🔐', 'key': '🔑', 'hammer': '🔨',
            'wrench': '🔧', 'nut_and_bolt': '🔩', 'gear': '⚙️', 'link': '🔗',
            'chains': '⛓️', 'scissors': '✂️', 'pushpin': '📌', 'round_pushpin': '📍',
            'paperclip': '📎', 'bookmark': '🔖', 'bookmark_tabs': '📑', 'newspaper': '📰',
            'page_facing_up': '📄', 'page_with_curl': '📃', 'scroll': '📜', 'clipboard': '📋',
            'calendar': '📅', 'chart_with_upwards_trend': '📈', 'chart_with_downwards_trend': '📉', 'bar_chart': '📊',
            'package': '📦', 'mailbox': '📫', 'inbox_tray': '📥', 'outbox_tray': '📤',
            'file_folder': '📁', 'open_file_folder': '📂', 'floppy_disk': '💾', 'cd': '💿',
            'dvd': '📀', 'battery': '🔋', 'electric_plug': '🔌', 'mag': '🔍',
            'mag_right': '🔎', 'microscope': '🔬', 'telescope': '🔭', 'satellite': '📡',
            'bell': '🔔', 'no_bell': '🔕', 'mega': '📣', 'loudspeaker': '📢',
            'hourglass': '⌛', 'watch': '⌚', 'alarm_clock': '⏰', 'stopwatch': '⏱️',
            'money_with_wings': '💸', 'dollar': '💵', 'moneybag': '💰', 'credit_card': '💳',
            'coin': '🪙', 'gem': '💎', 'car': '🚗', 'taxi': '🚕',
            'bus': '🚌', 'ship': '🚢', 'boat': '⛵', 'anchor': '⚓',
            'construction': '🚧', 'traffic_light': '🚥', 'rotating_light': '🚨', 'truck': '🚚',
            'tractor': '🚜', 'racing_car': '🏎️', 'motorcycle': '🏍️', 'bike': '🚲',
            'soccer': '⚽', 'basketball': '🏀', 'football': '🏈', 'baseball': '⚾',
            'tennis': '🎾', 'volleyball': '🏐', 'ping_pong': '🏓', 'badminton': '🏸',
            'ski': '🎿', 'snowboarder': '🏂', 'swimmer': '🏊', 'bicyclist': '🚴',
            'medal': '🏅', 'military_medal': '🎖️', 'trophy': '🏆', 'crown': '👑',
            'first_place_medal': '🥇', 'second_place_medal': '🥈', 'third_place_medal': '🥉',
            'facepalm': '🤦', 'shrug': '🤷', 'handshake': '🤝', 'vulcan_salute': '🖖',
            'love_you_gesture': '🤟', 'writing_hand': '✍️', 'ballot_box_with_check': '☑️',
            'heavy_plus_sign': '➕', 'heavy_minus_sign': '➖', 'heavy_division_sign': '➗',
            'no_entry': '⛔', 'no_entry_sign': '🚫', 'interrobang': '⁉️', 'bangbang': '‼️',
            '100': '💯', '1234': '🔢', '8ball': '🎱', 'keyboard': '⌨️',
            'desktop_computer': '🖥️', 'printer': '🖨️', 'triangular_flag_on_post': '🚩', 'crossed_flags': '🎌',
            'shower': '🚿', 'bathtub': '🛁', 'bed': '🛏️', 'toilet': '🚽',
            'door': '🚪', 'test_tube': '🧪', 'dna': '🧬', 'magnet': '🧲',
            'syringe': '💉', 'pill': '💊', 'adhesive_bandage': '🩹', 'stethoscope': '🩺',
            'mount_fuji': '🗻', 'statue_of_liberty': '🗽', 'european_castle': '🏰', 'japanese_castle': '🏯',
            'ferris_wheel': '🎡', 'roller_coaster': '🎢', 'tent': '⛺', 'map': '🗺️',
            'compass': '🧭', 'volcano': '🌋', 'mountain': '⛰️', 'house': '🏠',
            'office': '🏢', 'hospital': '🏥', 'bank': '🏦', 'hotel': '🏨',
            'school': '🏫', 'factory': '🏭', 'desert_island': '🏝️'
        };

        // Regex patterns for parsing
        // Block patterns:
        // - heading: Matches Markdown headings (#, ##, etc.)
        // - codeBlock: Matches fenced code blocks with language
        // - codeBlockStart/End: For incremental parsing
        // - blockquote: Matches blockquotes
        // - horizontalRule: Matches hr lines (---, ___, ***)
        // - unorderedList/orderedList/taskList: Matches lists and tasks
        // - table/tableSeparator: Matches Markdown tables
        // Inline patterns:
        // - bold/italic/strikethrough: Inline formatting, ReDoS protected
        // - inlineCode: Inline code spans
        // - link/image: Markdown links and images
        // - autolink/email: Auto-detect URLs and emails
        // - emoji: Emoji shortcodes
        // Math patterns:
        // - mathBlock/mathInline: LaTeX math blocks and inline
        // Mermaid:
        // - mermaidBlock: Mermaid diagram blocks
        this.patterns = {
            heading: /^(#{1,6})\s+(.+)$/,
            codeBlock: /^```(\w*)\n([\s\S]*?)```$/,
            codeBlockStart: /^```([\w+#-]*)\s*(.*)$/,
            codeBlockEnd: /^```$/,
            blockquote: /^>\s?(.*)$/,
            horizontalRule: /^(?:---+|___+|\*\*\*+)$/,
            unorderedList: /^(\s*)[-*+]\s+(.+)$/,
            orderedList: /^(\s*)(\d+)\.\s+(.+)$/,
            taskList: /^(\s*)[-*+]\s+\[([ xX])\]\s+(.+)$/,
            table: /^\|(.+)\|$/,
            tableSeparator: /^\|[\s-:|]+\|$/,

            bold: /\*\*(.+?)\*\*|__(.+?)__/g,
            italic: /\*([^\*\n]{1,1000}?)\*|_([^_\n]{1,1000}?)_/g, // Fixed: ReDoS protection
            strikethrough: /~~(.+?)~~/g,
            inlineCode: /`([^`]+)`/g,
            link: /\[([^\]]+)\]\(([^)]+)\)/g,
            image: /!\[([^\]]*)\]\(([^)]+)\)/g,
            autolink: /<(https?:\/\/[^>]+)>/g,
            email: /<([^@\s]+@[^>\s]+)>/g,
            emoji: /:([a-z0-9_+-]+):/gi,

            mathBlock: /\$\$\n?([\s\S]+?)\n?\$\$/g,
            mathInline: /\$([^\$\n]+)\$/g,

            mermaidBlock: /^```mermaid\n([\s\S]*?)```$/,

            // GitHub-specific patterns
            footnoteDef: /^\[\^([^\]\s]+)\]:\s*(.*)$/,
            detailsOpen: /^\s*<details(?:\s[^>]*)?>\s*$/i,
            detailsClose: /^\s*<\/details>\s*$/i
        };

        this.mermaidId = 0;

        // Base URL for GitHub auto-references (#123 issue links, commit SHA links).
        // Change this to your repository URL to match GitHub's linking behavior.
        this.repoUrl = 'https://github.com/oathanrex/markdown-editor';

        // Tracks heading slug usage for GitHub-style duplicate ids (id, id-1, ...)
        this.headingIdCounts = new Map();
    }

    /**
     * Parse Markdown to HTML
     * @param {string} markdown - Raw markdown text
     * @returns {string} - Rendered HTML
     */
    parse(markdown) {
        if (!markdown || typeof markdown !== 'string') {
            return '';
        }

        // Security: Limit document size to prevent DoS
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        if (new Blob([markdown]).size > MAX_SIZE) {
            console.error('Document too large');
            return '<div class="error">Document exceeds maximum size (10MB)</div>';
        }

        // Normalize line endings
        markdown = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // Reset heading id counters (GitHub-style duplicate slugs: id, id-1, ...)
        this.headingIdCounts = new Map();

        // Extract footnote definitions before block parsing (GitHub feature)
        const footnotes = this.extractFootnotes(markdown);

        // Parse block elements
        let html = this.parseBlocks(footnotes.markdown);

        // Replace footnote references and append the footnotes section
        html = this.renderFootnoteReferences(html, footnotes.definitions);

        // Sanitize HTML to prevent XSS
        html = this.sanitize(html);

        return html;
    }

    /**
     * Parse block-level elements
     * @param {string} markdown 
     * @returns {string}
     */
    parseBlocks(markdown) {
        const lines = markdown.split('\n');
        let html = '';
        let i = 0;
        let inCodeBlock = false;
        let codeBlockLang = '';
        let codeBlockInfo = '';
        let codeBlockContent = '';
        let inTable = false;
        let tableRows = [];
        let inBlockquote = false;
        let blockquoteContent = '';
        let inList = false;
        let listItems = [];
        let listType = '';
        let listIndent = 0;

        while (i < lines.length) {
            const line = lines[i];
            const currentLineIndex = i; // usage for data-source-line

            // Handle code blocks
            if (this.patterns.codeBlockStart.test(line) && !inCodeBlock) {
                // Flush pending
                html += this.flushBlockquote(inBlockquote, blockquoteContent);
                inBlockquote = false;
                blockquoteContent = '';
                html += this.flushList(inList, listItems, listType);
                inList = false;
                listItems = [];

                inCodeBlock = true;
                const startMatch = line.match(this.patterns.codeBlockStart);
                codeBlockLang = startMatch[1] || '';
                codeBlockInfo = startMatch[2] || '';
                codeBlockContent = '';
                // Store start line for the block
                this.currentBlockStartLine = currentLineIndex;
                i++;
                continue;
            }

            if (this.patterns.codeBlockEnd.test(line) && inCodeBlock) {
                // Check if it's mermaid
                if (codeBlockLang.toLowerCase() === 'mermaid') {
                    html += this.renderMermaid(codeBlockContent.trim(), this.currentBlockStartLine);
                } else {
                    html += this.renderCodeBlock(codeBlockContent, codeBlockLang, this.currentBlockStartLine, codeBlockInfo);
                }
                inCodeBlock = false;
                codeBlockLang = '';
                codeBlockInfo = '';
                codeBlockContent = '';
                i++;
                continue;
            }

            if (inCodeBlock) {
                codeBlockContent += (codeBlockContent ? '\n' : '') + line;
                i++;
                continue;
            }

            // Handle tables
            if (this.patterns.table.test(line)) {
                html += this.flushBlockquote(inBlockquote, blockquoteContent);
                inBlockquote = false;
                blockquoteContent = '';
                html += this.flushList(inList, listItems, listType);
                inList = false;
                listItems = [];

                if (!inTable) {
                    inTable = true;
                    tableRows = [];
                    this.currentBlockStartLine = currentLineIndex;
                }
                tableRows.push(line);
                i++;
                continue;
            } else if (inTable) {
                html += this.renderTable(tableRows, this.currentBlockStartLine);
                inTable = false;
                tableRows = [];
            }

            // Handle blockquotes
            if (this.patterns.blockquote.test(line)) {
                html += this.flushList(inList, listItems, listType);
                inList = false;
                listItems = [];

                const match = line.match(this.patterns.blockquote);
                // If starting new blockquote, track line
                if (!inBlockquote) {
                    this.currentBlockStartLine = currentLineIndex;
                }
                blockquoteContent += (blockquoteContent ? '\n' : '') + match[1];
                inBlockquote = true;
                i++;
                continue;
            } else if (inBlockquote) {
                html += this.flushBlockquote(true, blockquoteContent, this.currentBlockStartLine);
                inBlockquote = false;
                blockquoteContent = '';
            }

            // Handle headings
            if (this.patterns.heading.test(line)) {
                html += this.flushList(inList, listItems, listType);
                inList = false;
                listItems = [];

                const match = line.match(this.patterns.heading);
                const level = match[1].length;
                const text = this.parseInline(match[2]);
                const id = this.slugifyGitHub(match[2]);
                html += `<h${level} id="${id}" data-source-line="${currentLineIndex}"><a class="heading-anchor" href="#${id}">#</a>${text}</h${level}>`;
                i++;
                continue;
            }

            // Handle horizontal rules
            if (this.patterns.horizontalRule.test(line.trim())) {
                html += this.flushList(inList, listItems, listType);
                inList = false;
                listItems = [];
                html += `<hr data-source-line="${currentLineIndex}">`;
                i++;
                continue;
            }

            // Handle task lists
            const taskMatch = line.match(this.patterns.taskList);
            if (taskMatch) {
                if (!inList || listType !== 'task') {
                    html += this.flushList(inList, listItems, listType);
                    inList = true;
                    listType = 'task';
                    listItems = [];
                }
                const checked = taskMatch[2].toLowerCase() === 'x';
                listItems.push({
                    indent: taskMatch[1].length,
                    content: taskMatch[3],
                    checked: checked,
                    line: currentLineIndex
                });
                i++;
                continue;
            }

            // Handle unordered lists
            const ulMatch = line.match(this.patterns.unorderedList);
            if (ulMatch && !this.patterns.taskList.test(line)) {
                if (!inList || listType !== 'ul') {
                    html += this.flushList(inList, listItems, listType);
                    inList = true;
                    listType = 'ul';
                    listItems = [];
                }
                listItems.push({
                    indent: ulMatch[1].length,
                    content: ulMatch[2],
                    line: currentLineIndex
                });
                i++;
                continue;
            }

            // Handle ordered lists
            const olMatch = line.match(this.patterns.orderedList);
            if (olMatch) {
                if (!inList || listType !== 'ol') {
                    html += this.flushList(inList, listItems, listType);
                    inList = true;
                    listType = 'ol';
                    listItems = [];
                }
                listItems.push({
                    indent: olMatch[1].length,
                    content: olMatch[3],
                    number: parseInt(olMatch[2]),
                    line: currentLineIndex
                });
                i++;
                continue;
            }

            // Flush list if we hit a non-list line
            if (inList) {
                html += this.flushList(inList, listItems, listType);
                inList = false;
                listItems = [];
            }

            // Handle <details> collapsible sections (GitHub feature)
            if (this.patterns.detailsOpen.test(line)) {
                const innerLines = [];
                let j = i + 1;
                let closed = false;
                while (j < lines.length) {
                    if (this.patterns.detailsClose.test(lines[j])) {
                        closed = true;
                        break;
                    }
                    innerLines.push(lines[j]);
                    j++;
                }

                let content = innerLines.join('\n');
                let summary = 'Details';
                const sumMatch = content.match(/^\s*<summary>([\s\S]*?)<\/summary>\s*/i);
                if (sumMatch) {
                    summary = this.parseInline(sumMatch[1].trim());
                    content = content.slice(sumMatch[0].length);
                }

                html += `<details class="gfm-details"><summary>${summary}</summary>${this.parseBlocks(content)}</details>`;
                i = closed ? j + 1 : lines.length;
                continue;
            }

            // Handle empty lines
            if (line.trim() === '') {
                i++;
                continue;
            }

            // Handle paragraphs
            let paragraph = line;
            const paragraphStartLine = currentLineIndex;
            while (i + 1 < lines.length &&
                lines[i + 1].trim() !== '' &&
                !this.isBlockElement(lines[i + 1]) &&
                !this.isSetextUnderline(lines[i + 1])) {
                i++;
                paragraph += ' ' + lines[i];
            }

            // Setext headings (GitHub/CommonMark): "Title" followed by === or ---
            if (i + 1 < lines.length && /^\s{0,3}=+\s*$/.test(lines[i + 1])) {
                const id = this.slugifyGitHub(paragraph);
                html += `<h1 id="${id}" data-source-line="${paragraphStartLine}"><a class="heading-anchor" href="#${id}">#</a>${this.parseInline(paragraph)}</h1>`;
                i += 2;
                continue;
            }
            if (i + 1 < lines.length && /^\s{0,3}-{3,}\s*$/.test(lines[i + 1])) {
                const id = this.slugifyGitHub(paragraph);
                html += `<h2 id="${id}" data-source-line="${paragraphStartLine}"><a class="heading-anchor" href="#${id}">#</a>${this.parseInline(paragraph)}</h2>`;
                i += 2;
                continue;
            }

            html += `<p data-source-line="${paragraphStartLine}">${this.parseInline(paragraph)}</p>`;
            i++;
        }

        // Flush remaining content
        if (inCodeBlock) {
            html += this.renderCodeBlock(codeBlockContent, codeBlockLang, this.currentBlockStartLine, codeBlockInfo);
        }
        if (inTable) {
            html += this.renderTable(tableRows, this.currentBlockStartLine);
        }
        if (inBlockquote) {
            html += this.flushBlockquote(true, blockquoteContent, this.currentBlockStartLine);
        }
        if (inList) {
            html += this.flushList(true, listItems, listType);
        }

        return html;
    }

    /**
     * Check if a line is a block element
     */
    isBlockElement(line) {
        return this.patterns.heading.test(line) ||
            this.patterns.codeBlockStart.test(line) ||
            this.patterns.blockquote.test(line) ||
            this.patterns.horizontalRule.test(line.trim()) ||
            this.patterns.unorderedList.test(line) ||
            this.patterns.orderedList.test(line) ||
            this.patterns.table.test(line) ||
            this.patterns.taskList.test(line) ||
            this.patterns.detailsOpen.test(line) ||
            this.patterns.detailsClose.test(line);
    }

    /**
     * Check if a line is a setext heading underline (=== or ---)
     */
    isSetextUnderline(line) {
        return /^\s{0,3}(?:=+|-{3,})\s*$/.test(line);
    }

    /**
     * Parse inline elements
     */
    parseInline(text) {
        if (!text) return '';

        // Escape HTML first
        text = this.escapeHtml(text);

        // Stash generated HTML behind placeholders so later passes
        // (formatting, autolinks, emoji) cannot corrupt it
        const fragments = [];
        const stash = (html) => {
            fragments.push(html);
            return `\x00${(fragments.length - 1).toString(36)}\x00`;
        };

        // Inline code FIRST (GFM: nothing inside code spans gets formatted)
        text = text.replace(/`([^`]+)`/g, (match, code) => stash(`<code>${code}</code>`));

        // Math (before other transformations)
        text = text.replace(/\$\$([^$]+)\$\$/g, (match, math) => stash(
            `<span class="math-block" data-math="${this.escapeHtml(math)}">${this.escapeHtml(math)}</span>`));
        text = text.replace(/\$([^$\n]+)\$/g, (match, math) => stash(
            `<span class="math-inline" data-math="${this.escapeHtml(math)}">${this.escapeHtml(math)}</span>`));

        // Images (before links to prevent conflict)
        text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => stash(`<img src="${src}" alt="${alt}">`));

        // Links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, href) => stash(`<a href="${href}" target="_blank" rel="noopener">${label}</a>`));

        // Explicit autolinks <https://...> and <user@example.com>
        text = text.replace(/&lt;(https?:\/\/[^&]+)&gt;/g, (match, url) => stash(`<a href="${url}" target="_blank" rel="noopener">${url}</a>`));
        text = text.replace(/&lt;([\w.+-]+@[\w-]+(?:\.[\w-]+)+)&gt;/g, (match, email) => stash(`<a href="mailto:${email}">${email}</a>`));

        // Bare URL autolinks (GFM): https://... and www....
        text = text.replace(/(^|[\s(])((?:https?:\/\/|www\.)[^\s<>()\[\]]*[^\s<>()\[\].,;:!?'"])/gi, (match, pre, url) => {
            const href = /^www\./i.test(url) ? `https://${url}` : url;
            return pre + stash(`<a href="${href}" target="_blank" rel="noopener">${url}</a>`);
        });

        // Bare email autolinks (GFM)
        text = text.replace(/(^|[\s(<])([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g, (match, pre, email) => {
            return pre + stash(`<a href="mailto:${email}">${email}</a>`);
        });

        // GitHub @mentions -> github.com profiles
        text = text.replace(/(^|[^\w@.])@([A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?)(?![\w-])/g, (match, pre, user) => {
            return pre + stash(`<a href="https://github.com/${user}" target="_blank" rel="noopener">@${user}</a>`);
        });

        // GitHub issue/PR references #123
        text = text.replace(/(^|[^\w&;])#(\d+)\b/g, (match, pre, num) => {
            return pre + stash(`<a href="${this.repoUrl}/issues/${num}" target="_blank" rel="noopener">#${num}</a>`);
        });

        // GitHub commit SHAs (7-40 hex chars containing at least one digit)
        text = text.replace(/\b([a-f0-9]{7,40})\b/g, (match, sha) => {
            if (!/\d/.test(sha)) return match;
            return stash(`<a href="${this.repoUrl}/commit/${sha}" target="_blank" rel="noopener">${sha}</a>`);
        });

        // Bold
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

        // Italic (careful not to match inside words with underscores)
        text = text.replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, '<em>$1</em>');
        text = text.replace(/(?<!\w)_([^_]+)_(?!\w)/g, '<em>$1</em>');

        // Strikethrough
        text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');

        // Emoji
        text = text.replace(/:([a-z0-9_+-]+):/gi, (match, name) => {
            const emoji = this.emojiMap[name.toLowerCase()];
            return emoji || match;
        });

        // Line breaks (two spaces at end of line)
        text = text.replace(/  $/gm, '<br>');

        // Restore stashed fragments
        text = text.replace(/\x00([0-9a-z]+)\x00/g, (match, index) => fragments[parseInt(index, 36)] || match);

        return text;
    }

    /**
     * Parse inline math
     */
    parseMathInline(text) {
        // Block math ($$...$$)
        text = text.replace(/\$\$([^$]+)\$\$/g, (match, math) => {
            return `<span class="math-block" data-math="${this.escapeHtml(math)}">${this.escapeHtml(math)}</span>`;
        });

        // Inline math ($...$)
        text = text.replace(/\$([^$\n]+)\$/g, (match, math) => {
            return `<span class="math-inline" data-math="${this.escapeHtml(math)}">${this.escapeHtml(math)}</span>`;
        });

        return text;
    }

    /**
     * Render code block with syntax highlighting
     */
    renderCodeBlock(code, language, line, info = '') {
        const langClass = language ? `language-${language}` : '';
        const escapedCode = this.escapeHtml(code);
        const lineAttr = line !== undefined ? ` data-source-line="${line}"` : '';

        // GitHub-style label: filename (title="x", filename=x, or a bare
        // "name.ext" token) wins over the plain language name
        let label = language || '';
        const titleMatch = info.match(/(?:^|\s)(?:title|filename|file)\s*=\s*"?([^"\s]+)"?/i);
        if (titleMatch) {
            label = titleMatch[1];
        } else if (info.trim() && /\.[A-Za-z0-9]+$/.test(info.trim())) {
            label = info.trim();
        }

        return `<div class="code-block-wrapper"${lineAttr}>
                <div class="code-block-header">
                    ${label ? `<span class="code-language">${this.escapeHtml(label)}</span>` : ''}
                    <button class="copy-code-btn" type="button" aria-label="Copy code" title="Copy code">${COPY_ICON_SVG}</button>
                </div>
                <pre><code class="${langClass}">${escapedCode}</code></pre>
            </div>`;
    }

    /**
     * Render Mermaid diagram placeholder
     */
    renderMermaid(code, line) {
        const id = `mermaid-${++this.mermaidId}`;
        const lineAttr = line !== undefined ? ` data-source-line="${line}"` : '';
        return `<div class="mermaid" id="${id}" data-mermaid="${this.escapeHtml(code)}"${lineAttr}>${this.escapeHtml(code)}</div>`;
    }

    /**
     * Render table
     */
    renderTable(rows, line) {
        if (rows.length < 2) return '';

        const lineAttr = line !== undefined ? ` data-source-line="${line}"` : '';
        let html = `<table${lineAttr}>`;
        let isHeader = true;
        let alignments = [];
        let inThead = false;
        let inTbody = false;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            // Check if this is the separator row
            if (this.patterns.tableSeparator.test(row)) {
                // Parse alignments
                const cells = row.slice(1, -1).split('|');
                alignments = cells.map(cell => {
                    cell = cell.trim();
                    if (cell.startsWith(':') && cell.endsWith(':')) return 'center';
                    if (cell.endsWith(':')) return 'right';
                    return 'left';
                });
                isHeader = false;
                continue;
            }

            const cells = row.slice(1, -1).split('|').map(c => c.trim());
            const tag = isHeader ? 'th' : 'td';

            // Open <thead>/<tbody> exactly once, at the right moment
            if (isHeader && !inThead) {
                html += '<thead>';
                inThead = true;
            }
            if (!isHeader && inThead) {
                html += '</thead>';
                inThead = false;
            }
            if (!isHeader && !inTbody) {
                html += '<tbody>';
                inTbody = true;
            }

            html += '<tr>';
            cells.forEach((cell, j) => {
                const align = alignments[j] ? ` style="text-align: ${alignments[j]}"` : '';
                html += `<${tag}${align}>${this.parseInline(cell)}</${tag}>`;
            });
            html += '</tr>';
        }

        if (inTbody) html += '</tbody>';
        if (inThead) html += '</thead>';
        html += '</table>';
        return html;
    }

    /**
     * Flush blockquote content
     */
    flushBlockquote(inBlockquote, content, line) {
        if (!inBlockquote || !content) return '';

        // GitHub alerts: > [!NOTE] / [!TIP] / [!IMPORTANT] / [!WARNING] / [!CAUTION]
        const alertMatch = content.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(\n|$)/i);
        if (alertMatch) {
            const type = alertMatch[1].toLowerCase();
            const title = alertMatch[1][0] + alertMatch[1].slice(1).toLowerCase();
            const innerHtml = this.parseBlocks(content.slice(alertMatch[0].length));
            const alertAttr = line !== undefined ? ` data-source-line="${line}"` : '';
            return `<div class="gfm-alert gfm-alert-${type}" role="note"${alertAttr}><p class="gfm-alert-title">${title}</p>${innerHtml}</div>`;
        }

        const innerHtml = this.parseBlocks(content);
        const lineAttr = line !== undefined ? ` data-source-line="${line}"` : '';
        return `<blockquote${lineAttr}>${innerHtml}</blockquote>`;
    }

    /**
     * Flush list content
     */
    flushList(inList, items, type) {
        if (!inList || items.length === 0) return '';

        const tag = type === 'ol' ? 'ol' : 'ul';
        const lineAttr = items[0]?.line !== undefined ? ` data-source-line="${items[0].line}"` : '';
        let html = `<${tag}${lineAttr}>`;

        items.forEach(item => {
            if (type === 'task') {
                const checked = item.checked ? ' checked' : '';
                html += `<li class="task-list-item"><input type="checkbox"${checked} disabled> ${this.parseInline(item.content)}</li>`;
            } else {
                html += `<li>${this.parseInline(item.content)}</li>`;
            }
        });

        html += `</${tag}>`;
        return html;
    }

    /**
     * Create URL-friendly slug from text
     */
    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * GitHub-style heading slug with duplicate handling (id, id-1, id-2, ...)
     */
    slugifyGitHub(text) {
        const base = String(text).trim()
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s/g, '-') || 'section';
        const count = this.headingIdCounts.get(base) || 0;
        this.headingIdCounts.set(base, count + 1);
        return count === 0 ? base : `${base}-${count}`;
    }

    /**
     * Extract footnote definitions (GitHub feature).
     * Removes them from the markdown and returns a map of id -> content.
     */
    extractFootnotes(markdown) {
        const definitions = new Map();
        const lines = markdown.split('\n');
        const out = [];
        let capturing = null;
        let inCode = false;

        for (const line of lines) {
            // Skip fenced code blocks so definitions inside code are untouched
            if (this.patterns.codeBlockStart.test(line)) {
                inCode = !inCode;
                out.push(line);
                continue;
            }
            if (inCode) {
                out.push(line);
                continue;
            }

            const def = line.match(this.patterns.footnoteDef);
            if (def) {
                capturing = def[1];
                const existing = definitions.get(capturing);
                definitions.set(capturing, existing ? `${existing}\n${def[2]}` : def[2]);
                continue;
            }
            if (capturing !== null && /^\s{4,}\S/.test(line)) {
                // Continuation lines of a footnote definition (indented)
                definitions.set(capturing, `${definitions.get(capturing)}\n${line.trim()}`);
                continue;
            }
            capturing = null;
            out.push(line);
        }

        return { markdown: out.join('\n'), definitions };
    }

    /**
     * Render footnote references and the footnotes section (GitHub feature).
     * References inside code blocks/spans are left untouched.
     */
    renderFootnoteReferences(html, definitions) {
        if (!definitions || definitions.size === 0) return html;

        const numbers = new Map();
        const safeId = (id) => id.replace(/[^\w-]/g, '-');
        // Split out code blocks/spans so references inside them are not replaced
        const parts = html.split(/(<code[\s\S]*?<\/code>|<pre[\s\S]*?<\/pre>)/g);

        for (let p = 0; p < parts.length; p += 2) {
            parts[p] = parts[p].replace(/\[\^([^\]\s]+)\]/g, (match, id) => {
                if (!definitions.has(id)) return match;
                if (!numbers.has(id)) numbers.set(id, numbers.size + 1);
                const sid = safeId(id);
                return `<sup class="footnote-ref"><a href="#fn-${sid}" id="fnref-${sid}" aria-label="Footnote ${numbers.get(id)}">${numbers.get(id)}</a></sup>`;
            });
        }

        html = parts.join('');
        if (numbers.size === 0) return html;

        let section = '<section class="footnotes" role="doc-endnotes"><ol>';
        for (const [id, n] of numbers) {
            const content = this.parseInline(definitions.get(id));
            const sid = safeId(id);
            section += `<li id="fn-${sid}" role="doc-endnote">${content} <a href="#fnref-${sid}" class="footnote-backref" aria-label="Back to footnote reference ${n}">↩</a></li>`;
        }
        section += '</ol></section>';
        return html + section;
    }

    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return text.replace(/[&<>"']/g, char => map[char]);
    }

    /**
     * Sanitize HTML to prevent XSS
     */
    sanitize(html) {
        if (typeof DOMPurify !== 'undefined') {
            return DOMPurify.sanitize(html, {
                ADD_TAGS: ['mermaid', 'math-inline', 'math-block'],
                ADD_ATTR: ['data-math', 'data-mermaid', 'target', 'rel', 'class', 'id', 'data-source-line'],
                ALLOW_DATA_ATTR: true,
                FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
                FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onmouseenter', 'onmouseleave']
            });
        }

        // Fallback: Strip dangerous content when DOMPurify is unavailable
        // (warn once to avoid console spam on every parse call)
        if (!Parser._dompurifyWarned) {
            Parser._dompurifyWarned = true;
            console.warn('DOMPurify unavailable - using fallback sanitization');
        }
        return html
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
            .replace(/<object[\s\S]*?<\/object>/gi, '')
            .replace(/<embed[\s\S]*?>/gi, '')
            .replace(/on\w+\s*=/gi, 'data-blocked-event=')
            .replace(/javascript:/gi, 'blocked:');
    }

    /**
     * Extract headings for TOC
     */
    extractHeadings(markdown) {
        const headings = [];
        const lines = markdown.split('\n');
        let inCode = false;
        let prevText = null; // last plain-text line, for setext heading detection

        // Reset counters so TOC ids match rendered heading ids exactly
        this.headingIdCounts = new Map();

        lines.forEach(line => {
            // Skip fenced code blocks (existing bug fix: "# comment" in code
            // used to appear in the TOC)
            if (this.patterns.codeBlockStart.test(line)) {
                inCode = !inCode;
                prevText = null;
                return;
            }
            if (inCode) return;

            // Strip blockquote markers so inner headings match rendered ids
            const stripped = line.replace(/^\s*(?:>\s?)+/, '');

            if (stripped.trim() === '') {
                prevText = null;
                return;
            }

            // Setext underlines (=== / ---) heading the previous text line
            if (prevText !== null && /^\s{0,3}=+\s*$/.test(stripped)) {
                headings.push({
                    level: 1,
                    text: prevText.replace(/[*_`~]/g, ''),
                    id: this.slugifyGitHub(prevText)
                });
                prevText = null;
                return;
            }
            if (prevText !== null && /^\s{0,3}-{3,}\s*$/.test(stripped)) {
                headings.push({
                    level: 2,
                    text: prevText.replace(/[*_`~]/g, ''),
                    id: this.slugifyGitHub(prevText)
                });
                prevText = null;
                return;
            }

            const match = stripped.match(this.patterns.heading);
            if (match) {
                headings.push({
                    level: match[1].length,
                    text: match[2].replace(/[*_`~]/g, ''),
                    id: this.slugifyGitHub(match[2])
                });
                prevText = null;
                return;
            }

            if (this.isBlockElement(stripped)) {
                prevText = null;
                return;
            }

            // Plain text line: accumulate for possible setext heading
            prevText = prevText === null ? stripped.trim() : `${prevText} ${stripped.trim()}`;
        });
        return headings;
    }

    /**
     * Get word count from markdown
     */
    getWordCount(markdown) {
        const text = markdown
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .replace(/`[^`]+`/g, '') // Remove inline code
            .replace(/!?\[([^\]]*)\]\([^)]+\)/g, '$1') // Links/images to text
            .replace(/[#*_~`>|]/g, '') // Remove markdown symbols
            .trim();

        if (!text) return 0;
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }

    /**
     * Get character count
     */
    getCharCount(markdown) {
        return markdown.length;
    }
}

