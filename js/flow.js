// flow.js – Application Flow & Stage Coordinator for Swaraj Dates™

window.Flow = (function() {
    let currentStage = 1;
    let glassesClicks = 0;
    let typedBuffer = "";
    let konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let konamiIndex = 0;
    let captchaOathCount = 0;
    let saltTaxInstance = null;

    function setStage(stageNum) {
        currentStage = stageNum;

        // Update progress bar
        const stageItems = document.querySelectorAll(".progress-step");
        stageItems.forEach((item, idx) => {
            if (idx + 1 < currentStage) {
                item.className = "progress-step completed";
            } else if (idx + 1 === currentStage) {
                item.className = "progress-step active";
            } else {
                item.className = "progress-step";
            }
        });

        // Hide all stage panels
        const stages = document.querySelectorAll(".stage-panel");
        stages.forEach(panel => panel.classList.add("hidden"));

        // Show target panel
        const currentPanel = document.getElementById(`stage-${stageNum}`);
        if (currentPanel) {
            currentPanel.classList.remove("hidden");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        // Stage-specific initializers
        if (stageNum === 3) {
            const pickerMount = document.getElementById("picker-stage-mount");
            if (pickerMount && !pickerMount.hasChildNodes()) {
                window.Picker.mount(pickerMount);
            }
        } else if (stageNum === 4) {
            setupRoundTable();
        } else if (stageNum === 5) {
            setupSaltTax();
        } else if (stageNum === 6) {
            setupCertificate();
        }
    }

    // STAGE 1: Terms and Conditions of the Raj
    function initStage1() {
        const termsBox = document.getElementById("terms-scroll-box");
        const acceptBtn = document.getElementById("accept-terms-btn");
        const scrollNotice = document.getElementById("terms-scroll-notice");

        if (termsBox && acceptBtn) {
            termsBox.addEventListener("scroll", () => {
                const scrolledToBottom = termsBox.scrollHeight - termsBox.scrollTop <= termsBox.clientHeight + 40;
                if (scrolledToBottom) {
                    acceptBtn.disabled = false;
                    acceptBtn.classList.remove("disabled");
                    if (scrollNotice) scrollNotice.textContent = "✅ Clearance granted. You may now accept this nonsense.";
                }
            });

            acceptBtn.addEventListener("click", () => {
                // If not yet scrolled, auto-scroll and proceed
                termsBox.scrollTop = termsBox.scrollHeight;
                acceptBtn.disabled = false;
                acceptBtn.classList.remove("disabled");
                if (window.Chaos) {
                    window.Chaos.showToast("📜 Paperwork accepted by expedited civil service decree!");
                }
                setStage(2);
            });
        }
    }

    // STAGE 2: Satya CAPTCHA
    function initStage2() {
        const lieYesBtn = document.getElementById("captcha-lie-yes");
        const lieNoBtn = document.getElementById("captcha-lie-no");
        const lieFeedback = document.getElementById("captcha-lie-feedback");
        const oathSection = document.getElementById("captcha-oath-section");
        const oathInput = document.getElementById("captcha-oath-input");
        const oathSubmit = document.getElementById("captcha-oath-submit");
        const oathCounter = document.getElementById("captcha-oath-counter");

        function handleLieChoice(isYes) {
            const msg = isYes ? window.Copy.flow.captchaLieResponseYes : window.Copy.flow.captchaLieResponseNo;
            if (lieFeedback) {
                lieFeedback.textContent = msg;
                lieFeedback.classList.remove("hidden");
            }
            if (oathSection) {
                oathSection.classList.remove("hidden");
            }
            if (window.Chaos) window.Chaos.showToast(msg);
        }

        if (lieYesBtn) lieYesBtn.addEventListener("click", () => handleLieChoice(true));
        if (lieNoBtn) lieNoBtn.addEventListener("click", () => handleLieChoice(false));

        if (oathSubmit && oathInput) {
            oathSubmit.addEventListener("click", submitOath);
            oathInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    submitOath();
                }
            });
        }

        function submitOath() {
            const val = oathInput.value.trim();
            const targetPhrase = window.Copy.flow.repeatPhrase.trim();

            if (val.toLowerCase() === targetPhrase.toLowerCase()) {
                captchaOathCount++;
                oathInput.value = "";
                if (oathCounter) {
                    oathCounter.textContent = window.Copy.flow.repeatProgress.replace("{current}", captchaOathCount);
                }

                if (captchaOathCount >= 3) {
                    if (window.Chaos) window.Chaos.showToast("✨ Satya Verified! You may now seek your date.", 3000);
                    setTimeout(() => setStage(3), 600);
                } else {
                    if (window.Chaos) window.Chaos.showToast(`Oration ${captchaOathCount}/3 recorded. Repeat once more.`);
                }
            } else {
                if (window.Chaos) {
                    window.Chaos.showToast("❌ Verbatim mismatch! Must type: 'I swear I was born then.'");
                    window.Chaos.recordFailure();
                }
            }
        }
    }

    // STAGE 3 Listener for Proceeding
    function initStage3GlobalListeners() {
        document.addEventListener("click", (e) => {
            if (e.target && e.target.id === "proceed-roundtable-btn") {
                const hingeInput = document.getElementById("hinge-answer-input");
                if (hingeInput && hingeInput.value.trim().length > 0) {
                    const wordCount = hingeInput.value.trim().split(/\s+/).length;
                    if (wordCount < 3) {
                        if (window.Chaos) {
                            window.Chaos.showToast("💬 Your ideal date statement must contain at least 3 words!");
                            window.Chaos.recordFailure();
                        }
                        return;
                    }
                }
                setStage(4);
            }
        });
    }

    // STAGE 4: Round Table Conference Setup
    function setupRoundTable() {
        const dateEl = document.getElementById("roundtable-selected-date");
        const sel = window.Picker.getSelected();
        if (dateEl) {
            const mName = window.Copy.picker.months[sel.m - 1];
            dateEl.textContent = `${String(sel.d).padStart(2, "0")} ${mName} ${sel.y}`;
        }

        const confirmBtn = document.getElementById("roundtable-confirm-btn");
        const container = document.getElementById("satyagraha-button-arena");
        const reconsiderBtn = document.getElementById("roundtable-reconsider-btn");

        if (confirmBtn && container) {
            // Attach non-cooperation evasive button
            window.Chaos.attachNonCooperation(confirmBtn, container, () => {
                if (window.Chaos) {
                    window.Chaos.showToast("🎉 Date Confirmed by the High Commission!");
                }
                setStage(5);
            });
        }

        if (reconsiderBtn) {
            reconsiderBtn.addEventListener("click", () => {
                if (window.Chaos) {
                    window.Chaos.showToast(window.Copy.flow.reconsiderMsg, 4000);
                    window.Chaos.recordFailure();
                }
            });
        }
    }

    // STAGE 5: Salt Tax Setup
    function setupSaltTax() {
        const saltCountEl = document.getElementById("salt-clicks-counter");
        const saltProgress = document.getElementById("salt-progress-bar");
        const saltShakerBtn = document.getElementById("salt-shaker-zone");
        const saltDoneBtn = document.getElementById("salt-proceed-btn");
        const saltMessage = document.getElementById("salt-status-text");
        const saltBypass = document.getElementById("salt-bypass-btn");

        saltTaxInstance = window.Chaos.initSaltTax({
            targetClicks: 10,
            onUpdate: function(current, target) {
                if (saltCountEl) saltCountEl.textContent = `${current} / ${target}`;
                if (saltProgress) saltProgress.style.width = `${(current / target) * 100}%`;
                
                // Salt shake animation
                if (saltShakerBtn) {
                    saltShakerBtn.classList.remove("shaking");
                    void saltShakerBtn.offsetWidth; // trigger reflow
                    saltShakerBtn.classList.add("shaking");
                }
                triggerSaltParticle();
            },
            onComplete: function() {
                if (saltMessage) {
                    saltMessage.textContent = "🧂 " + window.Copy.flow.saltTaxPaid;
                    saltMessage.className = "salt-success-notice";
                }
                if (saltDoneBtn) {
                    saltDoneBtn.classList.remove("hidden");
                }
                if (window.Chaos) {
                    window.Chaos.showToast("🕊️ " + window.Copy.flow.saltTaxPaid, 4000);
                }
            }
        });

        if (saltShakerBtn) {
            saltShakerBtn.onclick = () => saltTaxInstance.click();
        }

        if (saltDoneBtn) {
            saltDoneBtn.onclick = () => setStage(6);
        }

        if (saltBypass) {
            saltBypass.onclick = () => {
                if (window.Chaos) window.Chaos.showToast("🧶 Khadi bribe accepted! Salt Tax waived by civil disobedience.");
                setStage(6);
            };
        }
    }

    function triggerSaltParticle() {
        const arena = document.getElementById("salt-shaker-zone");
        if (!arena) return;

        for (let i = 0; i < 5; i++) {
            const grain = document.createElement("span");
            grain.className = "salt-grain";
            grain.textContent = "•";
            grain.style.left = `${45 + (Math.random() * 20 - 10)}%`;
            grain.style.animationDelay = `${Math.random() * 0.1}s`;
            arena.appendChild(grain);

            setTimeout(() => {
                if (grain.parentNode) grain.parentNode.removeChild(grain);
            }, 700);
        }
    }

    // STAGE 6: Certificate Generation
    function setupCertificate() {
        const sel = window.Picker.getSelected();
        const mName = window.Copy.picker.months[sel.m - 1];
        const formattedDate = `${String(sel.d).padStart(2, "0")} ${mName} ${sel.y}`;

        const certDate = document.getElementById("cert-selected-date");
        const certAppNo = document.getElementById("cert-application-no");
        const certSpecialNotice = document.getElementById("cert-special-notice");
        const certSpins = document.getElementById("cert-charkha-spins");
        const certTax = document.getElementById("cert-salt-tax");

        if (certDate) certDate.textContent = formattedDate;
        if (certAppNo) {
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            certAppNo.textContent = `SWRJ-${sel.y}-${String(sel.m).padStart(2, "0")}${String(sel.d).padStart(2, "0")}-${randomCode}`;
        }
        if (certSpins) certSpins.textContent = window.Picker.getCharkhaSpins();
        if (certTax) certTax.textContent = saltTaxInstance ? saltTaxInstance.getCount() : "10";

        // 15 August 1947 Easter Egg on Certificate
        if (sel.y === 1947 && sel.m === 8 && sel.d === 15) {
            if (certSpecialNotice) {
                certSpecialNotice.textContent = "🌟 " + window.Copy.easterEggs.august15;
                certSpecialNotice.classList.remove("hidden");
            }
        } else {
            if (certSpecialNotice) certSpecialNotice.classList.add("hidden");
        }

        // Celebrate with subtle confetti
        launchConfetti();
    }

    function launchConfetti() {
        const container = document.getElementById("confetti-container");
        if (!container) return;
        container.innerHTML = "";

        const colors = ["#ff9933", "#ffffff", "#138808", "#000080", "#d4af37"];
        for (let i = 0; i < 40; i++) {
            const conf = document.createElement("div");
            conf.className = "confetti-piece";
            conf.style.left = `${Math.random() * 100}%`;
            conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            conf.style.animationDelay = `${Math.random() * 2}s`;
            conf.style.transform = `rotate(${Math.random() * 360}deg)`;
            container.appendChild(conf);
        }
    }

    // Global Easter Eggs and Handlers
    function initEasterEggs() {
        // 1. Click glasses logo 5 times
        const logo = document.getElementById("bapu-glasses-logo");
        if (logo) {
            logo.addEventListener("click", () => {
                glassesClicks++;
                if (glassesClicks >= 5) {
                    glassesClicks = 0;
                    if (window.Chaos) {
                        window.Chaos.showToast(window.Copy.easterEggs.glassesUnlocked, 5000);
                    }
                    document.body.classList.toggle("swaraj-vision-mode");
                } else {
                    if (window.Chaos) {
                        window.Chaos.showToast(`👓 Glasses inspected ${glassesClicks}/5 times...`);
                    }
                }
            });
        }

        // 2. Typing 'bapu' anywhere
        document.addEventListener("keydown", (e) => {
            // Ignore if typing in an input
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

            typedBuffer += e.key.toLowerCase();
            if (typedBuffer.length > 10) typedBuffer = typedBuffer.slice(-10);

            if (typedBuffer.endsWith("bapu")) {
                typedBuffer = "";
                if (window.Chaos) {
                    window.Chaos.showToast(window.Copy.easterEggs.bapuTyped, 5000);
                }
            }

            // 3. Konami Code
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    konamiIndex = 0;
                    if (window.Chaos) {
                        window.Chaos.showToast(window.Copy.easterEggs.konamiUnlocked, 6000);
                    }
                }
            } else {
                konamiIndex = 0;
            }
        });

        // Easter eggs clue dialog
        const clueLink = document.getElementById("easter-eggs-hint-link");
        const clueModal = document.getElementById("easter-eggs-modal");
        const clueClose = document.getElementById("close-easter-modal");

        if (clueLink && clueModal) {
            clueLink.addEventListener("click", (e) => {
                e.preventDefault();
                clueModal.classList.remove("hidden");
            });
        }
        if (clueClose && clueModal) {
            clueClose.addEventListener("click", () => {
                clueModal.classList.add("hidden");
            });
        }
    }

    // Mercy bypass action
    function activateMercy() {
        if (window.Chaos) {
            window.Chaos.showToast("🕊️ Bapu Takes Pity! All committees adjourned. Certificate granted!");
        }
        setStage(6);
    }

    function initGlobalActions() {
        // Allow direct clicking on all progress steps in the top navigation bar
        const progressSteps = document.querySelectorAll(".progress-step");
        progressSteps.forEach((step, idx) => {
            step.style.cursor = "pointer";
            step.addEventListener("click", () => {
                setStage(idx + 1);
            });
        });

        // Pre-mount the picker so Stage 3 is always ready immediately
        const pickerMount = document.getElementById("picker-stage-mount");
        if (pickerMount && !pickerMount.hasChildNodes() && window.Picker) {
            window.Picker.mount(pickerMount);
        }

        // Mercy banner click
        const mercyBanner = document.getElementById("mercy-banner");
        if (mercyBanner) {
            mercyBanner.addEventListener("click", activateMercy);
        }

        // Restart button in Certificate
        const restartBtn = document.getElementById("restart-app-btn");
        if (restartBtn) {
            restartBtn.addEventListener("click", () => {
                captchaOathCount = 0;
                setStage(1);
            });
        }

        // Print certificate button
        const printBtn = document.getElementById("print-cert-btn");
        if (printBtn) {
            printBtn.addEventListener("click", () => {
                window.print();
            });
        }
    }

    function start() {
        initStage1();
        initStage2();
        initStage3GlobalListeners();
        initEasterEggs();
        initGlobalActions();

        // Initialize Mercy Rule in Chaos engine
        if (window.Chaos) {
            window.Chaos.initMercyRule(activateMercy);
            window.Chaos.startToasts();
            window.Chaos.initQuitIndia();
        }

        // Mount Stage 1
        setStage(1);
    }

    return {
        start,
        setStage,
        activateMercy
    };
})();

// Auto-start when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.Flow.start());
} else {
    window.Flow.start();
}
