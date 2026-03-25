mixins.home = {
    mounted() {
        let background = this.$refs.homeBackground;
        let images = background.dataset.images.split(",");
        let id = Math.floor(Math.random() * images.length);
        background.style.backgroundImage = `url('${images[id]}')`;
        this.updateHomeBackgroundBlur();
        this.menuColor = true;
    },
    methods: {
        homeClick() {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        },
        updateHomeBackgroundBlur() {
            const background = this.$refs.homeBackground;
            if (!background) return;

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
            const viewportHeight = window.innerHeight || 1;
            const progress = Math.min(scrollTop / viewportHeight, 1);
            const blur = (progress * 12).toFixed(2);
            background.style.setProperty("--home-bg-blur", `${blur}px`);
        },
    },
};
