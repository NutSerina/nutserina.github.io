const app = Vue.createApp({
    mixins: Object.values(mixins),
    data() {
        return {
            loading: true,
            hiddenMenu: false,
            showMenuItems: false,
            menuColor: false,
            scrollTop: 0,
            renderers: [],
            tocDrawerOpen: false,
            tocObserver: null,
        };
    },
    created() {
        window.addEventListener("load", () => {
            this.loading = false;
        });
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll, true);
        this.render();
        this.$nextTick(() => this.initToc());
    },
    methods: {
        render() {
            for (let i of this.renderers) i();
        },
        handleScroll() {
            let wrap = this.$refs.homePostsWrap;
            let newScrollTop = document.documentElement.scrollTop;
            if (this.scrollTop < newScrollTop) {
                this.hiddenMenu = true;
                this.showMenuItems = false;
            } else this.hiddenMenu = false;
            if (wrap) {
                if (newScrollTop <= window.innerHeight - 100) this.menuColor = true;
                else this.menuColor = false;
                if (newScrollTop <= 400) wrap.style.top = "-" + newScrollTop / 5 + "px";
                else wrap.style.top = "-80px";
            }
            if (typeof this.updateHomeBackgroundBlur === "function") {
                this.updateHomeBackgroundBlur();
            }
            this.scrollTop = newScrollTop;
        },
        initToc() {
            const tocNav = document.querySelector('.toc-nav');
            const tocDrawerNav = document.querySelector('.toc-drawer-nav');
            if (!tocNav) return;

            setTimeout(() => {
                const tocItems = document.querySelectorAll('.content h2, .content h3, .content h4, .content h5, .content h6');
                if (tocItems.length === 0) return;

                let tocHtml = '';
                tocItems.forEach((item) => {
                    let id = item.id;
                    if (!id) {
                        id = 'toc-' + Math.random().toString(36).substr(2, 9);
                        item.id = id;
                    }
                    const level = parseInt(item.tagName.substring(1));
                    tocHtml += '<a class="toc-item level-' + level + '" href="#' + id + '" data-target="' + id + '">' + item.textContent + '</a>';
                });

                tocNav.innerHTML = tocHtml;
                if (tocDrawerNav) tocDrawerNav.innerHTML = tocHtml;

                document.querySelectorAll('.toc-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = item.dataset.target;
                        const target = document.getElementById(targetId);
                        if (target) {
                            const offset = 80;
                            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                            window.scrollTo({ top: top, behavior: 'smooth' });
                            this.tocDrawerOpen = false;
                        }
                    });
                });

                this.initTocObserver();
            }, 100);
        },
        initTocObserver() {
            const headers = document.querySelectorAll('.content h2, .content h3, .content h4, .content h5, .content h6');
            if (headers.length === 0) return;

            const tocItems = document.querySelectorAll('.toc-item');

            this.tocObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        tocItems.forEach(item => {
                            item.classList.remove('active');
                            if (item.dataset.target === entry.target.id) {
                                item.classList.add('active');
                            }
                        });
                    }
                });
            }, { rootMargin: '-80px 0px -80% 0px' });

            headers.forEach(header => this.tocObserver.observe(header));
        },
    },
});
app.mount("#layout");
