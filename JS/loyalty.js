$(function() {
    // Loyalty Program Data
    let loyaltyData = {
        points: 0,
        tier: 'bronze',
        visits: 0,
        memberSince: null,
        memberId: null,
        name: 'Guest Member'
    };

    let tiers = {
        bronze: { min: 0, max: 499, color: '#CD7F32', benefits: [
            'Welcome reward (Free appetizer)',
            'Exclusive email updates',
            'Birthday treat'
        ]},
        silver: { min: 500, max: 999, color: '#C0C0C0', benefits: [
            'Priority reservations',
            'Double points on weekends',
            'Free drink with order'
        ]},
        gold: { min: 1000, max: 1999, color: '#FFD700', benefits: [
            'Birthday platter',
            'Early access to new menus',
            'Monthly surprise gift'
        ]},
        platinum: { min: 2000, max: Infinity, color: '#E5E4E2', benefits: [
            'VIP chef\'s table experience',
            'Unlimited priority seating',
            'Annual gourmet dinner'
        ]}
    };

    // Initialize
    function initLoyalty() {
        loadFromLocalStorage();
        updateDisplay();
        setupEventListeners();
        generateMemberId();
    }

    // Load saved data
    function loadFromLocalStorage() {
        let saved = localStorage.getItem('sushiBellLoyalty');
        if (saved) {
            let data = JSON.parse(saved);
            Object.assign(loyaltyData, data);
        }
    }

    // Save data
    function saveToLocalStorage() {
        localStorage.setItem('sushiBellLoyalty', JSON.stringify(loyaltyData));
    }

    // Generate member ID
    function generateMemberId() {
        if (!loyaltyData.memberId) {
            let id = 'SB' + Date.now().toString().slice(-8);
            loyaltyData.memberId = id;
            saveToLocalStorage();
        }
        $('#memberID').text('ID: ' + loyaltyData.memberId);
    }

    // Update all displays
    function updateDisplay() {
        // Update points
        $('#currentPoints').text(loyaltyData.points);
        
        // Update visits
        $('#visitsCount').text(loyaltyData.visits);
        
        // Update member since
        if (loyaltyData.memberSince) {
            let date = new Date(loyaltyData.memberSince);
            $('#sinceDate').text(date.toLocaleDateString());
        }
        
        // Update tier
        updateTier();
        
        // Update progress circle
        updateProgressCircle();
        
        // Update tier progress bar
        updateTierProgress();
        
        // Update next reward calculation
        updateNextReward();
    }

    // Update current tier
    function updateTier() {
        let newTier = 'bronze';
        for (let [tier, range] of Object.entries(tiers)) {
            if (loyaltyData.points >= range.min) {
                newTier = tier;
            }
        }
        
        if (newTier !== loyaltyData.tier) {
            loyaltyData.tier = newTier;
            showTierUpgradeAnimation(newTier);
        }
        
        $('#currentTier').text(newTier.charAt(0).toUpperCase() + newTier.slice(1));
        
        // Update benefits list
        updateBenefits(newTier);
    }

    // Update progress circle
    function updateProgressCircle() {
        let currentTier = tiers[loyaltyData.tier];
        let progress = ((loyaltyData.points - currentTier.min) / (currentTier.max - currentTier.min)) * 100;
        let circumference = 2 * Math.PI * 54;
        let offset = circumference - (progress / 100) * circumference;
        
        $('#pointsProgress').css({
            'stroke-dasharray': circumference,
            'stroke-dashoffset': offset,
            'stroke': tiers[loyaltyData.tier].color
        });
    }

    // Update tier progress bar
    function updateTierProgress() {
        let totalProgress = 0;
        
        if (loyaltyData.points >= tiers.platinum.min) {
            totalProgress = 100;
        } else if (loyaltyData.points >= tiers.gold.min) {
            let progressInGold = (loyaltyData.points - tiers.gold.min) / (tiers.platinum.min - tiers.gold.min);
            totalProgress = 66 + (progressInGold * 33);
        } else if (loyaltyData.points >= tiers.silver.min) {
            let progressInSilver = (loyaltyData.points - tiers.silver.min) / (tiers.gold.min - tiers.silver.min);
            totalProgress = 33 + (progressInSilver * 33);
        } else {
            let progressInBronze = loyaltyData.points / tiers.silver.min;
            totalProgress = progressInBronze * 33;
        }
        
        $('#tierProgress').css('width', totalProgress + '%');
        
        // Update active tier label
        $('.tier-label').removeClass('active');
        $(`.tier-label[data-tier="${loyaltyData.tier}"]`).addClass('active');
    }

    // Update benefits list
    function updateBenefits(tier) {
        let benefitsList = $('#benefitsList');
        benefitsList.empty();
        
        tiers[tier].benefits.forEach(function(benefit) {
            benefitsList.append(`
                <li><i class="fas fa-check-circle"></i> ${benefit}</li>
            `);
        });
    }

    // Calculate next reward
    function updateNextReward() {
        let nextMilestone = Math.ceil((loyaltyData.points + 1) / 150) * 150;
        let pointsNeeded = nextMilestone - loyaltyData.points;
        $('#nextReward').text(pointsNeeded);
    }

    // Add points
    function addPoints(points) {
        loyaltyData.points += points;
        loyaltyData.visits++;
        
        // Animation
        let pointsElement = $('#currentPoints');
        let originalPoints = parseInt(pointsElement.text());
        animateCounter(pointsElement, originalPoints, loyaltyData.points);
        
        // Show points earned animation
        showPointsEarnedAnimation(points);
        
        updateDisplay();
        saveToLocalStorage();
    }

    // Animate counter
    function animateCounter(element, start, end) {
        let duration = 1000;
        let startTime = null;
        
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            let progress = timestamp - startTime;
            let current = Math.min(Math.floor((progress / duration) * (end - start) + start), end);
            
            element.text(current);
            
            if (progress < duration) {
                window.requestAnimationFrame(step);
            } else {
                element.text(end);
            }
        }
        
        window.requestAnimationFrame(step);
    }

    // Show points earned animation
    function showPointsEarnedAnimation(points) {
        let animation = $(`
            <div class="points-animation" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--accent-color);
                color: white;
                padding: 20px 40px;
                border-radius: 50px;
                font-size: 1.5rem;
                font-weight: bold;
                z-index: 9999;
                opacity: 0;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                +${points} Points!
            </div>
        `);
        
        $('body').append(animation);
        
        // Animate in
        animation.animate({ opacity: 1, top: '45%' }, 500, function() {
            // Animate out after delay
            setTimeout(function() {
                animation.animate({ opacity: 0, top: '40%' }, 500, function() {
                    animation.remove();
                });
            }, 1000);
        });
    }

    // Show tier upgrade animation
    function showTierUpgradeAnimation(newTier) {
        let tierName = newTier.charAt(0).toUpperCase() + newTier.slice(1);
        let tierColor = tiers[newTier].color;
        
        let animation = $(`
            <div class="tier-upgrade-animation" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 9998;
                color: white;
                text-align: center;
            ">
                <div style="font-size: 5rem; margin-bottom: 20px; color: ${tierColor}">
                    <i class="fas fa-trophy"></i>
                </div>
                <h2 style="font-size: 3rem; margin-bottom: 10px;">Congratulations!</h2>
                <p style="font-size: 2rem; margin-bottom: 30px;">You've reached ${tierName} Tier!</p>
                <button class="btn" style="margin-top: 20px; font-size: 1.2rem; padding: 15px 40px;">
                    Continue
                </button>
            </div>
        `);
        
        $('body').append(animation);
        
        // Add click handler to close
        animation.find('.btn').click(function() {
            animation.fadeOut(500, function() {
                animation.remove();
            });
        });
        
        // Auto-close after 5 seconds
        setTimeout(function() {
            if (animation.is(':visible')) {
                animation.fadeOut(500, function() {
                    animation.remove();
                });
            }
        }, 5000);
    }

    // Setup event listeners
    function setupEventListeners() {
        // Quick points buttons
        $('.action-btn').click(function() {
            let points = parseInt($(this).data('points'));
            addPoints(points);
        });

        // Add visit button
        $('#addPointsBtn').click(function() {
            addPoints(50); // Standard visit points
        });

        // Redeem button
        $('#redeemBtn').click(function() {
            if (loyaltyData.points >= 150) {
                $('#rewardsPopup').fadeIn(300);
            } else {
                showMessage('You need at least 150 points to redeem rewards!', 'error');
            }
        });

        // Close popup
        $('#closePopup').click(function() {
            $('#rewardsPopup').fadeOut(300);
        });

        // Claim reward buttons
        $('.claim-btn').click(function() {
            let rewardItem = $(this).closest('.reward-item');
            let cost = parseInt(rewardItem.data('cost'));
            
            if (loyaltyData.points >= cost) {
                loyaltyData.points -= cost;
                updateDisplay();
                saveToLocalStorage();
                
                showMessage('Reward claimed successfully!', 'success');
                $('#rewardsPopup').fadeOut(300);
            } else {
                showMessage('Not enough points!', 'error');
            }
        });

        // Tier card hover effects
        $('.tier-card').hover(
            function() {
                let tier = $(this).data('tier');
                if (tier !== loyaltyData.tier) {
                    updateBenefits(tier);
                }
            },
            function() {
                updateBenefits(loyaltyData.tier);
            }
        );

        // Form submission
        $('#loyaltyForm').on('submit', function(e) {
            e.preventDefault();

            let name = $('#fullName').val().trim();
            let phone = $('#phoneNumber').val().trim();
            let email = $('#email').val().trim();
            let branch = $('#preferredBranch').val();
            let birthday = $('#birthday').val();
            let contactPrefs = [];
            $('input[name="contact"]:checked').each(function() {
                contactPrefs.push($(this).val());
            });
            let notes = $('#favoriteSushi').val().trim();

            if (!name || !phone || !branch) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Create membership
            loyaltyData.name = name;
            loyaltyData.memberSince = new Date().toISOString();
            loyaltyData.visits = 1;
            loyaltyData.points = 100; // Welcome bonus
            
            // Update member details
            $('#memberName').text(name);
            $('#memberAvatar').html('<i class="fas fa-user-check"></i>');
            
            // Generate new ID
            generateMemberId();
            
            // Save and update
            saveToLocalStorage();
            updateDisplay();
            
            // Show success message
            showMessage('Welcome to Sushi Bell Circle! You have earned 100 welcome points.', 'success');
            
            // Reset form
            $(this)[0].reset();
        });

        // Close popup when clicking outside
        $(document).click(function(e) {
            if ($(e.target).hasClass('rewards-popup')) {
                $('#rewardsPopup').fadeOut(300);
            }
        });
    }

    // Show message
    function showMessage(text, type) {
        let message = $(`
            <div class="loyalty-message" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'error' ? '#ff4c4c' : '#4CAF50'};
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                z-index: 9999;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                transform: translateX(150%);
                transition: transform 0.3s ease;
            ">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
                ${text}
            </div>
        `);
        
        $('body').append(message);
        
        // Slide in
        setTimeout(function() {
            message.css('transform', 'translateX(0)');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(function() {
            message.css('transform', 'translateX(150%)');
            setTimeout(function() {
                message.remove();
            }, 300);
        }, 3000);
    }

    // Initialize the loyalty program
    initLoyalty();
});
