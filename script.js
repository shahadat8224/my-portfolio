/**
 * SHAHADAT ALIF - SITE LOGIC
 * Includes: GitHub Redirect, AI Chat, Animations, and UI Interactions
 */

// 1. IMMEDIATE GITHUB REDIRECT (Runs before anything else)
if (window.location.hostname === "shahdat8224.github.io") {
    window.location.replace("https://shahdat8224.vercel.app/");
}

document.addEventListener('DOMContentLoaded', function() {
    // --- UI Element Selectors ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const emailBtn = document.getElementById('emailBtn');
    const contactEmailBtn = document.getElementById('contactEmailBtn');
    const scrollProgress = document.getElementById('scrollProgress');
    const loadingBar = document.getElementById('loadingBar');
    const welcomeBubble = document.getElementById('welcome-bubble');
    const emailAddress = 'shahadatislamalf@gmail.com';

    // --- Page Load & Progress ---
    window.addEventListener('load', () => {
        setTimeout(() => { if (loadingBar) loadingBar.style.display = 'none'; }, 800);
    });

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgress) scrollProgress.style.width = scrolled + '%';
    });

    // --- Welcome Bubble (4 second delay) ---
    setTimeout(() => {
        if (welcomeBubble) welcomeBubble.classList.add('show');
    }, 4000);

    // --- Mobile Menu Toggle ---
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = mobileNav.classList.toggle('active');
            mobileNav.classList.toggle('hidden');
            
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = isActive ? 'fas fa-times text-lg' : 'fas fa-ellipsis-v text-lg';
            }
        });
    }

    // Close mobile menu on link click or clicking outside
    document.addEventListener('click', (e) => {
        if (mobileNav && !mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileNav.classList.remove('active');
            mobileNav.classList.add('hidden');
        }
    });

    // --- Email Copy Functionality ---
    function handleEmailCopy(button) {
        if (!button) return;
        const originalText = button.innerHTML;
        
        navigator.clipboard.writeText(emailAddress).then(() => {
            button.classList.add('email-copied');
            button.innerHTML = '<i class="fas fa-check mr-2"></i> Email Copied!';
            
            setTimeout(() => {
                button.classList.remove('email-copied');
                button.innerHTML = originalText;
                if (confirm('Email copied! Open your email app?')) {
                    window.location.href = `mailto:${emailAddress}`;
                }
            }, 2000);
        });
    }

    if (emailBtn) emailBtn.addEventListener('click', () => handleEmailCopy(emailBtn));
    if (contactEmailBtn) contactEmailBtn.addEventListener('click', () => handleEmailCopy(contactEmailBtn));

    // --- Intersection Observer for Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up').forEach(el => observer.observe(el));

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// --- AI Chat Logic (Outside DOMContentLoaded so toggleChat works from HTML) ---
function toggleChat() {
    const chat = document.getElementById('chat-window');
    const bubble = document.getElementById('welcome-bubble');
    if (bubble) bubble.classList.remove('show');
    
    if (chat) {
        chat.style.display = (chat.style.display === 'none' || chat.style.display === '') ? 'flex' : 'none';
    }
}

async function sendToGemini() {
    const input = document.getElementById('user-input');
    const content = document.getElementById('chat-content');
    if (!input || !content || !input.value.trim()) return;

    const userMessage = input.value.trim();
    content.innerHTML += `<div class="user-msg" style="align-self: flex-end; background: #0ea5e9; color: white; padding: 10px; border-radius: 12px 12px 0 12px; margin-bottom: 10px; max-width: 85%; font-size: 14px;">${userMessage}</div>`;
    input.value = '';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    content.appendChild(typingDiv);
    content.scrollTop = content.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });
        const data = await response.json();
        document.getElementById('typing-indicator')?.remove();
        
        const aiReply = data.reply || "I'm having trouble thinking right now.";
        content.innerHTML += `<div class="ai-msg" style="align-self: flex-start; background: #334155; color: white; padding: 10px; border-radius: 12px 12px 12px 0; margin-bottom: 10px; max-width: 85%; font-size: 14px;">${aiReply}</div>`;
    } catch (error) {
        document.getElementById('typing-indicator')?.remove();
        content.innerHTML += `<div class="ai-msg" style="color: #ef4444; font-size: 12px;">Connection lost. Check your internet.</div>`;
    }
    content.scrollTop = content.scrollHeight;
}

// Enter key support
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.activeElement.id === 'user-input') {
        sendToGemini();
    }
});
