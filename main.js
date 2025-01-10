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

function Modal(options = {}) {
    const {
        templateId,
        destroyOnClose = true,
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

    this._allowButtonClose = closeMethods.includes("button");
    this._allowBackdropClose = closeMethods.includes("overlay");
    this._allowEscapeClose = closeMethods.includes("escape");

    this._build = () => {
        const content = template.content.cloneNode(true);

        // Create modal elements
        this._backDrop = document.createElement("div");
        this._backDrop.classList.add("modal-backdrop");

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
            const closeBtn = document.createElement("button");
            closeBtn.classList.add("modal-close");
            closeBtn.innerHTML = "&times;";
            container.append(closeBtn);
            closeBtn.onclick = () => this.close();
        }

        const modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");

        // Append elements & content
        modalContent.append(content);
        container.append(modalContent);
        this._backDrop.append(container);
        document.body.append(this._backDrop);
    };

    this.open = () => {
        if (!this._backDrop) {
            this._build();
        }

        setTimeout(() => {
            this._backDrop.classList.add("show");
        }, 0);

        // Close with backDrop
        if (this._allowBackdropClose) {
            this._backDrop.onclick = (e) => {
                if (e.target === this._backDrop) {
                    this.close();
                }
            };
        }

        // Close with ESC key
        if (this._allowEscapeClose) {
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    this.close();
                }
            });
        }

        // Disable scrolling
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = getScrollbarWidth() + "px";

        this._backDrop.ontransitionend = (e) => {
            if (e.propertyName !== "transform") return;
            if (typeof onOpen === "function") onOpen();
        };

        return this._backDrop;
    };

    this.close = (isDestroyed = destroyOnClose) => {
        this._backDrop.classList.remove("show");
        this._backDrop.ontransitionend = (e) => {
            // Prevent animation execute multi times -> causing bugs
            if (e.propertyName !== "transform") return;

            // destroyOnClose: true -> closeEvent trigger -> "modal-backdrop" element removed out of DOM
            if (isDestroyed && this._backDrop) {
                this._backDrop.remove();
                this._backDrop = null;
            }

            // Enable scrolling
            document.body.classList.remove("no-scroll");
            document.body.style.paddingRight = "";

            if (typeof onClose === "function") onClose();
        };

        // equal destroyOnClose: true
        this.destroy = () => {
            this.close(true);
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

/**
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
    const modalElement = modal1.open();
};

const modal2 = new Modal({
    templateId: "modal-2",
    // closeMethods: ['button', 'overlay', 'escape'],
    footer: true,
    cssClass: ["class1", "class2", "classN", 12],
    onOpen: () => {
        console.log("Modal 2 opened");
    },
    onClose: () => {
        console.log("Modal 2 closed");
    },
});

$("#open-modal-2").onclick = () => {
    const modalElement = modal2.open();
};
