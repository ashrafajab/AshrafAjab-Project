$(function(){

    // Application tracker progress
    let currentStep = 1;
    let totalSteps = 4;

    // Applications counter
    let applicantCount = 24;

    // Initialize functions
    function initCareers() {
        setupEventListeners();
        updateTrackerProgress();
        updateApplicantCounter();
        setupFileUpload();
    }

    // Setup all event listeners
    function setupEventListeners() {
        // Quick apply buttons
        $('.apply-position-btn').click(function(e) {
            e.preventDefault();
            let position = $(this).data('position');
            $('#applyPosition').val(position);
            $('html, body').animate({
                scrollTop: $('#careersForm').offset().top - 100
            }, 500);
            
            // Animate the selected position card
            let positionCard = $(this).closest('.position-card');
            positionCard.css({
                'animation': 'pulse 0.5s ease'
            });
            setTimeout(function() {
                positionCard.css('animation', '');
            }, 500);
        });

        // Form submission
        $('#careersForm').on('submit', function(e) {
            e.preventDefault();
            
            let name = $('#applyName').val().trim();
            let phone = $('#applyPhone').val().trim();
            let position = $('#applyPosition').val();
            
            if (!name || !phone || !position) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Save application data
            let applicationData = {
                name: name,
                phone: phone,
                email: $('#applyEmail').val().trim(),
                position: position,
                branch: $('#applyBranch').val(),
                experience: $('#applyExperience').val(),
                notes: $('#applyNotes').val().trim(),
                timestamp: new Date().toISOString()
            };
            
            // Save to localStorage
            saveApplication(applicationData);
            
            // Update tracker progress
            updateTrackerProgress(2);
            
            // Show success overlay
            showSuccessOverlay(phone);
            
            // Increment applicant counter
            updateApplicantCounter(true);
            
            // Reset form
            $(this)[0].reset();
            $('#fileInfo').text('No file chosen');
        });

        // Close success overlay
        $('#closeSuccess').click(function() {
            $('#successOverlay').fadeOut(300);
        });

        // Position card hover effect
        $('.position-card').hover(
            function() {
                $(this).css('transform', 'translateY(-10px)');
            },
            function() {
                $(this).css('transform', 'translateY(0)');
            }
        );

        // File upload change
        $('#applyCV').change(function() {
            let fileName = $(this).val().split('\\').pop();
            if (fileName) {
                $('#fileInfo').text(fileName);
            } else {
                $('#fileInfo').text('No file chosen');
            }
        });
    }

    // Setup file upload preview
    function setupFileUpload() {
        $('#applyCV').on('change', function() {
            let fileName = $(this).val().split('\\').pop();
            let fileInfo = $('#fileInfo');
            
            if (fileName) {
                fileInfo.text(fileName);
                fileInfo.css('color', 'var(--accent-color)');
                
                // Add file icon
                if (!fileInfo.find('i').length) {
                    fileInfo.prepend('<i class="fas fa-file" style="margin-right: 8px;"></i> ');
                }
            } else {
                fileInfo.text('No file chosen');
                fileInfo.css('color', 'var(--text-color)');
                fileInfo.find('i').remove();
            }
        });
    }

    // Save application to localStorage
    function saveApplication(data) {
        let applications = JSON.parse(localStorage.getItem('sushiBellApplications') || '[]');
        applications.push(data);
        localStorage.setItem('sushiBellApplications', JSON.stringify(applications));
    }

    // Update tracker progress
    function updateTrackerProgress(step) {
        if (step) {
            currentStep = step;
        }
        
        // Update step indicators
        $('.tracker-step').removeClass('active');
        for (let i = 1; i <= currentStep; i++) {
            $(`.tracker-step[data-step="${i}"]`).addClass('active');
        }
        
        // Update progress bar
        let progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        $('#trackerProgress').css('width', progress + '%');
        
        // Animate progress
        $('#trackerProgress').css({
            'transition': 'width 0.8s ease'
        });
    }

    // Update applicant counter
    function updateApplicantCounter(increment) {
        if (increment) {
            applicantCount++;
            localStorage.setItem('applicantCount', applicantCount);
        } else {
            let savedCount = localStorage.getItem('applicantCount');
            if (savedCount) {
                applicantCount = parseInt(savedCount);
            }
        }
        
        $('#applicantCount').text(applicantCount);
        
        // Animate the counter
        let counterElement = $('#applicantCount');
        counterElement.css({
            'display': 'inline-block',
            'transform': 'scale(1.2)'
        });
        
        setTimeout(function() {
            counterElement.css('transform', 'scale(1)');
        }, 300);
    }

    // Show success overlay
    function showSuccessOverlay(phone) {
        $('#applicantPhone').text(phone);
        $('#successOverlay').fadeIn(300);
        
        // Start progress animation
        let progress = 0;
        let interval = setInterval(function() {
            progress += 10;
            updateTrackerProgress(Math.min(currentStep + 1, 4));
            
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 300);
    }

    // Show message
    function showMessage(text, type) {
        let messageElement = $('#careersMessage');
        let icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
        let color = type === 'error' ? '#ff4c4c' : '#4CAF50';
        
        messageElement.html(`<i class="fas ${icon}"></i> ${text}`);
        messageElement.css({
            'color': color,
            'padding': '10px',
            'border-radius': '5px',
            'background': type === 'error' ? 'rgba(255, 76, 76, 0.1)' : 'rgba(76, 175, 80, 0.1)',
            'border': `1px solid ${color}20`
        });
        
        // Clear message after 5 seconds
        setTimeout(function() {
            messageElement.fadeOut(300, function() {
                messageElement.html('').css({
                    'padding': '0',
                    'background': 'transparent',
                    'border': 'none'
                }).show();
            });
        }, 5000);
    }

    // Animate elements on scroll
    function isScrolledIntoView(elem) {
        let docViewTop = $(window).scrollTop();
        let docViewBottom = docViewTop + $(window).height();
        let elemTop = $(elem).offset().top;
        let elemBottom = elemTop + $(elem).height();
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    $(window).on('scroll resize', function() {
        $('.position-card, .benefit-card, .tracker-step').each(function() {
            if (isScrolledIntoView(this)) {
                $(this).addClass('visible');
                $(this).css({
                    'animation': 'fadeInUp 0.6s ease forwards',
                    'opacity': '0'
                });
            }
        });
    });

    // Initialize on page load
    initCareers();

    // Trigger initial scroll check
    $(window).trigger('scroll');
});