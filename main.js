const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 *  <div class="modal-backdrop">
        <div class="modal-container">
            <button class="modal-close">&times;</button>
            <div class="modal-content">
                .....
            </div>
        </div>
    </div>
 */

function Modal() {
    this.openModal = (objContent = {}) => {
        const { templateId } = objContent;
        const template = $(`#${templateId}`);

        if (!template) {
            console.error(`#${templateId} does not exist`);
            return;
        }

        // console.log(template.content);
        const content = template.content.cloneNode(true);

        // Create modal elements
        const backDrop = document.createElement('div');
        backDrop.classList.add('modal-backdrop');

        const container = document.createElement('div');
        container.classList.add('modal-container');

        const closeBtn = document.createElement('button');
        closeBtn.classList.add('modal-close');
        closeBtn.innerHTML = '&times;';

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        // Append elements & content
        modalContent.append(content);
        container.append(closeBtn, modalContent);
        backDrop.append(container);
        document.body.append(backDrop);

        setTimeout(() => {
            backDrop.classList.add('show');
        }, 1000);

        // Register close event for button
        closeBtn.onclick = () => this.closeModal(backDrop);

        // Register close event for backDrop element
        backDrop.onclick = (e) => {
            if (e.target === backDrop) {
                this.closeModal(backDrop);
            }
        };

        // Register close event for esc key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal(backDrop);
            }
        });
    };

    this.closeModal = (modalElement) => {
        modalElement.classList.remove('show');
        modalElement.ontransitionend = () => {
            modalElement.remove();
        };
    };
}

const modal = new Modal();

// modal.openModal('<h1>Learning JS is fun</h1>');

$('#open-modal-1').onclick = () => {
    modal.openModal({
        templateId: 'modal-1',
    });
};

$('#open-modal-2').onclick = () => {
    modal.openModal({
        templateId: 'modal-2',
    });
};
