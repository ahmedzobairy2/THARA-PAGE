// Modal Ajax functionality for Thara website
(function() {
    'use strict';

    // Initialize modals when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeModals();
        initializeAjaxForms();
    });

    function initializeModals() {
        // Create modal container if it doesn't exist
        if (!document.getElementById('ajax-modal-container')) {
            const modalContainer = document.createElement('div');
            modalContainer.id = 'ajax-modal-container';
            document.body.appendChild(modalContainer);
        }

        // Add click handlers for modal triggers
        document.addEventListener('click', function(e) {
            if (e.target.matches('[data-modal-ajax]') || e.target.closest('[data-modal-ajax]')) {
                e.preventDefault();
                const trigger = e.target.matches('[data-modal-ajax]') ? e.target : e.target.closest('[data-modal-ajax]');
                const modalType = trigger.getAttribute('data-modal-ajax');
                loadModal(modalType, trigger);
            }
        });
    }

    function loadModal(modalType, trigger) {
        const container = document.getElementById('ajax-modal-container');
        
        // Show loading state
        showLoadingModal();

        // Simulate Ajax call with setTimeout
        setTimeout(() => {
            let modalContent = '';
            
            switch(modalType) {
                case 'heritage-details':
                    modalContent = createHeritageDetailsModal(trigger);
                    break;
                case 'contact-form':
                    modalContent = createContactFormModal();
                    break;
                case 'image-gallery':
                    modalContent = createImageGalleryModal(trigger);
                    break;
                case 'user-profile':
                    modalContent = createUserProfileModal();
                    break;
                default:
                    modalContent = createDefaultModal();
            }

            container.innerHTML = modalContent;
            
            // Initialize Bootstrap modal
            const modal = new bootstrap.Modal(document.getElementById('ajax-modal'));
            modal.show();

            // Add event listeners for modal content
            addModalEventListeners();

        }, 800); // Simulate network delay
    }

    function showLoadingModal() {
        const container = document.getElementById('ajax-modal-container');
        container.innerHTML = `
            <div class="modal fade" id="ajax-modal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center p-5">
                            <div class="spinner-border text-primary mb-3" role="status">
                                <span class="visually-hidden">جاري التحميل...</span>
                            </div>
                            <h5>جاري تحميل المحتوى...</h5>
                            <p class="text-muted">يرجى الانتظار</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('ajax-modal'));
        modal.show();
    }

    function createHeritageDetailsModal(trigger) {
        const title = trigger.getAttribute('data-title') || 'تفاصيل العنصر التراثي';
        const description = trigger.getAttribute('data-description') || 'وصف العنصر التراثي';
        const image = trigger.getAttribute('data-image') || 'assets/img/old-sanaa.jpeg';
        
        return `
            <div class="modal fade" id="ajax-modal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <img src="${image}" alt="${title}" class="img-fluid rounded mb-3">
                                </div>
                                <div class="col-md-6">
                                    <h6 class="text-primary">الوصف</h6>
                                    <p>${description}</p>
                                    
                                    <h6 class="text-primary mt-3">معلومات إضافية</h6>
                                    <ul class="list-unstyled">
                                        <li><i class="fas fa-map-marker-alt text-danger"></i> الموقع: اليمن</li>
                                        <li><i class="fas fa-calendar text-info"></i> التاريخ: تراث قديم</li>
                                        <li><i class="fas fa-tag text-success"></i> الفئة: تراث ثقافي</li>
                                    </ul>
                                    
                                    <div class="d-flex gap-2 mt-3">
                                        <button class="btn btn-primary btn-sm" onclick="likeHeritage()">
                                            <i class="fas fa-heart"></i> إعجاب
                                        </button>
                                        <button class="btn btn-outline-secondary btn-sm" onclick="shareHeritage()">
                                            <i class="fas fa-share"></i> مشاركة
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                            <a href="details.html" class="btn btn-primary">عرض التفاصيل الكاملة</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function createContactFormModal() {
        return `
            <div class="modal fade" id="ajax-modal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">تواصل معنا</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
                        </div>
                        <div class="modal-body">
                            <form id="modal-contact-form">
                                <div class="mb-3">
                                    <label for="modal-name" class="form-label">الاسم</label>
                                    <input type="text" class="form-control" id="modal-name" required>
                                </div>
                                <div class="mb-3">
                                    <label for="modal-email" class="form-label">البريد الإلكتروني</label>
                                    <input type="email" class="form-control" id="modal-email" required>
                                </div>
                                <div class="mb-3">
                                    <label for="modal-message" class="form-label">الرسالة</label>
                                    <textarea class="form-control" id="modal-message" rows="4" required></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
                            <button type="button" class="btn btn-primary" onclick="submitModalForm()">إرسال</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function createImageGalleryModal(trigger) {
        const images = [
            'assets/img/old-sanaa.jpeg',
            'assets/img/dar-alhajar.jpeg',
            'assets/img/shibam.jpeg',
            'assets/img/yemeni-dagger.jpg'
        ];
        
        let imageSlides = '';
        images.forEach((img, index) => {
            imageSlides += `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src="${img}" class="d-block w-100" alt="صورة ${index + 1}">
                </div>
            `;
        });

        return `
            <div class="modal fade" id="ajax-modal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">معرض الصور</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
                        </div>
                        <div class="modal-body p-0">
                            <div id="imageCarousel" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-inner">
                                    ${imageSlides}
                                </div>
                                <button class="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">السابق</span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">التالي</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function createUserProfileModal() {
        return `
            <div class="modal fade" id="ajax-modal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">الملف الشخصي</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
                        </div>
                        <div class="modal-body text-center">
                            <div class="mb-3">
                                <img src="https://via.placeholder.com/100" alt="الصورة الشخصية" class="rounded-circle mb-3">
                                <h6>أحمد محمد</h6>
                                <p class="text-muted">محب للتراث اليمني</p>
                            </div>
                            
                            <div class="row text-center">
                                <div class="col-4">
                                    <h6 class="text-primary">25</h6>
                                    <small>مشاركة</small>
                                </div>
                                <div class="col-4">
                                    <h6 class="text-success">150</h6>
                                    <small>إعجاب</small>
                                </div>
                                <div class="col-4">
                                    <h6 class="text-info">8</h6>
                                    <small>متابع</small>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                            <button type="button" class="btn btn-primary">تعديل الملف</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function createDefaultModal() {
        return `
            <div class="modal fade" id="ajax-modal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">معلومات</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
                        </div>
                        <div class="modal-body">
                            <p>تم تحميل المحتوى بنجاح عبر Ajax!</p>
                            <p>هذا مثال على النوافذ المنبثقة التي يتم استدعاؤها بواسطة Ajax.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">حسناً</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function addModalEventListeners() {
        // Add any additional event listeners for modal content
    }

    function initializeAjaxForms() {
        // Handle Ajax form submissions
        document.addEventListener('submit', function(e) {
            if (e.target.matches('#modal-contact-form')) {
                e.preventDefault();
                submitModalForm();
            }
        });
    }

    // Global functions for modal interactions
    window.likeHeritage = function() {
        if (window.showBootstrapToast) {
            window.showBootstrapToast('شكراً لك!', 'تم إضافة إعجابك بنجاح', 'success');
        }
    };

    window.shareHeritage = function() {
        if (navigator.share) {
            navigator.share({
                title: 'ثَرَى - منصة التراث اليمني',
                text: 'اكتشف كنوز التراث اليمني',
                url: window.location.href
            });
        } else {
            if (window.showBootstrapToast) {
                window.showBootstrapToast('تم النسخ', 'تم نسخ الرابط إلى الحافظة', 'info');
            }
        }
    };

    window.submitModalForm = function() {
        const name = document.getElementById('modal-name')?.value;
        const email = document.getElementById('modal-email')?.value;
        const message = document.getElementById('modal-message')?.value;

        if (!name || !email || !message) {
            if (window.showBootstrapToast) {
                window.showBootstrapToast('خطأ', 'يرجى ملء جميع الحقول', 'danger');
            }
            return;
        }

        // Simulate Ajax submission
        setTimeout(() => {
            if (window.showBootstrapToast) {
                window.showBootstrapToast('تم الإرسال', 'تم إرسال رسالتك بنجاح', 'success');
            }
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('ajax-modal'));
            if (modal) {
                modal.hide();
            }
        }, 1000);
    };

})();

