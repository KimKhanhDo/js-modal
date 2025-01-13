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

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Modal.elements = [];

function Modal(options = {}) {
    // Destructure options with default values
    const {
        templateId,
        destroyOnClose = true,
        footer = false,
        cssClass = [],
        closeMethods = ["button", "overlay", "escape"],
        onOpen,
        onClose,
    } = options;

    const template = $(`#${templateId}`);

    if (!template) {
        console.error(`#${templateId} does not exist`);
        return;
    }

    // Initialize flags based on allowed close methods
    this._allowButtonClose = closeMethods.includes("button");
    this._allowBackdropClose = closeMethods.includes("overlay");
    this._allowEscapeClose = closeMethods.includes("escape");

    // Build the modal DOM structure
    this._build = () => {
        const content = template.content.cloneNode(true);

        // Create modal backdrop
        this._backDrop = document.createElement("div");
        this._backDrop.classList.add("modal-backdrop");

        // Create modal container
        const container = document.createElement("div");
        container.classList.add("modal-container");
        if (cssClass.length) {
            cssClass.forEach((className) => {
                if (typeof className === "string") {
                    container.classList.add(className);
                }
            });
        }

        // Create close btn & register event when condition is TRUE
        if (this._allowButtonClose) {
            // const closeBtn = document.createElement("button");
            // closeBtn.classList.add("modal-close");
            // closeBtn.innerHTML = "&times;";
            // closeBtn.onclick = () => this.close();

            const closeBtn = this._createButton("&times;", "modal-close", this.close);
            container.append(closeBtn);
        }

        // Add modal content & append modal elements to DOM
        const modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");
        modalContent.append(content);
        container.append(modalContent);

        // Build footer
        if (footer) {
            this._modalFooter = document.createElement("div");
            this._modalFooter.classList.add("modal-footer");

            this._renderFooterContent();
            this._renderFooterButtons();
            container.append(this._modalFooter);
        }

        this._backDrop.append(container);
        document.body.append(this._backDrop);
    };

    this.setFooterContent = (html) => {
        this._footerContent = html;
        this._renderFooterContent();
    };

    this._createButton = (title, cssClass, callback) => {
        const button = document.createElement("button");
        button.className = cssClass;
        button.innerHTML = title;
        button.onclick = callback;

        return button;
    };

    this._footerButtons = [];

    this.addFooterButton = (title, cssClass, callback) => {
        const button = this._createButton(title, cssClass, callback);
        this._footerButtons.push(button);
        this._renderFooterButtons();
    };

    this._renderFooterButtons = () => {
        if (this._modalFooter) {
            this._footerButtons.forEach((button) => {
                this._modalFooter.append(button);
            });
        }
    };

    this._renderFooterContent = () => {
        if (this._modalFooter && this._footerContent) {
            this._modalFooter.innerHTML = this._footerContent;
        }
    };

    // Open the modal
    this.open = () => {
        Modal.elements.push(this);

        if (!this._backDrop) {
            this._build();
        }

        setTimeout(() => {
            this._backDrop.classList.add("show");
        }, 0);

        // Enable backdrop click to close if allowed
        if (this._allowBackdropClose) {
            this._backDrop.onclick = (e) => {
                if (e.target === this._backDrop) {
                    this.close();
                }
            };
        }

        // Enable Escape key to close if allowed
        if (this._allowEscapeClose) {
            document.addEventListener("keydown", this._handleEscapeKey);
        }

        // Disable page scrolling and adjust padding for scrollbar
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = this._getScrollbarWidth() + "px";

        // Trigger onOpen callback after animation ends
        this._onTransitionEnd(onOpen);

        return this._backDrop;
    };

    this._handleEscapeKey = (e) => {
        const lastModal = Modal.elements[Modal.elements.length - 1];
        if (e.key === "Escape" && this === lastModal) {
            this.close();
        }
    };

    this._onTransitionEnd = (callback) => {
        this._backDrop.ontransitionend = (e) => {
            if (e.propertyName !== "transform") return;
            if (typeof callback === "function") callback();
        };
    };

    // Close the modal
    this.close = (isDestroyed = destroyOnClose) => {
        Modal.elements.pop();

        this._backDrop.classList.remove("show");

        if (this._allowEscapeClose) {
            document.removeEventListener("keydown", this._handleEscapeKey);
        }

        this._onTransitionEnd(() => {
            // destroyOnClose: true -> closeEvent trigger
            // -> "modal-backdrop" element removed out of DOM
            if (isDestroyed && this._backDrop) {
                this._backDrop.remove();
                this._backDrop = null;
                this._modalFooter = null;
            }

            // Restore page scrolling
            if (!Modal.elements.length !== 0) {
                document.body.classList.remove("no-scroll");
                document.body.style.paddingRight = "";
            }
        });

        if (typeof onClose === "function") onClose();

        // equal destroyOnClose: true
        this.destroy = () => {
            this.close(true);
        };
    };

    // Calculate the width of the scrollbar (cached for performance)
    this._getScrollbarWidth = () => {
        if (this._getScrollbarWidth) return this._getScrollbarWidth;

        const div = document.createElement("div");
        Object.assign(div.style, {
            overflow: "scroll",
            position: "absolute",
            top: "-9999px",
        });

        document.body.appendChild(div);
        this._getScrollbarWidth = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);

        return this._getScrollbarWidth;
    };
}

/**
 * Request
 * 1. modal.open();
 *
 * 2. modal.close(true);
 * destroyOnClose: true -> closeEvent trigger -> "modal-backdrop" element removed out of DOM
 * destroyOnClose: false -> closeEvent trigger ->
 * class "show" removed BUT "modal-backdrop" element stay
 *
 * 3. modal.destroy();
 * 4. modal.setFooterContent("Copyright xxx");
 * 5. modal.addFooterBtn("Cancel", "class-1 class-2", (e) => {});
 *
 */

const modal1 = new Modal({
    templateId: "modal-1",
    destroyOnClose: false,
    onOpen: () => {
        console.log("Modal 1 opened");
    },
    onClose: () => {
        console.log("Modal 1 closed");
    },
});

$("#open-modal-1").onclick = () => {
    modal1.open();
};

const modal2 = new Modal({
    templateId: "modal-2",
    // closeMethods: ['button', 'overlay', 'escape'],
    cssClass: ["class1", "class2", "classN"],
    onOpen: () => {
        console.log("Modal 2 opened");
    },
    onClose: () => {
        console.log("Modal 2 closed");
    },
});

$("#open-modal-2").onclick = () => {
    const modalElement = modal2.open();

    const form = modalElement.querySelector("#login-form");
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = {
                email: $("#email").value.trim(),
                password: $("#password").value.trim(),
            };

            console.log(formData);
        };
    }
};

const modal3 = new Modal({
    templateId: "modal-3",
    closeMethods: [],
    footer: true,
    onOpen: () => {
        console.log("Modal 3 opened");
    },
    onClose: () => {
        console.log("Modal 3 closed");
    },
});

// modal3.setFooterContent("<h2>Footer content</h2>");

modal3.addFooterButton("Danger", "modal-btn danger pull-left", (e) => {
    modal3.close();
});

modal3.addFooterButton("Cancel", "modal-btn", (e) => {
    modal3.close();
});

modal3.addFooterButton("<span>Agree</span>", "modal-btn primary", (e) => {
    modal3.close();
});

$("#open-modal-3").onclick = () => {
    modal3.open();
};
