/**
 * VIBELORD - Coming Soon Landing Page
 * Luxury jQuery animations: fade-in, typing, parallax, floating
 */
(function($) {
    'use strict';

    const HYPE_LINES = [
        'Your Event Deserves Energy.',
        'Turning Crowds Into Moments.',
        'Bringing the Hype to Every Stage.'
    ];

    // Wait for DOM ready
    $(document).ready(function() {
        initPageLoad();
        initHeroAnimations();
        initTypingEffect();
        initParallax();
        initFloatingImage();
        initScrollAnimations();

        $('.scroll-indicator').on('click', function() {
            const $about = $('#about');
            if ($about.length) $('html, body').animate({ scrollTop: $about.offset().top }, 800);
        });
    });

    /**
     * Smooth fade-in on page load
     */
    function initPageLoad() {
        $('body').css('opacity', 0);
        $('body').animate({ opacity: 1 }, 800, function() {
            $(this).addClass('page-loaded');
        });
    }

    /**
     * Hero text fade-in sequence (staggered lines)
     */
    function initHeroAnimations() {
        const $line1 = $('.hero-headline .line-1');
        const $line2 = $('.hero-headline .line-2');
        const $line3 = $('.hero-headline .line-3');
        const $line4 = $('.hero-headline .line-4');
        const $subtext = $('.hero-subtext');
        const $badge = $('.coming-soon-badge');

        setTimeout(function() { $line1.addClass('visible'); }, 400);
        setTimeout(function() { $line2.addClass('visible'); }, 700);
        setTimeout(function() { $line3.addClass('visible'); }, 1000);
        setTimeout(function() { $line4.addClass('visible'); }, 1200);
        setTimeout(function() { $subtext.addClass('visible'); }, 1500);
        setTimeout(function() { $badge.addClass('visible'); }, 1900);
    }

    /**
     * Typing effect for rotating hype lines
     */
    function initTypingEffect() {
        const $typedText = $('.typed-text');
        let lineIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 120;
        const deleteSpeed = 100;
        const pauseAfterType = 1500;
        const pauseAfterDelete = 400;

        function type() {
            const currentLine = HYPE_LINES[lineIndex];

            if (isDeleting) {
                $typedText.text(currentLine.substring(0, charIndex - 1));
                charIndex--;
                setTimeout(type, deleteSpeed);
            } else {
                $typedText.text(currentLine.substring(0, charIndex + 1));
                charIndex++;
                if (charIndex === currentLine.length) {
                    isDeleting = true;
                    setTimeout(type, pauseAfterType);
                } else {
                    setTimeout(type, typeSpeed);
                }
            }

            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                lineIndex = (lineIndex + 1) % HYPE_LINES.length;
                setTimeout(type, pauseAfterDelete);
            }
        }

        // Start typing after hero animations
        setTimeout(type, 2500);
    }

    /**
     * Full-page background: mousemove parallax + scroll effects
     */
    function initParallax() {
        const $bgImage = $('#page-bg-image');
        const $overlay = $('#page-bg-overlay');
        if (!$bgImage.length) return;

        // Mouse parallax
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        const mouseIntensity = 12;

        $(window).on('mousemove', function(e) {
            const w = $(window).width();
            const h = $(window).height();
            mouseX = (e.clientX - w / 2) / w;
            mouseY = (e.clientY - h / 2) / h;
        });

        $(window).on('mouseleave', function() {
            mouseX = 0;
            mouseY = 0;
        });

        // Scroll-based overlay: darkens as user scrolls for better contrast
        if ($overlay.length) {
            $(window).on('scroll', function() {
                const scrollTop = $(window).scrollTop();
                const scrollMax = Math.max($(document).height() - $(window).height(), 1);
                const scrollProgress = Math.min(scrollTop / scrollMax, 1);
                $overlay.css('opacity', 0.85 + scrollProgress * 0.15);
            });
        }

        // Mouse movement animation loop
        function updateMouseParallax() {
            currentX += (mouseX * mouseIntensity - currentX) * 0.06;
            currentY += (mouseY * mouseIntensity - currentY) * 0.06;

            const scrollTop = $(window).scrollTop();
            const docHeight = $(document).height();
            const winHeight = $(window).height();
            const scrollMax = docHeight - winHeight;
            const scrollProgress = scrollMax > 0 ? Math.min(scrollTop / scrollMax, 1) : 0;
            const scale = 1.05 + scrollProgress * 0.1;
            const parallaxY = scrollTop * 0.4;

            $bgImage.css('transform', 
                `translate(${currentX}px, ${currentY - parallaxY}px) scale(${scale})`);
            requestAnimationFrame(updateMouseParallax);
        }
        updateMouseParallax();
    }

    function initFloatingImage() {
        // Handled in initParallax
    }

    /**
     * Scroll-triggered animations for sections
     */
    function initScrollAnimations() {
        const $about = $('.about-content');
        const $banner = $('.coming-soon-banner');
        const $socialLinks = $('.social-links');
        const $links = $('.social-link');

        $about.css({ opacity: 0, transform: 'translateY(40px)' });
        $banner.css({ opacity: 0, transform: 'translateY(40px)' });
        $links.css({ opacity: 0, transform: 'scale(0.8)' });

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const $el = $(entry.target);
                    $el.addClass('visible');

                    if ($el.hasClass('social-links')) {
                        $links.each(function(i) {
                            const $link = $(this);
                            setTimeout(function() {
                                $link.css({
                                    opacity: 1,
                                    transform: 'scale(1)',
                                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                                });
                            }, i * 120);
                        });
                    }
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

        if ($about.length) observer.observe($about[0]);
        if ($banner.length) observer.observe($banner[0]);
        if ($socialLinks.length) observer.observe($socialLinks[0]);

        const style = document.createElement('style');
        style.textContent = `
            .about-content.visible,
            .coming-soon-banner.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
        `;
        document.head.appendChild(style);
    }

})(jQuery);
