document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const heroTitle = document.getElementById('hero-title');
    const heroPara = document.getElementById('hero-para');
    const heroBtn = document.getElementById('hero-btn');

    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = navbar.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
            });
        });
    }

    // Hero Animations on Load
    setTimeout(() => {
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 300);

    setTimeout(() => {
        heroPara.style.opacity = '1';
        heroPara.style.transform = 'translateY(0)';
    }, 600);

    setTimeout(() => {
        heroBtn.style.opacity = '1';
        heroBtn.style.transform = 'translateY(0)';
    }, 900);

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Reveal on Scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const revealTop = revealElements[i].getBoundingClientRect().top;
            const revealPoint = 150;

            if (revealTop < windowHeight - revealPoint) {
                revealElements[i].classList.add('active');
            }
        }
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Smooth Scroll for Nav Links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return; // Skip modal triggers
            if(!targetId.startsWith('#')) return; // Allow normal navigation for external links like leadership.html
            
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Leadership Modal Logic
    const modal = document.getElementById('leadership-modal');
    const navBtn = document.getElementById('nav-leadership-btn');
    const aboutBtn = document.getElementById('about-leadership-btn');

    function openModal(e) {
        if(e) e.preventDefault();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
        document.body.style.overflow = '';
    }

    if (navBtn) navBtn.addEventListener('click', openModal);
    if (aboutBtn) aboutBtn.addEventListener('click', openModal);

    // Service Modals Logic
    document.querySelectorAll('.view-services-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            const targetModal = document.getElementById(targetId);
            if (targetModal) {
                closeAllModals();
                targetModal.classList.add('show');
                document.body.style.overflow = 'hidden';

                // Apply staggered animation to list items
                const listItems = targetModal.querySelectorAll('.services-list li');
                listItems.forEach((li, index) => {
                    li.classList.remove('animate-in');
                    li.style.animationDelay = '0s';
                    
                    // Force reflow
                    void li.offsetWidth;
                    
                    li.style.animationDelay = `${index * 0.1}s`;
                    li.classList.add('animate-in');
                });
            }
        });
    });

    // Close buttons for all modals
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    // =========================================================
    // JAYUKTI FAQ CHATBOT
    // =========================================================
    initJayuktiChatbot();
});

