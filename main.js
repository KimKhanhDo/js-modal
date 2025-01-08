const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Keeps track of the currently open modal
let currentModal = null;

// Opening Modals
$$('[data-modal]').forEach((btn) => {
    btn.onclick = function () {
        const modal = $(this.dataset.modal); // document.querySelector(#modal-1)

        if (modal) {
            modal.classList.add('show');
            currentModal = modal;
        } else {
            console.error(`${this.dataset.modal} does not exist!`);
        }
    };
});

// Closing Modals via Close Button
$$('.modal-close').forEach((btn) => {
    btn.onclick = function () {
        const modal = this.closest('.modal-backdrop');
        if (modal) {
            modal.classList.remove('show');
            currentModal = null;
        }
    };
});

// Closing Modals via Backdrop Click
$$('.modal-backdrop').forEach((modal) => {
    modal.onclick = function (e) {
        if (e.target === this) {
            this.classList.remove('show');
            currentModal = null;
        }
    };
});

// Closing Modals via Escape Key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && currentModal) {
        currentModal.classList.remove('show');
        currentModal = null;
    }
});
