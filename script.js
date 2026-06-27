/**
 * KrakenLabs - Script principal
 * Gerencia scroll animations, scroll suave, efeito magnético e preferência de movimento
 */
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================================
    // 1. VERIFICA PREFERÊNCIA POR MOVIMENTO REDUZIDO
    // ============================================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Se o usuário prefere movimento reduzido, desativamos todas as animações
    if (prefersReducedMotion) {
        // Torna todos os elementos .reveal visíveis imediatamente
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        // Não executa o restante das animações
        return;
    }

    // ============================================================
    // 2. SCROLL REVEAL (IntersectionObserver)
    // ============================================================
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target); // otimização
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback para navegadores sem suporte: exibe todos imediatamente
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // ============================================================
    // 3. SCROLL SUAVE PARA LINKS ÂNCORA
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================================
    // 4. EFEITO MAGNÉTICO NO BOTÃO CTA
    // ============================================================
    const ctaBtn = document.querySelector('.cta-button');
    if (ctaBtn) {
        ctaBtn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            this.style.transform =
                `translate(${x * 0.08}px, ${y * 0.08}px) scale(1.02)`;
        });
        ctaBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0) scale(1)';
        });
    }

    // ============================================================
    // 5. PAUSA VÍDEO QUANDO ABA NÃO ESTIVER VISÍVEL (economia)
    // ============================================================
    const video = document.querySelector('.hero-video');
    if (video) {
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                video.pause();
            } else if (video.paused && video.autoplay) {
                video.play().catch(() => {});
            }
        }); }
    

    
});