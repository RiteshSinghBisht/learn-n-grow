/* ===========================
   LEARN N GROW — PREMIUM DARK
   =========================== */
(() => {
    'use strict';

    // ---- Shorthand ----
    const $ = (s, p = document) => p.querySelector(s);
    const $$ = (s, p = document) => [...p.querySelectorAll(s)];

    // ---- Mock Data ----
    const MOCK = {
        student: {
            name: 'Ritesh Singh',
            email: 'ritesh@example.com',
            phone: '+91 98765 43210',
            memberSince: 'January 2026',
        },
        stats: {
            // These will now be loaded from localStorage
            fluent: 0,
            khushi: 0,
            total: 0,
        },
        improvement: {
            labels: ['Tenses', 'Articles', 'Prepositions', 'Subject-Verb', 'Vocabulary', 'Sentence Structure'],
            // Initial mock data if nothing in storage
            data: [45, 30, 60, 55, 40, 50],
        },
        fluentResponses: [
            "That's a great question! The present perfect tense ('have done') connects the past to the present — it describes something that started in the past and is still relevant now. The past simple ('did') describes a completed action at a specific past time.\n\nFor example:\n• \"I have lived here for 5 years.\" (still living here)\n• \"I lived there in 2020.\" (no longer living there)",
            "Good observation! 'Since' is used with a specific point in time (since Monday, since 2020), while 'for' is used with a duration (for 3 days, for a year). Both are commonly used with the present perfect tense.",
            "Let me explain! 'Much' is used with uncountable nouns (much water, much time), while 'many' is used with countable nouns (many books, many people). A simple rule: if you can count it, use 'many'.",
            "The difference between 'affect' and 'effect': 'Affect' is usually a verb meaning to influence something. 'Effect' is usually a noun meaning the result. Remember: Affect = Action, Effect = End result.",
            "Great question about articles! Use 'a' before consonant sounds and 'an' before vowel sounds. 'The' is used when referring to something specific that both speaker and listener know about.",
        ],
        khushiResponses: [
            "That's wonderful to hear! Tell me more about your day. What did you do this morning? I'll help you express it naturally in English. 😊",
            "Nice try! Just a small correction — instead of saying \"I goed to the market\", you should say \"I went to the market\". 'Go' has an irregular past tense. Keep going, you're doing great!",
            "I love that you're practicing! Here's a more natural way to say that: \"I enjoy spending time with my friends on weekends.\" The key is using 'enjoy + verb-ing' for activities you like.",
            "That's a perfectly formed sentence! Your English is really improving. I noticed you used the correct tense and preposition. Let's try a slightly more complex sentence structure next.",
            "Interesting! When talking about your hobbies, you can say: \"I'm into reading\" or \"I'm passionate about cooking\". These sound more natural than just saying \"I like...\" all the time.",
        ],
    };

    // ---- State ----
    let currentUser = null;
    let currentPage = 'auth';
    let currentUid = null;

    // ---- Firestore Helpers ----
    function getUserDocRef() {
        if (!currentUid) return null;
        return db.collection('users').doc(currentUid);
    }

    async function loadUserData(firebaseUser) {
        const ref = getUserDocRef();
        if (!ref) return null;
        try {
            const doc = await ref.get();
            if (doc.exists) {
                return doc.data();
            } else {
                // First time user — create document with defaults
                const storedPhone = localStorage.getItem('temp_signup_phone');
                const storedFirst = localStorage.getItem('temp_signup_firstname');
                const storedLast = localStorage.getItem('temp_signup_lastname');

                const defaults = {
                    fluentSessions: 0,
                    khushiSessions: 0,
                    profilePhoto: '',
                    phone: storedPhone || '',
                    firstName: storedFirst || '',
                    lastName: storedLast || ''
                };

                // Clear temp storage
                localStorage.removeItem('temp_signup_phone');
                localStorage.removeItem('temp_signup_firstname');
                localStorage.removeItem('temp_signup_lastname');

                await ref.set(defaults);

                // Trigger n8n webhook for new user onboarding
                if (firebaseUser) {
                    sendUserToN8N(firebaseUser, defaults.phone, defaults.firstName, defaults.lastName);
                }

                return defaults;
            }
        } catch (err) {
            console.error('Firestore read error:', err);
            return null;
        }
    }

    // ---- n8n Webhook Integration ----
    function sendUserToN8N(user, phoneOverride = '', firstName = '', lastName = '') {
        // Replace this URL with your actual n8n webhook URL
        const WEBHOOK_URL = 'https://n8n.ritesh-ai-automation.in/webhook/new-user';

        const payload = {
            uid: user.uid,
            email: user.email,
            firstName: firstName || user.displayName?.split(' ')[0] || '',
            lastName: lastName || user.displayName?.split(' ').slice(1).join(' ') || '',
            phoneNumber: phoneOverride || user.phoneNumber || '',
            metadata: {
                creationTime: user.metadata.creationTime,
                lastSignInTime: user.metadata.lastSignInTime
            },
            registeredDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };

        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (response.ok) {
                    console.log('Successfully sent user data to n8n');
                } else {
                    console.error('Failed to send user data to n8n:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error sending user data to n8n:', error);
            });
    }

    async function updateUserData(fields) {
        const ref = getUserDocRef();
        if (!ref) return;
        try {
            await ref.set(fields, { merge: true });
        } catch (err) {
            console.error('Firestore write error:', err);
        }
    }

    // ---- Daily Content (Local Static) ----
    async function fetchDailyContent() {
        const today = new Date();
        const dateDisplay = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        const dateEl = document.getElementById('vocab-date');
        if (dateEl) dateEl.textContent = dateDisplay;

        // Deterministic Index based on days since epoch (Jan 1, 2024)
        const startEpoch = new Date('2024-01-01').getTime();
        const currentEpoch = today.getTime();
        const daysSince = Math.floor((currentEpoch - startEpoch) / (1000 * 60 * 60 * 24));

        // 1. Daily Tip
        if (typeof DAILY_TIPS !== 'undefined' && DAILY_TIPS.length > 0) {
            const tipIndex = daysSince % DAILY_TIPS.length;
            const dailyTip = DAILY_TIPS[tipIndex];

            const tipTitle = document.getElementById('tip-title');
            const tipContent = document.getElementById('tip-content');
            if (tipTitle) tipTitle.textContent = dailyTip.title;
            if (tipContent) tipContent.textContent = dailyTip.content;
        }

        // 2. Daily Vocabulary (5 words)
        if (typeof VOCABULARY_POOL !== 'undefined' && VOCABULARY_POOL.length > 0) {
            const vocabList = document.getElementById('vocab-list');
            if (vocabList) {
                // Random Vocabulary Generator (Seeded by Date)
                // Goal: Display 5 random words each day, consistent for everyone on that date.

                // Mulberry32 - A high-quality pseudo-random number generator
                function mulberry32(a) {
                    return function () {
                        var t = a += 0x6D2B79F5;
                        t = Math.imul(t ^ t >>> 15, t | 1);
                        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
                        return ((t ^ t >>> 14) >>> 0) / 4294967296;
                    }
                }

                const indices = [];
                // Use daysSince as the seed so the "random" set is fixed for the entire day
                const seed = daysSince;
                const rand = mulberry32(seed);

                // Pick 5 unique random words from the pool
                const count = Math.min(5, VOCABULARY_POOL.length);
                let attempts = 0;
                while (indices.length < count && attempts < 100) {
                    const idx = Math.floor(rand() * VOCABULARY_POOL.length);
                    if (!indices.includes(idx)) {
                        indices.push(idx);
                    }
                    attempts++;
                }

                const dailyVocab = indices.map(i => VOCABULARY_POOL[i]);

                vocabList.innerHTML = dailyVocab.map(item => `
                    <div class="vocab-item">
                        <div class="vocab-word">${item.word}</div>
                        <div class="vocab-dash">—</div>
                        <div class="vocab-meaning">${item.definition}</div>
                    </div>
                `).join('');
            }
        }
    }

    function syncAppViewportHeight() {
        const viewport = window.visualViewport;
        const viewportHeight = viewport ? viewport.height : window.innerHeight;
        const viewportOffsetTop = viewport ? viewport.offsetTop : 0;
        document.documentElement.style.setProperty('--app-height', `${Math.round(viewportHeight)}px`);
        document.documentElement.style.setProperty('--app-offset-top', `${Math.round(viewportOffsetTop)}px`);
    }

    function initMobileChatViewport() {
        const chatInputSelector = '#chat-input-fluent, #chat-input-khushi';

        const syncKeyboardState = () => {
            const activeEl = document.activeElement;
            const isChatInputFocused = !!(activeEl && activeEl.matches?.(chatInputSelector));
            const activeChatPage = document.querySelector('.chat-page.active');

            $$('.chat-page').forEach(page => page.classList.remove('keyboard-open'));

            if (!activeChatPage || !isChatInputFocused) return;
            activeChatPage.classList.add('keyboard-open');

            const botType = activeEl.id.includes('khushi') ? 'khushi' : 'fluent';
            requestAnimationFrame(() => scrollChat(botType));
        };

        syncAppViewportHeight();

        window.addEventListener('resize', syncAppViewportHeight, { passive: true });
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                syncAppViewportHeight();
                syncKeyboardState();
            }, 120);
        }, { passive: true });

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => {
                syncAppViewportHeight();
                syncKeyboardState();
            });
            window.visualViewport.addEventListener('scroll', syncAppViewportHeight);
        }

        document.addEventListener('focusin', event => {
            if (!event.target.matches?.(chatInputSelector)) return;
            setTimeout(() => {
                syncAppViewportHeight();
                syncKeyboardState();
            }, 60);
        });

        document.addEventListener('focusout', event => {
            if (!event.target.matches?.(chatInputSelector)) return;
            setTimeout(() => {
                syncAppViewportHeight();
                syncKeyboardState();
            }, 120);
        });
    }

    // ---- Init ----
    document.addEventListener('DOMContentLoaded', () => {
        initMobileChatViewport();
        lucide.createIcons();
        initAuth();
        initNav();
        initChat();
        initVoice();
        initFeedback();
        initProfile();
        initScrollAnimations();
        fetchDailyContent();
        checkSession();
    });

    // ---- Session ----
    function checkSession() {
        // Firebase handles session automatically
        auth.onAuthStateChanged(async user => {
            if (user) {
                currentUid = user.uid;
                currentUser = {
                    name: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    phone: user.photoURL || '',
                };

                // Load user data from Firestore
                const userData = await loadUserData(user);
                if (userData) {
                    currentUser.fluentSessions = userData.fluentSessions || 0;
                    currentUser.khushiSessions = userData.khushiSessions || 0;
                    currentUser.profilePhoto = userData.profilePhoto || '';

                    // Use Firestore name if available (overrides Auth displayName/email)
                    if (userData.firstName) {
                        const full = [userData.firstName, userData.lastName].filter(Boolean).join(' ');
                        if (full) currentUser.name = full;
                    }
                }

                // Only navigate if on auth page
                if (currentPage === 'auth') {
                    navigateTo('dashboard');
                }
            } else {
                currentUser = null;
                currentUid = null;
                if (currentPage !== 'auth') {
                    navigateTo('auth');
                }
            }
        });
    }

    // saveSession is no longer needed as Firebase persists state
    // But we keep a helper for logout
    function logout() {
        auth.signOut().then(() => {
            showToast('Signed out');
        }).catch(err => {
            console.error(err);
            showToast('Error signing out');
        });
    }

    // ---- Navigation ----
    function navigateTo(page) {
        const isChatPage = page === 'chat-fluent' || page === 'chat-khushi';
        document.body.classList.toggle('chat-open', isChatPage);

        // Hide all pages
        $$('.auth-page, .page, .chat-page, .profile-page').forEach(el => el.classList.remove('active'));

        // Show target
        const target = $(`#page-${page}`);
        if (target) {
            target.classList.add('active');
            currentPage = page;
        }

        syncAppViewportHeight();

        // Page-specific init
        if (page === 'dashboard') {
            loadStats();
            populateDashboard();
            // Re-trigger scroll animations
            setTimeout(() => triggerScrollAnimations(), 100);
        }
        if (page === 'chat-fluent') {
            incrementSession('fluent');
        }
        if (page === 'chat-khushi') {
            incrementSession('khushi');
        }
        if (page === 'profile') {
            populateProfile();
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }
    window.navigateTo = navigateTo;

    // ---- Auth ----
    function initAuth() {
        // Tab switching
        $$('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                $$('.auth-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const target = tab.dataset.tab;
                $$('.auth-form').forEach(f => f.classList.remove('active'));
                $(`#form-${target}`).classList.add('active');
            });
        });

        // Login
        $('#form-login').addEventListener('submit', e => {
            e.preventDefault();
            const email = $('#login-email').value.trim();
            const pass = $('#login-password').value.trim();

            let valid = true;
            if (!email) { $('#login-email').closest('.form-group').classList.add('error'); valid = false; }
            else { $('#login-email').closest('.form-group').classList.remove('error'); }
            if (!pass) { $('#login-password').closest('.form-group').classList.add('error'); valid = false; }
            else { $('#login-password').closest('.form-group').classList.remove('error'); }

            if (!valid) return;

            // Firebase Login
            auth.signInWithEmailAndPassword(email, pass)
                .then((userCredential) => {
                    // Success - onAuthStateChanged will handle navigation
                    showToast('Welcome back!');
                })
                .catch((error) => {
                    const message = getFriendlyErrorMessage(error.code);
                    showToast(message);
                    console.error(error.code, error.message);
                });
        });

        // Signup
        $('#form-signup').addEventListener('submit', e => {
            e.preventDefault();
            const firstName = $('#signup-firstname').value.trim();
            const lastName = $('#signup-lastname').value.trim();
            const name = `${firstName} ${lastName}`.trim();
            const email = $('#signup-email').value.trim();
            const phone = $('#signup-phone').value.trim();
            const pass = $('#signup-password').value.trim();
            const confirm = $('#signup-confirm').value.trim();

            let valid = true;
            const check = (id, cond) => {
                const el = $(`#${id}`).closest('.form-group');
                if (!cond) { el.classList.add('error'); valid = false; }
                else { el.classList.remove('error'); }
            };

            check('signup-firstname', firstName.length > 0);
            check('signup-lastname', lastName.length > 0);
            check('signup-email', email.includes('@'));
            check('signup-phone', phone.length >= 10);
            check('signup-password', pass.length >= 6);
            check('signup-confirm', confirm === pass && confirm.length > 0);

            if (!valid) return;

            // Firebase Signup
            auth.createUserWithEmailAndPassword(email, pass)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;

                    // Store details temporarily for onboarding (to avoid race conditions with updateProfile)
                    if (phone) localStorage.setItem('temp_signup_phone', phone);
                    if (firstName) localStorage.setItem('temp_signup_firstname', firstName);
                    if (lastName) localStorage.setItem('temp_signup_lastname', lastName);

                    // Update profile with name
                    user.updateProfile({
                        displayName: name
                    }).then(() => {
                        // Profile updated
                        // onAuthStateChanged will handle navigation
                        showToast('Account created successfully');
                    }).catch((error) => {
                        console.error("Error updates profile", error);
                    });
                })
                .catch((error) => {
                    const message = getFriendlyErrorMessage(error.code);
                    showToast(message);
                    console.error(error.code, error.message);
                });
        });

        // Clear error on focus
        $$('.input-field').forEach(input => {
            input.addEventListener('focus', () => {
                input.closest('.form-group')?.classList.remove('error');
            });
        });

        // Forgot Password
        const forgotLink = $('#forgot-password-link');
        if (forgotLink) {
            forgotLink.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const email = $('#login-email').value.trim();

                if (!email) {
                    showToast('Please enter your email first.');
                    $('#login-email').focus();
                    return;
                }

                showToast('Sending reset link...');

                try {
                    await auth.sendPasswordResetEmail(email);
                    showToast('Reset link sent! Check your email inbox.');
                } catch (error) {
                    console.error('Password reset error:', error);
                    const message = getFriendlyErrorMessage(error.code);
                    showToast(message);
                }
            });
        }
    }

    // ---- Top Nav ----
    function initNav() {
        const trigger = $('#nav-profile-trigger');
        const dropdown = $('#profile-dropdown');

        trigger.addEventListener('click', e => {
            e.stopPropagation();
            dropdown.classList.toggle('open');
        });

        document.addEventListener('click', () => {
            dropdown.classList.remove('open');
        });

        $('#nav-profile-link').addEventListener('click', e => {
            e.preventDefault();
            dropdown.classList.remove('open');
            navigateTo('profile');
        });

        $('#nav-logout').addEventListener('click', e => {
            e.preventDefault();
            logout();
        });
    }

    // ---- Dashboard ----
    function populateDashboard() {
        if (!currentUser) return;
        const firstName = currentUser.name.split(' ')[0];
        const initials = currentUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

        $('#welcome-heading').textContent = `Welcome back, ${firstName}`;
        $('#nav-student-name').textContent = firstName;

        // Check for saved profile photo for nav avatar (from Firestore data)
        const navAvatar = $('#nav-avatar');
        const savedPhoto = currentUser.profilePhoto || '';
        if (savedPhoto && navAvatar) {
            navAvatar.textContent = '';
            navAvatar.innerHTML = `<img src="${savedPhoto}" alt="Avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`;
        } else if (navAvatar) {
            navAvatar.textContent = initials;
        }

        // Date
        const now = new Date();
        const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        $('#welcome-date').textContent = now.toLocaleDateString('en-US', opts);

        // Stats count-up
        setTimeout(() => animateCountUp(), 300);

        // Chart
        setTimeout(() => renderChart(), 200);

        // Daily Vocabulary
        // Daily Vocabulary
        // populateVocabulary(); // Moved to fetchDailyContent fallback
    }

    // ---- Daily Vocabulary ----
    function populateVocabulary() {
        const WORDS = [
            { word: "Apparently", meaning: "As far as one knows or can see; it seems that something is true" },
            { word: "Eloquent", meaning: "Fluent or persuasive in speaking or writing" },
            { word: "Inevitable", meaning: "Certain to happen; unavoidable" },
            { word: "Pragmatic", meaning: "Dealing with things sensibly and realistically" },
            { word: "Ambiguous", meaning: "Open to more than one interpretation; not clear" },
            { word: "Resilient", meaning: "Able to recover quickly from difficult conditions" },
            { word: "Subtle", meaning: "So delicate or precise as to be difficult to describe" },
            { word: "Comprehensive", meaning: "Including all or nearly all elements; complete and thorough" },
            { word: "Authentic", meaning: "Of undisputed origin; genuine and real" },
            { word: "Diligent", meaning: "Having or showing careful and persistent effort" },
            { word: "Reluctant", meaning: "Unwilling and hesitant; not eager to do something" },
            { word: "Persuade", meaning: "To convince someone to do or believe something through reasoning" },
            { word: "Enormous", meaning: "Very large in size, quantity, or extent" },
            { word: "Accomplish", meaning: "To achieve or complete something successfully" },
            { word: "Tremendous", meaning: "Very great in amount, scale, or intensity" },
            { word: "Consequence", meaning: "A result or effect of an action or condition" },
            { word: "Significantly", meaning: "In a way that is important or large enough to have an effect" },
            { word: "Adequate", meaning: "Sufficient for a specific need or requirement" },
            { word: "Demonstrate", meaning: "To clearly show the existence or truth of something" },
            { word: "Interpret", meaning: "To explain the meaning of information or actions" },
            { word: "Consistent", meaning: "Acting or done the same way over time; unchanging" },
            { word: "Emphasize", meaning: "To give special importance or attention to something" },
            { word: "Enthusiasm", meaning: "Intense and eager enjoyment, interest, or approval" },
            { word: "Negotiate", meaning: "To discuss something in order to reach an agreement" },
            { word: "Perspective", meaning: "A particular way of thinking about or viewing something" },
            { word: "Substantial", meaning: "Of considerable importance, size, or worth" },
            { word: "Gradually", meaning: "In a way that happens slowly over time, not suddenly" },
            { word: "Controversy", meaning: "A prolonged public disagreement or heated discussion" },
            { word: "Anticipate", meaning: "To expect or predict something before it happens" },
            { word: "Distinguish", meaning: "To recognize or treat someone or something as different" },
            { word: "Exaggerate", meaning: "To make something seem larger or more important than it is" },
            { word: "Persistent", meaning: "Continuing firmly in spite of difficulty or opposition" },
            { word: "Spontaneous", meaning: "Done or occurring without planning, on impulse" },
            { word: "Credible", meaning: "Able to be believed or trusted; convincing" },
            { word: "Overwhelm", meaning: "To have a very strong emotional or physical effect on someone" },
            { word: "Meticulous", meaning: "Showing great attention to detail; very careful and precise" },
            { word: "Fluctuate", meaning: "To rise and fall irregularly in number or amount" },
            { word: "Contemplate", meaning: "To think about something deeply and for a long time" },
            { word: "Feasible", meaning: "Possible and practical to do or achieve easily" },
            { word: "Deteriorate", meaning: "To become progressively worse over time" },
            { word: "Novice", meaning: "A person new to or inexperienced in a particular field" },
            { word: "Profound", meaning: "Very great or intense; having deep meaning" },
            { word: "Reluctance", meaning: "Unwillingness or hesitation to do something" },
            { word: "Abundant", meaning: "Existing or available in large quantities; plentiful" },
            { word: "Gratitude", meaning: "The quality of being thankful; readiness to show appreciation" },
            { word: "Concise", meaning: "Giving a lot of information clearly in a few words; brief" },
            { word: "Vulnerable", meaning: "Exposed to the possibility of being harmed, physically or emotionally" },
            { word: "Elaborate", meaning: "Involving many carefully arranged parts; detailed and complicated" },
            { word: "Inevitable", meaning: "Sure to happen; impossible to avoid or prevent" },
            { word: "Versatile", meaning: "Able to adapt or be adapted to many different functions" },
            { word: "Peculiar", meaning: "Strange or unusual; not like what is normal or expected" },
            { word: "Diminish", meaning: "To make or become less; to reduce in size or importance" },
            { word: "Obstinate", meaning: "Stubbornly refusing to change one's opinion or course of action" },
            { word: "Candid", meaning: "Truthful and straightforward; being honest and open" },
            { word: "Turbulent", meaning: "Characterized by conflict, disorder, or confusion" },
            { word: "Impeccable", meaning: "Without faults or mistakes; flawless and perfect" },
            { word: "Endure", meaning: "To suffer something painful or difficult patiently over time" },
            { word: "Vivid", meaning: "Producing powerful feelings or strong, clear images in the mind" },
            { word: "Skeptical", meaning: "Not easily convinced; having doubts or reservations" },
            { word: "Compassion", meaning: "Sympathetic concern for the sufferings or misfortunes of others" },
        ];

        // Date-based seed for daily rotation
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

        // Simple seeded shuffle to pick 5 words
        function seededRandom(s) {
            let x = Math.sin(s) * 10000;
            return x - Math.floor(x);
        }

        const indices = [];
        let s = seed;
        while (indices.length < 5) {
            s++;
            const idx = Math.floor(seededRandom(s) * WORDS.length);
            if (!indices.includes(idx)) indices.push(idx);
        }

        const todayWords = indices.map(i => WORDS[i]);

        // Set date
        const vocabDateEl = $('#vocab-date');
        if (vocabDateEl) {
            vocabDateEl.textContent = today.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        }

        // Render words
        const listEl = $('#vocab-list');
        if (listEl) {
            listEl.innerHTML = todayWords.map(w => `
                <div class="vocab-item">
                    <span class="vocab-word">${w.word}</span>
                    <span class="vocab-dash">—</span>
                    <span class="vocab-meaning">${w.meaning}</span>
                </div>
            `).join('');
        }
    }

    // ---- Count-Up Animation ----
    function animateCountUp() {
        $$('.stat-value[data-count]').forEach(el => {
            const target = parseInt(el.dataset.count, 10);
            if (target === 0) {
                el.textContent = '0';
                return;
            }
            const duration = 1200;
            const start = performance.now();

            function tick(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased);
                if (progress < 1) requestAnimationFrame(tick);
                else el.textContent = target; // Ensure exact final value
            }
            requestAnimationFrame(tick);
        });
    }

    // ---- Stats Logic (Firestore-backed) ----
    function loadStats() {
        if (!currentUser) return;
        const fluent = currentUser.fluentSessions || 0;
        const khushi = currentUser.khushiSessions || 0;

        // Update DOM data-count attributes
        const stats = $$('.stat-value');
        if (stats.length >= 3) {
            stats[0].dataset.count = fluent;
            stats[1].dataset.count = khushi;
            stats[2].dataset.count = fluent + khushi;
        }
    }

    async function incrementSession(bot) {
        if (!currentUser) return;

        if (bot === 'fluent') {
            currentUser.fluentSessions = (currentUser.fluentSessions || 0) + 1;
            await updateUserData({ fluentSessions: currentUser.fluentSessions });
        } else {
            currentUser.khushiSessions = (currentUser.khushiSessions || 0) + 1;
            await updateUserData({ khushiSessions: currentUser.khushiSessions });
        }

        // Simulate learning progress
        updateChartData();
    }

    function updateChartData() {
        // Get current data or init with default
        let data = JSON.parse(localStorage.getItem('lg_chart_data'));
        if (!data) {
            data = [45, 30, 60, 55, 40, 50];
        }

        // Randomly improve 1-2 categories by 2-5 points
        const numUpdates = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numUpdates; i++) {
            const idx = Math.floor(Math.random() * data.length);
            const increase = Math.floor(Math.random() * 4) + 2;
            data[idx] = Math.min(data[idx] + increase, 100); // Cap at 100
        }

        localStorage.setItem('lg_chart_data', JSON.stringify(data));
    }

    // ---- Chart ----
    let chartInstance = null;

    function renderChart() {
        const canvas = $('#improvement-chart');
        if (!canvas) return;

        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }

        const ctx = canvas.getContext('2d');

        // Gradient fill
        const barGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        barGradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
        barGradient.addColorStop(1, 'rgba(139, 92, 246, 0.8)');

        const barBorderGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        barBorderGradient.addColorStop(0, '#3B82F6');
        barBorderGradient.addColorStop(1, '#8B5CF6');

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: MOCK.improvement.labels,
                datasets: [{
                    label: 'Proficiency Score',
                    data: JSON.parse(localStorage.getItem('lg_chart_data')) || MOCK.improvement.data,
                    backgroundColor: barGradient,
                    borderColor: barBorderGradient,
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                }],
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart',
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#FFFFFF',
                        titleColor: '#111827',
                        bodyColor: '#6B7280',
                        borderColor: '#E5E7EB',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 10,
                        displayColors: false,
                        titleFont: { weight: '600', size: 13 },
                        bodyFont: { size: 12 },
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    },
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.04)',
                            drawBorder: false,
                        },
                        ticks: {
                            color: '#9CA3AF',
                            font: { size: 11 },
                        },
                        border: { display: false },
                    },
                    y: {
                        grid: { display: false },
                        ticks: {
                            color: '#6B7280',
                            font: { size: 12, weight: '500' },
                            padding: 8,
                        },
                        border: { display: false },
                    },
                },
                layout: {
                    padding: { top: 4, bottom: 4 },
                },
            },
        });
    }

    // ---- Chat ----
    function initChat() {
        setupChatBot('fluent');
        setupChatBot('khushi');
    }

    function setupChatBot(type) {
        const input = $(`#chat-input-${type}`);
        const sendBtn = $(`#send-${type}`);

        const send = async () => {
            const text = input.value.trim();
            if (!text) return;
            addMessage(type, 'user', text);
            input.value = '';
            input.focus();

            // Show typing
            const typing = $(`#typing-${type}`);
            typing.classList.add('active');
            scrollChat(type);

            if (type === 'fluent') {
                // Real AI response via n8n webhook
                const response = await callFluentBot(text);
                typing.classList.remove('active');
                addMessage(type, 'bot', response, true);
            } else {
                // Real AI response via Khushi n8n webhook
                const data = await callKhushiBot(text);
                typing.classList.remove('active');
                handleKhushiResponse(data);
            }
        };

        sendBtn.addEventListener('click', send);
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
            }
        });
    }

    function addMessage(botType, sender, text, isHTML = false) {
        const container = $(`#chat-${botType}-messages`);
        const typing = $(`#typing-${botType}`);

        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        // Bot messages from n8n already contain HTML formatting
        const content = (sender === 'bot' && isHTML)
            ? text.replace(/\n/g, '<br/>')
            : escapeHTML(text).replace(/\n/g, '<br/>');

        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerHTML = `
      <div>
        <div class="msg-bubble">${content}</div>
        <div class="msg-time">${time}</div>
      </div>
    `;

        container.insertBefore(msgDiv, typing);
        scrollChat(botType);
    }

    function scrollChat(botType) {
        const container = $(`#chat-${botType}-messages`);
        requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
        });
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ---- N8N Webhook Integration ----
    // Use webhook-test for testing, switch to webhook/ for production
    const N8N_FLUENT_WEBHOOK = 'https://n8n.ritesh-ai-automation.in/webhook/fluent-bot-web';

    async function callFluentBot(message, mode = 'Chat', audioBlob = null) {
        try {
            const nameParts = (currentUser?.name || 'Guest').split(' ');
            const formData = new FormData();

            formData.append('first_name', nameParts[0] || '');
            formData.append('last_name', nameParts.slice(1).join(' ') || '');
            formData.append('date', Math.floor(Date.now() / 1000).toString());
            formData.append('mode', mode);
            formData.append('chat_id', currentUid || 'anonymous');

            if (audioBlob) {
                // Voice mode: attach audio file with correct extension
                const ext = audioBlob.type.includes('mp4') ? 'm4a' : 'webm';
                formData.append('audio', audioBlob, `voice-message.${ext}`);
            } else {
                // Chat mode: attach text
                formData.append('text', message);
            }

            console.log('Sending to n8n:', {
                mode,
                hasAudio: !!audioBlob,
                text: message,
                audioType: audioBlob?.type
            });
            const res = await fetch(N8N_FLUENT_WEBHOOK, {
                method: 'POST',
                body: formData,
            });
            console.log('Response status:', res.status);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            console.log('N8N response:', data);
            return data.reply || data.text || data.output || JSON.stringify(data);
        } catch (err) {
            console.error('Fluent Bot API error:', err);
            return '⚠️ Connection issue. Please try again in a moment.';
        }
    }

    // Khushi Bot Webhook
    const N8N_KHUSHI_WEBHOOK = 'https://n8n.ritesh-ai-automation.in/webhook/b06287b2-a53a-4a71-942a-9eae1b4a32db';

    async function callKhushiBot(message, mode = 'Chat', audioBlob = null) {
        try {
            const nameParts = (currentUser?.name || 'Guest').split(' ');
            const formData = new FormData();

            formData.append('first_name', nameParts[0] || '');
            formData.append('last_name', nameParts.slice(1).join(' ') || '');
            formData.append('date', Math.floor(Date.now() / 1000).toString());
            formData.append('mode', mode);
            formData.append('chat_id', currentUid || 'anonymous');

            if (audioBlob) {
                const ext = audioBlob.type.includes('mp4') ? 'm4a' : 'webm';
                formData.append('audio', audioBlob, `voice-message.${ext}`);
            } else {
                formData.append('text', message);
            }

            console.log('Sending to Khushi:', {
                mode,
                hasAudio: !!audioBlob,
                text: message,
                audioType: audioBlob?.type
            });
            const res = await fetch(N8N_KHUSHI_WEBHOOK, {
                method: 'POST',
                body: formData,
            });
            console.log('Khushi response status:', res.status);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            console.log('Khushi response:', data);
            return data; // Return full object for custom handling
        } catch (err) {
            console.error('Khushi Bot API error:', err);
            return { error: '⚠️ Connection issue. Please try again in a moment.' };
        }
    }

    // Handle Khushi's structured response (Premium Voice Card)
    function handleKhushiResponse(data) {
        if (data.error) {
            addMessage('khushi', 'bot', data.error);
            return;
        }

        const ans = data.ans || data.reply || data.text || data.output || '';
        const mistakes = data.mistakes_summary || data.mistake || '';
        const nextQ = data.next_question || '';
        const audioData = data.audio || data.audio_base64 || data.file;

        // 1. Premium Audio Card
        if (ans || audioData) {
            // Unique ID for this message instance
            const msgId = 'voice-' + Date.now() + Math.floor(Math.random() * 1000);

            // Store audio data globally
            if (!window.voiceDataStore) window.voiceDataStore = {};
            window.voiceDataStore[msgId] = {
                audio: audioData,
                text: ans,
                speed: 1.0 // Changed from 1.5 to 1.0 (Normal Speed)
            };

            const playIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="play-icon"><path d="M8 5V19L19 12L8 5Z" fill="currentColor"/></svg>`;

            const audioHtml = `
            <div class="voice-msg-container" id="${msgId}">
                <button class="voice-play-btn" onclick="toggleKhushiVoice('${msgId}')">
                    ${playIcon}
                </button>
                <div class="voice-waveform-box">
                    ${Array(18).fill('<div class="wave-bar"></div>').join('')}
                </div>
                <div class="voice-duration" id="dur-${msgId}">0:00</div>
            </div>`;

            addMessage('khushi', 'bot', audioHtml, true);

            // Auto-play the new voice message
            setTimeout(() => toggleKhushiVoice(msgId), 300);
        }

        // 2. Mistakes Bubble
        if (mistakes && !mistakes.includes('No mistakes')) {
            const mistakesHtml = `<div style="padding:4px"><strong>✏️ Mistakes Summary:</strong><br/><div style="margin-top:6px;white-space:pre-wrap">${mistakes}</div></div>`;
            addMessage('khushi', 'bot', mistakesHtml, true);
        } else if (mistakes) {
            const praiseHtml = `<div style="color:#15803d;font-weight:500">🎉 ${mistakes}</div>`;
            addMessage('khushi', 'bot', praiseHtml, true);
        }

        // 3. Next Question Bubble
        if (nextQ) {
            addMessage('khushi', 'bot', nextQ);
        }
    }

    // --- Premium Voice Logic ---
    window.currentVoice = null;     // { id, audio, speed }

    function stopKhushiVoicePlayback() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }

        if (!window.currentVoice) return;

        const { id, audio } = window.currentVoice;
        const playIconSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 5V19L19 12L8 5Z" fill="currentColor"/></svg>`;

        try {
            audio.pause();
            audio.currentTime = 0;
        } catch (err) {
            console.warn('Failed to stop active Khushi audio:', err);
        }

        const container = document.getElementById(id);
        if (container) {
            container.classList.remove('playing');

            const playBtn = container.querySelector('.voice-play-btn');
            if (playBtn) {
                playBtn.classList.remove('playing');
                playBtn.innerHTML = playIconSVG;
            }

            const durationEl = document.getElementById(`dur-${id}`);
            if (durationEl) {
                durationEl.textContent = formatTime(audio.duration || 0);
            }
        }

        window.currentVoice = null;
    }

    window.toggleKhushiVoice = (id) => {
        const container = document.getElementById(id);
        const playBtn = container.querySelector('.voice-play-btn');
        const durationEl = document.getElementById(`dur-${id}`);
        const data = window.voiceDataStore[id];

        const playIconSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 5V19L19 12L8 5Z" fill="currentColor"/></svg>`;
        const pauseIconSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" fill="currentColor"/></svg>`;

        if (!data) return;

        // If playing other audio, stop it
        if (window.currentVoice && window.currentVoice.id !== id) {
            const prevContainer = document.getElementById(window.currentVoice.id);
            if (prevContainer) {
                prevContainer.classList.remove('playing');
                prevContainer.querySelector('.voice-play-btn').classList.remove('playing');
                prevContainer.querySelector('.voice-play-btn').innerHTML = playIconSVG;
            }
            window.currentVoice.audio.pause();
            window.currentVoice = null;
        }

        // Initialize Audio if needed
        if (!window.currentVoice || window.currentVoice.id !== id) {
            // Handle Base64 source
            let src = null;
            if (data.audio) {
                src = data.audio.startsWith('data:') ? data.audio : `data:audio/mp3;base64,${data.audio}`;
            }

            if (!src) {
                // TTS Fallback
                window.playTTS(data.text);
                return;
            }

            const audio = new Audio(src);
            // Resume functionality logic

            window.currentVoice = { id, audio, speed: 1 };

            // Event Listeners
            audio.addEventListener('ended', () => {
                container.classList.remove('playing');
                playBtn.classList.remove('playing');
                playBtn.innerHTML = playIconSVG;
                window.currentVoice = null;
                durationEl.textContent = formatTime(audio.duration || 0);
            });

            audio.addEventListener('timeupdate', () => {
                if (!audio.duration) return;
                // Show current progress or remaining? User asked for duration.
                // Typical chat app shows X:XX (progress)
                durationEl.textContent = formatTime(audio.currentTime);
            });

            audio.addEventListener('loadedmetadata', () => {
                durationEl.textContent = formatTime(audio.duration);
            });

            // Check if speed was selected before play (UI pills) OR use stored default
            const activeSpeedOpt = container.querySelector('.speed-opt.active');
            if (activeSpeedOpt) {
                const speed = parseFloat(activeSpeedOpt.textContent);
                if (!isNaN(speed)) audio.playbackRate = speed;
            } else if (data.speed) {
                audio.playbackRate = data.speed; // Use stored default (1.5)
            }
        }

        const audio = window.currentVoice.audio;

        if (audio.paused) {
            audio.play().then(() => {
                container.classList.add('playing');
                playBtn.classList.add('playing');
                playBtn.innerHTML = pauseIconSVG;
            }).catch(e => {
                console.error("Audio play failed", e);
                window.playTTS(data.text);
            });
        } else {
            audio.pause();
            container.classList.remove('playing');
            playBtn.classList.remove('playing');
            playBtn.innerHTML = playIconSVG;
        }
    };

    window.setVoiceSpeed = (id, speed) => {
        const container = document.getElementById(id);
        if (!container) return;

        // Update pills UI
        const pills = container.querySelectorAll('.speed-opt');
        pills.forEach(p => {
            const pSpeed = parseFloat(p.textContent);
            if (pSpeed === speed) p.classList.add('active');
            else p.classList.remove('active');
        });

        // Update Audio
        if (window.currentVoice && window.currentVoice.id === id) {
            window.currentVoice.audio.playbackRate = speed;
        }
    };

    function formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    // Global TTS function
    window.playTTS = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop valid audio
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            // Try to set a female voice if available
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google US English'));
            if (femaleVoice) utterance.voice = femaleVoice;
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-Speech not supported in this browser.');
        }
    };

    function formatKhushiResponse(data) {
        const ans = data.ans || data.reply || data.text || data.output || '';
        const mistakes = data.mistakes_summary || data.mistake || '';
        const nextQ = data.next_question || '';

        let html = '';
        if (ans) html += `<div style="margin-bottom:8px">${ans}</div>`;
        if (mistakes && !mistakes.includes('No mistakes')) {
            html += `<div style="margin-top:8px;padding:8px 12px;background:rgba(239,68,68,0.08);border-left:3px solid #ef4444;border-radius:6px;font-size:13px"><strong>✏️ Mistakes:</strong><br/>${mistakes}</div>`;
        } else if (mistakes) {
            html += `<div style="margin-top:8px;padding:8px 12px;background:rgba(34,197,94,0.08);border-left:3px solid #22c55e;border-radius:6px;font-size:13px">🎉 ${mistakes}</div>`;
        }
        if (nextQ) html += `<div style="margin-top:8px;font-style:italic;color:#6366f1">💬 ${nextQ}</div>`;

        return html || JSON.stringify(data);
    }

    // ---- Voice Recording ----
    function initVoice() {
        setupVoiceForBot('fluent');
        setupVoiceForBot('khushi');
    }

    function setupVoiceForBot(type) {
        const micBtn = $(`#mic-${type}`);
        const sendBtn = $(`#send-${type}`);
        const cancelBtn = $(`#rec-cancel-${type}`);
        const inputBar = $(`#input-bar-${type}`);
        const timerEl = $(`#rec-timer-${type}`);
        const input = $(`#chat-input-${type}`);

        let recognition = null;
        let isRecording = false;
        let timerInterval = null;
        let seconds = 0;
        let mediaRecorder = null;
        let audioChunks = [];
        let isInitializing = false;
        let pendingStop = false;
        let recorderMimeType = '';
        let chunkMimeType = '';

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        micBtn.addEventListener('click', () => {
            if (isRecording) {
                stopRecording(true);
            } else {
                startRecording();
            }
        });

        // FIX 1: Send button should also stop & send during recording
        sendBtn.addEventListener('click', () => {
            if (isRecording) {
                stopRecording(true);
            }
        });

        cancelBtn.addEventListener('click', () => {
            stopRecording(false);
        });

        function startRecording() {
            if (isInitializing) return;

            // Recording should take mic focus: stop any currently playing bot audio immediately.
            stopKhushiVoicePlayback();

            isRecording = true;
            isInitializing = true;
            pendingStop = false;
            seconds = 0;
            audioChunks = [];
            chunkMimeType = '';
            recorderMimeType = ''; // Reset
            inputBar.classList.add('recording');
            timerEl.textContent = '0:00';

            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }

            // Safety: Clear input to prevent any phantom text
            input.value = '';
            input.dataset.voiceText = '';

            // Start actual audio recording for playback
            if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
                isInitializing = false;
                isRecording = false;
                inputBar.classList.remove('recording');
                showToast('Microphone recording is not supported in this browser.');
                return;
            }

            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const preferredMimeTypes = [
                        'audio/mp4;codecs=mp4a.40.2',
                        'audio/mp4',
                        'audio/webm;codecs=opus',
                        'audio/webm',
                        'audio/ogg;codecs=opus',
                        'audio/ogg'
                    ];
                    const supportsType = typeof MediaRecorder.isTypeSupported === 'function';
                    const selectedMimeType = supportsType
                        ? preferredMimeTypes.find(mime => MediaRecorder.isTypeSupported(mime))
                        : '';
                    const recorderOptions = selectedMimeType ? { mimeType: selectedMimeType } : undefined;

                    mediaRecorder = recorderOptions ? new MediaRecorder(stream, recorderOptions) : new MediaRecorder(stream);
                    recorderMimeType = mediaRecorder.mimeType || selectedMimeType || ''; // Capture browser-supported mime type

                    mediaRecorder.ondataavailable = (e) => {
                        if (e.data && e.data.size > 0) {
                            if (!chunkMimeType && e.data.type) chunkMimeType = e.data.type;
                            audioChunks.push(e.data);
                        }
                    };
                    mediaRecorder.onerror = (event) => {
                        console.warn('MediaRecorder error:', event?.error || event);
                    };

                    try {
                        // Small timeslice helps produce stable chunks across browsers.
                        mediaRecorder.start(250);
                    } catch (err) {
                        console.warn('MediaRecorder.start(250) failed, retrying without timeslice:', err);
                        mediaRecorder.start();
                    }

                    timerInterval = setInterval(() => {
                        seconds++;
                        const m = Math.floor(seconds / 60);
                        const s = seconds % 60;
                        timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
                    }, 1000);

                    isInitializing = false;

                    if (pendingStop) {
                        console.log('Handling pending stop after initialization');
                        stopRecording(true);
                    }
                })
                .catch(err => {
                    console.warn('Mic access denied:', err);
                    isInitializing = false;
                    isRecording = false;
                    inputBar.classList.remove('recording');
                    showToast('Microphone access denied. Please allow mic permission and try again.');
                });

            // Start speech-to-text in parallel
            // SpeechRecognition removed to prevent unwanted transcription
            /*
            if (SpeechRecognition) {
                recognition = new SpeechRecognition();
                recognition.lang = 'en-US';
                recognition.interimResults = true;
                recognition.continuous = true;

                let finalTranscript = '';

                recognition.onresult = (event) => {
                    let interim = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript + ' ';
                        } else {
                            interim += event.results[i][0].transcript;
                        }
                    }
                    input.dataset.voiceText = (finalTranscript + interim).trim();
                };

                recognition.onerror = (e) => {
                    if (e.error !== 'aborted') {
                        console.warn('Speech recognition error:', e.error);
                    }
                };

                recognition.onend = () => {
                    if (isRecording && recognition) {
                        try { recognition.start(); } catch (e) { }
                    }
                };

                try { recognition.start(); } catch (e) {
                    console.warn('Could not start speech recognition:', e);
                }
            }
            */
        }

        function stopRecording(shouldSend) {
            try {
                if (isInitializing) {
                    console.log('Recording is initializing, deferring stop...');
                    pendingStop = true;
                    return;
                }

                isRecording = false;
                inputBar.classList.remove('recording');
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                }

                // Safety check for recognition variable
                if (typeof recognition !== 'undefined' && recognition) {
                    try { recognition.stop(); } catch (e) { }
                    recognition = null;
                }

                // Stop media recorder and get audio blob
                const finalize = (audioBlob) => {
                    try {
                        if (shouldSend) {
                            if (audioBlob && audioBlob.size > 0) {
                                // Send audio directly to n8n for AI transcription
                                const durationSecs = Math.max(seconds, 1);
                                const audioUrl = URL.createObjectURL(audioBlob);
                                addVoiceMessage(type, durationSecs, audioUrl);
                                triggerBotResponse(type, audioBlob).catch(err => {
                                    console.error('TriggerBotResponse error:', err);
                                    showToast('Error sending message: ' + err.message);
                                });
                            } else {
                                console.warn('Voice recording failed: Empty audio blob.');
                                showToast('Voice recording failed. Please try again.');
                            }
                        }

                        input.dataset.voiceText = '';
                        seconds = 0;
                        if (timerEl) timerEl.textContent = '0:00';
                    } catch (finalErr) {
                        console.error('Finalize error:', finalErr);
                        showToast('Error processing recording: ' + finalErr.message);
                    }
                };

                if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                    const recorder = mediaRecorder;
                    recorder.onstop = () => {
                        try {
                            // Stop all mic tracks
                            if (recorder.stream) {
                                recorder.stream.getTracks().forEach(t => t.stop());
                            }

                            // Use the captured mimeType from initialization, fallback if needed
                            const blobMimeType = recorderMimeType || chunkMimeType || (audioChunks.length > 0 ? audioChunks[0].type : '') || 'audio/webm';
                            const blob = new Blob(audioChunks, { type: blobMimeType });
                            audioChunks = [];
                            chunkMimeType = '';
                            mediaRecorder = null;

                            console.log('Audio recording finished. Blob size:', blob.size, 'Type:', blob.type);

                            if (blob.size > 0) {
                                finalize(blob);
                            } else {
                                finalize(null);
                            }
                        } catch (onStopErr) {
                            console.error('Recorder onstop error:', onStopErr);
                            finalize(null);
                        }
                    };
                    try {
                        recorder.stop();
                    } catch (err) {
                        console.warn('Failed to stop recorder:', err);
                        finalize(null);
                    }
                } else {
                    finalize(null);
                }
            } catch (mainErr) {
                console.error('stopRecording fatal error:', mainErr);
                showToast('Error stopping recording: ' + mainErr.message);
            }
        }

        async function triggerBotResponse(botType, audioBlob = null) {
            const typing = $(`#typing-${botType}`);
            typing.classList.add('active');
            scrollChat(botType);

            if (botType === 'fluent') {
                let response;
                if (audioBlob) {
                    // Send audio file
                    response = await callFluentBot('', 'Voice', audioBlob);
                } else {
                    // Text message — use 'Chat' mode
                    const msgs = $$(`#chat-${botType}-messages .message.user .msg-bubble`);
                    const lastMsg = msgs.length ? msgs[msgs.length - 1].textContent : 'hello';
                    response = await callFluentBot(lastMsg, 'Chat');
                }

                typing.classList.remove('active');
                // Webhook replies are HTML-formatted; keep voice rendering aligned with text chat.
                addMessage(botType, 'bot', response, true);
            }
            else if (botType === 'khushi') {
                let data;
                if (audioBlob) {
                    data = await callKhushiBot('', 'Voice', audioBlob);
                } else {
                    // Text message — use 'Chat' mode
                    const msgs = $$(`#chat-${botType}-messages .message.user .msg-bubble`);
                    const lastMsg = msgs.length ? msgs[msgs.length - 1].textContent : 'hello';
                    data = await callKhushiBot(lastMsg, 'Chat');
                }

                typing.classList.remove('active');
                handleKhushiResponse(data);
            }
        }


        function addVoiceMessage(botType, durationSecs, audioUrl) {
            const container = $(`#chat-${botType}-messages`);
            const typing = $(`#typing-${botType}`);
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            const m = Math.floor(durationSecs / 60);
            const s = durationSecs % 60;
            const durStr = `${m}:${s.toString().padStart(2, '0')}`;

            const bars = Array.from({ length: 20 }, () => Math.floor(Math.random() * 18) + 6);
            const barHTML = bars.map(h => `<span style="height:${h}px"></span>`).join('');

            const msgDiv = document.createElement('div');
            msgDiv.className = 'message user';
            msgDiv.innerHTML = `
      <div>
        <div class="msg-bubble voice-bubble">
          <button class="voice-play-btn"><i data-lucide="play"></i></button>
          <div class="voice-waveform">${barHTML}</div>
          <span class="voice-duration">${durStr}</span>
        </div>
        <div class="msg-time">${time}</div>
      </div>
    `;

            container.insertBefore(msgDiv, typing);
            lucide.createIcons();
            scrollChat(botType);

            // FIX 2: Wire up play button for audio playback
            const playBtn = msgDiv.querySelector('.voice-play-btn');
            if (audioUrl) {
                const audio = new Audio(audioUrl);
                let isPlaying = false;
                playBtn.addEventListener('click', () => {
                    if (isPlaying) {
                        audio.pause();
                        audio.currentTime = 0;
                        playBtn.innerHTML = '<i data-lucide="play"></i>';
                        lucide.createIcons({ nodes: [playBtn] });
                        isPlaying = false;
                    } else {
                        audio.play().catch(e => {
                            console.error('Audio playback failed:', e);
                            showToast('Could not play audio. Please try again.');
                            isPlaying = false;
                            playBtn.innerHTML = '<i data-lucide="play"></i>';
                            lucide.createIcons({ nodes: [playBtn] });
                        });
                        playBtn.innerHTML = '<i data-lucide="pause"></i>';
                        lucide.createIcons({ nodes: [playBtn] });
                        isPlaying = true;
                    }
                });
                audio.addEventListener('ended', () => {
                    playBtn.innerHTML = '<i data-lucide="play"></i>';
                    lucide.createIcons({ nodes: [playBtn] });
                    isPlaying = false;
                });
            }
        }
    }

    // ---- Feedback ----
    function initFeedback() {
        const modal = $('#feedback-modal');
        const trigger = $('#feedback-trigger');
        const cancel = $('#fb-cancel');
        const form = $('#feedback-form');

        trigger?.addEventListener('click', e => {
            e.preventDefault();
            modal.classList.add('open');
        });

        cancel?.addEventListener('click', () => {
            modal.classList.remove('open');
        });

        modal?.addEventListener('click', e => {
            if (e.target === modal) modal.classList.remove('open');
        });

        form?.addEventListener('submit', e => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const category = $('#fb-type').value;
            const message = $('#fb-message').value;

            const payload = {
                uid: currentUser?.uid || 'anonymous',
                name: currentUser?.name || 'Anonymous',
                email: currentUser?.email || 'No Email',
                category: category,
                message: message,
                timestamp: new Date().toISOString()
            };

            // n8n Webhook for Feedback
            const WEBHOOK_URL = 'https://n8n.ritesh-ai-automation.in/webhook/feedback';

            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(response => {
                    if (response.ok) {
                        showToast('Feedback submitted. Thank you!');
                        modal.classList.remove('open');
                        form.reset();
                    } else {
                        throw new Error('Network response was not ok');
                    }
                })
                .catch(error => {
                    console.error('Error sending feedback:', error);
                    showToast('Failed to send feedback. Please try again.');
                })
                .finally(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // ---- Profile ----
    function initProfile() {
        const toggle = $('#change-pw-toggle');
        const pwForm = $('#change-pw-form');

        toggle?.addEventListener('click', () => {
            pwForm.classList.toggle('open');
            toggle.textContent = pwForm.classList.contains('open') ? 'Cancel' : 'Change Password';
        });

        $('#pw-form')?.addEventListener('submit', e => {
            e.preventDefault();
            const newPw = $('#pw-new').value;
            const confirmPw = $('#pw-confirm').value;

            if (newPw.length < 6) {
                showToast('Password must be at least 6 characters');
                return;
            }
            if (newPw !== confirmPw) {
                showToast('Passwords do not match');
                return;
            }

            pwForm.classList.remove('open');
            toggle.textContent = 'Change Password';
            e.target.reset();
            showToast('Password updated');
        });

        $('#profile-logout')?.addEventListener('click', () => {
            logout();
        });

        // ---- Photo Upload ----
        $('#profile-avatar-wrapper')?.addEventListener('click', () => {
            $('#profile-photo-input')?.click();
        });

        $('#profile-photo-input')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                showToast('Photo must be under 2MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64 = event.target.result;

                // Save to Firestore and local state
                currentUser.profilePhoto = base64;
                await updateUserData({ profilePhoto: base64 });

                displayProfilePhoto(base64);

                // Also update nav bar avatar
                const navAvatar = $('#nav-avatar');
                if (navAvatar) {
                    navAvatar.textContent = '';
                    navAvatar.innerHTML = `<img src="${base64}" alt="Avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`;
                }

                showToast('Profile photo updated!');
            };
            reader.readAsDataURL(file);
        });

        // ---- Name Editing ----
        const editBtn = $('#edit-name-btn');
        const nameEdit = $('#profile-name-edit');
        const nameRow = document.querySelector('.profile-name-row');

        editBtn?.addEventListener('click', () => {
            $('#profile-name-input').value = currentUser?.name || '';
            nameRow.style.display = 'none';
            nameEdit.style.display = 'flex';
            $('#profile-name-input').focus();
        });

        $('#cancel-name-btn')?.addEventListener('click', () => {
            nameEdit.style.display = 'none';
            nameRow.style.display = 'flex';
        });

        $('#save-name-btn')?.addEventListener('click', async () => {
            const newName = $('#profile-name-input').value.trim();
            if (!newName) {
                showToast('Name cannot be empty');
                return;
            }

            try {
                const user = auth.currentUser;
                if (user) {
                    await user.updateProfile({ displayName: newName });
                    currentUser.name = newName;
                    $('#profile-name').textContent = newName;

                    // Update initials avatar if no photo
                    if (!currentUser.profilePhoto) {
                        const initials = newName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                        $('#profile-avatar').textContent = initials;
                    }

                    nameEdit.style.display = 'none';
                    nameRow.style.display = 'flex';
                    showToast('Name updated!');
                }
            } catch (error) {
                console.error('Error updating name:', error);
                showToast('Failed to update name. Try again.');
            }
        });
    }

    function displayProfilePhoto(base64) {
        const avatarEl = $('#profile-avatar');
        avatarEl.textContent = '';
        avatarEl.innerHTML = `<img src="${base64}" alt="Profile Photo" />`;
    }

    function populateProfile() {
        if (!currentUser) return;

        // Check for saved photo first (from Firestore data)
        const savedPhoto = currentUser.profilePhoto || '';
        if (savedPhoto) {
            displayProfilePhoto(savedPhoto);
        } else {
            const initials = currentUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            $('#profile-avatar').textContent = initials;
        }

        $('#profile-name').textContent = currentUser.name;
        $('#profile-email').textContent = currentUser.email;
        $('#profile-phone').textContent = currentUser.phone || MOCK.student.phone;
        $('#profile-member-since').textContent = MOCK.student.memberSince;

        // Fetch stats from Firestore (cached in currentUser)
        const fluent = currentUser.fluentSessions || 0;
        const khushi = currentUser.khushiSessions || 0;

        $('#profile-fluent-count').textContent = fluent;
        $('#profile-khushi-count').textContent = khushi;

        // Re-render Lucide icons for profile page
        if (window.lucide) lucide.createIcons();
    }

    // ---- Scroll Fade-in Animations ----
    function initScrollAnimations() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        // Stagger delay
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, i * 100);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        $$('.fade-in-section').forEach(el => observer.observe(el));
    }

    function triggerScrollAnimations() {
        $$('.fade-in-section').forEach((el, i) => {
            el.classList.remove('visible');
            setTimeout(() => {
                el.classList.add('visible');
            }, i * 100);
        });
    }

    // ---- Helpers ----
    function getFriendlyErrorMessage(errorCode) {
        switch (errorCode) {
            case 'auth/invalid-credential':
                return 'Incorrect email or password.';
            case 'auth/user-not-found':
                return 'No account found with this email.';
            case 'auth/wrong-password':
                return 'Incorrect password.';
            case 'auth/email-already-in-use':
                return 'Email is already registered.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection.';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please try again later.';
            case 'auth/operation-not-allowed':
                return 'Operation not allowed. Please contact support.';
            default:
                return 'An error occurred. Please try again.';
        }
    }

    // ---- Toast ----
    function showToast(msg) {
        const toast = $('#toast');
        if (!toast) {
            console.log('Toast:', msg);
            return;
        }
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2800);
    }

})();
