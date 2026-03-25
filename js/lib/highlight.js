mixins.highlight = {
    data() {
        return { copying: false };
    },
    created() {
        hljs.configure({ ignoreUnescapedHTML: true });
        this.renderers.push(this.highlight);
    },
    methods: {
        getCodeLanguage(pre) {
            const codeElement = pre.querySelector("code");
            const classNames = [
                ...pre.classList,
                ...(codeElement ? [...codeElement.classList] : []),
            ];
            const languageClass = classNames.find((name) => name.startsWith("language-"));
            if (!languageClass) return "plaintext";

            const aliases = {
                "c++": "cpp",
                cs: "csharp",
                js: "javascript",
                ts: "typescript",
                sh: "bash",
                shell: "bash",
                zsh: "bash",
                ps: "powershell",
                pwsh: "powershell",
                yml: "yaml",
                md: "markdown",
            };
            const language = languageClass.slice(9).toLowerCase();
            return aliases[language] || language;
        },
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        highlight() {
            let codes = document.querySelectorAll("pre");
            for (let i of codes) {
                if (i.dataset.highlighted === "true") continue;
                let code = i.textContent;
                let language = this.getCodeLanguage(i);
                const hasExplicitLanguage = language !== "plaintext";
                let displayLanguage = language;
                let highlighted;
                try {
                    highlighted = hljs.highlight(code, { language }).value;
                } catch {
                    try {
                        const auto = hljs.highlightAuto(code);
                        highlighted = auto.value;
                        if (!hasExplicitLanguage) {
                            displayLanguage = auto.language || language;
                        }
                    } catch {
                        highlighted = code;
                        displayLanguage = "plaintext";
                    }
                }
                i.innerHTML = `
                <div class="code-content hljs">${highlighted}</div>
                <div class="language">${displayLanguage}</div>
                <div class="copycode">
                    <i class="fa-solid fa-copy fa-fw"></i>
                    <i class="fa-solid fa-check fa-fw"></i>
                </div>
                `;
                i.dataset.highlighted = "true";
                let content = i.querySelector(".code-content");
                hljs.lineNumbersBlock(content, { singleLine: true });
                let copycode = i.querySelector(".copycode");
                copycode.addEventListener("click", async () => {
                    if (this.copying) return;
                    this.copying = true;
                    copycode.classList.add("copied");
                    await navigator.clipboard.writeText(code);
                    await this.sleep(1000);
                    copycode.classList.remove("copied");
                    this.copying = false;
                });
            }
        },
    },
};
