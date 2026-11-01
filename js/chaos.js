// chaos.js – Satyagraha Chaos Engine for Swaraj Dates™

window.Chaos = (function() {
    let failedAttempts = 0;
    let toastInterval = null;
    let mercyTimer = null;
    let mercyTriggered = false;
    let onMercyCallback = null;

    // Toast Notification System
    function showToast(message, duration = 4000) {
        const container = document.getElementById("toast-container");
        if (!container) return;
        
        const toast = document.createElement("div");
        toast.className = "bureau-toast";
        toast.innerHTML = `<span class="toast-stamp">NOTICE</span><span class="toast-text">${message}</span>`;
        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add("visible");
        });

        setTimeout(() => {
            toast.classList.remove("visible");
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 400);
        }, duration);
    }

    function startToasts() {
        if (toastInterval) clearInterval(toastInterval);
        
        // Random toast every 8-12 seconds
        function scheduleNext() {
            const delay = 8000 + Math.random() * 4000;
            toastInterval = setTimeout(() => {
                if (window.Copy && window.Copy.notifications) {
                    const list = window.Copy.notifications;
                    const randomMsg = list[Math.floor(Math.random() * list.length)];
                    showToast(randomMsg);
                }
                scheduleNext();
            }, delay);
        }
        scheduleNext();
    }

    // Mercy Rule System
    function initMercyRule(onMercy) {
        onMercyCallback = onMercy;
        
        // Timer for 90 seconds
        if (mercyTimer) clearTimeout(mercyTimer);
        mercyTimer = setTimeout(() => {
            triggerMercyBanner();
        }, 90000); // 90 seconds
    }

    function recordFailure() {
        failedAttempts++;
        if (failedAttempts >= 10 && !mercyTriggered) {
            triggerMercyBanner();
        }
    }

    function triggerMercyBanner() {
        if (mercyTriggered) return;
        mercyTriggered = true;

        const banner = document.getElementById("mercy-banner");
        if (banner) {
            banner.classList.remove("hidden");
            banner.scrollIntoView({ behavior: "smooth" });
        }
        showToast("🕊️ " + window.Copy.chaos.mercyTitle, 6000);
    }

    function claimMercy() {
        if (typeof onMercyCallback === "function") {
            onMercyCallback();
        }
    }

    // Non-Cooperation Evasive Button (Satyagraha Button)
    function attachNonCooperation(buttonEl, containerEl, onConfirm) {
        if (!buttonEl || !containerEl) return;

        let hoverTimer = null;
        let touchTimer = null;
        let isCalm = false;
        let lastMove = 0;

        function makeCalm() {
            isCalm = true;
            buttonEl.classList.add("calm");
            buttonEl.title = window.Copy.chaos.nonCooperationCalm;
            showToast(window.Copy.chaos.nonCooperationCalm, 3000);
        }

        function resetCalm() {
            isCalm = false;
            buttonEl.classList.remove("calm");
        }

        function evade(e) {
            if (isCalm) return; // If calm has been achieved, don't evade!

            const now = Date.now();
            if (now - lastMove < 80) return; // Debounce rapid calls
            lastMove = now;

            const cRect = containerEl.getBoundingClientRect();
            const bRect = buttonEl.getBoundingClientRect();

            // Calculate mouse distance
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const btnCenterX = bRect.left + bRect.width / 2;
            const btnCenterY = bRect.top + bRect.height / 2;
            const dist = Math.hypot(mouseX - btnCenterX, mouseY - btnCenterY);

            // Evade only when approached quickly/closely (< 90px)
            if (dist < 90) {
                recordFailure();
                
                // Calculate new position staying strictly within container
                const maxX = Math.max(10, cRect.width - bRect.width - 20);
                const maxY = Math.max(10, cRect.height - bRect.height - 20);
                
                // Move in opposite direction or random safe zone
                const randomX = Math.floor(Math.random() * maxX);
                const randomY = Math.floor(Math.random() * maxY);

                buttonEl.style.position = "absolute";
                buttonEl.style.left = `${randomX}px`;
                buttonEl.style.top = `${randomY}px`;
            }
        }

        // Proximity evasion on container mousemove
        containerEl.addEventListener("mousemove", evade);

        // Calm hover: If cursor stays over the button for 3 seconds without frantic moving
        buttonEl.addEventListener("mouseenter", () => {
            if (isCalm) return;
            hoverTimer = setTimeout(() => {
                makeCalm();
            }, 3000);
        });

        buttonEl.addEventListener("mouseleave", () => {
            if (hoverTimer) clearTimeout(hoverTimer);
            if (!isCalm) {
                // Keep trying
            }
        });

        // Touch support: 2-second hold
        buttonEl.addEventListener("touchstart", (e) => {
            touchTimer = setTimeout(() => {
                makeCalm();
                showToast("✨ Touch Satyagraha Complete! Hold honored.", 2000);
            }, 2000);
        }, { passive: true });

        buttonEl.addEventListener("touchend", () => {
            if (touchTimer) clearTimeout(touchTimer);
        });

        // Keyboard accessibility: Enter or Space directly confirms
        buttonEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onConfirm();
            }
        });

        // Click handler
        buttonEl.addEventListener("click", (e) => {
            if (isCalm || e.isTrusted) {
                onConfirm();
            } else {
                recordFailure();
            }
        });
    }

    // Salt Tax Engine
    function initSaltTax(options) {
        const { targetClicks = 10, onUpdate, onComplete } = options;
        let currentClicks = 0;

        return {
            click: function() {
                if (currentClicks < targetClicks) {
                    currentClicks++;
                    if (onUpdate) onUpdate(currentClicks, targetClicks);
                    if (currentClicks >= targetClicks) {
                        if (onComplete) onComplete();
                    }
                }
                return currentClicks;
            },
            getCount: function() {
                return currentClicks;
            },
            reset: function() {
                currentClicks = 0;
            }
        };
    }

    // Quit India feature
    function initQuitIndia() {
        const quitBtn = document.getElementById("quit-india-btn");
        const quitOverlay = document.getElementById("quit-india-overlay");
        const returnBtn = document.getElementById("quit-india-return");

        if (quitBtn && quitOverlay) {
            quitBtn.addEventListener("click", () => {
                quitOverlay.classList.remove("hidden");
                quitOverlay.classList.add("visible");
            });
        }

        if (returnBtn && quitOverlay) {
            returnBtn.addEventListener("click", () => {
                quitOverlay.classList.remove("visible");
                setTimeout(() => {
                    quitOverlay.classList.add("hidden");
                }, 300);
            });
        }
    }

    return {
        showToast,
        startToasts,
        initMercyRule,
        recordFailure,
        claimMercy,
        attachNonCooperation,
        initSaltTax,
        initQuitIndia
    };
})();
