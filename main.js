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
        const { templateId, allowBackdropClose = true } = objContent;
        const template = $(`#${templateId}`);

        if (!template) {
            console.error(`#${templateId} does not exist`);
            return;
        }

        // console.log(template.content);
        const content = template.content.cloneNode(true);

        // Create modal elements
        const backDrop = document.createElement("div");
        backDrop.classList.add("modal-backdrop");

        const container = document.createElement("div");
        container.classList.add("modal-container");

        const closeBtn = document.createElement("button");
        closeBtn.classList.add("modal-close");
        closeBtn.innerHTML = "&times;";

        const modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");

        // Append elements & content
        modalContent.append(content);
        container.append(closeBtn, modalContent);
        backDrop.append(container);
        document.body.append(backDrop);

        setTimeout(() => {
            backDrop.classList.add("show");
        }, 1000);

        // Remove event for close button
        closeBtn.onclick = () => this.closeModal(backDrop);

        // Close event for backDrop element if condition is true
        if (allowBackdropClose) {
            backDrop.onclick = (e) => {
                if (e.target === backDrop) {
                    this.closeModal(backDrop);
                }
            };
        }

        // Register close event for ESC key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.closeModal(backDrop);
            }
        });

        // Disable scrolling
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = getScrollbarWidth() + "px";

        return backDrop;
    };

    this.closeModal = (modalElement) => {
        modalElement.classList.remove("show");
        modalElement.ontransitionend = () => {
            modalElement.remove();

            // Enable scrolling
            document.body.classList.remove("no-scroll");
            document.body.style.paddingRight = "";
        };
    };

    function getScrollbarWidth() {
        // Cache
        if (getScrollbarWidth.value) {
            console.log("Return exist value");
            return getScrollbarWidth.value;
        }

        const div = document.createElement("div");
        Object.assign(div.style, {
            overflow: "scroll",
            position: "absolute",
            top: "-9999px",
        });

        document.body.appendChild(div);
        const scrollbarWidth = div.offsetWidth - div.clientWidth;
        getScrollbarWidth.value = scrollbarWidth;

        document.body.removeChild(div);

        console.log(`Calculate scrollbar width ${scrollbarWidth}`);

        return scrollbarWidth;
    }
}

const modal = new Modal();

$("#open-modal-1").onclick = () => {
    modal.openModal({
        templateId: "modal-1",
    });
};

$("#open-modal-2").onclick = () => {
    const modalElement = modal.openModal({
        templateId: "modal-2",
        allowBackdropClose: false,
    });

    // console.log(modalElement);
    const form = modalElement.querySelector("#login-form");
    form.onsubmit = (e) => {
        e.preventDefault();

        const formData = {
            email: $("#email").value.trim(),
            password: $("#password").value.trim(),
        };

        console.log(formData);
    };
};
