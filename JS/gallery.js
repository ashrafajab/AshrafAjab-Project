// Gallery functionality
$(function() {
    setupGallery();
    setupNavigation();
});

function setupGallery() {
    // Filter functionality
    $('.gallery-filter .filter-btn').click(function() {
        $('.gallery-filter .filter-btn').removeClass('active');
        $(this).addClass('active');
        
        let filter = $(this).data('filter');
        
        if (filter === 'all') {
            $('.gallery-item').show();
        } else {
            $('.gallery-item').hide();
            $(`.gallery-item[data-category="${filter}"]`).show();
        }
    });
    
    // Lightbox functionality
    let currentIndex = 0;
    let galleryItems = $('.gallery-item');
    
    // Open lightbox
    $('.gallery-item').click(function() {
        currentIndex = $(this).index();
        openLightbox(currentIndex);
    });
    
    // Close lightbox
    $('.lightbox-close').click(closeLightbox);
    $('.lightbox').click(function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
    
    // Navigation
    $('.lightbox-prev').click(function() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightbox(currentIndex);
    });
    
    $('.lightbox-next').click(function() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateLightbox(currentIndex);
    });
    
    // Keyboard navigation
    $(document).keydown(function(e) {
        if ($('.lightbox').hasClass('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') $('.lightbox-prev').click();
            if (e.key === 'ArrowRight') $('.lightbox-next').click();
        }
    });
}

function openLightbox(index) {
    let item = $('.gallery-item').eq(index);
    let imgSrc = item.find('img').attr('src');
    let title = item.find('.gallery-overlay h3').text();
    let description = item.find('.gallery-overlay p').text();
    
    $('.lightbox-image').attr('src', imgSrc);
    $('.lightbox-caption h3').text(title);
    $('.lightbox-caption p').text(description);
    
    $('.lightbox').addClass('active');
    $('body').css('overflow', 'hidden');
}

function closeLightbox() {
    $('.lightbox').removeClass('active');
    $('body').css('overflow', '');
}

function updateLightbox(index) {
    let item = $('.gallery-item').eq(index);
    let imgSrc = item.find('img').attr('src');
    let title = item.find('.gallery-overlay h3').text();
    let description = item.find('.gallery-overlay p').text();
    
    $('.lightbox-image').attr('src', imgSrc);
    $('.lightbox-caption h3').text(title);
    $('.lightbox-caption p').text(description);
}

function setupNavigation() {
    // Hamburger menu toggle
    $('.hamburger').click(function() {
        $('.nav-links').toggleClass('active');
        $(this).toggleClass('active');
    });
    
    // Close mobile menu when clicking on a link
    $('.nav-links a').click(function() {
        if ($(window).width() <= 768) {
            $('.nav-links').removeClass('active');
            $('.hamburger').removeClass('active');
        }
    });
}
