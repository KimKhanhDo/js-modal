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
    const { templateId, closeMethods = ["button", "overlay", "escape"] } = options;
    const template = $(`#${templateId}`);

    if (!template) {
        console.error(`#${templateId} does not exist`);
        return;
    }

    this._allowButtonClose = closeMethods.includes("button");
    this._allowBackdropClose = closeMethods.includes("overlay");
    this._allowEscapeClose = closeMethods.includes("escape");

    this.open = () => {
        const content = template.content.cloneNode(true);

        // Create modal elements
        const backDrop = document.createElement("div");
        backDrop.classList.add("modal-backdrop");

        const container = document.createElement("div");
        container.classList.add("modal-container");

        // Create close btn & register event when condition is TRUE
        if (this._allowButtonClose) {
            const closeBtn = document.createElement("button");
            closeBtn.classList.add("modal-close");
            closeBtn.innerHTML = "&times;";
            container.append(closeBtn);
            closeBtn.onclick = () => this.close(backDrop);
        }

        const modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");

        // Append elements & content
        modalContent.append(content);
        container.append(modalContent);
        backDrop.append(container);
        document.body.append(backDrop);

        setTimeout(() => {
            backDrop.classList.add("show");
        }, 1000);

        // Close with backDrop
        if (this._allowBackdropClose) {
            backDrop.onclick = (e) => {
                if (e.target === backDrop) {
                    this.close(backDrop);
                }
            };
        }

        // Close with ESC key
        if (this._allowEscapeClose) {
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    this.close(backDrop);
                }
            });
        }

        // Disable scrolling
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = getScrollbarWidth() + "px";

        return backDrop;
    };

    this.close = (modalElement) => {
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

const modal1 = new Modal({
    templateId: "modal-1",
});

$("#open-modal-1").onclick = () => {
    const modalElement = modal1.open();

    // const img = modalElement.querySelector("img");
    // console.log(img);
};

const modal2 = new Modal({
    templateId: "modal-2",
    // closeMethods: ['button', 'overlay', 'escape'],
    footer: true,
    cssClass: ["class1", "class2", "classN"],
    onOpen: () => {
        console.log("Modal opened");
    },
    onClose: () => {
        console.log("Modal closed");
    },
});
$("#open-modal-2").onclick = () => {
    const modalElement = modal2.open();
};
