import { createClient } from '@launchdarkly/js-client-sdk';
import Observability from '@launchdarkly/observability';
import SessionReplay from '@launchdarkly/session-replay';
// import { useLaunchDarklyToolbar, FlagOverridePlugin, EventInterceptionPlugin } from '@launchdarkly/toolbar';


class PageHandler {
    constructor() {
        this.ldclient = null;
        this.context = this.getContext();
        this.homeSlider = null;
        this.coffeePromo1 = null;
        this.coffeePromo2 = null;
        document.addEventListener('DOMContentLoaded', this.onPageLoad.bind(this));

        this.init();
    }

    onPageLoad() {
        document.getElementById("page-banner-text").addEventListener("click", () => {
            this.getBannerText();
        });
    }

    init() {
        const client = createClient(clientKey, this.context, {
            plugins: [
                new Observability(),
                new SessionReplay()
            ],
            streaming: true
        });
        client.start();
        this.ldclient = client;

        this.ldclient.on('ready', () => {
            // initialization succeeded, flag values are now available
            this.homeSlider = this.ldclient.variation('release-home-page-slider', false);
            this.coffeePromo1 = this.ldclient.variation('coffee-promo-1', false);
            this.coffeePromo2 = this.ldclient.variation('coffee-promo-2', false);
            // etc.
        });

        this.ldclient.on('change:release-home-page-slider', (context) => {
            this.switchSlider(this.ldclient.variation('release-home-page-slider', false));
        });

        this.ldclient.on('change:coffee-promo-1', (context) => {
            this.switchPromo(this.ldclient.variation('coffee-promo-1', false), 1);
        });

        this.ldclient.on('change:coffee-promo-2', (context) => {
            this.switchPromo(this.ldclient.variation('coffee-promo-2', false), 2);
        });
    }

    getContext() {
        return {
            "kind": "multi",
            "user": {
                "key": "user-018e7bd4-ab96-782e-87b0-b1e32082b481",
                "name": "Miriam Wilson",
                "language": "en",
                "tier": "premium",
                "userId": "mwilson",
                "role": "developer",
                "email": "miriam.wilson@example.com",
            },
            "device": {
                "key": "device-018e7bd4-ab96-782e-87b0-b1e32082b481",
                "os": "macOS",
                "osVersion": "15.6",
                "model": "MacBook Pro",
                "manufacturer": "Apple",
            },
        };
    }

    switchSlider(enabled) {
        const slider = document.getElementById('home-page-slider');
        if (enabled) {
            slider.style.display = 'block';
        } else {
            slider.style.display = 'none';
        }
    }

    switchPromo(enabled, id) {
        const promo = document.getElementById('coffee-promo-' + id);
        if (enabled) {
            promo.style.display = 'block';
        } else {
            promo.style.display = 'none';
        }
    }

    switchSection() {
        const section = document.getElementById('coffee-promo-section');
        const promo1 = document.getElementById('coffee-promo-1');
        const promo2 = document.getElementById('coffee-promo-2');
        if (promo1.style.display !== 'none' || promo2.style.display !== 'none') {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    }

    getBannerText() {
        fetch('/api/banner')
            .then(response => response.json())
            .then(data => {
                const bannerText = data.primaryBanner;
                const heroBanner = document.getElementById('hero-banner');
                heroBanner.textContent = bannerText;
                console.log('Banner text updated:', bannerText);
            })
            .catch(error => {
                console.error('Error fetching banner text:', error);
            });
    }
}

const pageHandler = new PageHandler();

export default pageHandler;