function initJayuktiChatbot() {
    if (document.getElementById('jayukti-chat-launcher')) return;

    // 1. Create and inject launcher & chat window
    const launcher = document.createElement('div');
    launcher.id = 'jayukti-chat-launcher';
    launcher.className = 'jayukti-chat-launcher';
    launcher.setAttribute('role', 'button');
    launcher.setAttribute('aria-label', 'Chat with Jayukti');
    launcher.innerHTML = `
        <div class="jayukti-launcher-pulse"></div>
        <i class="fas fa-comment-dots"></i>
        <span class="jayukti-launcher-badge">FAQ</span>
        <span class="jayukti-launcher-tooltip">Ask Jayukti 👋</span>
    `;

    const chatWindow = document.createElement('div');
    chatWindow.id = 'jayukti-chat-window';
    chatWindow.className = 'jayukti-chat-window';
    chatWindow.innerHTML = `
        <div class="jayukti-chat-header">
            <div class="jayukti-chat-brand">
                <div class="jayukti-chat-avatar-wrap">
                    <img src="logo.jpeg" alt="Jayukti Assistant" class="jayukti-chat-avatar">
                    <span class="jayukti-chat-status-dot"></span>
                </div>
                <div class="jayukti-chat-title-group">
                    <h4>Jayukti <span class="jayukti-chat-badge">AI Assistant</span></h4>
                    <p class="jayukti-chat-status-text">
                        <i class="fas fa-circle" style="color: #00e676; font-size: 0.5rem;"></i>
                        Online • 24/7 FAQ Guide
                    </p>
                </div>
            </div>
            <div class="jayukti-chat-header-actions">
                <button type="button" class="jayukti-chat-action-btn" id="jayukti-chat-reset" title="Reset Conversation">
                    <i class="fas fa-rotate-right"></i>
                </button>
                <button type="button" class="jayukti-chat-action-btn" id="jayukti-chat-close" title="Close Chat">
                    <i class="fas fa-xmark"></i>
                </button>
            </div>
        </div>

        <div class="jayukti-chat-body" id="jayukti-chat-body">
            <!-- Messages will be rendered here -->
        </div>

        <div class="jayukti-chat-footer">
            <form class="jayukti-chat-input-form" id="jayukti-chat-form">
                <input type="text" id="jayukti-chat-input" class="jayukti-chat-input" 
                       placeholder="Ask Jayukti a question..." autocomplete="off">
                <button type="submit" class="jayukti-chat-send-btn" title="Send message">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(chatWindow);

    const chatBody = document.getElementById('jayukti-chat-body');
    const chatForm = document.getElementById('jayukti-chat-form');
    const chatInput = document.getElementById('jayukti-chat-input');
    const closeBtn = document.getElementById('jayukti-chat-close');
    const resetBtn = document.getElementById('jayukti-chat-reset');

    let isChatOpen = false;
    let isFirstOpen = true;

    // Toggle Chat Window
    function toggleChat(forceOpen = null) {
        isChatOpen = forceOpen !== null ? forceOpen : !isChatOpen;
        if (isChatOpen) {
            chatWindow.classList.add('open');
            launcher.classList.add('active');
            launcher.querySelector('i').className = 'fas fa-chevron-down';
            if (isFirstOpen) {
                renderWelcomeMessage();
                isFirstOpen = false;
            }
            setTimeout(() => chatInput.focus(), 300);
        } else {
            chatWindow.classList.remove('open');
            launcher.classList.remove('active');
            launcher.querySelector('i').className = 'fas fa-comment-dots';
        }
    }

    launcher.addEventListener('click', () => toggleChat());
    closeBtn.addEventListener('click', () => toggleChat(false));
    resetBtn.addEventListener('click', () => {
        chatBody.innerHTML = '';
        renderWelcomeMessage();
    });

    // Close on Escape when focused
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isChatOpen) toggleChat(false);
    });

    // Render Welcome Message
    function renderWelcomeMessage() {
        appendBotMessage(`
            <p>👋 Hello! I am <strong>Jayukti</strong>, your virtual guide for <strong>Jayukti Group of Companies</strong>.</p>
            <p>I can help answer your questions about our global minerals, port network, trade terms, leadership, and group entities.</p>
            <div class="jayukti-suggestions-wrapper">
                <span class="jayukti-suggestions-label">Popular Topics:</span>
                <div class="jayukti-chips-grid">
                    <button class="jayukti-chip" data-query="What minerals and products do you supply?"><i class="fas fa-gem"></i> Minerals &amp; Products</button>
                    <button class="jayukti-chip" data-query="Tell me about your 5 port network and dump yard"><i class="fas fa-anchor"></i> 5 Ports &amp; Logistics</button>
                    <button class="jayukti-chip" data-query="What trade terms and delivery solutions do you offer?"><i class="fas fa-file-contract"></i> Trade Terms (CIF/FOB)</button>
                    <button class="jayukti-chip" data-query="Who is in the leadership team?"><i class="fas fa-users"></i> Leadership Team</button>
                    <button class="jayukti-chip" data-query="Where are your offices and how do I contact you?"><i class="fas fa-location-dot"></i> Contact &amp; Offices</button>
                    <button class="jayukti-chip" data-query="What are the group entities of Jayukti?"><i class="fas fa-sitemap"></i> Business Verticals</button>
                </div>
            </div>
        `);
    }

    // Append User Message
    function appendUserMessage(text) {
        const row = document.createElement('div');
        row.className = 'jayukti-msg-row user';
        row.innerHTML = `<div class="jayukti-msg-bubble"><p>${escapeHtml(text)}</p></div>`;
        chatBody.appendChild(row);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Append Bot Message
    function appendBotMessage(html) {
        const row = document.createElement('div');
        row.className = 'jayukti-msg-row bot';
        row.innerHTML = `
            <img src="logo.jpeg" alt="Jayukti" class="jayukti-msg-avatar">
            <div class="jayukti-msg-bubble">${html}</div>
        `;
        chatBody.appendChild(row);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Attach event listeners to chips in this message
        row.querySelectorAll('.jayukti-chip').forEach(chip => {
            chip.addEventListener('click', function() {
                const query = this.getAttribute('data-query');
                handleUserQuery(query);
            });
        });
    }

    // Show Typing Indicator
    function showTypingIndicator() {
        const typing = document.createElement('div');
        typing.className = 'jayukti-msg-row bot';
        typing.id = 'jayukti-typing-indicator';
        typing.innerHTML = `
            <img src="logo.jpeg" alt="Jayukti" class="jayukti-msg-avatar">
            <div class="jayukti-msg-bubble jayukti-typing">
                <span></span><span></span><span></span>
            </div>
        `;
        chatBody.appendChild(typing);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('jayukti-typing-indicator');
        if (indicator) indicator.remove();
    }

    // Handle Query submission
    function handleUserQuery(query) {
        if (!query || !query.trim()) return;
        appendUserMessage(query.trim());
        chatInput.value = '';

        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            const responseHtml = getBotResponse(query.trim());
            appendBotMessage(responseHtml);
        }, 450);
    }

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleUserQuery(chatInput.value);
    });

    // Escape HTML helper
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Knowledge Base and FAQ matcher
    function getBotResponse(query) {
        const q = query.toLowerCase();

        // 1. Minerals & Products
        if (q.includes('iron ore') || q.includes('hematite') || q.includes('magnetite') || q.includes('lump') || q.includes('fine') || q.includes('pellet')) {
            return `
                <p><strong>Iron Ore Capabilities:</strong></p>
                <p>Jayukti supplies high-grade iron ore tailored for industrial smelting and metallurgy:</p>
                <ul>
                    <li><strong>Hematite Ore</strong> &amp; <strong>Magnetite Ore</strong></li>
                    <li><strong>Iron Ore Lumps</strong> (High-density calibrated sizes)</li>
                    <li><strong>Iron Ore Fines</strong> (Sinter &amp; pellet feed)</li>
                    <li><strong>Iron Ore Pellets</strong></li>
                </ul>
                <p>We source globally and ship through our dedicated port network.</p>
                ${renderSuggestedChips(['What ports do you ship from?', 'What trade terms do you offer?', 'Contact sales team'])}
            `;
        }

        if (q.includes('quartz') || q.includes('pebble')) {
            return `
                <p><strong>Quartz &amp; Stone Portfolio:</strong></p>
                <p>We supply premium silica quartz for glass, semiconductor, and ceramic applications:</p>
                <ul>
                    <li><strong>Glassy Quartz</strong> (High purity)</li>
                    <li><strong>Semi-Glassy Quartz</strong></li>
                    <li><strong>Granular Quartz</strong></li>
                    <li><strong>Quartz Powder</strong></li>
                    <li><strong>Pebbles</strong> (Calibrated industrial &amp; decorative)</li>
                </ul>
                ${renderSuggestedChips(['Explore other minerals', 'Trade Terms (CIF/FOB)', 'Request a quote'])}
            `;
        }

        if (q.includes('bauxite') || q.includes('limestone') || q.includes('dolomite') || q.includes('alumina') || q.includes('coal') || q.includes('coke') || q.includes('zinc') || q.includes('ggbfs') || q.includes('lime')) {
            return `
                <p><strong>Industrial Minerals &amp; Raw Materials:</strong></p>
                <p>Our core commodities include:</p>
                <ul>
                    <li><strong>Bauxite</strong> &amp; <strong>Calcined Alumina / Alumina Hydrate</strong></li>
                    <li><strong>Limestone</strong> (Oman &amp; Indian origins)</li>
                    <li><strong>Dolomite</strong> (Oman &amp; Indian origins)</li>
                    <li><strong>Quick Lime &amp; Hydrated Lime</strong> (Oman) and <strong>Lime Powder</strong></li>
                    <li><strong>Coal</strong>, <strong>Coke Dust</strong> &amp; <strong>GGBFS</strong></li>
                    <li><strong>Zinc Oxide</strong></li>
                </ul>
                ${renderSuggestedChips(['What port facilities do you have?', 'Delivery & trade terms', 'Contact sales'])}
            `;
        }

        if (q.includes('product') || q.includes('mineral') || q.includes('supply') || q.includes('commodit') || q.includes('material') || q.includes('goods')) {
            return `
                <p><strong>Global Minerals &amp; Sourcing Portfolio:</strong></p>
                <p>Jayukti International supplies raw materials to heavy industry worldwide:</p>
                <ul>
                    <li><strong>Ores:</strong> Iron Ore (Hematite, Magnetite, Lumps, Fines, Pellets), Bauxite</li>
                    <li><strong>Silica:</strong> Glassy, Semi-Glassy &amp; Granular Quartz, Quartz Powder, Pebbles</li>
                    <li><strong>Alumina &amp; Carbon:</strong> Calcined Alumina, Alumina Hydrate, Coal, Coke Dust, GGBFS</li>
                    <li><strong>Lime &amp; Dolomite:</strong> Limestone, Quick Lime, Hydrated Lime, Lime Powder, Dolomite</li>
                    <li><strong>Chemicals &amp; Others:</strong> Zinc Oxide</li>
                    <li><strong>Agro &amp; Marine:</strong> Organic Vegetables &amp; Fruits, Frozen Sea Foods</li>
                </ul>
                ${renderSuggestedChips(['What ports do you use?', 'What are your trade terms?', 'How to get a quote'])}
            `;
        }

        // 2. Ports, Dump Yard & Logistics
        if (q.includes('port') || q.includes('network') || q.includes('vizag') || q.includes('visakhapatnam') || q.includes('goa') || q.includes('paradeep') || q.includes('belekeri') || q.includes('mayuri') || q.includes('dump yard') || q.includes('yard') || q.includes('logistic') || q.includes('storage') || q.includes('shipping')) {
            return `
                <p><strong>Our 5-Port Shipping Network:</strong></p>
                <p>Jayukti maintains active handling operations across 5 major coastal ports:</p>
                <ul>
                    <li>⚓ <strong>VIZAG</strong> (Visakhapatnam Port)</li>
                    <li>⚓ <strong>GOA</strong></li>
                    <li>⚓ <strong>PARADEEP</strong></li>
                    <li>⚓ <strong>BELEKERI</strong></li>
                    <li>⚓ <strong>MAYURI</strong></li>
                </ul>
                <p><strong>Dedicated Dump Yard Facility at Vizag Port:</strong><br>
                Ensures efficient bulk handling, secure storage, and timely vessel dispatch with minimal turnaround time.</p>
                ${renderSuggestedChips(['What trade terms do you offer?', 'View full mineral catalog', 'Contact Vizag office'])}
            `;
        }

        // 3. Trade Terms & Delivery Solutions
        if (q.includes('term') || q.includes('cif') || q.includes('fob') || q.includes('cnf') || q.includes('for') || q.includes('incoterm') || q.includes('delivery') || q.includes('door') || q.includes('cy') || q.includes('freight')) {
            return `
                <p><strong>Trade Terms &amp; Delivery Solutions:</strong></p>
                <p>We provide flexible international contracting terms:</p>
                <ul>
                    <li><strong>CIF</strong> – Cost, Insurance, and Freight</li>
                    <li><strong>CNF</strong> – Cost and Freight</li>
                    <li><strong>FOB</strong> – Free on Board</li>
                    <li><strong>FOR</strong> – Free on Rail</li>
                </ul>
                <p><strong>Steamship Line Delivery (CY to Door):</strong><br>
                Seamless transport from Container Yard (CY) directly to your doorstep with trusted global ocean carriers.</p>
                ${renderSuggestedChips(['Tell me about 5 ports network', 'List of available minerals', 'Request a quote'])}
            `;
        }

        // 4. Contact, Office & Location
        if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('address') || q.includes('office') || q.includes('location') || q.includes('reach') || q.includes('call') || q.includes('hyderabad') || q.includes('number')) {
            return `
                <p><strong>Head Office &amp; Branch Contact:</strong></p>
                <p>📍 <strong>Head Office (Visakhapatnam):</strong><br>
                6-23-5/1, Flat No. PH2, East End Enclave Apartments, East Point Colony, Opp Vuda Park, Visakhapatnam – 530017, AP, India.</p>
                <p>📍 <strong>Branch Office (Hyderabad):</strong><br>
                Plot No. 18, RNS Colony, Boduppal, K.V. Rangareddy, Telangana, India.</p>
                <p>📞 <strong>Phone:</strong> <a href="tel:+918328101303">+91 8328 101 303</a>, 8297182755, 9966749762<br>
                ✉️ <strong>Email:</strong> <a href="mailto:info@jayukti.com">info@jayukti.com</a><br>
                🌐 <strong>Website:</strong> <a href="https://www.jayukti.com" target="_blank">www.jayukti.com</a><br>
                🏛️ <strong>GSTIN:</strong> AA370526015425A</p>
                ${renderSuggestedChips(['Who is in leadership?', 'Explore minerals & products'])}
            `;
        }

        // 5. Leadership Team
        if (q.includes('leader') || q.includes('director') || q.includes('founder') || q.includes('management') || q.includes('team') || q.includes('md') || q.includes('ceo') || q.includes('cto') || q.includes('who is') || q.includes('jayasree') || q.includes('chandra') || q.includes('satish') || q.includes('vijaya') || q.includes('mastanamma') || q.includes('varshini')) {
            return `
                <p><strong>Jayukti Leadership Team:</strong></p>
                <ol style="margin-left: 18px; padding: 0;">
                    <li><strong>Dr. M V N Jaya Sree</strong> – Managing Director</li>
                    <li><strong>Dr. M. Chandra Sekhar</strong> – Director</li>
                    <li><strong>Satish Kumar Mirtipati</strong> – Chief Executive Officer (CEO) &amp; CTO</li>
                    <li><strong>Krovidi Ellari Vijaya Latha</strong> – Director</li>
                    <li><strong>Dr. D Mastanamma</strong> – Director</li>
                    <li><strong>M Siri Varshini</strong> – Manager</li>
                </ol>
                <p>You can read their full bios on our <a href="leadership.html">Leadership page</a>.</p>
                ${renderSuggestedChips(['Contact the leadership', 'Explore business verticals'])}
            `;
        }

        // 6. Business Entities & Verticals
        if (q.includes('entit') || q.includes('vertical') || q.includes('group') || q.includes('ecosystem') || q.includes('infra') || q.includes('estates') || q.includes('research') || q.includes('software') || q.includes('trust')) {
            return `
                <p><strong>Jayukti Group Ecosystem:</strong></p>
                <p>Our operations span 6 specialized entities:</p>
                <ul>
                    <li>🚢 <strong>Jayukti Imports &amp; Exports:</strong> Global minerals, commodities &amp; international trade.</li>
                    <li>🏗️ <strong>Jayukti Infra Projects:</strong> Infrastructure, civil engineering &amp; smart cities.</li>
                    <li>🏢 <strong>Jayukti Estates:</strong> Residential &amp; commercial luxury property developments.</li>
                    <li>🔬 <strong>Jayukti Research Hub:</strong> Advanced R&amp;D in AI, IoT &amp; digital infrastructure.</li>
                    <li>💻 <strong>Jayukti Software Solutions:</strong> Enterprise software, cloud &amp; digital transformation.</li>
                    <li>🤝 <strong>Jayukti Trust:</strong> Philanthropy, education &amp; community empowerment.</li>
                </ul>
                ${renderSuggestedChips(['Minerals & Products', 'Contact our offices'])}
            `;
        }

        // 7. Careers & Jobs
        if (q.includes('career') || q.includes('job') || q.includes('hiring') || q.includes('recruit') || q.includes('apply') || q.includes('resume') || q.includes('work')) {
            return `
                <p><strong>Careers at Jayukti:</strong></p>
                <p>We are always looking for passionate professionals across global trading, infrastructure, engineering, and technology.</p>
                <p>Please check our <a href="careers.html">Careers &amp; Recruitment</a> page or email your resume directly to <a href="mailto:info@jayukti.com">info@jayukti.com</a>.</p>
                ${renderSuggestedChips(['About Jayukti Group', 'Contact details'])}
            `;
        }

        // 8. Greetings & Help
        if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('namaste') || q.includes('morning') || q.includes('evening') || q.includes('afternoon') || q === 'help') {
            return `
                <p>Hello! 😊 How can I assist you with Jayukti Group today?</p>
                <p>Choose an option below or type your question:</p>
                ${renderSuggestedChips(['Minerals & Products', '5 Ports & Logistics', 'Trade Terms (CIF/FOB)', 'Leadership Team', 'Offices & Contact'])}
            `;
        }

        if (q.includes('thank') || q.includes('thanks') || q.includes('great') || q.includes('good') || q.includes('awesome')) {
            return `
                <p>You're welcome! Glad I could help. Let me know if you have any more questions about Jayukti Group. Have a wonderful day! ✨</p>
                ${renderSuggestedChips(['Minerals & Products', 'Contact sales'])}
            `;
        }

        // Default Fallback
        return `
            <p>I would be delighted to assist you with that! Here is quick information about <strong>Jayukti Group</strong>:</p>
            <ul>
                <li><strong>Core Verticals:</strong> Minerals &amp; Sourcing, Infrastructure, Estates, Research &amp; Software.</li>
                <li><strong>Port Network:</strong> 5 major coastal ports with dedicated dump yard at Vizag Port.</li>
                <li><strong>Direct Support:</strong> Call <a href="tel:+918328101303">+91 8328 101 303</a> or email <a href="mailto:info@jayukti.com">info@jayukti.com</a>.</li>
            </ul>
            <p>Or tap any topic below to learn more:</p>
            ${renderSuggestedChips(['Minerals & Products', '5 Ports & Logistics', 'Trade Terms (CIF/FOB)', 'Leadership Team', 'Contact Offices'])}
        `;
    }

    // Helper to generate clickable suggestion chips
    function renderSuggestedChips(chips) {
        let html = '<div class="jayukti-suggestions-wrapper"><div class="jayukti-chips-grid">';
        chips.forEach(chip => {
            html += `<button class="jayukti-chip" data-query="${escapeHtml(chip)}">${escapeHtml(chip)}</button>`;
        });
        html += '</div></div>';
        return html;
    }
}
